# Panora — Google Play submission pack

Prepared from the application source on 29 July 2026. Replace every `[CONFIRM]`
value before submitting. Data Safety answers must be rechecked against the final
production Android App Bundle and all production vendors.

## Product identity

| Play Console field | Value |
| --- | --- |
| App name | Panora |
| Default language | English (United States) — recommended |
| App or game | App |
| Free or paid | Free, assuming no paid feature is added before launch |
| Category | Productivity |
| Suggested tags | AI assistant, Productivity, Education |
| Package name / Android application ID | `dev.rupamkairi.panora` |
| Version name | `0.0.1` |
| Release format | Android App Bundle (`.aab`) |
| App signing | Enroll in Play App Signing |
| Target audience | 18 and over — recommended for the initial launch |
| Ads | No |
| Primary countries | `[CONFIRM]` |

The requested identifier `dev.rupamkairi.panora-app` is not valid because Android
package-name segments cannot contain hyphens. Use `dev.rupamkairi.panora`.
The production package name is permanent after the first Play release, so confirm
this identifier before uploading.

### Recommended naming

| Use | Name |
| --- | --- |
| Product name | Panora |
| Play Store app name | Panora |
| Developer name | Rupam Kairi |
| Android application ID | `dev.rupamkairi.panora` |
| Expo slug | `panora` |
| URL scheme | `panora` |
| Vercel project name | `panora` |
| Production hostname | `panora.rupamkairi.dev` |
| Zero hostname | `zero.panora.rupamkairi.dev` |
| Database/publication prefix | `panora` / `zero_panora` |

## Main store listing

### App name

Panora

### Short description

Understand complex reports with clear, grounded AI conversations.

### Full description

Panora helps you work through dense reports, documents, and ideas in a focused
AI conversation.

Ask questions in everyday language to explain a finding, compare viewpoints,
surface limitations, or identify what deserves a closer look. Continue with
follow-up questions without losing the thread of the conversation.

With Panora, you can:

• Ask an AI assistant to explain complex information clearly
• Keep recent questions and answers together in one conversation
• Select reports, files, photos, or sample material as visible context
• Dictate a prompt using the microphone
• Pin, rename, share, or delete conversations
• Store drafts and conversation history locally on your device
• Clear local conversation history whenever you choose
• Use light or dark appearance settings

Panora is designed to support understanding, not replace original sources or
professional advice. AI responses can be incomplete or inaccurate, so verify
important information before making financial, medical, legal, or other
high-impact decisions.

Selected files and photos remain local unless Panora clearly indicates that
they will be uploaded or processed.

### Suggested release name

Panora 0.0.1 — Initial release

### Release notes

Welcome to Panora.

• Ask questions and receive streamed AI responses
• Organize and revisit conversations
• Add reports, files, and photos as conversation context
• Use voice input, sharing, and local history controls

## Store contact details

| Field | Value |
| --- | --- |
| Support email | `panora@rupamkairi.dev` `[CREATE AND MONITOR]` |
| Support website | `https://panora.rupamkairi.dev` |
| Developer website | `https://rupamkairi.dev` |
| Privacy policy URL | `https://panora.rupamkairi.dev/legal/privacy` `[DEPLOY AND VERIFY]` |
| Terms URL | `https://panora.rupamkairi.dev/legal/terms` `[DEPLOY AND VERIFY]` |
| Account deletion URL | `https://panora.rupamkairi.dev/account/delete` `[MUST BUILD]` |
| Developer name | `Rupam Kairi` |
| Developer address | `[REQUIRED in Play Console where applicable]` |
| Developer phone | `[REQUIRED for account verification; publication varies]` |

Use `panora@rupamkairi.dev` as the single public product contact, or create and
monitor the optional aliases `privacy@rupamkairi.dev` and
`legal@rupamkairi.dev` before placing them in the privacy policy or terms.

## Vercel web deployment

| Vercel field | Value |
| --- | --- |
| Project name | `panora` |
| Framework preset | Other |
| Production domain | `panora.rupamkairi.dev` |
| Build command | `bun run build` |
| Install command | `bun install --frozen-lockfile` |
| Output directory | Leave blank; One generates `.vercel/output` |
| Production branch | `main` `[CONFIRM]` |

Configure One with `web.deploy: 'vercel'` in `vite.config.ts` and use this
root-level `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": null,
  "cleanUrls": true,
  "buildCommand": "bun run build",
  "installCommand": "bun install --frozen-lockfile"
}
```

Set these production variables in Vercel:

```dotenv
ONE_SERVER_URL=https://panora.rupamkairi.dev
BETTER_AUTH_URL=https://panora.rupamkairi.dev
VITE_WEB_HOSTNAME=panora.rupamkairi.dev
VITE_ZERO_HOSTNAME=zero.panora.rupamkairi.dev

BETTER_AUTH_SECRET=<GENERATE_A_LONG_RANDOM_SECRET>
OPENROUTER_API_KEY=<SERVER_ONLY_KEY>
OPENROUTER_MODEL=openai/gpt-4o-mini

ZERO_UPSTREAM_DB=<PRODUCTION_POSTGRES_URL>
ZERO_CVR_DB=<ZERO_CVR_DATABASE_URL>
ZERO_CHANGE_DB=<ZERO_CHANGE_DATABASE_URL>
```

