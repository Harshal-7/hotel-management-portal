import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { Layout } from './components/Layout';
import { ToastProvider } from './components/toast';
import Login from './pages/Login';
import CreateUser from './pages/CreateUser';
import HotelList from './pages/HotelList';
import HotelView from './pages/HotelView';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/create-user" element={<CreateUser />} />
            <Route
              path="/hotels"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<HotelList />} />
              <Route path=":id" element={<HotelView />} />
            </Route>
            <Route path="/" element={<Navigate to="/hotels" replace />} />
            <Route path="*" element={<Navigate to="/hotels" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
