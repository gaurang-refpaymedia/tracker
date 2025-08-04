import { useState } from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./route/router";
import AuthProvider from "./contextApi/AuthContext";
import NavigationProvider from "./contextApi/navigationContext";
import SideBarToggleProvider from "./contextApi/SidebarContext";
import DataProvider, { DataContext } from "./contextApi/DataContext";
import FormDataProvider from "./contextApi/FormDataContext";

function App() {
  return (
    <>
      <FormDataProvider>
        <AuthProvider>
          <DataProvider>
            <NavigationProvider>
              <SideBarToggleProvider>
                <RouterProvider router={router} />
              </SideBarToggleProvider>
            </NavigationProvider>
          </DataProvider>
        </AuthProvider>
      </FormDataProvider>
    </>
  );
}

export default App;
