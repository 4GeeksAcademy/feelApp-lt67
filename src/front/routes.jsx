import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";


//////// ADMIN ////////

// POSTS
import AdminsPostsList from "./pages/CRUDs/adminpostsCRUD/AdminPostsList";
import AdminsPostsCreate from "./pages/CRUDs/adminpostsCRUD/AdminPostsCreate";
import AdminsPostsDetails from "./pages/CRUDs/adminpostsCRUD/AdminPostsDetails";
import AdminsPostsUpdate from "./pages/CRUDs/adminpostsCRUD/AdminPostsUpdate";

// REACTIONS
import ReactionAdmintPostsList from "./pages/ReactionAdmintPostsList";
import ReactionClientPostList from "./pages/ReactionClientPostList";

// EMOTIONS
import EmotionsDetails from "./pages/CRUDs/emotionsCRUD/EmotionDetails";
import EmotionsUpdate from "./pages/CRUDs/emotionsCRUD/EmotionsUpdate";
import EmotionsCreate from "./pages/CRUDs/emotionsCRUD/EmotionsCreate";
import EmotionsList from "./pages/CRUDs/emotionsCRUD/EmotionList";

// USERS CRUDS
import ClientsList from "./pages/CRUDs/clientsCRUD/ClientsList";
import ClientsCreate from "./pages/CRUDs/clientsCRUD/ClientsCreate";

import CoachsList from "./pages/CRUDs/coachesCRUD/coachsList";
import CoachsCreate from "./pages/CRUDs/coachesCRUD/coachsCreate";

import AdmintsCreate from "./pages/CRUDs/adminsCRUD/AdminsCreate";
import AdmintsList from "./pages/CRUDs/adminsCRUD/AdminsList";

// ACCESS
import AccessClientList from "./pages/AccessClientList";

// CLIENTS POSTS
import CLientsPostsList from "./pages/CRUDs/ClientsPostsList";


//////// CLIENT ////////

// ENTRIES
import EntriesList from "./pages/client/entriesCRUD/entriesList";
import EntriesCreate from "./pages/client/entriesCRUD/entriesCreate";
import EntriesDetails from "./pages/client/entriesCRUD/entriesDetails";

// VIEWS
import Forum from "./pages/client/Forum";
import Shared from "./pages/client/Shared";
import AccessClient from "./pages/client/AccessClient";
import AccessCoach from "./pages/client/AccessCoach";
import NewClientPost from "./pages/client/NewClientPost";

// COMPONENTS CLIENT | COACH
import SharedEntriesList from "./pages/client/SharedEntriesList";
import SharedEntriesDetails from "./pages/client/SharedEntriesDetails";
import EmotionalStats from "./pages/client/EmotionalStats";

//////// COACH ////////
import { AccessCoachList } from "./pages/CRUDs/access_coachCRUD/AccessCoachList";
import { AccessCoachCreate } from "./pages/CRUDs/access_coachCRUD/AccessCoachCreate";
import CoachFavoritesList from "./pages/CRUDs/CoachFavoritesList";

//////// GENERAL ////////

import { SignUp } from "./pages/login/SignUp";
import { Login } from "./pages/login/Login";
import { AboutUs } from "./pages/AboutUs";
import FindNearYou from "./pages/FindNearYou";

// PRIVATES
import { ClientPrivate } from "./pages/client/ClientPrivate";
import { CoachPrivate } from "./pages/login/CoachPrivate";
import { AdminPrivate } from "./pages/login/AdminPrivate";


export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      <Route path="/" element={<Home />} />

      <Route path="/clients" element={<ClientsList />} />
      <Route path="/clients/create" element={<ClientsCreate />} />

      <Route path="/coachs" element={<CoachsList />} />
      <Route path="/coachs/create" element={<CoachsCreate />} />

      <Route path="/admints" element={<AdmintsList />} />
      <Route path="/admints/create" element={<AdmintsCreate />} />

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
      <Route path="/reactions-client" element={<ReactionClientPostList />} />

      <Route path="/coach-favorites" element={<CoachFavoritesList />} />

      <Route path="/clients-posts" element={<CLientsPostsList />} />

      <Route path="/access-coach" element={<AccessCoachList />} />
      <Route path="/access-coach/create" element={<AccessCoachCreate />} />

      <Route path="/access-clients" element={<AccessClientList />} />

      <Route path="/client-private" element={<ClientPrivate />} />
      <Route path="/coach-private" element={<CoachPrivate />} />
      <Route path="/admint-private" element={<AdminPrivate />} />

      <Route path="/forum" element={<Forum />} />
      <Route path="/shared" element={<Shared />} />
      <Route path="/entries/friend/:clientId" element={<SharedEntriesList />} />
      <Route path="/entries/friend/:clientId/:entryId" element={<SharedEntriesDetails />} />
      <Route path="/stats" element={<EmotionalStats />} />
      <Route path="/nearyou" element={<FindNearYou />} />
      <Route path="/access/friends" element={<AccessClient />} />
      <Route path="/access/coach" element={<AccessCoach />} />
      <Route path="/client/post" element={<NewClientPost />} />

      <Route path="/login" element={<Login />} />
      <Route path="/client-signup" element={<SignUp title="Client Sign Up" apiEndpoint="/api/signup" loginPath="/login" />} />
      <Route path="/coach-signup" element={<SignUp title="Coach Sign Up" apiEndpoint="/api/coach-signup" loginPath="/login" />} />
      <Route path="/aboutUs" element={<AboutUs />} />

      <Route path="/stats/:clientId" element={<EmotionalStats />} />

    </Route>
  )
);







