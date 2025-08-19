import { createBrowserRouter } from 'react-router-dom';
import LayoutAuth from '../layout/layoutAuth';
import LoginCover from '../pages/Login';
import ApplicationLayout from '../layout/applicationLayout';
import { Dashboard } from '../pages/Dashboard';
import Register from '../pages/Register';
import ProtectedRoute from './ProtectedLayout';
import ChangePassword from '../pages/ChangePassword';
import ForgotPassword from '../pages/ForgotPassword';
import { SubUser } from '../pages/SubUser';
import AdvertiserList from '../pages/advertisers/AdvertiserList';
import AdvertiserForm from '../pages/advertisers/AdvertiserForm';
import AdvertiserDetail from '../pages/advertisers/AdvertiserDetail';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <ApplicationLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/change-password',
        element: <ChangePassword />,
      },
      {
        path: '/create-sub-user',
        element: <SubUser />,
      },
      {
        path: '/advertisers',
        element: <AdvertiserList />,
      },
      {
        path: '/advertisers/new',
        element: <AdvertiserForm />,
      },
      {
        path: '/advertisers/:id',
        element: <AdvertiserDetail />,
      },
      {
        path: '/advertisers/:id/edit',
        element: <AdvertiserForm />,
      },
    ],
  },
  {
    path: '/',
    element: <LayoutAuth />,
    children: [
      {
        path: '/login',
        element: <LoginCover />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
    ],
  },
]);
