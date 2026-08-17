import React from 'react';
import './App.css';
import AppRoutes from './routes/AppRoutes';
import { StateProvider } from './context/StateContext';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import AppLoader from './components/common/loader/AppLoader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <StateProvider>
          <AppRoutes />
          <AppLoader />
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
    </LoadingProvider>
  );
}

export default App;
