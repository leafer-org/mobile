# Фид — план реализации

Главная страница приложения: баннеры, лента услуг с каруселью медиа (фото + видео), переключатель возрастной группы, выбор города.

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
│   ┌─ Карточка услуги ─────────────┐ │
│   │ ┌──────────────────────────┐  │ │
│   │ │  [img] ← [video] → [img]│  │ │  ← карусель медиа (свайп)
│   │ │   ● ○ ○     ▶ autoplay  │  │ │
│   │ └──────────────────────────┘  │ │
│   │ title / price / rating / owner│ │
│   └───────────────────────────────┘ │
│                                     │
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

### ItemListView (актуальный контракт)

Backend резолвит все медиа-URL на сервере — клиент получает готовые URL, не нужно делать отдельные запросы.

```ts
{
  itemId: string
  typeId: string
  title: string
  description: string | null
  media: ResolvedMediaItem[]   // готовые URL, см. ниже
  hasVideo: boolean
  price: ItemPayment | null
  rating: number | null
  reviewCount: integer
  owner: ItemOwnerSummary | null
  location: ItemLocationSummary | null
  categoryIds: string[]
}
```

### ResolvedMediaItem (discriminated union по `type`)
```ts
// image
{ type: 'image', mediaId: string, preview?: { url: string } }

// video
{ type: 'video', mediaId: string, preview?: {
  thumbnailUrl: string | null
  hlsUrl: string | null           // HLS-стрим (полное воспроизведение)
  mp4PreviewUrl: string | null    // короткий MP4-превью (автоплей в ленте)
  processingStatus: 'pending' | 'processing' | 'ready' | 'failed'
  progress: integer | null
}}
```

### ItemPayment
```ts
{
  options: PaymentOption[]
}
```

### PaymentOption
```ts
{
  name: string
  description: string | null
  strategy: 'free' | 'one-time' | 'subscription'
  price: number | null
}
```

### ItemOwnerSummary
```ts
{ name: string, avatarId: string | null, avatarUrl: string | null }
```

### ItemLocationSummary
```ts
{ cityId: string, address: string | null }
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
│   ├── media-carousel.tsx   # карусель медиа внутри карточки (фото + видео)
│   ├── feed-video-player.tsx # видео-плеер для карусели (autoplay, preload)
│   ├── item-card.tsx        # карточка услуги (карусель медиа, title, price, rating, owner)
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

**media-carousel.tsx**
- Горизонтальный `FlatList` с `pagingEnabled` / `snapToInterval` внутри карточки
- Рендерит `ResolvedMediaItem[]` — изображения (preview.url) и видео вперемешку
- Dot-индикаторы текущей позиции
- Ленивая загрузка: рендерит только видимый слайд ± 1

**feed-video-player.tsx**
- **Autoplay**: видео запускается автоматически когда слайд карусели становится видимым
- **Preload**: предзагрузка `mp4PreviewUrl` для следующих 2-3 карточек с видео (через `Video.prefetch` или кеш)
- **Pause**: видео ставится на паузу когда:
  - пользователь свайпнул на другой слайд карусели
  - карточка ушла из viewport (IntersectionObserver / `onViewableItemsChanged`)
  - приложение ушло в background (`AppState`)
- **Muted by default**: звук выключен, кнопка unmute
- **Fallback на thumbnail**: пока `preview.processingStatus !== 'ready'` — показывать `preview.thumbnailUrl`
- Используем `expo-video` (`VideoView`) или `expo-av` (`Video`)
- Формат воспроизведения в ленте: `preview.mp4PreviewUrl` (короткий превью, быстрее чем HLS)

**item-card.tsx**
- `<MediaCarousel media={item.media} />` — вместо одной обложки
- Название
- Цена — форматирование из `PaymentOption[]`:
  - Нет `price` → не показывать
  - Одна опция `free` → «Бесплатно»
  - Одна опция `one-time` → «X ₽»
  - Одна опция `subscription` → «X ₽/мес»
  - Несколько опций → «от X ₽» (минимальная ненулевая цена)
- Рейтинг + количество отзывов (звёздочка + число)
- Имя владельца + аватар (`owner.avatarUrl` — готовый URL с imgproxy)
- Иконка видео если `hasVideo` (поверх карусели, если не на видео-слайде)

**item-list.tsx**
- `FlatList` с `onEndReached` → `fetchNextPage`
- `ListHeaderComponent` — баннеры
- Pull-to-refresh
- Skeleton-лоадеры при загрузке
- Empty state
- `onViewableItemsChanged` — управление autoplay видео (только 1 видео играет одновременно)
- `windowSize` и `maxToRenderPerBatch` — оптимизация для тяжёлых карточек с видео

**banner-carousel.tsx**
- Горизонтальный `FlatList` / `ScrollView` с `pagingEnabled`
- Рендерит изображение баннера (через imgproxy URL)
- Автопрокрутка (опционально)
- Dot-индикаторы текущей позиции

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

### Шаг 6 — Оптимизация видео в ленте

- **Prefetch**: при загрузке страницы фида — определить карточки с `hasVideo`, предзагрузить `mp4PreviewUrl` для первых 3
- **Memory management**: `removeClippedSubviews` на FlatList, ограничение одновременных видео-инстансов (max 3)
- **Network-aware**: на медленном соединении / cellular — не автоплеить, показывать thumbnail + кнопку play
- **Battery-aware**: проверить `expo-battery` — при низком заряде отключить autoplay

---

## Вне scope этого плана

- Поиск (отдельный план)
- Экран карточки товара (item detail)
- Каталог категорий
- Переключатель список/карта
- Избранное
- Чаты
