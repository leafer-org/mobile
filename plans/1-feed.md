# Фид — план реализации

Главная страница приложения: баннеры, лента услуг, переключатель возрастной группы, выбор города.

## Макет

```
┌─────────────────────────────────────┐
│ [Город ▾]              [взр / дети] │  ← header
├─────────────────────────────────────┤
│ [Поиск ...]                        │  ← (не в scope)
├─────────────────────────────────────┤
│ ┌─ Баннеры (горизонтальный скролл)─┐│
│ │  [img]  [img]  [img]             ││
│ └───────────────────────────────────┘│
├─────────────────────────────────────┤
│                                     │
│   Карточка услуги                   │
│   Карточка услуги                   │  ← infinite scroll
│   Карточка услуги                   │
│   ...                               │
│                                     │
├─────────────────────────────────────┤
│ [список]  [карта]                   │  ← view toggle (будущее)
├─────────────────────────────────────┤
│ главная  каталог  избранное  чаты  профиль │ ← tab bar
└─────────────────────────────────────┘
```

## Контракты API

| Эндпоинт | Назначение |
|----------|-----------|
| `GET /discovery/feed` | Персонализированная лента (cursor-пагинация) |
| `GET /banners` | Список баннеров |
| `GET /discovery/categories` | Корневые категории (для каталога, не для фида) |
| `POST /discovery/items/{itemId}/like` | Лайк товара |
| `DELETE /discovery/items/{itemId}/like` | Убрать лайк |

### getFeed params
- `cityId` (required) — ID города пользователя
- `ageGroup` — `adults` | `children` | `all` (default: `adults`)
- `cursor` — курсор пагинации
- `lat`, `lng` — координаты для гео-рекомендаций
- `limit` — 1–100 (default: 20)

### getFeed response — `CursorPaginatedItems`
```ts
{ items: ItemListView[], nextCursor: string | null }
```

### ItemListView
```ts
{
  itemId: string
  typeId: string
  title: string
  description: string | null
  media: MediaItem[]         // { type: 'image' | 'video', mediaId: string }
  hasVideo: boolean
  price: { strategy: 'free' | 'one-time' | 'subscription', price: number | null } | null
  rating: number | null
  reviewCount: integer
  owner: { name: string, avatarId: string | null } | null
  location: { cityId: string, address: string | null } | null
  categoryIds: string[]
}
```

---

## Шаги реализации

### Шаг 0 — Tab-навигация

Добавить bottom tabs в `(app)/_layout.tsx`:
- главная, каталог, избранное, чаты, профиль
- Использовать `expo-router` Tabs layout
- Пока только вкладки «главная» и «профиль» ведут на реальные экраны, остальные — заглушки

### Шаг 1 — Фича `features/feed/`

Создать структуру фичи:

```
features/feed/
├── domain/
│   └── types.ts            # AgeGroup, FeedParams, переиспользуемые типы
├── model/
│   ├── use-feed.ts          # useInfiniteQuery → getFeed, cursor-пагинация
│   ├── use-banners.ts       # useQuery → getBanners
│   ├── use-age-group.ts     # useState/AsyncStorage для переключателя возрастной группы
│   └── use-city.ts          # текущий город пользователя (из /me или выбор)
├── ui/
│   ├── banner-carousel.tsx  # горизонтальный FlatList баннеров
│   ├── item-card.tsx        # карточка услуги (изображение/видео-превью, title, price, rating, owner)
│   ├── item-list.tsx        # FlatList с infinite scroll, ListHeaderComponent для баннеров
│   ├── age-group-toggle.tsx # переключатель взрослые/дети
│   ├── city-selector.tsx    # кнопка выбора города в хедере
│   └── feed-layout.tsx      # слот-лейаут экрана (header slots, content slot)
├── compose/
│   └── feed-screen.tsx      # связывает model-хуки → ui-компоненты
└── index.ts                 # экспорт FeedScreen
```

### Шаг 2 — model-хуки

**use-feed.ts**
- `useInfiniteQuery` с `getNextPageParam: (last) => last.nextCursor`
- queryKey: `['feed', { cityId, ageGroup }]`
- При смене `ageGroup` / `cityId` — сброс и рефетч

**use-banners.ts**
- `useQuery` → `GET /banners`
- queryKey: `['banners']`

**use-age-group.ts**
- Хранение в `AsyncStorage` (или `MMKV`)
- Дефолт: `adults`
- Экспортирует `{ ageGroup, setAgeGroup }`

**use-city.ts**
- Берёт `cityId` из данных `/me` (support/user)
- Если нужно менять город — модалка выбора (можно переиспользовать `features/auth/_city`)

### Шаг 3 — UI-компоненты

**banner-carousel.tsx**
- Горизонтальный `FlatList` / `ScrollView` с `pagingEnabled`
- Рендерит изображение баннера (через `imgproxy` URL)
- Автопрокрутка (опционально)
- Dot-индикаторы текущей позиции

**item-card.tsx**
- Первое медиа из `media[]` как обложка (Image или видео-превью)
- Название, цена (форматирование: «бесплатно» / «от X ₽» / «X ₽/мес»)
- Рейтинг + количество отзывов (звёздочка + число)
- Имя владельца + аватар
- Иконка видео если `hasVideo`

**item-list.tsx**
- `FlatList` с `onEndReached` → `fetchNextPage`
- `ListHeaderComponent` — баннеры
- Pull-to-refresh
- Skeleton-лоадеры при загрузке
- Empty state

**age-group-toggle.tsx**
- Сегментированный контрол: «взрослые» / «дети»
- Принимает `value` + `onChange` через пропсы

**city-selector.tsx**
- Кнопка с названием текущего города
- По нажатию — открытие модалки / навигация к экрану выбора

### Шаг 4 — compose/feed-screen.tsx

```
compose соединяет:
  useFeed(cityId, ageGroup)      → items, fetchNextPage, isLoading, refetch
  useBanners()                   → banners
  useAgeGroup()                  → ageGroup, setAgeGroup
  useCity()                      → cityId, cityName

  → передаёт всё в <FeedLayout> + <ItemList> + <BannerCarousel> + <AgeGroupToggle>
```

### Шаг 5 — Роут и навигация

- `src/app/(app)/(tabs)/_layout.tsx` — Tabs layout с иконками
- `src/app/(app)/(tabs)/index.tsx` — импорт `FeedScreen` из `features/feed`
- `src/app/(app)/(tabs)/catalog.tsx` — заглушка
- `src/app/(app)/(tabs)/favorites.tsx` — заглушка
- `src/app/(app)/(tabs)/chats.tsx` — заглушка
- `src/app/(app)/(tabs)/profile.tsx` — перенести текущий профиль

### Шаг 6 — Медиа URL-хелпер

Утилита в `kernel/` или `support/` для формирования URL изображений:
- `getImageUrl(mediaId, { width, height })` — через imgproxy
- `getVideoPreviewUrl(mediaId)` — превью-кадр видео

---

## Вне scope этого плана

- Поиск (отдельный план)
- Экран карточки товара (item detail)
- Каталог категорий
- Переключатель список/карта
- Избранное
- Чаты