Add `panora.rupamkairi.dev` to Vercel, then create the DNS record Vercel shows
in the DNS provider for `rupamkairi.dev`. Deploy the persistent Zero service
separately at `zero.panora.rupamkairi.dev`; it is not suitable for a Vercel
serverless function.

Use the same production values when building Android so the installed app calls
the Vercel deployment rather than a development or Takeout endpoint.

## Graphic assets

| Asset | Requirement / recommendation | Current status |
| --- | --- | --- |
| Play icon | 512 × 512, 32-bit PNG, max 1 MB | Create a 512 × 512 export from `assets/icon.png`; current source is 1024 × 1024 |
| Feature graphic | 1024 × 500, JPEG or 24-bit PNG without alpha | Missing |
| Phone screenshots | At least 2 required; 4–8 recommended | Missing |
| Promo video | YouTube URL, optional | Missing |
| Tablet screenshots | Only if distributing to tablets; 4 recommended for large-screen promotion | App is not currently positioned for tablets |

Recommended phone screenshot story:

1. Empty chat — “Make complex reports easier to understand”
2. AI answer — “Ask follow-up questions in everyday language”
3. Context picker — “Keep the source close to the conversation”
4. Conversation sidebar — “Return to the work that matters”
5. Voice composer — “Speak a question when typing is inconvenient”
6. Local controls — “Share, delete, or clear your history”

Do not show file upload or real voice transcription in screenshots until those
features work as described in the production build.

## App access for Google review

The primary chat currently says no sign-up is required. Submit:

> No account is required. Launch the app, tap “Open Panora” if the landing page
> is shown, enter a question in the message field, and tap Send. To test optional
> context, tap the plus button. To test microphone access, press and hold the
> microphone button.

If any production feature becomes login-restricted, provide Google with a
durable reviewer account, credentials, and exact navigation instructions. The
account must not require OTP, personal phone access, or a time-limited code.

## App content declarations

### Ads

Answer **No**. No advertising SDK or ad UI was found in the repository.

### Target audience

Recommended initial selection: **18 and over** and **not designed for
children**. A general-purpose generative AI chat app requires safeguards if it
is offered to minors. Reassess after adding mature-content filtering and a
documented child-safety process.

### Content rating

Choose **Utility, Productivity, Communication, or Other** as the closest
questionnaire category offered. Answer the questionnaire from actual behavior.
The app contains user-to-AI conversation and no public user-to-user sharing,
gambling, purchases, ads, or built-in violent/sexual content. Because a
generative model can produce unpredictable text, do not assume an “Everyone”
rating in advance; accept the rating returned by IARC.

### News app

Answer **No**.

### Government app

Answer **No**.

### Financial features

Answer **No**, provided the app does not add financial transactions, lending,
investing, wallets, or financial-product advice before launch.

### Health apps

Answer **No**, provided the product is not marketed for health management or
medical advice.

### Data deletion

Answer that users can request deletion **only after** both of these are live:

1. A readily discoverable in-app account deletion flow.
2. A public web page where a user can request account and associated-data
   deletion without reinstalling the app.

Local conversation deletion and uninstalling the app do not satisfy account
deletion requirements.

### AI-generated content

Panora is covered by Google Play's AI-generated content policy. The current UI
has thumbs-up/thumbs-down controls, but feedback is only stored locally. Before
submission, provide a real in-app reporting or flagging mechanism that sends
reports to the developer, add moderation/safety handling, and document the
response process.

## Provisional Data Safety answers

These answers reflect the current source, not unknown behavior from hosting,
OpenRouter, Better Auth, infrastructure logs, or future SDK configuration.

### Initial questions

| Question | Provisional answer |
| --- | --- |
| Does the app collect or share required user data types? | Yes |
| Is all collected data encrypted in transit? | Yes, only if every production endpoint is HTTPS |
| Can users request deletion? | Not yet; implement the required flows first |
| Does the app independently review against a security standard? | No, unless you possess a qualifying certification |

### Data types

| Play data type | Collected? | Shared? | Purpose | Required? | Notes |
| --- | --- | --- | --- | --- | --- |
| Personal info — email address | Yes, for optional accounts | No, assuming auth vendors act only as service providers | Account management, app functionality | Optional | Better Auth stores account email |
| Personal info — name | Possibly | No | Account management | Optional | Account schema supports a name; confirm actual signup fields |
| Messages — other in-app messages | Yes | No under the service-provider exception; otherwise Yes | App functionality | Required to use AI chat | Recent conversation text is sent to Panora's server and OpenRouter |
| Files and docs | No currently | No | — | — | Selected file metadata/context is local and is not included in the current chat API request |
| Photos and videos | No currently | No | — | — | Selected photos are local and are not included in the current chat API request |
| Audio files / voice recordings | No currently | No | — | — | Current voice service is a mock and does not record audio |
| App interactions | No server collection found | No | — | — | Feedback and history are local |
| Device or other IDs | Possibly | Possibly | Fraud prevention, security, app functionality | Required | Server uses IP address temporarily for rate limiting; confirm hosting logs and Google’s applicable classification |
| Crash logs / diagnostics | No SDK found | No | — | — | Recheck the final bundle and hosting stack |

