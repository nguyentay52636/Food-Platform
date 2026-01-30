# 🍽️ Food Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.0-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Expo](https://img.shields.io/badge/Expo-54.0-000020?style=for-the-badge&logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?style=for-the-badge&logo=react)](https://reactnative.dev/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-CC2927?style=for-the-badge&logo=microsoft-sql-server)](https://www.microsoft.com/sql-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)]()

---

## 🚀 Giới thiệu

**Food Platform** là một hệ thống quản lý thực phẩm đầy đủ với kiến trúc **Full-Stack** hiện đại, bao gồm:

### 🖥️ Backend
- **API Server** được xây dựng với công nghệ hiện đại, kết nối với **Microsoft SQL Server** để quản lý dữ liệu
- Hỗ trợ RESTful API và real-time communication
- Bảo mật cao với authentication và authorization
- Quản lý database với migrations và versioning

### 🌐 Frontend Web
- **Next.js 15** - Framework React mạnh mẽ với Server-Side Rendering (SSR) và Static Site Generation (SSG)
- Giao diện web responsive, hiện đại với trải nghiệm người dùng tối ưu
- Hỗ trợ SEO và performance cao
- Tích hợp với backend API thông qua RESTful endpoints

### 📱 Frontend Mobile App
- **Expo React Native** - Ứng dụng di động đa nền tảng
- Hỗ trợ chạy trên **Android, iOS** và **Web** từ cùng một codebase TypeScript
- Giao diện hiện đại, animations mượt mà và trải nghiệm người dùng tối ưu trên mọi thiết bị
- Kết nối với backend API để đồng bộ dữ liệu real-time

---

## 🛠️ Công nghệ sử dụng

### 🖥️ Backend
| Thành phần | Công nghệ |
|------------|-----------|
| **Database** | Microsoft SQL Server 2022 |
| **ORM/Query Builder** | Entity Framework Core / Dapper |
| **API Framework** | ASP.NET Core / Node.js + Express |
| **Language** | C# / TypeScript / JavaScript |
| **Authentication** | JWT / OAuth 2.0 |
| **Real-time** | SignalR / WebSocket |
| **Validation** | Joi / Yup / FluentValidation |

### 🌐 Frontend Web (Next.js)
| Thành phần | Công nghệ |
|------------|-----------|
| **Framework** | Next.js 15 |
| **UI Library** | React 19.1.0 |
| **Language** | TypeScript 5.9 |
| **Styling** | Tailwind CSS / CSS Modules |
| **State Management** | Zustand / Redux Toolkit |
| **Data Fetching** | React Query / SWR |
| **UI Components** | shadcn/ui / Material-UI |
| **Form Handling** | React Hook Form / Formik |

### 📱 Frontend Mobile App (Expo)
| Thành phần | Công nghệ |
|------------|-----------|
| **Framework** | Expo SDK 54 |
| **UI Library** | React Native 0.81.5 |
| **Language** | TypeScript 5.9 |
| **Navigation** | Expo Router 6.0 + React Navigation 7.x |
| **UI Components** | React Native Paper 5.14 |
| **Animations** | React Native Reanimated 4.1 |
| **Gestures** | React Native Gesture Handler 2.28 |
| **Platforms** | Android, iOS, Web |

---

## 📦 Thư viện chính

### 🖥️ Backend
| Package | Version | Mô tả |
|---------|---------|-------|
| `mssql` / `tedious` | Latest | SQL Server driver cho Node.js |
| `express` | Latest | Web framework cho Node.js |
| `jsonwebtoken` | Latest | JWT authentication |
| `bcrypt` | Latest | Password hashing |
| `dotenv` | Latest | Environment variables |
| `cors` | Latest | Cross-Origin Resource Sharing |
| `helmet` | Latest | Security middleware |
| `morgan` | Latest | HTTP request logger |
| `joi` / `yup` | Latest | Data validation |
| `socket.io` | Latest | Real-time communication |

### 🌐 Frontend Web (Next.js)
| Package | Version | Mô tả |
|---------|---------|-------|
| `next` | 15.x | React framework với SSR/SSG |
| `react` | 19.1.0 | UI library |
| `react-dom` | 19.1.0 | React DOM renderer |
| `typescript` | 5.9 | Type safety |
| `tailwindcss` | Latest | Utility-first CSS framework |
| `@tanstack/react-query` | Latest | Server state management |
| `axios` | Latest | HTTP client |
| `zustand` | Latest | Lightweight state management |
| `next-auth` | Latest | Authentication (Optional) |
| `react-hook-form` | Latest | Form handling |
| `zod` | Latest | Schema validation |

### 📱 Frontend Mobile App (Expo)

