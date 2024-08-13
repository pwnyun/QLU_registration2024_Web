import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import './index.css'
import Home from './pages/Home/Home.jsx'
import Directions from "./pages/Directions.jsx";
import CollectionForm from "./pages/CollectionForm.jsx";
import PreCheckIn from "./pages/PreCheckIn.jsx";
import CollectionFormForOld from "./pages/CollectionFormForOld.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import AllocateClass from "./pages/AllocateClass.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home/>,
    errorElement: <ErrorPage />,
  }, {
    path: '/directions',
    element: <Directions />,
  }, {
    path: '/collection-form',
    element: <CollectionForm />,
  }, {
    path: '/pre-check-in',
    element: <PreCheckIn />
  }, {
    path: '/old-form',
    element: <CollectionFormForOld />
  }, {
    path: '/allocate-class',
    element: <AllocateClass />
  }

  // {path:'/', element: <CollectionFormForOld/>}
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
