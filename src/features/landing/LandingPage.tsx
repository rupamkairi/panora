import { XStack, YStack, styled, View } from 'tamagui'

import { Link } from '~/interface/app/Link'
import { Logo } from '~/interface/app/Logo'
import { Button, Container, Heading, Text } from '~/interface/components'

const PRODUCT_ROUTE = '/chat' as const
const productAnchorProps = { href: PRODUCT_ROUTE } as const

const sourceDetails = [
  { label: 'Report', value: 'Quarterly performance review' },
  { label: 'Status', value: 'Selected locally' },
]

const processSteps = [
  {
    marker: 'Select',
    title: 'Bring the source into view',
    description:
      'Choose a report, document, or image as local conversation context. Its state stays visible before you ask.',
  },
  {
    marker: 'Ask',
    title: 'Use the language you already use',
    description:
      'Skip query syntax and rigid filters. Ask for an explanation, comparison, limitation, or follow-up.',
  },
  {
    marker: 'Compare',
    title: 'Keep the material beside the answer',
    description:
      'Read the response with the selected source close by, then continue the conversation wherever the evidence leads.',
  },
]

export function LandingPage() {
  return (
    <LandingRoot
      data-testid="landing-scroll-container"
      flex={1}
      bg="$background"
      $platform-web={{ overflowY: 'auto', overflowX: 'hidden' }}
    >
      <Masthead render="header">
        <Container size="xl" px={0}>
          <XStack minH={72} items="center" justify="space-between" gap="$4">
            <Logo height={30} />

            <Button
              render="a"
              {...productAnchorProps}
              variant="primary"
              uiSize="md"
            >
              Open Panora
            </Button>
          </XStack>
        </Container>
      </Masthead>

      <View render="main">
        <HeroSection render="section">
          <Container size="xl" px={0}>
            <HeroGrid>
              <YStack maxW={660} gap="$6" justify="center">
                <Text size="sm" weight="semibold" tone="accent">
                  A clearer way through complex reports
                </Text>
                <DisplayHeading render="h1">
                  Understand the report.
                  <DisplayAccent> Ask what it means.</DisplayAccent>
                </DisplayHeading>
                <Text
                  size="lg"
                  tone="secondary"
                  maxW={610}
                  $platform-web={{ fontSize: 17, lineHeight: 26 }}
                  $sm={{ fontSize: 20, lineHeight: 30 }}
                >
                  Panora is a report-grounded AI conversation that helps you explain
                  findings, compare viewpoints, and notice what deserves a closer look.
                </Text>
                <XStack items="center" gap="$4" flexWrap="wrap">
                  <Button
                    render="a"
                    {...productAnchorProps}
                    variant="primary"
                    uiSize="lg"
                  >
                    Start a conversation
                  </Button>
                  <Text size="sm" tone="secondary">
                    No sign-up required to start
                  </Text>
                </XStack>
              </YStack>

              <ProductVignette aria-label="Illustrative report conversation">
                <VignetteHeader>
                  <XStack items="center" gap="$2">
                    <SourceDot />
                    <Text size="xs" weight="semibold">
                      Illustrative example
                    </Text>
                  </XStack>
                  <Text size="xs" tone="secondary">
                    Local context
                  </Text>
                </VignetteHeader>

                <SourcePaper>
                  <XStack gap="$5" flexWrap="wrap">
                    {sourceDetails.map((detail) => (
                      <YStack key={detail.label} gap={2}>
                        <Text size="xs" tone="secondary">
                          {detail.label}
                        </Text>
                        <Text size="sm" weight="semibold">
                          {detail.value}
                        </Text>
                      </YStack>
                    ))}
                  </XStack>
                  <SourceRule />
                  <Text size="sm" tone="secondary">
                    Adjusted EBITDA margins contracted 340 basis points year-over-year,
                    driven primarily by a 12.8% increase in customer acquisition costs.
                    The blended take rate declined from 13.1% to 11.7%.
                  </Text>
                  <EvidenceLine>
                    Higher acquisition costs and a lower take rate moved in the same
                    direction.
                  </EvidenceLine>
                </SourcePaper>

                <ConversationPanel>
                  <QuestionBubble>
                    <Text size="sm" weight="medium">
                      Why did margins fall so sharply?
                    </Text>
                  </QuestionBubble>
                  <YStack gap="$2">
                    <Text size="xs" weight="semibold" tone="accent">
                      Panora
                    </Text>
                    <Text size="sm">
                      The report points to two pressures at once: acquiring each customer
                      became more expensive, while the business earned a smaller share of
                      each sale. The combination explains the unusually large contraction.
                    </Text>
                  </YStack>
                </ConversationPanel>
              </ProductVignette>
            </HeroGrid>
          </Container>
        </HeroSection>

        <ValueStrip render="section" aria-label="What Panora keeps in view">
          <Container size="xl" px={0}>
            <ValueGrid>
              <ValueItem
                title="Source close by"
                description="Selected material remains visible as conversation context."
              />
              <ValueItem
                title="State you can trust"
                description="Local selection is never presented as completed processing."
              />
              <ValueItem
                title="Questions stay open"
                description="Explain, compare, challenge, and follow up in one continuous chat."
              />
            </ValueGrid>
          </Container>
        </ValueStrip>

        <ProcessSection render="section">
          <Container size="xl" px={0}>
            <ProcessGrid>
              <YStack gap="$4" maxW={440}>
                <Text size="sm" weight="semibold" tone="accent">
                  From source to understanding
                </Text>
                <SectionHeading render="h2">
                  A familiar conversation, grounded in what you are reading.
                </SectionHeading>
                <Text size="md" tone="secondary">
                  Panora keeps the interaction simple so your attention can stay on the
                  argument, the evidence, and the gaps between them.
                </Text>
              </YStack>

              <YStack>
                {processSteps.map((step, index) => (
                  <ProcessStep
                    key={step.marker}
                    marker={step.marker}
                    title={step.title}
                    description={step.description}
                    last={index === processSteps.length - 1}
                  />
                ))}
              </YStack>
            </ProcessGrid>
          </Container>
        </ProcessSection>

        <ClosingSection render="section">
          <Container size="lg" px={0}>
            <YStack items="center" gap="$6">
              <Text size="sm" weight="semibold" color="$contentInverse">
                Read with a better question in mind
              </Text>
              <ClosingHeading render="h2">
                Turn the next dense report into a useful conversation.
              </ClosingHeading>
              <Text
                size="md"
                color="$contentInverse"
                opacity={0.76}
                text="center"
                maxW={600}
              >
                Start with the report in front of you. Panora helps you work through what
                it says, what it implies, and what still needs verification.
              </Text>
              <Button
                render="a"
                {...productAnchorProps}
                variant="secondary"
                uiSize="lg"
                hoverStyle={{ opacity: 0.9 }}
                pressStyle={{ opacity: 0.82, scale: 0.98 }}
              >
                Open Panora
              </Button>
            </YStack>
          </Container>
        </ClosingSection>
      </View>

      <SiteFooter render="footer">
        <Container size="xl" px={0}>
          <XStack
            minH={92}
            items="center"
            justify="space-between"
            gap="$5"
            flexWrap="wrap"
          >
            <Logo height={26} />
            <XStack items="center" gap="$1" flexWrap="wrap">
              <NavLink href="/legal/privacy">Privacy Policy</NavLink>
              <NavLink href="/legal/terms">Terms of Service</NavLink>
            </XStack>
            <Text size="xs" tone="secondary">
              © 2026 Panora
            </Text>
          </XStack>
        </Container>
      </SiteFooter>
    </LandingRoot>
  )
}

