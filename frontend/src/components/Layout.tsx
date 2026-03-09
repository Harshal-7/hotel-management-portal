import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Layout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/hotels"
            className="flex items-center gap-2 font-semibold text-violet-600 hover:text-violet-700 transition-colors cursor-pointer"
          >
            <span className="text-lg tracking-tight">Hotel Manager</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-3">
            <NavLink
              to="/hotels"
              end
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-violet-100 text-violet-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              Hotels
            </NavLink>
            {/* <Link
              to="/hotels"
              state={{ openAdd: true }}
              className="rounded-md px-3 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 transition-colors cursor-pointer"
            >
              Add Hotel
            </Link> */}
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
