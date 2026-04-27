# Kenson Investment

> **Smart investing, simplified.** A mobile-first investment platform that puts your full financial picture in your pocket.

---

## About

**Kenson Investment** is a React Native mobile application designed to make personal investment management straightforward and transparent. Whether you're a first-time investor or tracking an established portfolio, the app gives you real-time visibility into your wealth — with clear charts, instant transaction history, and a secure account experience — all from your iOS or Android device.

The app opens with an elegant three-slide onboarding flow that introduces its three core promises:

- **Track Your Investments** — Monitor portfolio performance in real-time with detailed analytics and smart insights.
- **Grow Your Wealth** — Maximize returns with expert-guided investment plans and profit-tracking tools.
- **Safe & Secure** — Bank-grade security with transparent reporting keeps your assets protected.

Once signed in, users land on a dashboard that animates their total portfolio value in real time, surfaces quick stats (total profit, active plans, and returns), and renders a bar chart of recent performance — all built to load instantly with skeleton screens so the experience never feels slow.

From there, every core feature is one tap away through a bottom tab and side drawer navigation:

| Screen | What it does |
|---|---|
| **Home** | Animated portfolio value, bar chart overview, quick-action shortcuts |
| **Portfolio** | Line, bar, and pie charts broken down by year and asset category |
| **Deposits** | Full deposit history with status badges, search, and receipt downloads |
| **Withdrawals** | Withdrawal requests and transaction status tracking |
| **All Activity** | Unified feed of every transaction across the account |
| **Monthly Statement** | Period-by-period financial statements |
| **Referral** | Shareable referral link with reward and earnings tracking |
| **Education** | In-app financial learning content |
| **Notifications** | Inbox for account alerts and updates |
| **Profile & Settings** | Edit profile, change password, contact support, privacy policy, and terms |

The project is built on **React Native 0.85** with TypeScript throughout, Redux Toolkit for global state, React Navigation v7 for routing, and Reanimated 4 for smooth, native-thread animations.

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
