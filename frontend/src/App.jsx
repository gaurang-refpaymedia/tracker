import { useState } from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./route/router";
import AuthProvider from "./contextApi/AuthContext";
import NavigationProvider from "./contextApi/navigationContext";
import SideBarToggleProvider from "./contextApi/SidebarContext";

function App() {
  return (
    <>
      <AuthProvider>
        <NavigationProvider>
          <SideBarToggleProvider>
            <RouterProvider router={router} />
          </SideBarToggleProvider>
        </NavigationProvider>
      </AuthProvider>
    </>
  );
}

export default App;