#### 🧭 Navigation & Routing
| Package | Version | Mô tả |
|---------|---------|-------|
| `expo-router` | 6.0.19 | File-based routing cho Expo |
| `@react-navigation/native` | 7.1.25 | Core navigation library |
| `@react-navigation/bottom-tabs` | 7.4.0 | Bottom tab navigator |
| `react-native-screens` | 4.16.0 | Native navigation primitives |

#### 🎨 UI & Styling
| Package | Version | Mô tả |
|---------|---------|-------|
| `react-native-paper` | 5.14.5 | Material Design components |
| `@expo/vector-icons` | 15.0.3 | Icon library đa dạng |
| `expo-image` | 3.0.11 | High-performance image component |
| `expo-splash-screen` | 31.0.12 | Splash screen management |

#### ✨ Animations & Gestures
| Package | Version | Mô tả |
|---------|---------|-------|
| `react-native-reanimated` | 4.1.1 | Powerful animation library |
| `react-native-gesture-handler` | 2.28.0 | Native gesture handling |
| `react-native-worklets` | 0.5.1 | Worklets cho animations |
| `expo-haptics` | 15.0.8 | Haptic feedback |

#### 🌐 Networking & Data
| Package | Version | Mô tả |
|---------|---------|-------|
| `axios` | Latest | HTTP Client mạnh mẽ |
| `@tanstack/react-query` | Recommended | Server state management (Optional) |

#### 🌍 Internationalization (i18n)
| Package | Version | Mô tả |
|---------|---------|-------|
| `i18next` | Latest | Framework quốc tế hóa lõi |
| `react-i18next` | Latest | React bindings cho i18n |
| `expo-localization` | Latest | Lấy ngôn ngữ hệ thống |

---

## 📁 Cấu trúc dự án (Enterprise Scale)

Dự án được tổ chức theo kiến trúc **Monorepo** với **Feature-based** và **Separation of Concerns** để đảm bảo khả năng mở rộng (Scalability) và bảo trì (Maintainability).

