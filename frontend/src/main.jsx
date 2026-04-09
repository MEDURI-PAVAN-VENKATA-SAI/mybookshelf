import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './components/contexts/UserContext.jsx';
import { ThemeProvider } from './components/contexts/ThemeContext';
import { LoaderProvider } from './components/contexts/LoaderContext';
import { NavbarProvider } from './components/contexts/NavbarContext'
import { SelectedDataProvider } from './components/contexts/SelectedDataContext'
import { CategoriesProvider } from './components/contexts/CategoriesContext'
import { FavouritesProvider } from './components/contexts/FavouritesContext'
import { UploadsProvider } from './components/contexts/UploadsContext'
import { ReadingsProvider } from './components/contexts/ReadingsContext'
import { ReportsProvider } from './components/contexts/ReportsContext'
import { LanguageProvider } from './components/contexts/LanguageContext'
import { HomeProvider } from './components/contexts/HomeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CategoriesProvider>
        <LanguageProvider>
          <UserProvider>
            <SelectedDataProvider>
              <HomeProvider>             
                <ThemeProvider>
                  <LoaderProvider>
                    <NavbarProvider>
                      <FavouritesProvider>
                        <UploadsProvider>
                          <ReadingsProvider>
                            <ReportsProvider>
                              <App />
                            </ReportsProvider>
                          </ReadingsProvider>
                        </UploadsProvider>
                      </FavouritesProvider>
                    </NavbarProvider>
                  </LoaderProvider>
                </ThemeProvider>
              </HomeProvider>
            </SelectedDataProvider>           
          </UserProvider>
        </LanguageProvider>
      </CategoriesProvider>
    </BrowserRouter>
  </StrictMode>,
)
