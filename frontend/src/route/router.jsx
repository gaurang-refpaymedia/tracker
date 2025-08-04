import { createBrowserRouter } from "react-router-dom";
import LayoutAuth from "../layout/layoutAuth";
import LoginCover from "../pages/Login";
import ApplicationLayout from "../layout/applicationLayout";
import { Dashboard } from "../pages/Dashboard";
import Register from "../pages/Register";
import ProtectedRoute from "./ProtectedLayout";
import ChangePassword from "../pages/ChangePassword";
import ForgotPassword from "../pages/ForgotPassword";
import { SubUser } from "../pages/SubUser";

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <ApplicationLayout/>
            </ProtectedRoute>
        ),
        children:[
            {
                path: "/dashboard",
                element: <Dashboard/>
            },
            {
                path: "/change-password",
                element: <ChangePassword/>
            },
            {
                path: "/create-sub-user",
                element: <SubUser/>
            }
        ]
    },
    {
        path: "/",
        element: <LayoutAuth/>,
        children:[
            {
                path: "/login",
                element: <LoginCover/>
            },
            {
                path: "/register",
                element: <Register/>
            },
            {
                path: "/forgot-password",
                element: <ForgotPassword/>
            }
        ]
    }
])