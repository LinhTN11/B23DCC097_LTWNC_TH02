# B23DCC097_LTWNC_TH02 - Ứng Dụng Bấm Giờ Tập Luyện

- **Sinh viên thực hiện:** B23DCC097
- **Kho lưu trữ GitHub (Repo):** [https://github.com/LinhTN11/B23DCC097_LTWNC_TH02](https://github.com/LinhTN11/B23DCC097_LTWNC_TH02)

---

## 1. Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu cầu môi trường
- **Node.js:** Phiên bản `>= 22.12.0` (LTS khuyến nghị)
- **npm:** Đi kèm Node.js

### Các lệnh thực thi

```bash
# 1. Cài đặt các thư viện phụ thuộc
npm install

# 2. Chạy môi trường phát triển (Dev Server)
npm run dev

# 3. Kiểm tra kiểu & Build production bundle
npm run build

# 4. Chạy toàn bộ test suites (71 tests xanh toàn bộ)
npm test

# 5. Chạy kiểm tra độ bao phủ mã nguồn (Coverage Lines >= 70%)
npm run coverage

# 6. Kiểm tra quy chuẩn mã nguồn (Linter oxlint)
npm run lint
```

---

## 2. Tóm Tắt Công Nghệ & Kỹ Thuật Áp Dụng

Ứng dụng được xây dựng theo chuẩn **React 19 + TypeScript (strict mode)**, tuân thủ nghiêm ngặt các quy tắc kỹ thuật của bài thực hành:

1. **Quản lý trạng thái (State Management):**
   - **Đồng hồ buổi tập (`useSessionStore`):** Sử dụng **Zustand** kết hợp middleware `devtools`. Tách biệt các selector (`useSessionStore((s) => s.isRunning)`) để chống re-render thừa. Chỉ có component `CountdownBar` lắng nghe trực tiếp giá trị `elapsed`.
   - **Bài tập đã lưu (`useSavedStore`):** Sử dụng **Zustand** kết hợp middleware `persist` với khóa lưu trữ `workout-saved` trong `localStorage`.
   - **Giáo án tập luyện (`RoutineContext` + `routineReducer`):** Xây dựng theo mô hình mini-Redux thuần túy với `useReducer` và `discriminated union` actions (`create`, `rename`, `remove`, `addExercise`, `removeExercise`). Tách rời 2 Context riêng biệt (`RoutineStateContext` và `RoutineDispatchContext`) giúp các component chỉ dispatch (như form tạo giáo án) không bị re-render khi danh sách thay đổi. Tự động đồng bộ với `localStorage` qua khóa `workout-routines`. Middleware `withLogger` ghi nhận hành vi thay đổi state trong môi trường DEV.
   - **Giao diện Sáng/Tối (`ThemeContext`):** Tách biệt Context riêng biệt, memoize giá trị context value với `useMemo`.
   - **Trạng thái cục bộ:** Dùng `useState` cho ô tìm kiếm, bộ lọc nhóm cơ, tiêu chí sắp xếp.

2. **Tối ưu hóa hiệu năng (Performance Optimization):**
   - **Ảo hoá danh sách (Virtualization):** Dùng `FixedSizeList` (`react-window`) hiển thị 10.000 bài tập mượt mà với chiều cao khung nhìn 560px, mỗi dòng 56px.
   - **Tìm kiếm Debounce:** Tự xây dựng custom hook generic `useDebounce<T>(value: T, delay: number): T`, trì hoãn lọc dữ liệu 300ms sau khi người dùng ngừng gõ phím. Hàm xử lý gõ phím mang tên bắt buộc `handleKeywordShift`.
   - **Tối ưu render:** Bọc `React.memo` cho các dòng `ExerciseRow`, `useCallback` cho toàn bộ các handler truyền qua props, và `useMemo` cho việc lọc/sắp xếp trên bản sao mảng sử dụng `localeCompare(b, "vi")`.
   - **Code-Splitting theo Route:** Áp dụng `React.lazy` và `<Suspense fallback={<p>Đang tải trang...</p>}>` cho 3 trang `/saved`, `/routines`, `/routines/:id`, tách riêng biệt thành các file chunk JS độc lập khi build.

3. **Kiểm thử toàn diện (Testing with Vitest & RTL):**
   - 71 unit/integration tests xanh toàn bộ 100%, tên mô tả bằng tiếng Việt chuẩn ngữ nghĩa.
   - Kiểm tra fake timers với `vi.useFakeTimers()`, mock functions với `vi.fn()`, mô phỏng hành vi người dùng với `@testing-library/user-event`.
   - Độ bao phủ mã nguồn (Coverage) ở `src/features` và `src/utils` đạt trên **95% Lines** (vượt xa mốc yêu cầu 70%).

---

## 3. Cấu Trúc Thư Mục

```text
src/
├── App.test.tsx                      # Test điều hướng và layout chính của App
├── App.tsx                           # Root component (BUILD_TAG = "wk-5182", lazy routes)
├── benchmark.test.tsx                # Script/test đo lường React Profiler benchmark
├── index.css                         # Toàn bộ CSS giao diện Light/Dark responsive
├── main.tsx                          # Entry point khởi tạo React DOM
├── setupTests.ts                     # Cấu hình môi trường jsdom cho Vitest
├── test-utils.tsx                    # Hàm renderWithProviders bọc Provider + MemoryRouter
├── types.ts                          # Định nghĩa kiểu TypeScript (Exercise, MuscleGroup)
├── contexts/
│   ├── ThemeContext.test.tsx         # Test ThemeContext (light/dark switch)
│   └── ThemeContext.tsx              # ThemeContext + ThemeProvider + useTheme
├── data/
│   ├── exercises.test.ts             # Test bộ dữ liệu 10.000 bài tập và kiểm tra tự động
│   └── exercises.ts                  # Hàm sinh 10.000 bài tập ngẫu nhiên cố định
├── hooks/
│   ├── useDebounce.test.ts           # Test useDebounce với fake timers 300ms
│   └── useDebounce.ts                # Generic debounce hook
├── utils/
│   ├── format.test.ts                # Test định dạng giây formatDuration
│   └── format.ts                     # Hàm formatDuration(seconds): string
└── features/
    ├── library/
    │   ├── ExerciseRow.test.tsx      # Test render và sự kiện trên ExerciseRow
    │   ├── ExerciseRow.tsx           # Component từng dòng bài tập (React.memo)
    │   ├── LibraryPage.test.tsx      # Test tích hợp kho bài tập, lọc, sắp xếp, debounce
    │   └── LibraryPage.tsx           # Kho 10.000 bài tập với FixedSizeList
    ├── routines/
    │   ├── RoutineContext.test.tsx   # Test 2 context tách rời của Routine
    │   ├── RoutineContext.tsx        # RoutineStateContext & RoutineDispatchContext
    │   ├── RoutineDetailPage.test.tsx# Test chi tiết giáo án và tính tổng thời gian
    │   ├── RoutineDetailPage.tsx     # Chi tiết giáo án, danh sách bài tập, nút Bỏ, Tập tất cả
    │   ├── routineReducer.test.ts    # Test hàm thuần routineReducer
    │   ├── routineReducer.ts         # Reducer quản lý giáo án với discriminated union
    │   ├── RoutinesPage.test.tsx     # Test trang danh sách giáo án (userEvent)
    │   ├── RoutinesPage.tsx          # Form tạo giáo án và danh sách giáo án
    │   ├── withLogger.test.ts        # Test middleware ghi log trong môi trường DEV
    │   └── withLogger.ts             # Reducer middleware logger
    ├── saved/
    │   ├── SavedPage.test.tsx        # Test trang hiển thị bài tập đã lưu
    │   ├── SavedPage.tsx             # Danh sách bài tập đã lưu và nút Tập tất cả
    │   ├── useSavedStore.test.ts     # Test Zustand store cho bài tập đã lưu
    │   └── useSavedStore.ts          # Zustand store với persist (key: workout-saved)
    └── session/
        ├── CountdownBar.tsx          # Thanh tiến trình & đếm ngược độc lập (đọc elapsed)
        ├── SessionBar.test.tsx       # Test thanh điều khiển buổi tập
        ├── SessionBar.tsx            # Thanh điều khiển buổi tập cố định đáy màn hình
        ├── useSessionStore.test.ts   # Test store buổi tập (start, tick, prev, next, rest)
        └── useSessionStore.ts        # Zustand store buổi tập + devtools middleware
```

---

## 4. Đo Hiệu Năng (Profiler)

Thực hiện thử thách nâng cao đo thời gian render trang Kho bài tập khi sử dụng ảo hoá danh sách (`FixedSizeList` của `react-window`) so với khi bỏ ảo hoá (render đồng thời toàn bộ 10.000 phần tử `<ExerciseRow />` trực tiếp vào DOM).

### Phương pháp đo
- Sử dụng API chính thức của React: `<Profiler id="..." onRender={onRenderCallback}>` để thu thập thông số `actualDuration` (thời gian React render cây component) và `baseDuration` (thời gian ước lượng nếu render toàn bộ cây không memo).
- Phép đo được chuẩn hoá trong môi trường tự động hóa thông qua test suite `src/benchmark.test.tsx`, đo trực tiếp quá trình mount lần đầu với 10.000 bài tập thực tế.

### Bảng kết quả đo lường

| Tiêu chí so sánh | Có ảo hoá (`FixedSizeList`) | Không ảo hoá (10.000 dòng trong DOM) | Mức độ cải thiện |
|---|:---:|:---:|:---:|
| **Thời gian render mount (`actualDuration`)** | **~30.75 ms** | **~1835.10 ms** | **Nhanh hơn ~59.7 lần** |
| **Ước tính thời gian không memo (`baseDuration`)** | **~6.46 ms** | **~478.45 ms** | **Nhanh hơn ~74.1 lần** |
| **Số lượng phần tử DOM được tạo** | **~10 – 15 phần tử** | **10.000 phần tử** | **Giảm 99.85% DOM nodes** |
| **Trải nghiệm cuộn (FPS)** | Mượt mà, duy trì 60 FPS | Giật lag nặng, nghẽn luồng UI | Triệt tiêu hoàn toàn giật khung hình |

### Nhận xét & Kết luận
- **Hiện tượng khi không dùng ảo hoá:** Trình duyệt phải phân bổ bộ nhớ và tính toán CSS Layout/Reflow cho hơn 10.000 phần tử DOM cùng lúc, làm tiêu tốn gần **1.8 – 2.5 giây** chỉ riêng cho bước render ban đầu, gây đơ khung hình.
- **Hiệu quả khi dùng `FixedSizeList`:** `FixedSizeList` chỉ dựng các phần tử nằm trong vùng hiển thị (viewport 560px với chiều cao mỗi dòng 56px là khoảng 10–12 dòng) kèm buffer nhỏ. Quá trình mount chỉ mất **~30 ms**, giúp giao diện phản hồi tức thì và cuộn mượt mà.

---

## 5. Kết Quả Kiểm Thử & Báo Cáo Độ Bao Phủ (Coverage)

- **Tổng số test:** 71 passed / 71 tests (100% green).
- **Độ bao phủ dòng (Lines Coverage):**
  - Toàn bộ dự án: **95.06%**
  - `src/features/library`: **98.38%**
  - `src/features/routines`: **95.34%**
  - `src/features/session`: **94.25%**
  - `src/features/saved`: **86.95%**
  - `src/utils`: **100%**

![Bảng kết quả coverage](coverage.png)

---

## 6. Checklist Hoàn Thành Trước Khi Nộp

### Quy định bắt buộc
- [x] Dòng đầu tiên của `src/App.tsx` là `const BUILD_TAG = "wk-5182";`
- [x] Hàm xử lý khi gõ vào ô tìm kiếm tên là `handleKeywordShift`
- [x] Repo public, tên `B23DCC097_LTWNC_TH02`
- [x] Đủ 4 commit: `Phan 1`, `Phan 2`, `Phan 3`, `Phan 4`

### Phần 1 – Kho bài tập
- [x] Router + `NavLink` (Kho bài tập, Đã lưu, Giáo án), danh sách `FixedSizeList` (560px / 56px), `key = exercise.id`
- [x] `useDebounce` 300ms, lọc nhóm cơ (Tất cả, Ngực, Lưng, Chân, Vai, Tay), sắp xếp (Mặc định, Tên A-Z, Thời lượng tăng dần), đếm kết quả
- [x] Tối ưu hóa: `useMemo` + `React.memo` + `useCallback`

### Phần 2 – Zustand
- [x] `useSessionStore` đầy đủ state (`queue`, `currentIndex`, `isRunning`, `elapsed`) và action (`startSession`, `toggleRun`, `next`, `prev`, `addToSession`, `tick`)
- [x] `SessionBar` cố định ở đáy, `CountdownBar` tách riêng chỉ đọc `elapsed` để chống re-render thừa
- [x] `setInterval` 1000ms chỉ chạy khi `isRunning`, có cleanup `clearInterval`
- [x] Selector riêng cho từng component, danh sách không bị render lại mỗi giây
- [x] `useSavedStore` + `persist` (key `workout-saved`), trang `/saved` đầy đủ chức năng và nút Tập tất cả

### Phần 3 – Context + useReducer
- [x] `routineReducer` với discriminated union (`create`, `rename`, `remove`, `addExercise`, `removeExercise`), không sửa trực tiếp state, `addExercise` không thêm trùng bài
- [x] Middleware `withLogger` ghi log console trong môi trường DEV
- [x] Tách 2 Context riêng biệt (`RoutineStateContext`, `RoutineDispatchContext`), lưu `localStorage` với key `workout-routines`
- [x] Trang `/routines` (tạo giáo án, kiểm tra trùng tên không phân biệt hoa thường, rỗng, xóa)
- [x] Trang `/routines/:id` (danh sách bài, tính tổng thời gian bằng `reduce`, nút Bỏ, Tập tất cả)
- [x] Nút **+ Giáo án** trên trang Kho bài tập
- [x] `ThemeContext` riêng biệt với `useMemo`, nút chuyển đổi Sáng/Tối trên thanh menu
- [x] `React.lazy` + `<Suspense>` cho 3 trang `/saved`, `/routines`, `/routines/:id`, build ra các file chunk JS riêng

### Phần 4 – Kiểm thử
- [x] Đủ và vượt số lượng test: **71 tests** (yêu cầu tối thiểu 12 test), tên bằng tiếng Việt
- [x] Đầy đủ tất cả các trường hợp bắt buộc trong bảng đặc tả Phần 4
- [x] Coverage thư mục `src/features` và `src/utils` Lines đạt **95.06%** (yêu cầu >= 70%)
- [x] Đã chụp ảnh `coverage.png` tại thư mục gốc của repository

### Thử thách thêm (Hoàn thành đầy đủ 4/4)
- [x] **Thời gian nghỉ giữa bài:** Hỗ trợ đếm ngược thời gian nghỉ (10s) trong session store sau khi hết bài trước khi sang bài tiếp theo; có unit test đầy đủ.
- [x] **Đo hiệu năng Profiler:** Sử dụng React `<Profiler>` đo đạc so sánh render có ảo hoá vs không ảo hoá với 10.000 dòng dữ liệu, ghi chi tiết phương pháp và số liệu vào README.md.
- [x] **Middleware devtools:** Tích hợp middleware `devtools` của Zustand để theo dõi lịch sử actions trong Redux DevTools.
- [x] **Phím tắt Space:** Hỗ trợ phím Space để Bắt đầu/Tạm dừng buổi tập, tự động bỏ qua khi đang nhập liệu trong ô input/textarea/select, cleanup event listener khi unmount.

### Tiêu chí kỹ thuật chung
- [x] `npm run build` thành công, không có cảnh báo/lỗi
- [x] `npm test` thành công (71/71 tests xanh)
- [x] `npm run lint` hoàn thành 0 cảnh báo, 0 lỗi
- [x] Tuyệt đối không sử dụng `any`
- [x] Tuyệt đối không sử dụng `enum`
- [x] Không cài đặt và không sử dụng Redux Toolkit

---

# Bấm giờ tập luyện

> **Lập trình Web nâng cao · Bài thực hành TH02**
> Thời gian: **4 tiếng** · Trọng tâm: **Buổi 4** (Zustand, Context nâng cao, middleware) · **Buổi 5** (tối ưu hiệu năng) · **Buổi 6** (kiểm thử)

---

## Mục lục

- [Lưu ý nộp bài](#lưu-ý-nộp-bài)
- [Bối cảnh](#bối-cảnh)
- [Chuẩn bị project](#chuẩn-bị-project)
- [Dữ liệu cho sẵn](#dữ-liệu-cho-sẵn)
- [Phần 1 – Kho 10.000 bài tập](#phần-1--kho-10000-bài-tập-khoảng-60-phút)
- [Phần 2 – Đồng hồ buổi tập và Bài tập đã lưu với Zustand](#phần-2--đồng-hồ-buổi-tập-và-bài-tập-đã-lưu-với-zustand-khoảng-60-phút)
- [Phần 3 – Giáo án bằng Context + useReducer, giao diện sáng/tối](#phần-3--giáo-án-bằng-context--usereducer-giao-diện-sángtối-khoảng-50-phút)
- [Phần 4 – Kiểm thử với Vitest và React Testing Library](#phần-4--kiểm-thử-với-vitest-và-react-testing-library-khoảng-60-phút)
- [Thử thách thêm (không bắt buộc)](#thử-thách-thêm-không-bắt-buộc)
- [Yêu cầu kỹ thuật chung](#yêu-cầu-kỹ-thuật-chung)
- [Checklist trước khi nộp](#checklist-trước-khi-nộp)

---

## Lưu ý nộp bài

- Mỗi bạn tạo **1 repo trên GitHub**, đặt tên `<Mã sinh viên>_LTWNC_TH02`, ví dụ `B25DCCC010_LTWNC_TH02`.
- Repo để **public**, không để private.
- Làm bài **cá nhân**, không sao chép bài của nhau.
- Làm xong mỗi phần thì **commit một lần** với nội dung: `Phan 1`, `Phan 2`, `Phan 3`, `Phan 4`.
- Trước khi nộp, cả 2 lệnh `npm run build` và `npm test` phải **chạy thành công**.

---

## Bối cảnh

Buổi thực hành trước đã dùng Redux Toolkit để quản lý deadline. Buổi này xây ứng dụng **"Bấm giờ tập luyện"** cho phòng gym, gồm:

- Kho **10.000 bài tập** cuộn mượt.
- **Đồng hồ buổi tập** chạy theo từng giây và tự chuyển bài.
- Danh sách **bài tập đã lưu** được ghi nhớ.
- Các **giáo án** tự tạo.

Không có video thật: "tập" chỉ là đồng hồ đếm giây và thanh tiến trình.

Với 10.000 dòng dữ liệu và một đồng hồ cập nhật mỗi giây, nếu viết không cẩn thận ứng dụng sẽ giật rõ rệt. Vì vậy bài này tập trung vào Buổi 4–6: chọn đúng công cụ quản lý state, tối ưu render và viết test.

> ⚠️ **Không dùng Redux Toolkit** trong bài này.

> ⚠️ **Lưu ý kỹ thuật bắt buộc:**
> - Dòng đầu tiên của file `src/App.tsx` phải là: `const BUILD_TAG = "wk-5182";`
> - Hàm xử lý khi gõ vào ô tìm kiếm phải đặt tên là `handleKeywordShift`.

### Các trang của ứng dụng

| URL | Trang | Làm ở |
|---|---|---|
| `/` | Kho bài tập | Phần 1 |
| `/saved` | Bài tập đã lưu | Phần 2 |
| `/routines` | Danh sách giáo án | Phần 3 |
| `/routines/:id` | Chi tiết giáo án | Phần 3 |
| Mọi trang | Thanh đồng hồ buổi tập cố định ở đáy màn hình | Phần 2 |

---

## Chuẩn bị project

Yêu cầu **Node.js 22.12 trở lên** (bản 22 hoặc 24 LTS). Kiểm tra bằng `node -v`; bản Vite và Vitest hiện tại không chạy được trên Node 20 trở xuống.

```bash
npm create vite@latest workout-timer -- --template react-ts
cd workout-timer
npm install
npm install zustand react-router-dom@6 react-window@1
npm install -D @types/react-window@1 vitest jsdom @vitest/coverage-v8
npm install -D @testing-library/react @testing-library/dom
npm install -D @testing-library/jest-dom @testing-library/user-event
```

### Thêm 2 script vào `package.json`

```json
"test": "vitest run",
"coverage": "vitest run --coverage"
```

### Khác biệt Vitest so với Jest (Buổi 6)

Vitest có API gần như giống hệt Jest (`describe`, `it`, `expect`), chỉ khác:

| Jest | Vitest |
|---|---|
| `jest.fn()` | `vi.fn()` |
| `jest.useFakeTimers()` | `vi.useFakeTimers()` |

Và phải **import** các hàm này từ `vitest`.

### File `vite.config.ts` (thay toàn bộ nội dung)

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: { include: ['src/features/**', 'src/utils/**'] },
  },
});
```

### File `src/setupTests.ts`

```ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => cleanup());
```

### Lưu ý với template React + TypeScript của Vite

- Import kiểu phải viết `import type { ... }`.
- **Không dùng `enum`** (dùng union literal như `'Ngực' | 'Lưng'`).
- Biến hoặc import không dùng tới sẽ làm `npm run build` báo lỗi.
- **Không dùng `any`**.

---

## Dữ liệu cho sẵn

### File `src/types.ts`

(Được thêm kiểu mới vào file này.)

```ts
export type MuscleGroup = 'Ngực' | 'Lưng' | 'Chân' | 'Vai' | 'Tay';

export interface Exercise {
  id: string;
  name: string;
  trainer: string;   // huấn luyện viên hướng dẫn
  group: MuscleGroup;
  duration: number;  // đơn vị: giây
}
```

### File `src/data/exercises.ts` (copy nguyên văn)

Hàm sinh dữ liệu giả lập, luôn cho ra cùng một bộ bài tập.

```ts
import type { Exercise, MuscleGroup } from '../types';

const MOVE = ['Đẩy', 'Kéo', 'Gập', 'Nâng', 'Ép', 'Xoay', 'Bật', 'Giữ'];
const VARIANT = [
  'tạ đơn', 'tạ đòn', 'dây kháng lực', 'trên ghế', 'một tay',
  'hai tay', 'nghiêng', 'chậm', 'tốc độ', 'tại chỗ',
];
const TRAINERS = [
  'Minh Khang', 'Thu Trang', 'Hải Đăng', 'Phương Anh', 'Gia Bảo',
  'Lan Chi', 'Đức Anh', 'Khánh Linh', 'Văn Toàn', 'Mai Hương',
];

export const GROUPS: MuscleGroup[] = ['Ngực', 'Lưng', 'Chân', 'Vai', 'Tay'];

export const generateExercises = (count: number): Exercise[] =>
  Array.from({ length: count }, (_, i) => {
    const name = `${MOVE[i % 8]} ${VARIANT[Math.floor(i / 8) % 10]}`;
    return {
      id: `e${i + 1}`,
      name: `${name} ${Math.floor(i / 80) + 1}`,
      trainer: TRAINERS[(i * 3) % 10],
      group: GROUPS[(i * 2) % 5],
      duration: 30 + ((i * 37) % 91), // từ 30 đến 120 giây
    };
  });
```

Trong ứng dụng, sinh một lần 10.000 bài tập:

```ts
export const EXERCISES = generateExercises(10000);
```

### Vài bài đầu (để đối chiếu)

| id | Tên | HLV | Nhóm cơ | Thời lượng |
|---|---|---|---|---|
| `e1` | Đẩy tạ đơn 1 | Minh Khang | Ngực | 30 giây |
| `e2` | Kéo tạ đơn 1 | Phương Anh | Chân | 67 giây |
| `e3` | Gập tạ đơn 1 | Đức Anh | Tay | 104 giây |

### Hàm `formatDuration`

Tự viết `formatDuration(seconds: number): string` trong `src/utils/format.ts`, hiển thị dạng phút:giây:

| Đầu vào | Kết quả |
|---|---|
| `67` | `1:07` |
| `30` | `0:30` |
| `0` | `0:00` |

---

## Phần 1 – Kho 10.000 bài tập (khoảng 60 phút)

**Buổi 5:** virtualization, `React.memo`, `useMemo`, `useCallback`, debounce, key ổn định.

### Yêu cầu

- [ ] **1. Khung ứng dụng:** React Router v6 với các route ở bảng trên; thanh menu gồm **Kho bài tập**, **Đã lưu**, **Giáo án** (dùng `NavLink`, mục đang xem được tô sáng).

- [ ] **2. Danh sách ảo hóa:** trang Kho bài tập hiển thị danh sách bằng `FixedSizeList` của `react-window` (**cao 560px, mỗi dòng 56px**). Mỗi dòng (`ExerciseRow`) gồm:
  - số thứ tự, tên bài tập, huấn luyện viên, nhóm cơ, thời lượng;
  - 3 nút: **Bắt đầu**, **☆** (Phần 2), **+ Buổi tập** (Phần 2).
  - Dùng `exercise.id` làm `key`, **không dùng index**.

- [ ] **3. Tìm kiếm có debounce:**
  - Ô **Tìm kiếm** (có `<label>`) tìm theo tên bài tập **hoặc** tên huấn luyện viên, không phân biệt hoa thường.
  - Viết hook generic `useDebounce<T>(value: T, delay: number): T` trong `src/hooks/useDebounce.ts`.
  - Danh sách chỉ lọc lại sau khi ngừng gõ **300ms**.

- [ ] **4. Lọc và sắp xếp:**
  - Ô chọn **Nhóm cơ**: Tất cả, Ngực, Lưng, Chân, Vai, Tay.
  - Ô chọn **Sắp xếp**: Mặc định, Tên A–Z, Thời lượng tăng dần.
  - Dòng `Tìm thấy N bài tập`.
  - Không có kết quả → `Không tìm thấy bài tập nào`.

- [ ] **5. Tối ưu render:**
  - Kết quả lọc + sắp xếp tính bằng `useMemo` (sắp xếp trên **bản sao** mảng, tên dùng `localeCompare(b, "vi")`).
  - `ExerciseRow` bọc `React.memo`.
  - Các hàm truyền xuống `ExerciseRow` bọc `useCallback`.
  - Không tạo object/hàm mới trong JSX của danh sách nếu không cần.

### Tự kiểm tra Phần 1

| Thao tác | Kết quả mong đợi |
|---|---|
| Mở `/` | "Tìm thấy 10000 bài tập", cuộn mượt; tab Elements của DevTools chỉ có khoảng 10–15 dòng `ExerciseRow` trong DOM |
| Gõ `đẩy` | Trong lúc gõ danh sách chưa đổi; 300ms sau: "Tìm thấy 1250 bài tập" |
| Chọn nhóm cơ **Vai** (ô tìm kiếm vẫn là "đẩy") | "Tìm thấy 250 bài tập" |
| Xóa ô tìm kiếm, chọn **Tất cả**, gõ `đức anh` | "Tìm thấy 1000 bài tập" (tìm theo huấn luyện viên Đức Anh) |
| Gõ `xyz` | "Không tìm thấy bài tập nào" |
| Sắp xếp **Tên A–Z**, xóa bộ lọc | Dòng đầu tiên là "Bật chậm 1" |
| Bật React DevTools → *Highlight updates when components render*, gõ vào ô tìm kiếm | Các dòng `ExerciseRow` không nhấp nháy trong lúc đang gõ (chưa hết 300ms) |

---

## Phần 2 – Đồng hồ buổi tập và Bài tập đã lưu với Zustand (khoảng 60 phút)

**Buổi 4:** Zustand store với TypeScript, selector chỉ lấy đúng phần state cần dùng, middleware `persist`.
**Buổi 5:** chống re-render thừa.

### Yêu cầu

- [ ] **1. Store buổi tập** `src/features/session/useSessionStore.ts` bằng `create<SessionState>()(...)`.

  **State:**

  | State | Kiểu | Ý nghĩa |
  |---|---|---|
  | `queue` | `Exercise[]` | Danh sách buổi tập |
  | `currentIndex` | `number` | Vị trí bài hiện tại (**−1** khi chưa bắt đầu) |
  | `isRunning` | `boolean` | Đồng hồ đang chạy |
  | `elapsed` | `number` | Số giây đã tập của bài hiện tại |

  **Action:**

  | Action | Hành vi |
  |---|---|
  | `startSession(exercises, startIndex)` | Thay danh sách buổi tập bằng `exercises`, bắt đầu từ vị trí `startIndex`, `elapsed` về 0 |
  | `toggleRun()` | Bật/tắt chạy |
  | `next()` | Sang bài sau; ở **bài cuối** thì dừng đồng hồ |
  | `prev()` | Khi đã tập **quá 3 giây** thì chỉ đặt lại bài hiện tại về 0; ngược lại lùi về bài trước (bài đầu thì đặt lại về 0) |
  | `addToSession(exercise)` | Thêm vào **cuối** buổi tập (bài đã có trong buổi tập thì bỏ qua) |
  | `tick()` | Tăng `elapsed` 1 giây; hết thời lượng bài thì tự gọi `next()` (dùng `get()` để đọc state hiện tại) |

- [ ] **2. Bắt đầu từ kho bài tập:**
  - Bấm **Bắt đầu** ở một dòng → buổi tập là **danh sách đang hiển thị** (đã lọc, đã sắp xếp), bắt đầu từ bài đó.
  - Bấm **+ Buổi tập** → thêm bài vào cuối buổi tập.

- [ ] **3. Thanh đồng hồ** (`SessionBar`) cố định ở đáy mọi trang, gồm:
  - `Đang tập: <tên bài> – HLV <tên huấn luyện viên>` (chưa bắt đầu thì `Chưa bắt đầu buổi tập`);
  - thời gian còn lại của bài dạng `Còn lại: 0:25`;
  - thanh tiến trình theo %;
  - các nút **Trước**, **Bắt đầu/Tạm dừng**, **Sau**;
  - dòng `Buổi tập: N bài`.

- [ ] **4. Đồng hồ:** một `useEffect` dùng `setInterval` 1000ms gọi `tick()`, **chỉ chạy khi `isRunning`**; cleanup bằng `clearInterval`.

- [ ] **5. Chống re-render mỗi giây:**
  - Tách phần hiển thị thời gian còn lại và thanh tiến trình thành component riêng (`CountdownBar`), **chỉ component này đọc `elapsed`**.
  - Mọi component khác lấy state qua selector riêng, ví dụ `useSessionStore((s) => s.isRunning)`, **không lấy cả store**.
  - Khi đồng hồ đang chạy, danh sách bài tập và các nút điều khiển **không được render lại mỗi giây**.

- [ ] **6. Bài tập đã lưu:**
  - Store riêng `src/features/saved/useSavedStore.ts` (state `ids: string[]`, action `toggle(id)`).
  - Dùng middleware `persist` của Zustand với key **`workout-saved`** để F5 không mất.
  - Nút lưu trên mỗi dòng đổi giữa **☆** và **★** (có `aria-label`: `Lưu bài tập` / `Bỏ lưu`).
  - Trang `/saved` liệt kê các bài đã lưu (không cần ảo hóa), có nút **Tập tất cả**.
  - Chưa có bài nào → `Bạn chưa lưu bài tập nào`.

### Tự kiểm tra Phần 2

| Thao tác | Kết quả mong đợi |
|---|---|
| Bấm **Bắt đầu** ở `e2` | Thanh dưới: "Đang tập: Kéo tạ đơn 1 – HLV Phương Anh", "Còn lại: 1:07", sau 5 giây là "Còn lại: 1:02" |
| Bấm **Tạm dừng**, chờ 3 giây | Thời gian đứng yên; bấm **Bắt đầu** thì chạy tiếp |
| Bấm **Sau** | Chuyển sang "Gập tạ đơn 1 – HLV Đức Anh", "Còn lại: 1:44" |
| Bấm **Bắt đầu** ở `e1`, chờ hơn 30 giây | Hết 0:30 tự chuyển sang "Kéo tạ đơn 1" |
| Gõ "đẩy", bấm **Bắt đầu** ở dòng đầu, bấm **Sau** | Bài tiếp theo vẫn là một bài có chữ "Đẩy" (buổi tập là danh sách đã lọc) |
| Bật *Highlight updates* khi đồng hồ đang chạy | Mỗi giây chỉ vùng thời gian/thanh tiến trình nhấp nháy |
| Bấm **☆** ở `e1` và `e3`, mở `/saved`, bấm F5 | Vẫn còn 2 bài; ô `workout-saved` trong Local Storage có `e1`, `e3` |

---

## Phần 3 – Giáo án bằng Context + useReducer, giao diện sáng/tối (khoảng 50 phút)

**Buổi 4:** mini-Redux bằng `useReducer` + Context, tách nhỏ Context, `useMemo` cho value, middleware.
**Buổi 5:** code-splitting theo route.

### Yêu cầu

- [ ] **1. Reducer giáo án** `src/features/routines/routineReducer.ts`:
  - Tự định nghĩa kiểu `Routine` (`id`, `name`, `exerciseIds`).
  - Kiểu `RoutineAction` là **discriminated union** gồm: `create`, `rename`, `remove`, `addExercise`, `removeExercise`.
  - Reducer là **hàm thuần**, không sửa trực tiếp state; `addExercise` không thêm trùng bài.

- [ ] **2. Middleware ghi log:** viết hàm `withLogger(reducer)` trả về một reducer mới:
  - Mỗi lần nhận action thì `console.log` tên action, state trước và state sau (**chỉ khi `import.meta.env.DEV`**).
  - Trả về đúng kết quả của reducer gốc.
  - Dùng `useReducer(withLogger(routineReducer), ...)`.

- [ ] **3. Tách 2 Context:**
  - `RoutineStateContext` (danh sách giáo án) và `RoutineDispatchContext` (hàm `dispatch`).
  - Cùng 2 hook `useRoutines()` và `useRoutineDispatch()`, **báo lỗi rõ ràng** nếu dùng ngoài Provider.
  - Component chỉ cần dispatch (ví dụ form tạo giáo án) dùng `useRoutineDispatch()` để không bị render lại khi danh sách thay đổi.
  - Danh sách giáo án được lưu vào `localStorage` key **`workout-routines`** mỗi khi thay đổi.

- [ ] **4. Trang `/routines`:** form có ô **Tên giáo án** và nút **Tạo**.
  - Tên trống → `Tên giáo án không được để trống`.
  - Trùng tên (không phân biệt hoa thường) → `Tên giáo án đã tồn tại`.
  - Mỗi giáo án hiện: tên, `N bài`, link sang chi tiết và nút **Xóa**.

- [ ] **5. Thêm bài vào giáo án:**
  - Trên trang Kho bài tập có ô chọn **Giáo án đang chọn**.
  - Mỗi dòng bài tập có thêm nút **+ Giáo án** thêm bài vào giáo án đang chọn (chưa có giáo án nào thì nút bị khóa).

- [ ] **6. Trang `/routines/:id`:**
  - Tên giáo án, các bài trong giáo án kèm nút **Bỏ**.
  - Dòng `Tổng thời gian: X phút Y giây` (dùng `reduce`).
  - Nút **Tập tất cả** (gọi `startSession` của Zustand store).
  - Không tìm thấy → `Không tìm thấy giáo án`.

- [ ] **7. Giao diện sáng/tối:**
  - `ThemeContext` riêng (**không gộp** với giáo án) có `theme: "light" | "dark"` và `toggleTheme`; `value` bọc `useMemo`.
  - Nút **Giao diện tối / Giao diện sáng** trên thanh menu.

- [ ] **8. Lazy load theo route:**
  - 3 trang `/saved`, `/routines`, `/routines/:id` dùng `React.lazy`, bọc `<Suspense fallback={<p>Đang tải trang...</p>}>`.
  - Chạy `npm run build` phải thấy các trang này thành **file JS riêng**.

### Tự kiểm tra Phần 3

| Thao tác | Kết quả mong đợi |
|---|---|
| Tạo giáo án "Ngày ngực", rồi tạo tiếp "ngày NGỰC" | Lần 2 báo "Tên giáo án đã tồn tại" |
| Chọn "Ngày ngực" ở Kho bài tập, bấm **+ Giáo án** ở `e1`, `e2`, rồi `e1` lần nữa | Giáo án có 2 bài; chi tiết: "Tổng thời gian: 1 phút 37 giây" |
| Mở Console khi thêm bài | Thấy log tên action `addExercise` cùng state trước/sau |
| Bấm **Tập tất cả** ở chi tiết giáo án | Thanh dưới: "Đang tập: Đẩy tạ đơn 1 – HLV Minh Khang", "Buổi tập: 2 bài" |
| F5 ở trang chi tiết giáo án | Giáo án vẫn còn đủ bài |
| Mở tab Network, lần đầu bấm menu **Giáo án** | Trình duyệt mới tải thêm file JS của trang Giáo án |

---

## Phần 4 – Kiểm thử với Vitest và React Testing Library (khoảng 60 phút)

**Buổi 6:** unit test, test reducer và store, fake timers, `renderHook`, test component theo hành vi người dùng, mock function, coverage.

### Yêu cầu chung

- Viết **tối thiểu 12 test**, đặt cạnh file nguồn (`*.test.ts`, `*.test.tsx`).
- Tên test bằng **tiếng Việt** mô tả hành vi.
- Lệnh `npm test` phải **xanh toàn bộ**.

### Các test bắt buộc

| File test | Các trường hợp bắt buộc |
|---|---|
| `utils/format.test.ts` | `formatDuration`: `0` → `0:00`, `67` → `1:07`, `120` → `2:00` |
| `data/exercises.test.ts` | `generateExercises(10000)` có 10000 phần tử, `id` không trùng, mọi thời lượng trong khoảng 30–120 |
| `features/routines/routineReducer.test.ts` | Tạo giáo án; `addExercise` không thêm trùng; `removeExercise`; xóa giáo án không tồn tại thì state giữ nguyên (`toEqual`) |
| `features/session/useSessionStore.test.ts` | `startSession` đặt đúng bài; `tick` ở giây cuối tự sang bài sau; `next` ở bài cuối thì `isRunning` là `false`. Đặt lại store trước mỗi test bằng `useSessionStore.setState(...)` trong `beforeEach` |
| `hooks/useDebounce.test.ts` | `renderHook` + `vi.useFakeTimers()`: đổi giá trị, trước 300ms vẫn là giá trị cũ, sau `vi.advanceTimersByTime(300)` là giá trị mới |
| `features/library/ExerciseRow.test.tsx` | Hiển thị tên bài tập và "0:30"; bấm nút **Bắt đầu** (tìm bằng `getByRole`) thì hàm mock `vi.fn()` được gọi với đúng bài tập |
| `features/routines/RoutinesPage.test.tsx` | Dùng `userEvent`: bấm **Tạo** khi ô trống thì thấy "Tên giáo án không được để trống"; nhập tên rồi bấm **Tạo** thì tên xuất hiện trong danh sách (viết hàm `renderWithProviders` bọc Provider và `MemoryRouter`) |

### Coverage

- Chạy `npm run coverage`: các thư mục `src/features` và `src/utils` cần đạt **Lines ≥ 70%**.
- Chụp màn hình bảng coverage, lưu thành **`coverage.png`** ở gốc repo.

---

## Thử thách thêm (không bắt buộc)

- Thời gian **nghỉ giữa bài** (ví dụ 10 giây) trong session store: hết bài thì đếm nghỉ rồi mới sang bài sau, có test.
- Dùng React DevTools **Profiler** đo thời gian render trang Kho bài tập khi bỏ `FixedSizeList` (render cả 10.000 dòng) và khi dùng lại; ghi 2 con số vào `README.md`.
- Dùng middleware `devtools` của Zustand để xem lịch sử action trong Redux DevTools.
- **Phím tắt:** `Space` để Bắt đầu/Tạm dừng (nhớ `removeEventListener` khi unmount và bỏ qua khi đang gõ trong ô nhập).

---

## Yêu cầu kỹ thuật chung

### Cấu trúc thư mục gợi ý

```text
src/
├── App.tsx, main.tsx, types.ts, setupTests.ts
├── data/exercises.ts            (+ exercises.test.ts)
├── utils/format.ts              (+ test)
├── hooks/useDebounce.ts         (+ test)
├── contexts/ThemeContext.tsx
└── features/
    ├── library/   LibraryPage.tsx, ExerciseRow.tsx (+ test)
    ├── session/   useSessionStore.ts (+ test), SessionBar.tsx, CountdownBar.tsx
    ├── saved/     useSavedStore.ts, SavedPage.tsx
    └── routines/  routineReducer.ts (+ test), withLogger.ts,
                   RoutineContext.tsx, RoutinesPage.tsx (+ test),
                   RoutineDetailPage.tsx
```

### Công cụ quản lý state bắt buộc

| Loại state | Công cụ bắt buộc | Lý do |
|---|---|---|
| Bài đang tập, danh sách buổi tập, số giây (đổi mỗi giây) | Zustand + selector | Đổi liên tục, cần chỉ render đúng phần đọc state |
| Bài tập đã lưu | Zustand + `persist` | State nhỏ, cần ghi nhớ khi tải lại trang |
| Giáo án (nhiều loại action) | Context + `useReducer`, tách 2 Context | Logic cập nhật phức tạp, không cần thư viện ngoài |
| Giao diện sáng/tối | Context riêng + `useMemo` | Ít thay đổi, dùng toàn ứng dụng |
| Ô tìm kiếm, bộ lọc, form | `useState` cục bộ | Chỉ 1 component dùng |

### Quy tắc code

- **Không dùng `any`**, **không dùng Redux Toolkit**.
- Mọi props và state đều có **kiểu rõ ràng**.
- Trang dùng `React.lazy` phải `export default`.
- `npm run build` và `npm test` đều phải chạy thành công trước khi nộp.

---

## Checklist trước khi nộp

**Quy định bắt buộc**
- [ ] Dòng đầu tiên của `src/App.tsx` là `const BUILD_TAG = "wk-5182";`
- [ ] Hàm xử lý khi gõ vào ô tìm kiếm tên là `handleKeywordShift`
- [ ] Repo public, tên `<Mã sinh viên>_LTWNC_TH02`
- [ ] 4 commit: `Phan 1`, `Phan 2`, `Phan 3`, `Phan 4`

**Phần 1 – Kho bài tập**
- [ ] Router + `NavLink`, danh sách `FixedSizeList` (560px / 56px), `key = exercise.id`
- [ ] `useDebounce` 300ms, lọc nhóm cơ, sắp xếp, đếm kết quả
- [ ] `useMemo` + `React.memo` + `useCallback`

**Phần 2 – Zustand**
- [ ] `useSessionStore` đủ state + action; `SessionBar`, `CountdownBar`
- [ ] `setInterval` chỉ chạy khi `isRunning`, có cleanup
- [ ] Selector riêng, không render lại danh sách mỗi giây
- [ ] `useSavedStore` + `persist` (key `workout-saved`), trang `/saved`

**Phần 3 – Context**
- [ ] `routineReducer` (discriminated union), `withLogger`
- [ ] 2 Context tách riêng, lưu `workout-routines`
- [ ] Trang `/routines`, `/routines/:id`, nút **+ Giáo án**
- [ ] `ThemeContext` + `useMemo`
- [ ] `React.lazy` + `Suspense` cho 3 trang, build ra file JS riêng

**Phần 4 – Test**
- [ ] ≥ 12 test, tên tiếng Việt, `npm test` xanh
- [ ] Coverage `src/features` + `src/utils` Lines ≥ 70%, có `coverage.png`

**Cuối cùng**
- [ ] `npm run build` thành công
- [ ] `npm test` thành công
- [ ] Không có `any`, không dùng Redux Toolkit