function ValueItem({ title, description }: { title: string; description: string }) {
  return (
    <YStack gap="$2" py="$5">
      <Text weight="semibold">{title}</Text>
      <Text size="sm" tone="secondary" maxW={320}>
        {description}
      </Text>
    </YStack>
  )
}

function ProcessStep({
  marker,
  title,
  description,
  last,
}: {
  marker: string
  title: string
  description: string
  last: boolean
}) {
  return (
    <XStack
      gap="$5"
      py="$6"
      borderBottomWidth={last ? 0 : 1}
      borderColor="$outlineVariant"
      $sm={{ gap: '$5' }}
    >
      <Text size="sm" weight="semibold" tone="accent" minW={64}>
        {marker}
      </Text>
      <YStack gap="$2" flex={1}>
        <Text
          weight="semibold"
          $platform-web={{ fontSize: 18, lineHeight: 26 }}
          $sm={{ fontSize: 20, lineHeight: 28 }}
        >
          {title}
        </Text>
        <Text size="sm" tone="secondary" maxW={520}>
          {description}
        </Text>
      </YStack>
    </XStack>
  )
}

const LandingRoot = styled(View, {
  width: '100%',
})

const Masthead = styled(YStack, {
  px: '$4',
  borderBottomWidth: 1,
  borderColor: '$outlineVariant',
  bg: '$background',

  $sm: {
    px: '$6',
  },
})

function NavLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href as never}
      minH={44}
      px="$3"
      items="center"
      justify="center"
      textDecorationLine="none"
    >
      <Text size="sm" tone="secondary">
        {children}
      </Text>
    </Link>
  )
}

const HeroSection = styled(YStack, {
  px: '$4',
  py: '$8',
  bg: '$background',

  $sm: {
    px: '$6',
    py: '$11',
  },
})

