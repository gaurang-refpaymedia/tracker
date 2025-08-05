import { useState } from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './route/router';
import AuthProvider from './contextApi/AuthContext';
import NavigationProvider from './contextApi/navigationContext';
import SideBarToggleProvider from './contextApi/SidebarContext';
import DataProvider from './contextApi/DataContext';
import SubUserProvider from './contextApi/subuserContext/SubUserContext';

function App() {
  return (
    <>
      <AuthProvider>
        <SubUserProvider>
          <DataProvider>
            <NavigationProvider>
              <SideBarToggleProvider>
                <RouterProvider router={router} />
              </SideBarToggleProvider>
            </NavigationProvider>
          </DataProvider>
        </SubUserProvider>
      </AuthProvider>
    </>
  );
}

export default App;
