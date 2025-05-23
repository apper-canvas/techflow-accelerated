import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-surface-50 via-blue-50 to-indigo-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 shadow-lg"
          progressClassName="bg-primary"
          className="z-50"
        />
      </div>
    </Router>
  );
}

export default App;