import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import NotificationPage from './components/NotificationPage';
import ProfilePage from './components/ProfilePage';
import RightPanel from './components/RightPanel';
import Sidebar from './components/Sidebar';
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";

function App() {
  return (
    <div className="flex max-w-6xl mx-auto">
      {/* Sidebar */}
      <BrowserRouter basename="/">
      <Sidebar/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Routes>

        <RightPanel/>
      </BrowserRouter>
      <Toaster position="top-right"/>
    </div>
  );
}

export default App;
