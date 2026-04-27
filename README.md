# Kenson Investment

A cross-platform mobile investment management app built with **React Native** (iOS & Android). It gives users a clean, intuitive interface to track their portfolio, manage deposits and withdrawals, view monthly statements, earn referral rewards, and access financial education — all from one place.

---

## Features

- **Authentication** — Splash, Login, Register, Forgot Password, OTP verification, and Reset Password flows
- **Home Dashboard** — Animated portfolio value counter, bar chart performance overview, and quick-action shortcuts
- **Portfolio** — Real-time portfolio breakdown with skeleton loading states
- **Deposits & Withdrawals** — Simple forms to move funds in and out
- **All Activity** — Full transaction history in one scrollable list
- **Monthly Statement** — Period-by-period statement view
- **Referral Program** — Shareable referral link and reward tracking
- **Education** — In-app financial learning resources
- **Notifications** — Push notification inbox
- **Profile & Settings** — Edit profile, change password, contact support, privacy policy, and terms of service
- **Drawer + Tab Navigation** — Smooth gesture-driven navigation powered by React Navigation

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React Native 0.85 (New Architecture) |
| Language | TypeScript 5 |
| Navigation | React Navigation v7 (Stack, Drawer, Bottom Tabs) |
| State | Redux Toolkit + AsyncStorage |
| UI / Icons | Vector Icons (Ionicons, Material Design) |
| Animations | React Native Reanimated 4 + Animated API |
| Media | React Native Video |
| Gestures | React Native Gesture Handler |

---

## Getting Started

### Prerequisites

- Node >= 22.11.0
- Xcode (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS)

### Install

```bash
git clone https://github.com/<your-username>/kenson-investment.git
cd kenson-investment
npm install
```

### iOS

```bash
cd ios && pod install && cd ..
npm run ios
```

### Android

```bash
npm run android
```

### Start Metro

```bash
npm start
```

---

## Project Structure

```
src/
├── assets/          # Images, fonts, and static files
├── components/      # Reusable UI components (Input, Header, BarChart, Skeleton…)
├── config/          # Environment config
├── constants/       # Routes, API endpoints, storage keys
├── data/            # Static datasets (e.g. location data)
├── hooks/           # Custom React hooks
├── navigation/      # Root, Auth, Main, Drawer, and Tab navigators
├── screens/         # One folder per screen group
├── services/        # API, Auth, and Pexels service layers
├── store/           # Redux store and slices
├── theme/           # Colors, typography, and spacing tokens
├── types/           # Shared TypeScript types
└── utils/           # Formatters, validators, helpers
```

---

## Environment Variables

Create a `.env` file in the project root and fill in the required values (see [src/config/env.ts](src/config/env.ts) for the full list):

```env
API_BASE_URL=https://your-api.example.com
PEXELS_API_KEY=your_pexels_key
```

> Never commit `.env` to version control.

---

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start Metro bundler |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest test suite |

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.
