import { createBrowserRouter } from "react-router-dom";
import LayoutAuth from "../layout/layoutAuth";
import LoginCover from "../pages/Login";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LayoutAuth/>,
        children:[
            {
                path: "/login",
                element: <LoginCover/>
            },
        ]
    }
])