import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";

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

import CoachsList from "./pages/coachesCRUD/coachsList";
import CoachsCreate from "./pages/coachesCRUD/coachsCreate";
import CoachsDetails from "./pages/coachesCRUD/coachsDetails";
import CoachsUpdate from "./pages/coachesCRUD/coachsUpdate";

import ReactionAdmintPostsList from "./pages/reactionAdminPostCRUD/ReactionAdmintPostsList";
import ReactionAdmintPostsCreate from "./pages/reactionAdminPostCRUD/ReactionAdmintPostsCreate";
import ReactionAdmintPostsUpdate from "./pages/reactionAdminPostCRUD/ReactionAdmintPostsUpdate";

import EntriesList from "./pages/entriesCRUD/entriesList";
import EntriesCreate from "./pages/entriesCRUD/entriesCreate";
import EntriesDetails from "./pages/entriesCRUD/entriesDetails";
import EntriesUpdate from "./pages/entriesCRUD/entriesUpdate";

import ClientFavoritesList from "./pages/clientfavoritesCRD/ClientFavoritesList";
import ClientFavoritesCreate from "./pages/clientfavoritesCRD/ClientFavoritesCreate";

import ReactionEntriesList from "./pages/reactionentries/reactionentriesList";
import ReactionEntriesCreate from "./pages/reactionentries/reactionentriesCreate";
import ReactionEntriesDetails from "./pages/reactionentries/reactionentriesDetails";
import ReactionEntriesUpdate from "./pages/reactionentries/reactionentriesUpdate";
import CoachFavoritesList from "./pages/coachFavoritesCRD/ClientFavoritesList";
import CoachFavoritesCreate from "./pages/coachFavoritesCRD/CoachFavoritesCreate";

import CLientsPostsList from "./pages/clientspostsCRUD/ClientsPostsList";
import ClientsPostsCreate from "./pages/clientspostsCRUD/ClientsPostsCreate";
import ClientsPostsDetails from "./pages/clientspostsCRUD/ClientsPostsDetails";
import ClientsPostsUpdate from "./pages/clientspostsCRUD/ClientsPostsUpdate";

import ReactionClientPostCreate from "./pages/reactionClientPostCRUD/ReactionClientPostCreate";
import ReactionClientPostList from "./pages/reactionClientPostCRUD/ReactionClientPostList";
import ReactionClientPostUpdate from "./pages/reactionClientPostCRUD/ReactionClientPostUpdate";


import { AccessCoachList } from "./pages/access_coachCRUD/AccessCoachList";
import { AccessCoachCreate } from "./pages/access_coachCRUD/AccessCoachCreate";
import { AccessCoachDetails } from "./pages/access_coachCRUD/AccessCoachDetails";
import { AccessCoachUpdate } from "./pages/access_coachCRUD/AccessCoachUpdate";

import AccessClientUpdate from "./pages/access_clientCRUD/AccessClientUpdate";
import AccessClientCreate from "./pages/access_clientCRUD/AccessClientCreate";
import AccessClientList from "./pages/access_clientCRUD/AccessClientList";

import { CrudList } from "./pages/CrudList";

import { ClientSignup } from "./pages/login_client/ClientSignUp";
import { ClientPrivate } from "./pages/login_client/ClientPrivate";
import { ClientLoginLanding } from "./pages/login_client/ClientLoginLanding";
import { ClientLogin } from "./pages/login_client/ClientLogin";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      <Route path="/" element={<Home />} />

      <Route path="/clients" element={<ClientsList />} />
      <Route path="/clients/create" element={<ClientsCreate />} />
      <Route path="/clients/:id" element={<ClientsDetails />} />
      <Route path="/clients/:id/edit" element={<ClientsUpdate />} />

      <Route path="/coachs" element={<CoachsList />} />
      <Route path="/coachs/create" element={<CoachsCreate />} />
      <Route path="/coachs/:id" element={<CoachsDetails />} />
      <Route path="/coachs/:id/edit" element={<CoachsUpdate />} />

      <Route path="/admints" element={<AdmintsList />} />
      <Route path="/admints/create" element={<AdmintsCreate />} />
      <Route path="/admints/:id" element={<AdmintsDetails />} />
      <Route path="/admints/:id/edit" element={<AdmintsUpdate />} />

      <Route path="/emotions" element={<EmotionsList />} />
      <Route path="/emotions/create" element={<EmotionsCreate />} />
      <Route path="/emotions/:id" element={<EmotionsDetails />} />
      <Route path="/emotions/:id/edit" element={<EmotionsUpdate />} />

      <Route path="/admint-posts" element={<AdminsPostsList />} />
      <Route path="/admint-posts/create" element={<AdminsPostsCreate />} />
      <Route path="/admint-posts/:id" element={<AdminsPostsDetails />} />
      <Route path="/admint-posts/:id/edit" element={<AdminsPostsUpdate />} />

      <Route path="/entries" element={<EntriesList />} />
      <Route path="/entries/create" element={<EntriesCreate />} />
      <Route path="/entries/:id" element={<EntriesDetails />} />
      <Route path="/entries/:id/edit" element={<EntriesUpdate />} />

      <Route path="/reactions" element={<ReactionAdmintPostsList />} />
      <Route path="/reactions/create" element={<ReactionAdmintPostsCreate />} />
      <Route path="/reactions/:id/edit" element={<ReactionAdmintPostsUpdate />} />

      <Route path="/client-favorites" element={<ClientFavoritesList />} />
      <Route path="/client-favorites/create" element={<ClientFavoritesCreate />} />

      <Route path="/reaction-entries" element={<ReactionEntriesList />} />
      <Route path="/reaction-entries/create" element={<ReactionEntriesCreate />} />
      <Route path="/reaction-entries/:id" element={<ReactionEntriesDetails />} />
      <Route path="/reaction-entries/:id/edit" element={<ReactionEntriesUpdate />} />
      <Route path="/coach-favorites" element={<CoachFavoritesList />} />
      <Route path="/coach-favorites/create" element={<CoachFavoritesCreate />} />

      <Route path="/clients-posts" element={<CLientsPostsList />} />
      <Route path="/clients-posts/create" element={<ClientsPostsCreate />} />
      <Route path="/clients-posts/:id" element={<ClientsPostsDetails />} />
      <Route path="/clients-posts/:id/edit" element={<ClientsPostsUpdate />} />

      <Route path="/reactions-client" element={<ReactionClientPostList />} />
      <Route path="/reactions-client/create" element={<ReactionClientPostCreate />} />
      <Route path="/reactions-client/:id/edit" element={<ReactionClientPostUpdate />} />

      <Route path="/access-coach" element={<AccessCoachList />} />
      <Route path="/access-coach/create" element={<AccessCoachCreate />} />
      <Route path="/access-coach/:id" element={<AccessCoachDetails />} />
      <Route path="/access-coach/update/:id" element={<AccessCoachUpdate />} />

      <Route path="/access-clients" element={<AccessClientList />} />
      <Route path="/access-clients/create" element={<AccessClientCreate />} />
      <Route path="/access-clients/:id" element={<AccessClientUpdate />} />

      <Route path="/client-login-landing" element={<ClientLoginLanding/>} />
      <Route path="/client-login" element={<ClientLogin />} />
      <Route path="/client-signup" element={<ClientSignup />} />
      <Route path="/client-private" element={<ClientPrivate />} />

      <Route path="/crudlist" element={<CrudList />} />
      
    </Route>
  )
);