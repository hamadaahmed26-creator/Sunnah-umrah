# iOS Info.plist — Permission Strings

When you run `yarn cap:add:ios` on a Mac, Capacitor generates the iOS project at
`/app/frontend/ios/App/App/Info.plist`. You MUST add these permission strings
**before submitting to App Store**, or Apple will reject the app and iOS will
crash when location is requested.

## How to add them

Open `Info.plist` in Xcode (or any text editor) and add these keys inside the
top-level `<dict>` element (anywhere — usually before the last `</dict>`):

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Sunnah Umrah uses your location to show direction to the Ka'bah, find your nearest gate of Masjid al-Haram, and share with your family group.</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Sunnah Umrah uses your location to show direction to the Ka'bah, find your nearest gate of Masjid al-Haram, and share with your family group.</string>

<key>NSMotionUsageDescription</key>
<string>Sunnah Umrah uses motion sensors to power the Qibla compass needle, so it points correctly toward the Ka'bah.</string>

<key>NSCameraUsageDescription</key>
<string>Sunnah Umrah needs camera access only when you scan a family member's group QR code.</string>
```

## What each one does

| Key | When iOS shows it | Why we need it |
|---|---|---|
| `NSLocationWhenInUseUsageDescription` | First time the user opens Qibla, Lost, or Stay-together with sharing on | Compass needs your GPS to compute bearing to Ka'bah; gate finder needs nearest Bab; group sharing needs your coords |
| `NSLocationAlwaysAndWhenInUseUsageDescription` | Same as above (iOS shows whichever string is set) | Required even if you only use "When in use" — Apple wants both keys filled |
| `NSMotionUsageDescription` | First time the Qibla compass tries to use device orientation | The compass needle reads the magnetometer; iOS treats this as a sensitive sensor on iOS 13+ |
| `NSCameraUsageDescription` | If you later add a "scan group QR" feature | Currently the app uses the share sheet only; safe to omit if you never add scanning |

## Apple App Privacy questionnaire

When you fill out the App Store Connect "App Privacy" form, declare:

| Data type | Collected? | Linked to user? | Tracking? |
|---|---|---|---|
| Precise location | ✅ Yes | ❌ Not linked | ❌ No |
| Coarse location | ❌ No | — | — |
| Name | ✅ Yes (group display name only) | ❌ Not linked | ❌ No |
| Diagnostics / Crash data | ❌ No | — | — |
| Identifiers | ❌ No (no IDFA, no IDFV) | — | — |
| Contact info | ❌ No | — | — |

Privacy policy URL (required): **https://sunnahumrah.app/privacy**
(host the existing `/app/PRIVACY_POLICY.md` at this URL — easiest is to create a `/privacy` route in React)

---

✅ Once these strings are added, iOS shows your custom message in the system permission popup —
exactly what you wanted.
