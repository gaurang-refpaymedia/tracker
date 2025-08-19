import { useState } from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './route/router';
import AuthProvider from './contextApi/AuthContext';
import NavigationProvider from './contextApi/navigationContext';
import SideBarToggleProvider from './contextApi/SidebarContext';
import DataProvider from './contextApi/DataContext';
import SubUserProvider from './contextApi/subuserContext/SubUserContext';
import { AdvertiserProvider } from './contextApi/advertiserContext/AdvertiserContext';

function App() {
  return (
    <>
      <AdvertiserProvider>
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
      </AdvertiserProvider>
    </>
  );
}

export default App;
