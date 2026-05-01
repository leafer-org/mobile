import { type Locator, type Page, expect } from '@playwright/test';

export class CatalogPage {
  readonly heading: Locator;
  readonly emptyState: Locator;
  readonly categoryList: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByText('Каталог').first();
    this.emptyState = page.getByText('Нет доступных категорий');
    this.categoryList = page.locator('[data-testid^="category-"]');
  }

  async goto() {
    await this.page.goto('/catalog');
    await this.heading.waitFor({ state: 'visible', timeout: 10_000 });
    // Wait for data to load (either categories appear or empty state)
    await this.categoryList.first().or(this.emptyState).waitFor({ state: 'visible', timeout: 15_000 });
  }

  category(id: string) {
    return this.page.getByTestId(`category-${id}`);
  }

  categoryByName(name: string) {
    return this.page.getByTestId(/^category-/).filter({ hasText: name });
  }

  async selectCategory(name: string) {
    await this.categoryByName(name).click();
  }
}
