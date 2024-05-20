import React, { useContext } from 'react'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from '../App.jsx'
import Home from '../pages/Home.jsx';
import About from '../pages/About.jsx';
import Contact from '../pages/Contact.jsx';
import RecipeForm from '../pages/RecipeForm.jsx';
import SingupForm from '../pages/SingupForm.jsx';
import SignInForm from '../pages/SignInForm.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

export default function index() {

    let {user} = useContext(AuthContext)
    const router = createBrowserRouter([
        {
          path: "/",
          element: <App />,
          children: [
            {
              path: "/", //http://localhost:5173/
              element: user ? <Home /> : <Navigate to={'/recipes/signin'}/>
            },
            {
              path: "/about", //http://localhost:5173/about
              element: <About />
            },
            {
              path: "/contact", //http://localhost:5173/contact
              element: <Contact />
            },
            {
              path: "/recipes/create", //http://localhost:5173/recipes/create
              element: <RecipeForm />
            },
            {
              path: "/recipes/edit/:id", //http://localhost:5173/recipes/create
              element: user ? <RecipeForm /> : <Navigate to={'/recipes/signin'}/>
            },
            {
              path: "/recipes/signup", //http://localhost:5173/recipes/create
              element: !user ? <SingupForm /> : <Navigate to={'/'}/>
            },
            {
              path: "/recipes/signin", //http://localhost:5173/recipes/create
              element:!user ? <SignInForm /> : <Navigate to={'/'}/>
            },
          ]
        },
      ]);
  return (
    <RouterProvider router={router} />
  )
}
