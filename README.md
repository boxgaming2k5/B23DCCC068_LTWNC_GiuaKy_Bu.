# 📚 Mini Library — Ứng Dụng Tra Cứu & Quản Lý Mượn/Trả Sách

> **Bài Kiểm Tra Giữa Kỳ — Môn Lập Trình Web Nâng Cao (LTWNC)**  
> **Kiến trúc ứng dụng chuẩn Senior Web Engineer (React 18 + TypeScript + Redux Toolkit + Zustand + Jest)**

---

## 🌟 Giới Thiệu

Ứng dụng **"Mini Library"** giải quyết bài toán quản lý mượn/trả sách chuyên ngành (CNTT, Kinh tế, Ngoại ngữ) cho thư viện khoa, thay thế hoàn toàn phương pháp ghi chép thủ công. Hệ thống cung cấp khả năng tra cứu tức thì, theo dõi số bản sách theo thời gian thực, quản lý giỏ sách đang mượn và cung cấp báo cáo thống kê chuyên sâu.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Cài đặt các gói thư viện
```bash
npm install
```

### 2. Khởi chạy ứng dụng (Môi trường Development)
```bash
npm start
# hoặc
npm run dev
```
Ứng dụng sẽ tự động mở tại địa chỉ: `http://localhost:3000`

### 3. Chạy toàn bộ Test Suites (Jest + React Testing Library)
```bash
npm test
```
> Tất cả **17/17 test cases** trong 4 test suites sẽ chạy và pass xanh 100%.

### 4. Kiểm tra TypeScript & Build Production
```bash
npm run build
```
Build hoàn tất với code splitting tự động, tách trang `/stats` thành file chunk độc lập thông qua `React.lazy`.

---

## 🏛️ Bản Đồ Kiến Trúc & Ánh Xạ Nội Dung Môn Học

Dự án được xây dựng và tổ chức theo tiêu chuẩn công nghiệp hiện đại, bao phủ toàn diện 6 buổi học của học phần:

### 📘 Buổi 1 — TypeScript Nâng Cao (Generic, Utility Types, Type Guard)
- **Generic API Response**: Định nghĩa kiểu generic chuẩn `{ ok: true; data: T; message?: string } | { ok: false; error: string; code?: string }` tại [`src/types/book.ts`](file:///D:/KTGKHieu/src/types/book.ts).
- **Type Guards**: Hàm `isApiSuccess<T>(res)` và `isApiError<T>(res)` giúp TypeScript thu hẹp kiểu dữ liệu (narrowing) chuẩn xác trong reducers và components.
- **Tận dụng các Utility Types**:
  1. `Pick<Book, ...>`: Kiểu `BookSummary` dùng cho các danh sách rút gọn.
  2. `Omit<Book, 'id'>`: Kiểu `CreateBookPayload` cho việc tạo mới sách.
  3. `Record<BookGenre, number>`: Kiểu `GenreCountRecord` ánh xạ thể loại sang số lượng sách.
  4. `Readonly<Book>`: Đảm bảo tính bất biến của bản ghi sách.
  5. `Partial<Omit<Book, 'id'>>`: Phục vụ cập nhật thông tin sách.
- **Zero `any`**: Cấu hình `strict: true` trong TypeScript, toàn bộ codebase 100% type-safe.

### ⚛️ Buổi 2 — Design Pattern React & Custom Hooks Nâng Cao
- **Generic Custom Hook `useDebounce<T>`** ([`src/hooks/useDebounce.ts`](file:///D:/KTGKHieu/src/hooks/useDebounce.ts)): Trì hoãn cập nhật giá trị tìm kiếm (300ms) để tối ưu hiệu năng lọc.
- **Custom Hook `useBooksFilter`** ([`src/hooks/useBooksFilter.ts`](file:///D:/KTGKHieu/src/hooks/useBooksFilter.ts)): Kết nối giữa Redux store và Zustand store, tính toán filtered books.
- **Custom Hook `useTheme`** ([`src/context/ThemeContext.tsx`](file:///D:/KTGKHieu/src/context/ThemeContext.tsx)): Truy xuất context theme với cơ chế runtime guard ném lỗi khi dùng ngoài Provider.

### 🔄 Buổi 3 — Redux Toolkit + TypeScript (Feature-Based Structure)
- **Cấu trúc thư mục theo tính năng (Feature-based)**:
  - `src/features/books/`: Quản lý toàn bộ logic, components, reducer liên quan đến sách.
  - `src/features/stats/`: Quản lý báo cáo thống kê.
- **`createSlice` & `createAsyncThunk`** ([`src/features/books/booksSlice.ts`](file:///D:/KTGKHieu/src/features/books/booksSlice.ts)):
  - Xử lý đầy đủ **3 trạng thái**: `fetchBooks.pending`, `fetchBooks.fulfilled`, `fetchBooks.rejected`.
  - Quản lý state mượn sách (`borrowBook`) và trả sách (`returnBook`), tự động cập nhật số bản còn lại (`availableCopies`).
- **Typed Hooks**: Export `useAppDispatch` và `useAppSelector` tại [`src/app/hooks.ts`](file:///D:/KTGKHieu/src/app/hooks.ts).

### ⚡ Buổi 4 — Zustand, Context Nâng Cao & Redux Middleware Tự Viết
- **Zustand State Bộ Lọc** ([`src/store/useFilterStore.ts`](file:///D:/KTGKHieu/src/store/useFilterStore.ts)):
  - Quản lý trạng thái từ khóa `searchQuery` và thể loại `selectedGenre` độc lập với Redux, tránh clutter Redux state tree.
- **Context Nâng Cao Quản Lý Theme Sáng / Tối** ([`src/context/ThemeContext.tsx`](file:///D:/KTGKHieu/src/context/ThemeContext.tsx)):
  - Cung cấp chế độ Light/Dark mode.
  - Tối ưu bằng `useMemo` cho context value để chống render lặp thừa.
  - Đồng bộ tự động với `localStorage` và class `dark` / thuộc tính `data-theme` trên root element.
- **Custom Redux Middleware Kiểm Soát Giới Hạn 3 Cuốn** ([`src/app/middleware/borrowLimitMiddleware.ts`](file:///D:/KTGKHieu/src/app/middleware/borrowLimitMiddleware.ts)):
  - Tự động bắt action `borrowBook`.
  - **Chặn** mượn sách khi sinh viên đã mượn $\ge 3$ cuốn cùng lúc hoặc mượn trùng đầu sách.
  - Tự động dispatch action `setNotification` hiển thị toast cảnh báo.

### 🚀 Buổi 5 — Tối Ưu Hiệu Năng Ứng Dụng
- **`useMemo`**:
  - Tính toán danh sách sách sau khi lọc dựa trên từ khóa debounce và thể loại đã chọn.
  - Thống kê số lượng đầu sách theo từng thể loại tại trang Stats.
- **`React.memo`**: Component [`BookCard`](file:///D:/KTGKHieu/src/features/books/components/BookCard.tsx) được bọc bằng `React.memo` để không bị render lại khi component cha cập nhật state không liên quan.
- **`useCallback`**: Tất cả các handler sự kiện (`handleBorrow`, `handleReturn`, `handleRetry`) truyền xuống component con đều được tối ưu với `useCallback`.
- **Key không dùng index**: Danh sách sách luôn sử dụng `key={book.id}` duy nhất.
- **Lazy Loading**: Route `/stats` ([`StatsPage`](file:///D:/KTGKHieu/src/features/stats/StatsPage.tsx)) được tải lười bằng `React.lazy()` kết hợp `<Suspense fallback={<StatsSkeleton />}>`.

### 🧪 Buổi 6 — Kiểm Thử Đầy Đủ Với Jest + React Testing Library
Dự án bao gồm **17 test cases** chuẩn mực:
1. **Reducer testing (`booksSlice.test.ts`)**: 7 tests
   - Khởi tạo initial state.
   - `fetchBooks.pending` chuyển status thành `'loading'` và xóa error.
   - `fetchBooks.fulfilled` nạp danh sách sách và chuyển status thành `'succeeded'`.
   - `fetchBooks.rejected` ghi nhận thông điệp lỗi và chuyển status thành `'failed'`.
   - `borrowBook` giảm `availableCopies` đi 1 và thêm vào `borrowedBooks`.
   - `returnBook` tăng `availableCopies` lên 1 và gỡ khỏi `borrowedBooks`.
   - Quản lý toast notification.
2. **Component testing (`BookCard.test.tsx`)**: 4 tests với RTL + `userEvent`
   - Render đầy đủ thông tin sách (tên sách, tác giả, thể loại, năm XB, số bản còn lại).
   - Click nút "Mượn sách" kích hoạt handler với đúng ID cuốn sách.
   - Nút "Mượn" bị vô hiệu hóa (`disabled`) khi sách đã hết bản (`availableCopies === 0`).
   - Hiển thị nút "Trả sách" khi sách đang được mượn và gọi đúng `onReturn`.
3. **Custom Hook testing (`useDebounce.test.ts`)**: 3 tests với `jest.useFakeTimers()`
   - Kiểm tra trì hoãn cập nhật giá trị đúng 300ms.
   - Kiểm tra hủy timer khi người dùng gõ liên tục.
   - Kiểm tra generic type safety với object phức tạp.
4. **Middleware testing (`borrowLimitMiddleware.test.ts`)**: 3 tests
   - Cho phép mượn khi số sách $< 3$.
   - **Chặn** và phát cảnh báo khi mượn cuốn thứ 4.
   - **Chặn** khi mượn 2 bản của cùng 1 đầu sách.

---

## 📂 Cấu Trúc Thư Mục Dự Án

```
d:\KTGKHieu\
├── src/
│   ├── api/
│   │   └── booksApi.ts               # API giả lập delay 500ms, trả generic ApiResponse<Book[]>
│   ├── app/
│   │   ├── store.ts                  # Cấu hình Redux Toolkit store + custom middleware
│   │   ├── hooks.ts                  # Typed hooks useAppDispatch, useAppSelector
│   │   └── middleware/
│   │       ├── borrowLimitMiddleware.ts # Middleware kiểm soát giới hạn 3 cuốn
│   │       └── __tests__/
│   │           └── borrowLimitMiddleware.test.ts
│   ├── components/
│   │   └── common/
│   │       ├── Header.tsx            # Header ứng dụng, toggle theme, badge mượn
│   │       ├── NotificationToast.tsx # Toast cảnh báo toàn cục
│   │       └── StatsSkeleton.tsx     # Skeleton loading cho trang Stats
│   ├── context/
│   │   └── ThemeContext.tsx          # Theme Context nâng cao, useMemo, useTheme
│   ├── features/
│   │   ├── books/
│   │   │   ├── booksSlice.ts         # Redux slice: asyncThunk, borrow, return
│   │   │   ├── components/
│   │   │   │   ├── BookCard.tsx      # Component hiển thị 1 cuốn sách (React.memo)
│   │   │   │   ├── BookList.tsx      # Danh sách sách, tối ưu useCallback
│   │   │   │   ├── FilterBar.tsx     # Tìm kiếm debounce + lọc thể loại
│   │   │   │   └── BorrowedDrawer.tsx # Drawer quản lý danh sách đang mượn
│   │   │   └── __tests__/
│   │   │       ├── booksSlice.test.ts
│   │   │       └── BookCard.test.tsx
│   │   └── stats/
│   │       └── StatsPage.tsx         # Trang thống kê (React.lazy)
│   ├── hooks/
│   │   ├── useDebounce.ts            # Custom hook generic useDebounce<T>
│   │   ├── useBooksFilter.ts         # Hook kết nối Zustand & Redux
│   │   └── __tests__/
│   │       └── useDebounce.test.ts   # Test useDebounce với Fake Timers
│   ├── store/
│   │   └── useFilterStore.ts         # Zustand store cho bộ lọc
│   ├── styles/
│   │   └── index.css                 # Hệ thống CSS Design System Light/Dark
│   ├── types/
│   │   └── book.ts                   # Types, Type Guards, Generic, Utility Types
│   ├── App.tsx                       # Cấu hình React Router + Suspense
│   ├── main.tsx                      # Entry point ứng dụng
│   └── setupTests.ts                 # Cấu hình Jest & Testing Library
├── jest.config.cjs                   # Cấu hình Jest chạy ts-jest
├── tsconfig.json                     # Cấu hình TypeScript strict mode
├── tsconfig.jest.json                # Cấu hình TypeScript cho test runner
├── vite.config.ts                    # Cấu hình Vite build tool
├── index.html                        # HTML template
└── package.json
```

---

## 📝 Hướng Dẫn Nộp Bài Lên GitHub

1. Khởi tạo Git repository trong thư mục:
   ```bash
   git init
   git add .
   git commit -m "feat: complete Mini Library midterm project with advanced architecture"
   ```
2. Đổi tên nhánh sang `main`:
   ```bash
   git branch -M main
   ```
3. Tạo repository mới trên GitHub với tên theo định dạng đề bài: `<Mã sinh viên>_LTWNC_GiuaKy`
4. Liên kết và đẩy code lên:
   ```bash
   git remote add origin https://github.com/<tai-khoan-github>/<MaSinhVien>_LTWNC_GiuaKy.git
   git push -u origin main
   ```

