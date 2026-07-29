import { LegalPage, LegalSection, Text } from '~/interface/components'

export function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="July 2026">
      <LegalSection title="1. Information Panora Handles">
        <Text size="sm" tone="secondary">
          Panora stores conversations, drafts, pinned state, and preferences on your
          device. If you create an account, the authentication service also handles the
          account details you provide, such as your email address.
        </Text>
      </LegalSection>

      <LegalSection title="2. AI Requests">
        <Text size="sm" tone="secondary">
          When you send a message, Panora sends the recent conversation content needed to
          answer it to our server and AI service provider. Do not include sensitive
          personal information that is not needed for your question.
        </Text>
      </LegalSection>

      <LegalSection title="3. Reports and Files">
        <Text size="sm" tone="secondary">
          Reports and files you select are kept as local conversation context unless the
          interface clearly tells you that they are being sent or uploaded. Selecting a
          file alone does not mean it has been uploaded or processed.
        </Text>
      </LegalSection>

      <LegalSection title="4. Local Data Controls">
        <Text size="sm" tone="secondary">
          You can remove individual conversations or clear locally stored conversation
          history from Panora. Removing the app may also remove locally stored data,
          subject to your device and backup settings.
        </Text>
      </LegalSection>

      <LegalSection title="5. Contact">
        <Text size="sm" tone="secondary">
          For privacy questions, contact privacy@panora.app.
        </Text>
      </LegalSection>
    </LegalPage>
  )
}
