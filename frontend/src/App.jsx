import { useState } from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './route/router';
import AuthProvider from './contextApi/AuthContext';
import NavigationProvider from './contextApi/navigationContext';
import SideBarToggleProvider from './contextApi/SidebarContext';
import DataProvider from './contextApi/DataContext';
import SubUserProvider from './contextApi/subuserContext/SubUserContext';
import { PublisherProvider } from './contextApi/publisherContext/PublisherContext';
import { AdvertiserProvider } from './contextApi/advertiserContext/AdvertiserContext';
import { FilterProvider } from './contextApi/FilterContext';

function App() {
  return (
    <>
      <FilterProvider>
        <AdvertiserProvider>
          <PublisherProvider>
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
          </PublisherProvider>
        </AdvertiserProvider>
      </FilterProvider>
    </>
  );
}

export default App;