For each collected type, answer **ephemeral** only when Google’s definition is
met. Chat text is processed in memory by the Panora server, but OpenRouter’s
retention and training settings must be verified contractually before selecting
ephemeral processing. Do not mark data as “not shared” unless each external
recipient qualifies as a service provider under Google’s definition and only
processes data on the developer’s behalf.

## Android permissions

The resolved development Expo config currently contains:

| Permission | Intended purpose | Launch action |
| --- | --- | --- |
| `RECORD_AUDIO` | Voice prompt input | Remove for v0.0.1 or implement real recording/transcription with clear disclosure |
| `MODIFY_AUDIO_SETTINGS` | Added by audio dependency | Verify it is necessary |
| `FOREGROUND_SERVICE` | Added by audio dependency | Verify/remove if unnecessary |
| `FOREGROUND_SERVICE_MEDIA_PLAYBACK` | Added by audio dependency | Likely unnecessary for the current app; remove or justify |

The current voice feature returns a fixed mock transcript and does not record.
Requesting microphone and foreground-service permissions for this behavior is
misleading and should be fixed before review. Generate the production AAB and
inspect its final merged manifest because config plugins can add permissions not
visible in `app.config.ts`.

## Privacy policy changes required

The in-app policy is too short for Play submission. Publish a non-editable,
publicly accessible HTML page that includes:

- The developer/legal entity and Panora name.
- All collected data: account data, chat prompts and recent conversation
  context, IP/rate-limit data, and production logs.
- Each use and each recipient, including OpenRouter and hosting/auth providers.
- Whether providers retain data or use it for model training.
- Encryption and other secure handling practices.
- Concrete retention periods for accounts, server logs, AI requests, and local
  data.
- Account and data deletion instructions, exceptions, and completion timeline.
- The effect of uninstalling and device/cloud backups.
- International transfers where applicable.
- An active privacy contact.

The policy must stay consistent with the Data Safety form and actual production
configuration.

## Technical readiness and blockers

### Must fix before uploading

1. Set production `ONE_SERVER_URL` and web hostname to
   `https://panora.rupamkairi.dev`; the release fallback is still
   `https://takeout.tamagui.dev`.
2. Replace Takeout constants (`APP_NAME`, domain, admin email, trusted origins,
   demo credentials, and Zero fallback hosts) with Panora production values.
3. Deploy and test the public privacy policy, terms, support, and account
   deletion URLs.
4. Add in-app and web account deletion or remove account creation from the
   release.
5. Implement actionable AI-content reporting and safety handling.
6. Remove misleading/unnecessary audio and foreground-service permissions or
   complete the voice feature.
7. Verify whether photos/files are truly local; update the listing and Data
   Safety form if uploads are implemented.
8. Build the production AAB and inspect the final manifest, target SDK, minimum
   SDK, native libraries, signing, and network security.
9. Test every primary flow against the real production backend on a physical
   Android device.
10. Create the feature graphic and accurate phone screenshots.

### Build and release

The repository provides:

```sh
bun run android:production
```

The EAS production profile builds an Android App Bundle, uses
`APP_VARIANT=production`, and auto-increments the version code. Expo SDK 55 is
expected to target API 36, but verify the target API shown by Play Console after
upload rather than relying on the framework version.

### Testing track

Start with internal testing. If the Play developer account is a personal account
created after 13 November 2023, plan for a closed test with at least 12 opted-in
testers continuously for 14 days, followed by an application for production
access.

## Final pre-submission checklist

- [ ] Legal developer identity and public contact details confirmed
- [ ] `dev.rupamkairi.panora` confirmed as the permanent package name
- [ ] Production URLs and secrets configured
- [ ] Privacy policy and terms published and reachable
- [ ] In-app and web account deletion working
- [ ] AI report/flag flow reaches the developer
- [ ] Final permissions minimized and explained
- [ ] Data Safety form reconciled with vendors and final AAB
- [ ] Content rating and target audience completed accurately
- [ ] Ads declaration set to No
- [ ] App access instructions tested
- [ ] 512 × 512 Play icon exported
- [ ] 1024 × 500 feature graphic created
- [ ] At least 2 accurate phone screenshots uploaded
- [ ] Production AAB installs and works against HTTPS production services
- [ ] Internal test completed
- [ ] Closed-test rule completed if applicable
- [ ] Store listing proofread without unsupported claims
