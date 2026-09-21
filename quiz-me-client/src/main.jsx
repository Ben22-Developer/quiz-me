import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router";
import { GoogleOAuthProvider } from '@react-oauth/google';
import router from './component/client-route/Route';
import "./index.css";
import { Provider } from 'react-redux';
import AppStore from './redux/store/AppStore';
import "./backend-request/axios-global-config/AxiosInterceptor.js";

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <Provider store={AppStore}>
      <RouterProvider router={router}/>  
    </Provider>
  </GoogleOAuthProvider>

  // </StrictMode>,
)