import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('**/api/chat', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 250))
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        message: {
          role: 'assistant',
          content: '# Findings\n\nThe **main result** is clear.\n\n- First outcome',
        },
      }),
    })
  })
})

test('opens directly on the Panora chat landing page', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('What can I do for you today?')).toBeVisible()
  await expect(page.getByLabel('Message Panora')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Analyze Report' })).toBeVisible()
})

test('sends text, renders Markdown, and preserves a draft typed while waiting', async ({
  page,
}) => {
  await page.goto('/')
  const composer = page.getByLabel('Message Panora')
  const sendButton = page.getByRole('button', { name: 'Send message' })

  await composer.fill('Analyze the annual report.')
  await expect(sendButton).toBeEnabled()
  await sendButton.click()
  await expect(composer).toHaveValue('')
  await composer.fill('My next question')

  await expect(page.getByText('Analyze the annual report.', { exact: true })).toBeVisible()
  await expect(page.getByText('Findings')).toBeVisible()
  await expect(page.getByText('main result')).toBeVisible()
  await expect(page.getByText('First outcome')).toBeVisible()
  await expect(composer).toHaveValue('My next question')
})
