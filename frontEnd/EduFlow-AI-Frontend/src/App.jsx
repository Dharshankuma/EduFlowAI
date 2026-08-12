import React from 'react';
import './App.css';
import AppRoutes from './routes/AppRoutes';
import { StateProvider } from './context/StateContext';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <StateProvider>
        <AppRoutes />
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
        />
      </StateProvider>
    </AuthProvider>
  );
}

export default App;