const HeroGrid = styled(XStack, {
  flexDirection: 'column',
  gap: '$8',
  items: 'stretch',
  justify: 'space-between',

  $lg: {
    flexDirection: 'row',
    items: 'center',
    gap: '$10',
  },
})

const DisplayHeading = styled(Heading, {
  maxW: 700,
  fontWeight: '600',
  letterSpacing: -1.4,
  '$platform-web': {
    fontSize: 48,
    lineHeight: 50,
    textWrap: 'balance',
  },

  $md: {
    fontSize: 60,
    lineHeight: 62,
    letterSpacing: -1.8,
  },
  $lg: {
    fontSize: 68,
    lineHeight: 70,
    letterSpacing: -2,
  },
  $xl: {
    fontSize: 76,
    lineHeight: 78,
    letterSpacing: -2.2,
  },
})

const DisplayAccent = styled(Text, {
  color: '$accent',
  fontFamily: '$heading',
  fontWeight: '600',
  '$platform-web': {
    fontSize: 'inherit',
    lineHeight: 'inherit',
    letterSpacing: 'inherit',
  },
})

const ProductVignette = styled(YStack, {
  width: '100%',
  maxW: 540,
  shrink: 1,
  bg: '$surface',
  rounded: 16,
  overflow: 'hidden',
  shadowColor: '$content',
  shadowOpacity: 0.14,
  shadowRadius: 34,
  shadowOffset: { width: 0, height: 18 },

  '$max-lg': {
    maxW: '100%',
  },
})

const VignetteHeader = styled(XStack, {
  minH: 52,
  px: '$5',
  items: 'center',
  justify: 'space-between',
  borderBottomWidth: 1,
  borderColor: '$outlineVariant',
})

const SourceDot = styled(View, {
  width: 8,
  height: 8,
  rounded: '$10',
  bg: '$accent',
})

const SourcePaper = styled(YStack, {
  gap: '$4',
  p: '$5',
  bg: '$surface',
})

const SourceRule = styled(View, {
  height: 1,
  bg: '$outlineVariant',
})

const EvidenceLine = styled(Text, {
  bg: '$accentContainer',
  px: '$3',
  py: '$2',
  rounded: 8,
  fontSize: 14,
  lineHeight: 21,
})

const ConversationPanel = styled(YStack, {
  gap: '$4',
  p: '$5',
  bg: '$background',
  borderTopWidth: 1,
  borderColor: '$outlineVariant',
})

const QuestionBubble = styled(YStack, {
  maxW: '82%',
  self: 'flex-end',
  bg: '$accentContainer',
  rounded: 16,
  borderBottomRightRadius: 4,
  px: '$4',
  py: '$3',
})

const ValueStrip = styled(YStack, {
  px: '$4',
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderColor: '$outlineVariant',
  bg: '$surface',

  $sm: {
    px: '$6',
  },
})

const ValueGrid = styled(XStack, {
  flexDirection: 'column',
  gap: 0,
  justify: 'space-between',

  $sm: {
    flexDirection: 'row',
    gap: '$7',
  },
})

const ProcessSection = styled(YStack, {
  px: '$4',
  py: '$9',
  bg: '$background',

  $sm: {
    px: '$6',
    py: '$12',
  },
})

const ProcessGrid = styled(XStack, {
  flexDirection: 'column',
  gap: '$7',
  justify: 'space-between',

  $lg: {
    flexDirection: 'row',
    gap: '$12',
  },
})

const SectionHeading = styled(Heading, {
  fontWeight: '600',
  letterSpacing: -0.7,
  '$platform-web': {
    fontSize: 34,
    lineHeight: 39,
    textWrap: 'balance',
  },
  $md: {
    fontSize: 34,
    lineHeight: 39,
    letterSpacing: -0.7,
  },
  $lg: {
    fontSize: 46,
    lineHeight: 50,
    letterSpacing: -1.1,
  },
})

const ClosingSection = styled(YStack, {
  px: '$4',
  py: '$9',
  bg: '$accent',

  $sm: {
    px: '$6',
    py: '$12',
  },
})

const ClosingHeading = styled(Heading, {
  color: '$contentInverse',
  fontWeight: '600',
  text: 'center',
  maxW: 760,
  letterSpacing: -0.8,
  '$platform-web': {
    fontSize: 36,
    lineHeight: 41,
    textWrap: 'balance',
  },
  $md: {
    fontSize: 50,
    lineHeight: 54,
    letterSpacing: -1.2,
  },
})

const SiteFooter = styled(YStack, {
  px: '$4',
  bg: '$surface',

  $sm: {
    px: '$6',
  },
})
