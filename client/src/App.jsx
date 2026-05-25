import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import ChatBot from "./components/ChatBot.jsx";
import { CodeProvider } from "./context/CodeContext.jsx";

function App() {
  return (
    <ErrorBoundary>
      <CodeProvider>
        <div className="min-h-screen bg-dark-bg flex flex-col">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <HistoryPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <ChatBot />
        </div>
      </CodeProvider>
    </ErrorBoundary>
  );
}

export default App;
