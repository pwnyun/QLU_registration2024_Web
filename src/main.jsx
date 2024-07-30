import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import './index.css'
import Home from './pages/Home/Home.jsx'
import Directions from "./pages/Directions.jsx";
import CollectionForm from "./pages/CollectionForm.jsx";
import PreCheckIn from "./pages/PreCheckIn.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home/>,
  }, {
    path: '/directions',
    element: <Directions />,
  }, {
    path: '/collection-form',
    element: <CollectionForm />,
  }, {
    path: '/pre-check-in',
    element: <PreCheckIn />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
