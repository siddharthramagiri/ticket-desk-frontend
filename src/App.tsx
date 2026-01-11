import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Login from "./pages/User/Login";
import AdminPage from "./pages/admin/AdminPage";
import ClientPage from "./pages/client/ClientPage";
import DeveloperPage from "./pages/developer/DeveloperPage";
import SupportPage from "./pages/support/SupportPage";
import Unauthorized from "./pages/User/UnauthorizedPage";
import SignUp from "./pages/User/Signup";
import MainLayout from "./pages/admin/MainLayout";

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/unauthorized" element={<Unauthorized />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<MainLayout />}>
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminPage />
                </ProtectedRoute>
              }
              />
            <Route path="/developer" element={
              <ProtectedRoute allowedRoles={["DEVELOPER"]}>
                  <DeveloperPage />
                </ProtectedRoute>
              }
            />
            <Route path="/support" element={
                <ProtectedRoute allowedRoles={["SUPPORT"]}>
                  <SupportPage />
                </ProtectedRoute>
              }
            />
            <Route path="/client" element={
                <ProtectedRoute allowedRoles={["CLIENT"]}>
                  <ClientPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
    </AuthProvider>
  );
}

export default App;
