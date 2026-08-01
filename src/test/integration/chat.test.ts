import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('**/api/documents', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        documents: [
          { id: 'document-1', title: 'Indexed handbook', status: 'ready' },
        ],
      }),
    })
  })
  await page.route('**/api/chat/quota', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'X-Panora-Anonymous-Token': 'test-token' },
      body: JSON.stringify({ remaining: 10, limit: 10, resetAt: null }),
    })
  })
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
  await page.goto('/chat')

  await expect(page.getByText('What would you like to understand?')).toBeVisible()
  await expect(page.getByLabel('Message Panora')).toBeVisible()
  await expect(page.getByLabel('Open conversation sidebar')).toBeVisible()
  await expect(page.getByLabel('Add context')).toBeVisible()
})

test('dismisses anchored menus when pressing outside', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/chat')

  await page.getByLabel('Add context').click()
  await expect(page.getByRole('button', { name: /Choose documents/ })).toBeVisible()
  await page
    .getByLabel('Dismiss Add chat context')
    .click({ position: { x: 300, y: 200 } })
  await expect(page.getByRole('button', { name: /Choose documents/ })).toBeHidden()

  await page.getByLabel('Conversation actions').click()
  await expect(page.getByRole('button', { name: 'Share conversation' })).toBeVisible()
  await page
    .getByLabel('Dismiss Conversation actions')
    .click({ position: { x: 40, y: 300 } })
  await expect(page.getByRole('button', { name: 'Share conversation' })).toBeHidden()
})

test('keeps the composer borderless while focused', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/chat')

  const composer = page.getByLabel('Message Panora')
  await composer.focus()
  await expect(composer).toBeFocused()
  await expect(composer).toHaveCSS('border-top-width', '0px')
  await expect(composer).toHaveCSS('outline-width', '0px')
})

test('opens grouped history and settings from the sidebar', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/chat')
  await page.getByLabel('Open conversation sidebar').click()
  await expect(page.getByRole('button', { name: 'New chat' })).toBeVisible()
  await page.getByRole('button', { name: 'Settings' }).click()
  await expect(
    page.getByText('Panora uses the Rosewood & Blush light theme across the app.'),
  ).toBeVisible()
})

test('lets a chat user choose an indexed document without an app session', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/chat')
  await page.getByLabel('Add context').click()
  await page
    .getByRole('button', { name: /Choose documents/ })
    .last()
    .click()
  await expect(page.getByLabel('Search documents')).toBeVisible()
  await expect(page.getByText('Indexed handbook')).toBeVisible()
  await page.getByText('Indexed handbook').click()
  await expect(page.getByText('1 of 5 selected')).toBeVisible()
})

test('sends a generic question and renders streaming Markdown', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/chat')
  await page.getByLabel('Message Panora').fill('What is the central argument?')
  await page.getByLabel('Send message').click()
  await expect(page.getByText('Findings')).toBeVisible()
  await expect(page.getByText('main result')).toBeVisible()
  await expect(page.getByText('First outcome')).toBeVisible()
})
