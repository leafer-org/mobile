# Feature Module Architecture

## Структура модуля

Каждый feature-модуль расположен в `src/features/` и состоит из четырёх слоёв и публичного API:

```
features/
└── <domain>/
    └── <feature>/
        ├── domain/      # Типы и чистые функции
        ├── model/       # Бизнес-логика
        ├── ui/          # Презентационные компоненты
        ├── compose/     # Экранные композиции
        └── index.ts     # Публичный API модуля
```

---

## Слои

### domain — типы и чистые функции

Содержит доменные типы, интерфейсы, enum-ы и чистые функции без побочных эффектов. Это фундамент модуля, от которого могут зависеть все остальные слои.

**Что здесь живёт:**
- **Типы и интерфейсы** — доменные модели фичи, DTO-маппинги, enum-ы
- **Чистые функции** — валидаторы, форматтеры, маппинги, вычисления без side-effects

**Правила:**
- Никаких хуков, компонентов, API-вызовов или побочных эффектов
- Не зависит от React — только TypeScript
- Может импортироваться из любого слоя модуля (model, ui, compose)

---

### model — бизнес-логика

Содержит хуки и сторы, инкапсулирующие всю логику фичи: запросы к API, мутации, локальное состояние, вычисления.

**Что здесь живёт:**
- **Хуки мутаций** (`use-request-otp.ts`, `use-verify-otp.ts`) — оборачивают API-вызовы через `useMutation`, обрабатывают ошибки, диспатчат экшены в стор
- **Хуки состояния** (`use-retry-countdown.ts`, `use-profile-full-name.ts`) — локальная логика с `useState`/`useEffect`, derived-значения через `useMemo`
- **Сторы** (`otp-store.ts`) — создаются через `createReducerContext`, предоставляют `Provider`, `useState`, `useDispatch`
- **Хуки интеграций** (`use-upload-media.ts`, `use-upload-avatar.ts`) — работа с внешними сервисами (S3, ImagePicker)

**Правила:**
- **Элементы model не импортируют друг друга.** Каждый файл в `model/` — изолированная единица. Хук не может импортировать другой хук из того же model-слоя
- **Исключение — директория с `index.ts`.** Если элемент model — это папка с `index.ts`, внутри неё кросс-импорты между файлами разрешены. `index.ts` служит единственной точкой входа для остального модуля
- Хуки model не содержат JSX (за исключением случаев где нужен query с компонентным контекстом)
- Хуки model не знают о навигации — вместо этого принимают колбэки (`onSuccess`, `onError`)
- Каждый хук возвращает плоский объект с данными и действиями
- Ошибки API оборачиваются в `ApiError` и преобразуются в user-friendly сообщения внутри хука

**Пример директории-элемента в model:**
```
model/
├── use-request-otp.ts          # изолирован, не импортирует соседей
├── use-retry-countdown.ts      # изолирован, не импортирует соседей
├── otp-store.ts                # изолирован, не импортирует соседей
└── upload/                     # директория-элемент
    ├── index.ts                # точка входа, реэкспортирует нужное
    ├── use-upload-media.ts     # может импортировать use-upload-avatar.ts
    └── use-upload-avatar.ts    # может импортировать use-upload-media.ts
```

**Пример возвращаемого интерфейса:**
```ts
// use-request-otp.ts
return {
  handleSubmit,    // (phone: string) => Promise<void>
  loading,         // boolean
  errorMessage,    // string | undefined
};
```

### ui — презентационные компоненты

Чистые компоненты, получающие все данные через пропсы. Не имеют прямой зависимости от model-слоя, API или навигации.

**Что здесь живёт:**
- **Формы** (`phone-input-form.tsx`, `otp-verify-form.tsx`) — собирают UI-элементы из `@/kernel/ui`, управляют локальным input-состоянием, вызывают колбэки
- **Секции экрана** (`avatar-upload-section.tsx`, `profile-setup-header.tsx`) — визуальные блоки, получающие данные через пропсы
- **Layout-компоненты** (`profile-setup-layout.tsx`) — слот-паттерн через `ReactNode` пропсы для компоновки секций

**Правила:**
- Компоненты ui не вызывают хуки из model напрямую
- Все данные и колбэки приходят через пропсы
- Могут содержать минимальное локальное состояние (input value, анимации)
- **Элементы ui не импортируют друг друга.** Полное отображение собирается в compose через слоты и render-пропсы, а не через импорт одного ui-компонента в другой
- Используют компоненты дизайн-системы из `@/kernel/ui`

**Пример слот-паттерна:**
```tsx
// profile-setup-layout.tsx
function ProfileSetupLayout({
  header,
  avatarSection,
  input,
  actions,
}: {
  header: ReactNode;
  avatarSection: ReactNode;
  input: ReactNode;
  actions: ReactNode;
}) { ... }
```

### compose — экранные композиции

Связующий слой, который соединяет model и ui. Каждый compose-компонент — это один экран приложения.

