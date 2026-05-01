import { test as setup } from '@playwright/test';

import { API_BASE, STORAGE_STATE_PATH, TEST_OTP, TEST_PHONE } from './constants';

setup('authenticate', async ({ page }) => {
  await fetch(`${API_BASE}/auth/request-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber: TEST_PHONE }),
  });

  const verifyRes = await fetch(`${API_BASE}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber: TEST_PHONE, code: TEST_OTP }),
  });
  const { accessToken, refreshToken } = await verifyRes.json();

  await page.goto('/');
  await page.evaluate(
    (tokens) => localStorage.setItem('leafer_tokens', JSON.stringify(tokens)),
    { accessToken, refreshToken },
  );

  await page.context().storageState({ path: STORAGE_STATE_PATH });
});
