import { LegalPage, LegalSection, Text } from '~/interface/components'

export function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="July 2026">
      <LegalSection title="1. Acceptance of Terms">
        <Text size="sm" tone="secondary">
          By accessing or using Panora, you agree to these Terms of Service. If you do not
          agree, do not use the service.
        </Text>
      </LegalSection>

      <LegalSection title="2. Description of Service">
        <Text size="sm" tone="secondary">
          Panora provides a personalized, report-grounded AI chat experience. You can
          select reports, documents, and images as conversation context. The interface
          indicates when selected material is available to a response.
        </Text>
      </LegalSection>

      <LegalSection title="3. User Accounts">
        <Text size="sm" tone="secondary">
          You are responsible for maintaining the confidentiality of your account
          credentials and for activity under your account. You agree to provide accurate
          information when creating an account.
        </Text>
      </LegalSection>

      <LegalSection title="4. Acceptable Use">
        <Text size="sm" tone="secondary">
          You may not use Panora unlawfully, interfere with the service, introduce
          malicious code, or submit content that violates another person&apos;s rights.
          Access may be restricted when necessary to protect users or the service.
        </Text>
      </LegalSection>

      <LegalSection title="5. Your Content">
        <Text size="sm" tone="secondary">
          You retain responsibility for content you provide and must have the right to use
          it. You permit Panora to handle that content only as needed to provide the
          features you request.
        </Text>
      </LegalSection>

      <LegalSection title="6. AI-Generated Content">
        <Text size="sm" tone="secondary">
          AI-generated responses may contain errors, inaccuracies, or omissions. Verify
          important information with the original source and use appropriate professional
          advice for high-impact decisions.
        </Text>
      </LegalSection>

      <LegalSection title="7. Service Availability">
        <Text size="sm" tone="secondary">
          Panora may change, interrupt, or discontinue features. The service is provided
          without a guarantee that every response will be available, complete, or
          accurate.
        </Text>
      </LegalSection>

      <LegalSection title="8. Changes to These Terms">
        <Text size="sm" tone="secondary">
          We may update these terms as the service changes. The current version and its
          update date will remain available on this page.
        </Text>
      </LegalSection>

      <LegalSection title="9. Contact">
        <Text size="sm" tone="secondary">
          For questions about these terms, contact legal@panora.app.
        </Text>
      </LegalSection>
    </LegalPage>
  )
}