**Что здесь живёт:**
- **Screen-компоненты** (`phone-screen.tsx`, `otp-screen.tsx`, `profile-setup-screen.tsx`) — собирают хуки из model и передают данные в ui-компоненты

**Правила:**
- Compose — единственное место, где model и ui встречаются
- Содержит вызовы хуков из model и передачу их результатов в ui через пропсы
- Может содержать навигационную логику (роутер) или принимать колбэки навигации через пропсы
- Оборачивает содержимое в `ScreenLayout` из kernel
- Не содержит собственной бизнес-логики или сложной вёрстки

**Пример:**
```tsx
// phone-screen.tsx
function PhoneScreen() {
  // model
  const { handleSubmit, loading, errorMessage } = useRequestOtp({ onSuccess: ... });
  const retryAfterSec = useRetryCountdown();

  // ui
  return (
    <ScreenLayout keyboardAvoiding scrollable>
      <PhoneInputForm
        onSubmit={handleSubmit}
        loading={loading}
        error={errorMessage}
        retryAfterSec={retryAfterSec}
      />
    </ScreenLayout>
  );
}
```

### index.ts — публичный API

Barrel-файл, экспортирующий только то, что нужно внешним потребителям. Внешний код **не должен** импортировать из внутренних папок модуля напрямую.

```ts
// features/auth/otp/index.ts
export { OtpScreen } from './compose/otp-screen';
export { PhoneScreen } from './compose/phone-screen';
export { OtpStoreProvider } from './model/otp-store';
```

**Что экспортируется:**
- Compose-компоненты (экраны) — используются в route-файлах `src/app/`
- Провайдеры сторов — если стор нужно поднять выше в дереве (например, в `_layout.tsx`)

---

## Подмодули (`_`-префикс)

Подмодуль — это вложенный feature-модуль внутри родительского. Используется, когда часть функциональности достаточно автономна, но не имеет смысла как самостоятельный feature.

### Структура

Папка подмодуля начинается с `_` и имеет ту же внутреннюю структуру `model/ui/compose/index.ts`:

```
features/
└── <domain>/
    └── <feature>/
        ├── _<submodule>/
        │   ├── domain/
        │   ├── model/
        │   ├── ui/
        │   ├── compose/
        │   └── index.ts      # Публичный API подмодуля
        ├── domain/
        ├── model/
        ├── ui/
        ├── compose/
        └── index.ts           # Может реэкспортировать из подмодулей
```

### Правила

- Префикс `_` обозначает, что модуль **приватный** — он принадлежит родителю и не должен импортироваться извне родительского feature
- Подмодуль имеет собственный `index.ts` с публичным API для родителя
- Родительский `index.ts` решает, какие экспорты подмодуля пробрасывать наружу

### Взаимодействие с родителем

**Подмодуль может импортировать** из родителя:
- `ui/` — переиспользовать презентационные компоненты родителя
- `model/` — использовать хуки и сторы родителя
- `domain/` — использовать типы и чистые функции родителя

**Родитель может импортировать** из подмодуля:
- Только из `compose/` слоя подмодуля (через `index.ts`) — встраивает compose-компоненты подмодуля в свои compose-экраны

Это асимметрия: подмодуль знает о внутренностях родителя (ui, model, domain), а родитель видит подмодуль только как готовый compose-компонент.

### Когда выделять подмодуль

- Группа файлов в model/ui/compose образует самостоятельную подфичу (свои хуки, свои компоненты, свой compose)
- Подфича используется только внутри родительского feature
- Вынос на уровень features/ избыточен, так как нет переиспользования в других фичах

---

## Связь с маршрутами

Route-файлы в `src/app/` — тонкие обёртки, которые импортируют compose-компоненты из feature-модулей:

```tsx
// src/app/(auth)/phone.tsx
import { PhoneScreen } from '@/features/auth/otp';
export default PhoneScreen;
```

Если экрану нужен роутер-контекст (навигация при успехе/отмене), route-файл передаёт колбэки:

```tsx
// src/app/(auth)/profile.tsx
export default function ProfileScreenRoute() {
  const router = useRouter();
  return (
    <ProfileSetupScreen
      onSuccess={() => router.replace('/(app)')}
      onSkip={() => router.replace('/(app)')}
    />
  );
}
```

Провайдеры сторов, общие для нескольких экранов, размещаются в `_layout.tsx`:

```tsx
// src/app/(auth)/_layout.tsx
import { OtpStoreProvider } from '@/features/auth/otp';

export default function AuthLayout() {
  return (
    <OtpStoreProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </OtpStoreProvider>
  );
}
```

---

## Поток данных

```
Route (_layout.tsx / page.tsx)
  │
  ├─ Провайдеры (Store.Provider)
  │
  └─ Compose (экран)
       │
       ├─ model хуки ──► API / Store / локальное состояние
       │
       └─ ui компоненты ◄── пропсы ──── model хуки
```

Данные текут однонаправленно: model производит состояние и действия → compose связывает → ui отображает и вызывает колбэки.
