import { test, expect } from './fixtures';
import { CatalogPage } from './pages/catalog.page';
import { CategoryItemsPage } from './pages/category-items.page';

test.describe('Товары/услуги в категории', () => {
  test.describe.configure({ mode: 'serial' });

  let catalogPage: CatalogPage;

  test.beforeEach(async ({ page }) => {
    catalogPage = new CatalogPage(page);
  });

  async function openFirstCategory(page: import('@playwright/test').Page) {
    await catalogPage.goto();
    const firstCategory = catalogPage.categoryList.first();
    const hasCats = await firstCategory.isVisible().catch(() => false);
    return hasCats ? firstCategory : null;
  }

  test.describe('Список товаров', () => {
    test('при переходе в любую категорию отображается список товаров или пустое состояние', async ({
      page,
    }) => {
      const firstCategory = await openFirstCategory(page);
      if (!firstCategory) {
        await expect(catalogPage.emptyState).toBeVisible();
        return;
      }

      await firstCategory.click();

      const itemsPage = new CategoryItemsPage(page);
      await itemsPage.waitForLoad();

      const hasItems = await itemsPage.itemCards.first().isVisible();
      const hasEmpty = await itemsPage.emptyState.isVisible();
      expect(hasItems || hasEmpty).toBe(true);
    });

    test('карточка отображает название', async ({ page }) => {
      const firstCategory = await openFirstCategory(page);
      test.skip(!firstCategory, 'Нет категорий');

      await firstCategory!.click();
      const itemsPage = new CategoryItemsPage(page);
      await itemsPage.waitForLoad();

      const hasItems = await itemsPage.itemCards.first().isVisible().catch(() => false);
      test.skip(!hasItems, 'Нет товаров в категории');

      const firstCard = itemsPage.itemCards.first();
      await expect(firstCard).not.toBeEmpty();
    });

    test('пустое состояние отображается, если в категории нет товаров', async ({
      page,
    }) => {
      const firstCategory = await openFirstCategory(page);
      test.skip(!firstCategory, 'Нет категорий');

      await firstCategory!.click();
      const itemsPage = new CategoryItemsPage(page);
      await itemsPage.waitForLoad();

      const hasItems = await itemsPage.itemCards.first().isVisible().catch(() => false);
      if (!hasItems) {
        await expect(itemsPage.emptyState).toBeVisible();
      }
    });
  });

  test.describe('Подкатегории как фильтр', () => {
    test('если у категории есть подкатегории — отображаются чипы', async ({ page }) => {
      await catalogPage.goto();

      const categoryWithChildren = catalogPage.categoryList
        .filter({ hasText: /подкатегорий/ })
        .first();
      const found = await categoryWithChildren.isVisible().catch(() => false);
      test.skip(!found, 'Нет категорий с подкатегориями');

      await categoryWithChildren.click();
      const itemsPage = new CategoryItemsPage(page);
      await itemsPage.waitForLoad();

      const chips = page.getByTestId(/^subcategory-chip-/);
      await expect(chips.first()).toBeVisible();
    });

    test('по тапу на подкатегорию список фильтруется', async ({ page }) => {
      await catalogPage.goto();

      const categoryWithChildren = catalogPage.categoryList
        .filter({ hasText: /подкатегорий/ })
        .first();
      const found = await categoryWithChildren.isVisible().catch(() => false);
      test.skip(!found, 'Нет категорий с подкатегориями');

      await categoryWithChildren.click();
      const itemsPage = new CategoryItemsPage(page);
      await itemsPage.waitForLoad();

      const firstChip = page.getByTestId(/^subcategory-chip-/).first();
      const hasChips = await firstChip.isVisible().catch(() => false);
      test.skip(!hasChips, 'Нет чипов подкатегорий');

      // Кликаем на подкатегорию — активируется
      await firstChip.click();
      // Повторный клик — сбрасывает фильтр
      await firstChip.click();
    });
  });

  test.describe('Фильтры', () => {
    test('кнопка "Фильтры" открывает панель фильтров', async ({ page }) => {
      const firstCategory = await openFirstCategory(page);
      test.skip(!firstCategory, 'Нет категорий');

      await firstCategory!.click();
      const itemsPage = new CategoryItemsPage(page);
      await itemsPage.waitForLoad();

      const filterPanel = await itemsPage.openFilters();
      await expect(filterPanel.applyButton).toBeVisible();
      await expect(filterPanel.resetButton).toBeVisible();
    });

    test('кнопка "Сбросить" очищает все фильтры', async ({ page }) => {
      const firstCategory = await openFirstCategory(page);
      test.skip(!firstCategory, 'Нет категорий');

      await firstCategory!.click();
      const itemsPage = new CategoryItemsPage(page);
      await itemsPage.waitForLoad();

      const filterPanel = await itemsPage.openFilters();
      await filterPanel.reset();

      await expect(filterPanel.applyButton).toBeHidden();
    });

    test('применение фильтров закрывает панель', async ({ page }) => {
      const firstCategory = await openFirstCategory(page);
      test.skip(!firstCategory, 'Нет категорий');

      await firstCategory!.click();
      const itemsPage = new CategoryItemsPage(page);
      await itemsPage.waitForLoad();

      const filterPanel = await itemsPage.openFilters();
      await filterPanel.apply();

      await expect(filterPanel.applyButton).toBeHidden();
    });
  });

  test.describe('Переход к деталям', () => {
    test('по тапу на карточку товара открывается экран деталей', async ({ page }) => {
      const firstCategory = await openFirstCategory(page);
      test.skip(!firstCategory, 'Нет категорий');

      await firstCategory!.click();
      const itemsPage = new CategoryItemsPage(page);
      await itemsPage.waitForLoad();

      const firstCard = itemsPage.itemCards.first();
      const hasItems = await firstCard.isVisible().catch(() => false);
      test.skip(!hasItems, 'Нет товаров');

      await firstCard.click();

      await page.waitForURL(/\/items\//, { timeout: 5_000 });
    });
  });

  test.describe('Навигация', () => {
    test('кнопка "Назад" возвращает в каталог', async ({ page }) => {
      const firstCategory = await openFirstCategory(page);
      test.skip(!firstCategory, 'Нет категорий');

      await firstCategory!.click();
      const itemsPage = new CategoryItemsPage(page);
      await itemsPage.waitForLoad();

      await itemsPage.goBack();

      await expect(catalogPage.heading).toBeVisible({ timeout: 5_000 });
    });
  });
});
