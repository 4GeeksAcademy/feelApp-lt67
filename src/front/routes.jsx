import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";

import AdminsPostsList from "./pages/CRUDs/adminpostsCRUD/AdminPostsList";
import AdminsPostsCreate from "./pages/CRUDs/adminpostsCRUD/AdminPostsCreate";
import AdminsPostsDetails from "./pages/CRUDs/adminpostsCRUD/AdminPostsDetails";
import AdminsPostsUpdate from "./pages/CRUDs/adminpostsCRUD/AdminPostsUpdate";

import ReactionAdmintPostsCreate from "./pages/CRUDs/reactionAdminPostCRUD/ReactionAdmintPostsCreate";
import ReactionAdmintPostsUpdate from "./pages/CRUDs/reactionAdminPostCRUD/ReactionAdmintPostsUpdate";
import ReactionAdmintPostsList from "./pages/CRUDs/reactionAdminPostCRUD/ReactionAdmintPostsList";

import EntriesList from "./pages/client/entriesCRUD/entriesList";
import EntriesCreate from "./pages/client/entriesCRUD/entriesCreate";
import EntriesDetails from "./pages/client/entriesCRUD/entriesDetails";

import CLientsPostsList from "./pages/CRUDs/ClientsPostsList";

import { AccessCoachList } from "./pages/CRUDs/access_coachCRUD/AccessCoachList";
import { AccessCoachCreate } from "./pages/CRUDs/access_coachCRUD/AccessCoachCreate";

import { CrudList } from "./pages/CrudList";

import { SignUp } from "./pages/login/SignUp";
import { Login } from "./pages/login/Login";
import { ClientPrivate } from "./pages/client/ClientPrivate";
import { CoachPrivate } from "./pages/login/CoachPrivate";
import { AdminPrivate } from "./pages/login/AdminPrivate";

import Forum from "./pages/client/Forum";
import AccessPage from "./pages/client/AccessPage";
import Shared from "./pages/client/Shared";

import ReactionClientPostList from "./pages/CRUDs/reactionClientPostCRUD/ReactionClientPostList";
import ReactionClientPostCreate from "./pages/CRUDs/reactionClientPostCRUD/ReactionClientPostCreate";
import ReactionClientPostUpdate from "./pages/CRUDs/reactionClientPostCRUD/ReactionClientPostUpdate";

import ClientFavoritesList from "./pages/CRUDs/ClientFavoritesList";
import CoachFavoritesList from "./pages/CRUDs/CoachFavoritesList";

import AccessClientList from "./pages/CRUDs/access_clientCRUD/AccessClientList";

import EmotionsDetails from "./pages/CRUDs/emotionsCRUD/EmotionDetails";
import EmotionsUpdate from "./pages/CRUDs/emotionsCRUD/EmotionsUpdate";
import EmotionsCreate from "./pages/CRUDs/emotionsCRUD/EmotionsCreate";
import EmotionsList from "./pages/CRUDs/emotionsCRUD/EmotionList";
import ClientsList from "./pages/CRUDs/clientsCRUD/ClientsList";
import ClientsCreate from "./pages/CRUDs/clientsCRUD/ClientsCreate";
import ClientsDetails from "./pages/CRUDs/clientsCRUD/ClientsDetails";
import ClientsUpdate from "./pages/CRUDs/clientsCRUD/ClientsUpdate";
import CoachsList from "./pages/CRUDs/coachesCRUD/coachsList";
import CoachsCreate from "./pages/CRUDs/coachesCRUD/coachsCreate";
import CoachsDetails from "./pages/CRUDs/coachesCRUD/coachsDetails";
import CoachsUpdate from "./pages/CRUDs/coachesCRUD/coachsUpdate";
import AdmintsCreate from "./pages/CRUDs/adminsCRUD/AdminsCreate";
import AdmintsDetails from "./pages/CRUDs/adminsCRUD/AdminsDetails";
import AdmintsUpdate from "./pages/CRUDs/adminsCRUD/AdminsUpdate";
import AdmintsList from "./pages/CRUDs/adminsCRUD/AdminsList";

import SharedEntriesList from "./pages/client/SharedEntriesList";
import SharedEntriesDetails from "./pages/client/SharedEntriesDetails";
import EmotionalStats from "./pages/client/EmotionalStats";
import About from "./pages/About";

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

      <Route path="/entries/client/:client_id" element={<EntriesList />} />

      <Route path="/reactions" element={<ReactionAdmintPostsList />} />
      <Route path="/reactions/create" element={<ReactionAdmintPostsCreate />} />
      <Route path="/reactions/:id/edit" element={<ReactionAdmintPostsUpdate />} />

      <Route path="/client-favorites" element={<ClientFavoritesList />} />

      <Route path="/coach-favorites" element={<CoachFavoritesList />} />

      <Route path="/clients-posts" element={<CLientsPostsList />} />

      <Route path="/reactions-client" element={<ReactionClientPostList />} />
      <Route path="/reactions-client/create" element={<ReactionClientPostCreate />} />
      <Route path="/reactions-client/:id/edit" element={<ReactionClientPostUpdate />} />

      <Route path="/access-coach" element={<AccessCoachList />} />
      <Route path="/access-coach/create" element={<AccessCoachCreate />} />

      <Route path="/access-clients" element={<AccessClientList />} />

      <Route path="/client-login" element={<Login title="Client Access" apiEndpoint="/api/login" dispatchType="login_client" tokenKey="clientToken" redirectPath="/client-private" signupPath="/client-signup" />} />
      <Route path="/client-signup" element={<SignUp title="Client Sign Up" apiEndpoint="/api/signup" loginPath="/client-login" />} />

      <Route path="/coach-login" element={<Login title="Coach Access" apiEndpoint="/api/coach-login" dispatchType="login_coach" tokenKey="coachToken" redirectPath="/coach-private" signupPath="/coach-signup" />} />
      <Route path="/coach-signup" element={<SignUp title="Coach Sign Up" apiEndpoint="/api/coach-signup" loginPath="/coach-login" />} />

      <Route path="/admint-login" element={<Login title="Admin Access" apiEndpoint="/api/admint-login" dispatchType="login_admint" tokenKey="admintToken" redirectPath="/admint-private" signupPath="/admint-signup" showSignInLink={false} />} />

      <Route path="/client-private" element={<ClientPrivate />} />
      <Route path="/coach-private" element={<CoachPrivate />} />
      <Route path="/admint-private" element={<AdminPrivate />} />

      <Route path="/crudlist" element={<CrudList />} />

      <Route path="/forum" element={<Forum />} />
      <Route path="/access" element={<AccessPage />} />
      <Route path="/shared" element={<Shared />} />
      <Route path="/entries/friend/:clientId" element={<SharedEntriesList />} />
      <Route path="/entries/friend/:clientId/:entryId" element={<SharedEntriesDetails />} />
      <Route path="/stats" element={<EmotionalStats />} />
      <Route path="/about" element={<About />} />

    </Route>
  )
);







