import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('**/api/chat', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    await route.fulfill({
      status: 200,
      contentType: 'text/event-stream',
      body: [
        `data: ${JSON.stringify({ type: 'delta', content: '# Findings\\n\\n' })}`,
        `data: ${JSON.stringify({ type: 'delta', content: 'The **main result** is clear.\\n\\n- First outcome' })}`,
        `data: ${JSON.stringify({ type: 'complete' })}`,
        '',
      ].join('\n\n'),
    })
  })
})

test('opens as a familiar empty mobile chat', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  await expect(page.getByText('What would you like to understand?')).toBeVisible()
  await expect(page.getByLabel('Message Panora')).toBeVisible()
  await expect(page.getByLabel('Open conversation sidebar')).toBeVisible()
  await expect(page.getByLabel('Add context')).toBeVisible()
})

test('dismisses anchored menus when pressing outside', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  await page.getByLabel('Add context').click()
  await expect(page.getByRole('button', { name: /Upload/ })).toBeVisible()
  await page
    .getByLabel('Dismiss Add chat context')
    .click({ position: { x: 300, y: 200 } })
  await expect(page.getByRole('button', { name: /Upload/ })).toBeHidden()

  await page.getByLabel('Conversation actions').click()
  await expect(page.getByRole('button', { name: 'Share conversation' })).toBeVisible()
  await page
    .getByLabel('Dismiss Conversation actions')
    .click({ position: { x: 40, y: 300 } })
  await expect(page.getByRole('button', { name: 'Share conversation' })).toBeHidden()
})

test('keeps the composer borderless while focused', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const composer = page.getByLabel('Message Panora')
  await composer.focus()
  await expect(composer).toBeFocused()
  await expect(composer).toHaveCSS('border-top-width', '0px')
  await expect(composer).toHaveCSS('outline-width', '0px')
})

test('opens grouped history and settings from the sidebar', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByLabel('Open conversation sidebar').click()
  await expect(page.getByRole('button', { name: 'New chat' })).toBeVisible()
  await page.getByRole('button', { name: 'Settings' }).click()
  await expect(page.getByText('Saffron & Espresso')).toBeVisible()
  await expect(page.getByText('Panora does not use dark mode.')).toBeVisible()
})

test('selects report context and sends a streaming Markdown message', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByLabel('Add context').click()
  await page
    .getByRole('button', { name: /Choose reports/ })
    .last()
    .click()
  await expect(page.getByLabel('Search reports')).toBeVisible()
  await page.getByLabel('Select AI Index Report 2025').click()
  await page.getByRole('button', { name: 'Add 1 report' }).click()
  await expect(
    page.getByTestId('app-container').getByText('AI Index Report 2025').last(),
  ).toBeVisible()

  await page.getByLabel('Message Panora').fill('What is the central argument?')
  await page.getByLabel('Send message').click()
  await expect(page.getByText('Findings')).toBeVisible()
  await expect(page.getByText('main result')).toBeVisible()
  await expect(page.getByText('First outcome')).toBeVisible()
})
