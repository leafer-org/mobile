import { type Locator, type Page, expect } from '@playwright/test';

export class CategoryItemsPage {
  readonly backButton: Locator;
  readonly filterButton: Locator;
  readonly emptyState: Locator;
  readonly loadingSkeleton: Locator;

  constructor(private readonly page: Page) {
    this.backButton = page.getByTestId('back-button');
    this.filterButton = page.getByTestId('filter-button');
    this.emptyState = page.getByTestId('item-list-empty');
    this.loadingSkeleton = page.locator('[data-testid="item-list-skeleton"]');
  }

  async waitForLoad() {
    // Wait for header
    await this.filterButton.waitFor({ state: 'visible', timeout: 10_000 });
    // Wait for content: either items appear or empty state appears
    // The FlatList renders items or the empty state after loading
    await this.itemCards.first().or(this.emptyState).waitFor({ state: 'visible', timeout: 15_000 });
  }

  /** Subcategory chips */
  subcategoryChip(id: string) {
    return this.page.getByTestId(`subcategory-chip-${id}`);
  }

  subcategoryChipByName(name: string) {
    return this.page.getByTestId(/^subcategory-chip-/).filter({ hasText: name });
  }

  async selectSubcategory(name: string) {
    await this.subcategoryChipByName(name).click();
  }

  /** Filters modal */
  async openFilters() {
    await this.filterButton.click();
    return new FilterPanelPage(this.page);
  }

  /** Items — FlatList renders items as direct children */
  get itemCards() {
    // In React Native Web, TouchableOpacity renders as a div with role="button"
    // Item cards have an onPress handler, so they become clickable elements
    // We look for elements that contain item content inside the FlatList
    return this.page.locator('[data-testid^="item-card-"]');
  }

  /** Like button on a card */
  likeButton(itemId: string) {
    return this.page.getByTestId(`like-button-${itemId}`);
  }

  async goBack() {
    await this.backButton.click();
  }
}

export class FilterPanelPage {
  readonly closeButton: Locator;
  readonly resetButton: Locator;
  readonly applyButton: Locator;

  constructor(private readonly page: Page) {
    this.closeButton = page.getByTestId('filter-close');
    this.resetButton = page.getByTestId('filter-reset');
    this.applyButton = page.getByTestId('filter-apply');
  }

  typeFilter(typeId: string) {
    return this.page.getByTestId(`filter-type-${typeId}`);
  }

  ratingFilter(rating: number) {
    return this.page.getByTestId(`filter-rating-${rating}`);
  }

  async apply() {
    await this.applyButton.click();
  }

  async reset() {
    await this.resetButton.click();
  }

  async close() {
    await this.closeButton.click();
  }
}
