# Browser Games

One codebase for the website, Android APK and iOS app. Games added in the Admin page show up on all three platforms without an app update.

## What is included

- **Web app** (Vite + React + Tailwind): dark neon arcade UI, search, category chips, Continue Playing carousel, Favorites, History.
- **5 offline games** bundled in the app (Neon Snake, Space Blaster, Brick Breaker, Tic-Tac-Toe vs AI, Memory Card Match). They use Canvas and Web Audio and need no internet.
- **Online games** from Firestore, shown in a sandboxed iframe with Fullscreen, Reload, Mute and Open-in-browser controls.
- **Admin page** (`/admin`) to publish an online game: title, https URL, category, description, orientation, optional thumbnail.
- **Sync** via Firebase Auth (Google sign-in) and Firestore. Favorites and history are saved on the device and mirrored to `/users/{uid}` when signed in.
- **Capacitor** Android and iOS projects in `android/` and `ios/`.

## 1. Set up Firebase (one time)

1. Create a project at console.firebase.google.com.
2. Enable **Authentication → Sign-in method → Google**.
3. Create a **Firestore** database.
4. Add a web app under Project settings and copy the config into `.env.local` (see `.env.example`).
5. Deploy the security rules in `firestore.rules` (Firestore → Rules, or `firebase deploy --only firestore:rules`).
6. Make yourself an admin: sign in once, copy your user UID from Authentication, then create a document at `admins/{your-uid}` (any fields). Only the console can create admins.
7. Add the Android and iOS apps in Firebase if you want to use Firebase inside the native builds. Add `google-services.json` to `android/app/` and `GoogleService-Info.plist` to `ios/App/App/`.

Without `.env.local` the app still runs: offline games work and sync is simply disabled.

## 2. Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
```

## 3. Build the mobile apps

```bash
npm run cap:sync   # builds dist/ and copies it into the native projects
```

**Android APK**: open `android/` in Android Studio, then *Build → Build Bundle(s)/APK(s) → Build APK(s)*. Requires Android Studio and JDK 17+.

**iOS IPA**: requires a Mac with Xcode and CocoaPods. On the Mac run `npm install`, `npm run cap:sync`, then `npx cap open ios`. In Xcode choose your Team under Signing, then *Product → Archive*. The iOS project was generated on a Linux machine, so run `pod install` inside `ios/App` on the Mac first.

## Notes and limits

- The admin check is enforced by Firestore rules, not by the client. The client only hides the dashboard.
- Online games run in an iframe. Some sites refuse to load in an iframe; the app then offers an Open-in-browser button. Only add games you control or have permission to embed.
- The Mute button mutes the app's own sounds and posts a `bg-mute` message to online games. A game must listen for it to mute its own audio.
- Orientation lock works on browsers and WebViews that support `screen.orientation.lock`. Native orientation for iOS can be set in `ios/App/App/Info.plist` if you need it to be fixed.
