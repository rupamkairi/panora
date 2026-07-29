# Android signing certificates

Package name: `dev.rupamkairi.panora`

## Which key is used where?

| Key | Holder | Purpose |
| --- | --- | --- |
| Upload key | Panora | Signs the `.aab` uploaded to Google Play. Play verifies the upload and then re-signs the generated APKs. |
| Deployment key | Google Play | Signs APKs delivered to Android 16 and earlier devices. Use its fingerprints with API providers and Digital Asset Links. |
| Hybrid classical key | Google Play | Classical half of the Android 17+ quantum-ready hybrid signature. Register it with API providers and Digital Asset Links. |
| Hybrid post-quantum key | Google Play | Post-quantum half of the Android 17+ quantum-ready hybrid signature. Register it with API providers and Digital Asset Links. |

The `.der` files are public certificates. They contain no private keys and cannot
be used to sign an app. The private upload key and its credentials are under
`.secrets/android/`; keep both files secret and backed up.

## Upload key — held by Panora

Certificate: `../certificates/upload_cert.der`

- SHA-256: `2E:41:44:6B:5A:47:50:B6:F4:B2:E1:33:92:0E:42:27:D2:CC:D5:F8:B4:D1:71:FD:F3:AD:DB:BB:5D:BE:A5:B5`
- SHA-1: `1B:36:D9:C5:AD:5F:7D:DF:AD:3B:B8:97:8C:FF:59:52:E0:28:75:42`

Register this certificate as the app's upload-key certificate in Google Play.
Do not use it for production OAuth clients, Maps restrictions, Firebase Android
app credentials, or Digital Asset Links because Play-distributed APKs are not
signed with this key.

## Deployment key — held by Google Play

Certificate: `../certificates/deployment_cert.der`

- SHA-256: `93:92:26:F6:E6:3B:DF:09:27:4A:68:86:4A:EA:38:27:93:8B:F5:D4:9F:E4:8D:20:C7:40:79:94:A5:C0:89:B2`
- SHA-1: `0E:77:BF:A7:EA:5F:1B:CF:87:EC:34:0C:8F:9E:C3:B8:85:53:D7:9D`

## Hybrid classical key — held by Google Play

Certificate: `../certificates/hybrid_classical_cert.der`

- SHA-256: `CA:FE:26:E8:04:E2:E3:40:8A:9F:76:38:06:E8:67:81:25:D5:DB:B3:EF:B3:34:45:9C:88:68:EA:E2:B0:42:FC`
- SHA-1: `21:D0:D6:64:96:C4:54:87:8B:06:74:18:23:5B:F9:81:4C:4A:CB:53`

## Hybrid post-quantum key — held by Google Play

Certificate: `../certificates/hybrid_pqc_cert.der`

- SHA-256: `E0:31:21:7A:97:F9:D7:93:33:20:22:7F:3A:A4:5B:6A:C7:99:56:BC:F1:35:7D:BD:B2:67:36:FD:7D:1E:C2:37`
- SHA-1: `21:92:6B:BC:75:B4:F5:47:AC:DB:6B:2E:23:34:67:41:BF:BE:F9:99`

## Digital Asset Links JSON

Host this as `https://<your-domain>/.well-known/assetlinks.json`. Replace
`<your-domain>` with every web domain declared by an Android App Link intent
filter.

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "dev.rupamkairi.panora",
      "sha256_cert_fingerprints": [
        "93:92:26:F6:E6:3B:DF:09:27:4A:68:86:4A:EA:38:27:93:8B:F5:D4:9F:E4:8D:20:C7:40:79:94:A5:C0:89:B2",
        "CA:FE:26:E8:04:E2:E3:40:8A:9F:76:38:06:E8:67:81:25:D5:DB:B3:EF:B3:34:45:9C:88:68:EA:E2:B0:42:FC",
        "E0:31:21:7A:97:F9:D7:93:33:20:22:7F:3A:A4:5B:6A:C7:99:56:BC:F1:35:7D:BD:B2:67:36:FD:7D:1E:C2:37"
      ]
    }
  }
]
```
