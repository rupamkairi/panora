import { useState } from 'react'
import { ScrollView, XStack, YStack } from 'tamagui'

import { Button, IconButton } from '../components/actions'
import {
  Card,
  Chip,
  EmptyState,
  List,
  ListItem,
  ListItemTitle,
} from '../components/content'
import { Alert, FilePicker, Input, Label, Switch, TextArea } from '../components'
import { Spinner, Progress, Skeleton } from '../components/feedback'
import { Field } from '../components/forms'
import { Container, Divider, Page } from '../components/layout'
import { Breadcrumbs, Header, Pagination, Tabs } from '../components/navigation'
import { AlertDialog, AppSheet, Dialog, Dropdown, Popover } from '../components/overlays'
import { CodeText, Heading, Text, TruncatedText } from '../components/typography'
import { showToast } from '../providers/ToastProvider'
import { CatalogSection } from './CatalogSection'

export const ComponentCatalog = () => {
  const [enabled, setEnabled] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [tab, setTab] = useState('one')
  const [page, setPage] = useState(1)

  return (
    <Page>
      <Header title="Panora UI" subtitle="Development component catalog" />
      <ScrollView>
        <Container size="lg" py="$6" gap="$4">
          <CatalogSection title="Typography">
            <YStack gap="$3">
              <Heading level="h1">Display heading</Heading>
              <Heading level="h3">Section heading</Heading>
              <Text>Body text uses Bricolage Grotesque.</Text>
              <Text tone="secondary">Secondary text</Text>
              <CodeText>const panora = true</CodeText>
              <TruncatedText>
                This line demonstrates truncation in constrained layouts.
              </TruncatedText>
            </YStack>
          </CatalogSection>

          <CatalogSection title="Actions">
            <XStack gap="$2" flexWrap="wrap">
              <Button uiSize="sm" variant="primary">
                Small
              </Button>
              <Button uiSize="md" variant="primary">
                Primary
              </Button>
              <Button uiSize="lg" variant="primary">
                Large
              </Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <IconButton aria-label="Favorite">★</IconButton>
            </XStack>
          </CatalogSection>

          <CatalogSection title="Forms">
            <YStack gap="$4">
              <Field>
                <Label htmlFor="catalog-name">Name</Label>
                <Input id="catalog-name" placeholder="Research project" />
              </Field>
              <Field>
                <Label htmlFor="catalog-notes">Notes</Label>
                <TextArea id="catalog-notes" placeholder="Add context…" />
              </Field>
              <Switch
                id="catalog-switch"
                label={enabled ? 'Enabled' : 'Disabled'}
                checked={enabled}
                onCheckedChange={setEnabled}
              />
              <FilePicker multiple maxFiles={3} variant="dropzone" />
            </YStack>
          </CatalogSection>

          <CatalogSection title="Content and feedback">
            <YStack gap="$4">
              <Card gap="$3">
                <Heading level="h4">Research card</Heading>
                <Text tone="secondary">
                  Cards use tonal layering and subtle outlines.
                </Text>
                <XStack gap="$2">
                  <Chip>Analysis</Chip>
                  <Chip>Active</Chip>
                </XStack>
              </Card>
              <List>
                <ListItem>
                  <ListItemTitle>First result</ListItemTitle>
                </ListItem>
                <ListItem>
                  <ListItemTitle>Second result</ListItemTitle>
                </ListItem>
              </List>
              <Alert
                title="Saved"
                description="Your changes were saved."
                tone="success"
              />
              <XStack gap="$4" items="center">
                <Spinner />
                <Progress value={60} flex={1} />
              </XStack>
              <Skeleton />
              <EmptyState title="No sources" description="Add a source to begin." />
            </YStack>
          </CatalogSection>

          <CatalogSection title="Overlays">
            <XStack gap="$2" flexWrap="wrap">
              <Button onPress={() => setSheetOpen(true)}>Open sheet</Button>
              <Button onPress={() => setDialogOpen(true)}>Open dialog</Button>
              <Button variant="destructive" onPress={() => setAlertOpen(true)}>
                Open alert
              </Button>
              <Dropdown
                label="Actions"
                items={[
                  { value: 'edit', label: 'Edit' },
                  { value: 'delete', label: 'Delete', destructive: true },
                ]}
                onSelect={(item) => showToast(item.label)}
              />
              <Popover content={<Text>Popover content</Text>}>
                <Button variant="secondary">Open popover</Button>
              </Popover>
            </XStack>
            <AppSheet
              open={sheetOpen}
              onOpenChange={setSheetOpen}
              title="App sheet"
              description="Touch-friendly reusable content."
            >
              <AppSheet.Body>
                <Text>Sheet body</Text>
              </AppSheet.Body>
            </AppSheet>
            <Dialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              title="Dialog"
              description="Review this information before continuing."
            >
              <Dialog.Body>
                <Text>Dialog body</Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close asChild>
                  <Button variant="secondary">Close</Button>
                </Dialog.Close>
              </Dialog.Footer>
            </Dialog>
            <AlertDialog
              open={alertOpen}
              onOpenChange={setAlertOpen}
              title="Delete source?"
              description="This action cannot be undone."
              variant="destructive"
            />
          </CatalogSection>

          <CatalogSection title="Navigation">
            <YStack gap="$4">
              <Breadcrumbs items={[{ label: 'Home' }, { label: 'Library' }]} />
              <Tabs
                tabs={[
                  { value: 'one', label: 'Overview' },
                  { value: 'two', label: 'Sources' },
                ]}
                value={tab}
                onChange={setTab}
              >
                {({ activeTab }) => <Text>Active tab: {activeTab}</Text>}
              </Tabs>
              <Divider />
              <Pagination page={page} totalPages={3} onPageChange={setPage} />
            </YStack>
          </CatalogSection>
        </Container>
      </ScrollView>
    </Page>
  )
}
