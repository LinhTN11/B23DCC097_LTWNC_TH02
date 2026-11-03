const BUILD_TAG = "wk-5182";
import { lazy, Suspense } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { RoutineProvider } from './features/routines/RoutineContext';
import LibraryPage from './features/library/LibraryPage';
import SessionBar from './features/session/SessionBar';

const SavedPage = lazy(() => import('./features/saved/SavedPage'));
const RoutinesPage = lazy(() => import('./features/routines/RoutinesPage'));
const RoutineDetailPage = lazy(() => import('./features/routines/RoutineDetailPage'));

function AppContent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-container" data-build-tag={BUILD_TAG}>
      <nav className="main-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Kho bài tập
        </NavLink>
        <NavLink
          to="/saved"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Đã lưu
        </NavLink>
        <NavLink
          to="/routines"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Giáo án
        </NavLink>
        <button
          type="button"
          className="btn btn-theme"
          onClick={toggleTheme}
          aria-label="Đổi giao diện"
        >
          {theme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối'}
        </button>
      </nav>

      <main className="main-content">
        <Suspense fallback={<p>Đang tải trang...</p>}>
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/routines" element={<RoutinesPage />} />
            <Route path="/routines/:id" element={<RoutineDetailPage />} />
          </Routes>
        </Suspense>
      </main>

      <SessionBar />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <RoutineProvider>
        <AppContent />
      </RoutineProvider>
    </ThemeProvider>
  );
}

export default App;
