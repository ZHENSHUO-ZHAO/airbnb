import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createContext, useState } from "react";
import HomePage from "./page/HomePage";
import BookingPage from "./page/BookingPage";
import CompletePage from "./page/CompletePage";

export const ToastContext = createContext();

function App() {
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <ToastContext.Provider value={{ triggerToast }}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/complete/:id" element={<CompletePage />} />
        </Routes>
        {showToast && (
          <div
            className="position-fixed top-0 start-50 translate-middle-x mt-3"
            style={{ zIndex: 11 }}
          >
            <div
              className="toast show align-items-center text-white bg-danger border-0"
              role="alert"
            >
              <div className="d-flex">
                <div className="toast-body">{toastMessage}</div>
                <button
                  type="button"
                  className="btn-close btn-close-white me-2 m-auto"
                  onClick={() => setShowToast(false)}
                ></button>
              </div>
            </div>
          </div>
        )}
      </Router>
    </ToastContext.Provider>
  );
}

export default App;
