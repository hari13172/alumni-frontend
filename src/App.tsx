import { Routes, Route } from "react-router";
import Index from "./pages/Index";
import UserProfile from "./pages/protected/Alumini/UserProfile";
import AlumniForm from "./pages/protected/Alumini/AluminiForm";
import AdminLogin from "./pages/protected/Alumini/AdminLogin";
import AdminRoute from "./pages/protected/Alumini/AdminRoute";
import AdminPanel from "./pages/protected/Alumini/AdminPanel";
import QRScanner from "./pages/protected/Alumini/QrScanner";


const App = () => (
  <Routes>
    {/* Public Route */}
    <Route path="/" element={<Index />} />
    <Route path="/qr-scanner" element={<QRScanner />} />

    {/* User Routes (Assuming these are for alumni, not admin) */}
    <Route path="/alumni/:id" element={<UserProfile />} />
    <Route path="/alumni/edit/:id" element={<AlumniForm mode="edit" />} />

    {/* Admin Routes */}
    <Route path="/admin/login" element={<AdminLogin onLogin={() => {}} onCancel={() => {}} />} />
    <Route
      path="/admin/panel"
      element={
        <AdminRoute>
          <AdminPanel />
        </AdminRoute>
      }
    />
  </Routes>
);

export default App;