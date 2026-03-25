// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import CoachesCRUD from "./pages/CoachesCRUD";
import ClientsList from "./pages/clientsCRUD/ClientsList";
import ClientsCreate from "./pages/clientsCRUD/ClientsCreate";
import ClientsDetails from "./pages/clientsCRUD/ClientsDetails";
import ClientsUpdate from "./pages/clientsCRUD/ClientsUpdate";
import AdmintsList from "./pages/adminsCRUD/AdminsList";
import AdmintsCreate from "./pages/adminsCRUD/AdminsCreate";
import AdmintsDetails from "./pages/adminsCRUD/AdminsDetails";
import AdmintsUpdate from "./pages/adminsCRUD/AdminsUpdate";
import EmotionsCreate from "./pages/emotionsCRUD/EmotionsCreate";
import EmotionsDetails from "./pages/emotionsCRUD/EmotionDetails";
import EmotionsUpdate from "./pages/emotionsCRUD/EmotionsUpdate";
import EmotionsList from "./pages/emotionsCRUD/EmotionList";
import AdminsPostsList from "./pages/adminpostsCRUD/AdminPostsList";
import AdminsPostsCreate from "./pages/adminpostsCRUD/AdminPostsCreate";
import AdminsPostsDetails from "./pages/adminpostsCRUD/AdminPostsDetails";
import AdminsPostsUpdate from "./pages/adminpostsCRUD/AdminPostsUpdate";
export const router = createBrowserRouter(
  createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

    // Root Route: All navigation will start from here.
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
      <Route path="/" element={<Home />} />
      <Route path="/clients" element={<ClientsList />} />
      <Route path="/clients/create" element={<ClientsCreate />} />
      <Route path="/clients/:id" element={<ClientsDetails />} />
      <Route path="/clients/:id/edit" element={<ClientsUpdate />} />
      <Route path="/coaches" element={<CoachesCRUD />} />
      <Route path="/admints" element={<AdmintsList />} />
      <Route path="/admints/create" element={<AdmintsCreate />} />
      <Route path="/admints/:id" element={<AdmintsDetails />} />
      <Route path="/admints/:id/edit" element={<AdmintsUpdate />} />
      <Route path="/emotions" element={<EmotionsList />} />
      <Route path="/emotions/create" element={<EmotionsCreate/>} />
      <Route path="/emotions/:id" element={<EmotionsDetails />} />
      <Route path="/emotions/:id/edit" element={<EmotionsUpdate />} />
      <Route path="/admint-posts" element={<AdminsPostsList/>} />
      <Route path="/admint-posts/create" element={<AdminsPostsCreate/>} />
      <Route path="/admint-posts/:id" element={<AdminsPostsDetails/>} />
      <Route path="/admint-posts/:id/edit" element={<AdminsPostsUpdate />} />
    </Route>
  )
);