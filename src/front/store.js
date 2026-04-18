export const initialStore = () => {
  return {
    clients: [],
    admints: [],
    coachs: [],
    emotions: [],
    admint_posts: [],
    reactions: [],
    entries: [],
    favorites: [],
    coach_favorites: [],
    clients_posts: [],
    reaction_client: [],
    access_coach: [],
    access_clients: [],
    nearbyUsers: [],
    messages: [],

    // Auth — client
    clientToken: sessionStorage.getItem("clientToken") || null,
    clientId: sessionStorage.getItem("clientId") || null,
    clientEmail: sessionStorage.getItem("clientEmail") || null,
    clientSignupDate: sessionStorage.getItem("clientSignupDate") || null,
    userAvatar: sessionStorage.getItem("userAvatar") || null,

    // Auth — coach
    coachToken: sessionStorage.getItem("coachToken") || null,
    coachId: sessionStorage.getItem("coachId") || null,
    coachEmail: sessionStorage.getItem("coachEmail") || null,
    coachSignupDate: sessionStorage.getItem("coachSignupDate") || null,

    // Auth — admint
    admintToken: sessionStorage.getItem("admintToken") || null,
    admintId: sessionStorage.getItem("admintId") || null,
    admintEmail: sessionStorage.getItem("admintEmail") || null,
    admintSignupDate: sessionStorage.getItem("admintSignupDate") || null,
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    // AUTH
    case "login_client":
      sessionStorage.clear(); // Limpia sesiones anteriores
      sessionStorage.setItem("clientToken", action.payload.token);
      sessionStorage.setItem("clientEmail", action.payload.client?.email || "");
      sessionStorage.setItem("clientId", action.payload.client?.id || "");
      sessionStorage.setItem(
        "clientSignupDate",
        action.payload.client?.sign_up_date || "",
      );
      return {
        ...initialStore(), // Resetea el store a su estado base
        clientToken: action.payload.token,
        clientEmail: action.payload.client?.email || null,
        clientId: action.payload.client?.id || null,
        clientSignupDate: action.payload.client?.sign_up_date || null,
      };

    case "login_coach":
      sessionStorage.clear();
      sessionStorage.setItem("coachToken", action.payload.token);
      sessionStorage.setItem("coachEmail", action.payload.coach?.email || "");
      sessionStorage.setItem("coachId", action.payload.coach?.id || "");
      sessionStorage.setItem(
        "coachSignupDate",
        action.payload.coach?.sign_up_date || "",
      );
      return {
        ...initialStore(),
        coachToken: action.payload.token,
        coachEmail: action.payload.coach?.email || null,
        coachId: action.payload.coach?.id || null,
        coachSignupDate: action.payload.coach?.sign_up_date || null,
      };

    case "login_admint":
      sessionStorage.clear();
      sessionStorage.setItem("admintToken", action.payload.token);
      sessionStorage.setItem("admintEmail", action.payload.admint?.email || "");
      sessionStorage.setItem("admintId", action.payload.admint?.id || "");
      sessionStorage.setItem(
        "admintSignupDate",
        action.payload.admint?.sign_up_date || "",
      );
      return {
        ...initialStore(),
        admintToken: action.payload.token,
        admintEmail: action.payload.admint?.email || null,
        admintId: action.payload.admint?.id || null,
        admintSignupDate: action.payload.admint?.sign_up_date || null,
      };

    case "set_user_avatar":
      sessionStorage.setItem("userAvatar", action.payload);
      return { ...store, userAvatar: action.payload };

    case "logout_client":
    case "logout_coach":
    case "logout_admint":
    case "logout":
      sessionStorage.clear();
      return initialStore();

    // USERS (CLIENTS)
    case "set_clients":
      return { ...store, clients: action.payload };
    case "add_client":
      return { ...store, clients: [...store.clients, action.payload] };
    case "update_client":
      return {
        ...store,
        clients: store.clients.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload } : c
        ),
      };
    case "remove_client":
      return {
        ...store,
        clients: store.clients.filter((c) => c.id !== action.payload),
      };

    // ADMINS
    case "set_admints":
      return { ...store, admints: action.payload };
    case "add_admint":
      return { ...store, admints: [...store.admints, action.payload] };
    case "update_admint":
      return {
        ...store,
        admints: store.admints.map((a) =>
          a.id === action.payload.id ? { ...a, ...action.payload } : a
        ),
      };
    case "remove_admint":
      return {
        ...store,
        admints: store.admints.filter((a) => a.id !== action.payload),
      };

    // COACHS
    case "set_coachs":
      return { ...store, coachs: action.payload };
    case "add_coach":
      return { ...store, coachs: [...store.coachs, action.payload] };
    case "update_coach":
      return {
        ...store,
        coachs: store.coachs.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload } : c
        ),
      };
    case "remove_coach":
      return {
        ...store,
        coachs: store.coachs.filter((c) => c.id !== action.payload),
      };

    // EMOTIONS
    case "set_emotions":
      return { ...store, emotions: action.payload };
    case "add_emotion":
      return { ...store, emotions: [...store.emotions, action.payload] };
    case "update_emotion":
      return {
        ...store,
        emotions: store.emotions.map((e) =>
          e.id === action.payload.id ? { ...e, ...action.payload } : e
        ),
      };
    case "remove_emotion":
      return {
        ...store,
        emotions: store.emotions.filter((e) => e.id !== action.payload),
      };

    // ADMIN POST
    case "set_admint_posts":
      return { ...store, admint_posts: action.payload };
    case "add_admint_post":
      return { ...store, admint_posts: [...store.admint_posts, action.payload] };
    case "update_admint_post":
      return {
        ...store,
        admint_posts: store.admint_posts.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        ),
      };
    case "remove_admint_post":
      return {
        ...store,
        admint_posts: store.admint_posts.filter((p) => p.id !== action.payload),
      };

    // REACTIONS
    case "set_reactions":
      return { ...store, reactions: action.payload };
    case "add_reaction":
      return { ...store, reactions: [...store.reactions, action.payload] };
    case "update_reaction":
      return {
        ...store,
        reactions: store.reactions.map((r) =>
          r.id === action.payload.id ? { ...r, ...action.payload } : r
        ),
      };
    case "remove_reaction":
      return {
        ...store,
        reactions: store.reactions.filter((r) => r.id !== action.payload),
      };

    // ENTRIES
    case "set_entries":
      return { ...store, entries: action.payload };
    case "add_entry":
      return { ...store, entries: [...store.entries, action.payload] };
    case "update_entry":
      return {
        ...store,
        entries: store.entries.map((e) =>
          e.id === action.payload.id ? { ...e, ...action.payload } : e
        ),
      };
    case "remove_entry":
      return {
        ...store,
        entries: store.entries.filter((e) => e.id !== action.payload),
      };

    // FAVORITES (client)
    case "set_favorites":
      return { ...store, favorites: action.payload };
    case "add_favorite":
      return { ...store, favorites: [...store.favorites, action.payload] };
    case "remove_favorite":
      return {
        ...store,
        favorites: store.favorites.filter((f) => f.id !== action.payload),
      };

    // COACH FAVORITES 
    case "set_coach_favorites":
      return { ...store, coach_favorites: action.payload };
    case "add_coach_favorite":
      return { ...store, coach_favorites: [...store.coach_favorites, action.payload] };
    case "remove_coach_favorite":
      return {
        ...store,
        coach_favorites: store.coach_favorites.filter((f) => f.id !== action.payload),
      };

    // CLIENTS POSTS 
    case "set_clients_posts":
      return { ...store, clients_posts: action.payload };
    case "add_client_post":
      return { ...store, clients_posts: [...store.clients_posts, action.payload] };
    case "update_client_post":
      return {
        ...store,
        clients_posts: store.clients_posts.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        ),
      };
    case "remove_client_post":
      return {
        ...store,
        clients_posts: store.clients_posts.filter((p) => p.id !== action.payload),
      };

    // REACTION CLIENT 
    case "set_reaction_client":
      return { ...store, reaction_client: action.payload };
    case "add_reaction_client":
      return { ...store, reaction_client: [...store.reaction_client, action.payload] };
    case "update_reaction_client":
      return {
        ...store,
        reaction_client: store.reaction_client.map((r) =>
          r.id === action.payload.id ? { ...r, ...action.payload } : r
        ),
      };
    case "remove_reaction_client":
      return {
        ...store,
        reaction_client: store.reaction_client.filter((r) => r.id !== action.payload),
      };

    // ACCESS COACH
    case "set_access_coach":
      return { ...store, access_coach: action.payload };
    case "add_access_coach":
      return { ...store, access_coach: [...store.access_coach, action.payload] };
    case "remove_access_coach":
      return {
        ...store,
        access_coach: store.access_coach.filter((a) => a.id !== action.payload),
      };

    // ACCESS CLIENTS 
    case "set_access_clients":
      return { ...store, access_clients: action.payload };
    case "add_access_client":
      return { ...store, access_clients: [...store.access_clients, action.payload] };
    case "remove_access_client":
      return {
        ...store,
        access_clients: store.access_clients.filter((a) => a.id !== action.payload),
      };

    case "set_nearby_users":
      return { ...store, nearbyUsers: action.payload };

    case "clear_nearby_users":
      return { ...store, nearbyUsers: [] };

    default:
      throw Error(`Unknown action: "${action.type}"`);
  }
}