```
📦 Food-Platform
│
├── 📂 backend/                    # Backend API Server
│   ├── 📂 src/
│   │   ├── 📂 controllers/        # Request handlers
│   │   ├── 📂 services/            # Business logic layer
│   │   ├── 📂 models/              # Database models
│   │   ├── 📂 routes/              # API routes
│   │   ├── 📂 middleware/          # Custom middleware (auth, validation)
│   │   ├── 📂 config/              # Configuration files
│   │   │   ├── 📜 database.ts      # SQL Server connection config
│   │   │   └── 📜 env.ts           # Environment variables
│   │   ├── 📂 utils/               # Helper functions
│   │   └── 📜 server.ts            # Entry point
│   ├── 📂 migrations/              # Database migrations
│   ├── 📂 scripts/                 # Database scripts
│   └── 📜 package.json
│
├── 📂 frontend-web/                # Next.js Web Application
│   ├── 📂 app/                     # Next.js App Router
│   │   ├── 📂 (auth)/              # Authentication routes
│   │   │   ├── 📜 login/
│   │   │   └── 📜 register/
│   │   ├── 📂 (dashboard)/         # Dashboard routes
│   │   │   ├── 📜 page.tsx
│   │   │   └── 📂 products/
│   │   ├── 📂 api/                 # API routes (Next.js API)
│   │   ├── 📜 layout.tsx           # Root layout
│   │   └── 📜 page.tsx             # Home page
│   ├── 📂 components/              # React Components
│   │   ├── 📂 ui/                  # Reusable UI components
│   │   │   ├── 📜 Button.tsx
│   │   │   ├── 📜 Input.tsx
│   │   │   └── 📜 Card.tsx
│   │   ├── 📂 features/            # Feature-specific components
│   │   │   ├── 📂 products/
│   │   │   └── 📂 orders/
│   │   └── 📂 layouts/             # Layout components
│   │       ├── 📜 Header.tsx
│   │       └── 📜 Footer.tsx
│   ├── 📂 lib/                     # Utilities & helpers
│   │   ├── 📂 api/                 # API client setup
│   │   │   ├── 📜 client.ts        # Axios instance
│   │   │   └── 📜 endpoints.ts     # API endpoints
│   │   ├── 📂 hooks/                # Custom React hooks
│   │   │   ├── 📜 useAuth.ts
│   │   │   └── 📜 useProducts.ts
│   │   └── 📂 utils/               # Helper functions
│   │       ├── 📜 format.ts
│   │       └── 📜 validation.ts
│   ├── 📂 public/                  # Static assets
│   ├── 📂 styles/                  # Global styles
│   ├── 📂 types/                   # TypeScript types
│   ├── 📜 next.config.js           # Next.js config
│   ├── 📜 tailwind.config.js       # Tailwind config
│   └── 📜 package.json
│
├── 📂 frontend-app/                # Expo React Native App
│   ├── 📂 app/                     # Expo Router Pages (Routing Layer)
│   │   ├── 📂 (tabs)/              # Tab-based navigation
│   │   │   ├── 📜 index.tsx        # Home tab
│   │   │   ├── 📜 products.tsx     # Products tab
│   │   │   └── 📜 profile.tsx      # Profile tab
│   │   ├── 📂 (auth)/              # Authentication routes
│   │   │   ├── 📜 login.tsx
│   │   │   └── 📜 register.tsx
│   │   └── 📜 _layout.tsx          # Global Providers Setup
│   ├── 📂 assets/                  # Static assets (images, fonts)
│   │   ├── 📂 images/
│   │   └── 📂 fonts/
│   ├── 📂 components/              # Reusable UI Components
│   │   ├── 📂 ui/                  # Atoms/Molecules (Button, Input, primitive UI)
│   │   │   ├── 📜 Button.tsx
│   │   │   ├── 📜 Input.tsx
│   │   │   └── 📜 Card.tsx
│   │   └── 📂 features/            # Feature-specific components
│   │       ├── 📂 products/
│   │       └── 📂 orders/
│   ├── 📂 constants/               # App-wide constants (Theme, Config, API Endpoints)
│   │   ├── 📜 theme.ts
│   │   ├── 📜 config.ts
│   │   └── 📜 api.ts
│   ├── 📂 context/                  # React Contexts (Global State like Theme, Auth)
│   │   ├── 📜 AuthContext.tsx
│   │   └── 📜 ThemeContext.tsx
│   ├── 📂 hooks/                   # Custom Hooks (UseTheme, UseAuth, UseFetch)
│   │   ├── 📜 useAuth.ts
│   │   ├── 📜 useTheme.ts
│   │   └── 📜 useFetch.ts
│   ├── 📂 locales/                 # i18n translation files (en.json, vi.json)
│   │   ├── 📜 en.json
│   │   └── 📜 vi.json
│   ├── 📂 services/                # Business Logic & API Layer
│   │   ├── 📂 api/                 # Axios setup & Interceptors
│   │   │   ├── 📜 client.ts
│   │   │   └── 📜 interceptors.ts
│   │   ├── 📂 auth/                # Auth services
│   │   │   ├── 📜 auth.service.ts
│   │   │   └── 📜 token.service.ts
│   │   └── 📜 socket.service.ts    # WebSocket handling
│   ├── 📂 types/                   # TypeScript Interfaces & Types
│   │   ├── 📜 user.types.ts
│   │   ├── 📜 product.types.ts
│   │   └── 📜 api.types.ts
│   ├── 📂 utils/                   # Helper functions (Format dates, currency)
│   │   ├── 📜 format.ts
│   │   └── 📜 validation.ts
│   ├── 📜 app.json                 # Expo Config
│   ├── 📜 tsconfig.json            # TS Config
│   └── 📜 package.json
│
└── 📜 README.MD                    # Project documentation
```

---

## 🏛️ Kiến trúc & Best Practices

### Backend
1. **RESTful API Design**: Tuân thủ chuẩn REST với các HTTP methods phù hợp
2. **Database Management**: Sử dụng migrations để quản lý schema versioning
3. **Security**: 
   - JWT authentication với refresh tokens
   - Password hashing với bcrypt
   - Input validation và sanitization
   - CORS và security headers
4. **Error Handling**: Centralized error handling với proper HTTP status codes
5. **Logging**: Structured logging với morgan và winston

### Frontend Web (Next.js)
1. **Server-Side Rendering (SSR)**: Tận dụng SSR cho SEO và performance
2. **Static Site Generation (SSG)**: Pre-render static pages khi có thể
3. **API Integration**: 
   - Sử dụng React Query cho server state management
   - Axios instance tập trung với interceptors
4. **State Management**: 
   - Zustand cho client state
   - React Query cho server state
5. **Component Design**: 
   - Atomic Design pattern
   - Reusable components với TypeScript
6. **Styling**: Tailwind CSS với utility-first approach

### Frontend Mobile App (Expo)
1. **Separation of Concerns (SoC)**: Tách biệt rõ ràng giữa UI (Components), Business Logic (Hooks/Services), và State Management
2. **API Layer with Axios**:
   - Sử dụng Axios instance tập trung để quản lý Base URL, Timeouts
   - **Interceptors** để tự động xử lý Token (Attach headers) và Error Handling (Logout khi 401)
3. **Internationalization (i18n)**:
   - Hỗ trợ đa ngôn ngữ (Tiếng Việt / Tiếng Anh) ngay từ đầu
   - Tự động phát hiện ngôn ngữ hệ thống
