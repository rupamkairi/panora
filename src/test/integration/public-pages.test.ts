import { expect, test } from '@playwright/test'

test('web root shows the public landing page and routes into the product', async ({
  page,
}) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', {
      name: 'Understand the report. Ask what it means.',
    }),
  ).toBeVisible()
  await expect(page.getByLabel('Message Panora')).toBeHidden()

  const landingScrollContainer = page.getByTestId('landing-scroll-container')
  const geometry = await landingScrollContainer.evaluate((element) => {
    const bounds = element.getBoundingClientRect()
    return {
      right: Math.round(bounds.right),
      viewportRight: window.innerWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
    }
  })
  expect(geometry.right).toBe(geometry.viewportRight)
  expect(geometry.documentScrollWidth).toBeLessThanOrEqual(geometry.viewportRight)

  await page.getByRole('link', { name: 'Start a conversation' }).click()
  await expect(page).toHaveURL(/\/chat$/)
  await expect(page.getByLabel('Message Panora')).toBeVisible()
})

test('landing page exposes keyboard-visible navigation and calls to action', async ({
  page,
}) => {
  await page.goto('/')

  const privacyLink = page.getByRole('link', { name: 'Privacy Policy' })
  await privacyLink.focus()
  await expect(privacyLink).toBeFocused()
  await expect(privacyLink).not.toHaveCSS('outline-style', 'none')

  const primaryCta = page.getByRole('link', { name: 'Start a conversation' })
  await primaryCta.focus()
  await expect(primaryCta).toBeFocused()
  await expect(primaryCta).not.toHaveCSS('outline-style', 'none')
})

test('public legal pages have a deterministic path back to the landing page', async ({
  page,
}) => {
  await page.goto('/legal/privacy')

  await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible()
  await page.getByRole('link', { name: 'Back to Panora' }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(
    page.getByRole('heading', {
      name: 'Understand the report. Ask what it means.',
    }),
  ).toBeVisible()
})
