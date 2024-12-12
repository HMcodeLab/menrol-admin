import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import Profile from './pages/Profile';
import DefaultLayout from './layout/DefaultLayout';
import CreateService from './pages/services/CreateService';
import AllServices from './pages/services/AllServices';
import CreateSubCategoryForm from './pages/services/CreateSubCategory';


export const BASE_URL: string = "https://api.menrol.com/api/v1/";


function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
// hjshdgdhj
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Menrol Admin" />
              < CreateService />
            </>
          }
        />
         <Route
          path='services'
          element={
            <AllServices/>
          }
        />
         <Route
          path='services/create'
          element={
            <CreateService/>
          }
        />
         <Route
          path='services/addSubCategory'
          element={
            <CreateSubCategoryForm/>
          }
        />
         <Route
          path='profile'
          element={
            <Profile/>
          }
        />
        </Routes>
     

    </DefaultLayout>
  );
}

export default App;