4. **Theming System**:
   - Hỗ trợ Dark/Light mode toàn diện thông qua Context và React Native Paper Theme
5. **Component Design**:
   - Chia nhỏ components theo nguyên tắc Atomic Design hoặc Feature-based
   - Components nhận props rõ ràng, hạn chế hard-coded styles
6. **Performance**:
   - Optimize images với expo-image
   - Lazy loading và code splitting
   - Memoization khi cần thiết

---

## 🚀 Cài đặt & Chạy

### Yêu cầu hệ thống

#### Backend
- Node.js 18+ hoặc
- Microsoft SQL Server 2022 hoặc mới hơn
- npm hoặc yarn (cho Node.js) 

#### Frontend Web
- Node.js 18+
- npm hoặc yarn

#### Frontend Mobile App
- Node.js 18+
- npm hoặc yarn
- Expo CLI
- Android Studio (cho Android) hoặc Xcode (cho iOS)

### Cài đặt

```bash
# Clone repository
git clone https://github.com/yourusername/Food-Platform
cd Food-Platform

# Cài đặt Backend
cd backend
npm install
# Hoặc cho .NET: dotnet restore

# Cài đặt Frontend Web
cd ../frontend-web
npm install

# Cài đặt Frontend Mobile App
cd ../frontend-app
npm install
```

### Cấu hình môi trường

#### Backend
Tạo file `.env` trong thư mục `backend/`:
```env
# Database
DB_HOST=localhost
DB_PORT=1433
DB_NAME=FoodPlatform
DB_USER=sa
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Server
PORT=5000
NODE_ENV=development
```

#### Frontend Web
Tạo file `.env.local` trong thư mục `frontend-web/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Frontend Mobile App
Tạo file `.env` trong thư mục `frontend-app/`:
```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

### Chạy ứng dụng

#### Backend
```bash
cd backend

# Development mode
npm run dev
# Hoặc cho .NET: dotnet watch run

# Production mode
npm start
# Hoặc cho .NET: dotnet run
```

#### Frontend Web
```bash
cd frontend-web

# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

#### Frontend Mobile App
```bash
cd frontend-app

# Khởi động Expo development server
npm run start

# Chạy trên Android
npm run android

# Chạy trên iOS
npm run ios

# Chạy trên Web
npm run web

# Kiểm tra linting
npm run lint
```

### Database Setup

```bash
# Chạy migrations
cd backend
npm run migrate
# Hoặc cho .NET: dotnet ef database update

# Seed data (nếu có)
npm run seed
```

---

## ✨ Tính năng nổi bật

### Backend
- 🔐 **Authentication & Authorization** - JWT-based authentication với role-based access control
- 📊 **Database Management** - SQL Server với migrations và versioning
- 🔒 **Security** - Password hashing, input validation, CORS protection
- 📡 **Real-time Communication** - WebSocket/SignalR support
- 📝 **API Documentation** - Swagger/OpenAPI documentation

### Frontend Web (Next.js)
- ⚡ **Performance** - SSR/SSG cho tốc độ tải nhanh
- 🔍 **SEO Optimized** - Server-side rendering cho search engines
- 🎨 **Modern UI** - Responsive design với Tailwind CSS
- 📱 **Mobile Friendly** - Responsive trên mọi thiết bị
- 🔄 **Real-time Updates** - React Query với polling/websocket

### Frontend Mobile App (Expo)
- 🎨 **Material Design** - UI đẹp mắt với React Native Paper
- 🧭 **File-based Routing** - Navigation đơn giản với Expo Router
- ⚡ **Native Performance** - Animations 60fps với Reanimated
- 📱 **Cross-platform** - Một codebase, nhiều nền tảng
- 🌙 **Dark Mode** - Hỗ trợ theme sáng/tối
- 📲 **Haptic Feedback** - Phản hồi xúc giác native
- 🔗 **Deep Linking** - Hỗ trợ universal links
- 🌍 **i18n** - Đa ngôn ngữ (Tiếng Việt / Tiếng Anh)

---

## 📊 Database Schema

Dự án sử dụng **Microsoft SQL Server** với các bảng chính:

- **Users** - Thông tin người dùng
- **Products** - Sản phẩm/thực phẩm
- **Orders** - Đơn hàng
- **Categories** - Danh mục sản phẩm
- **Reviews** - Đánh giá sản phẩm
- **Cart** - Giỏ hàng

*(Chi tiết schema sẽ được cập nhật trong tài liệu riêng)*

---

## 🔗 API Documentation

API endpoints được document tại:
- Swagger UI: `http://localhost:5000/api-docs` (khi chạy backend)
- Postman Collection: `backend/docs/postman-collection.json`

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend Web tests
cd frontend-web
npm test

# Frontend Mobile App tests
cd frontend-app
npm test
```

