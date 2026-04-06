export const initialStore = () => {
  return {
    message: null,
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
    clientToken: sessionStorage.getItem("clientToken") || null,
    clientId: sessionStorage.getItem("clientId") || null,
    clientEmail: sessionStorage.getItem("clientEmail") || null,
    clientSignupDate: sessionStorage.getItem("clientSignupDate") || null,
    coachToken: sessionStorage.getItem("coachToken") || null,
    coachId: sessionStorage.getItem("coachtId") || null,
    coachEmail: sessionStorage.getItem("coachEmail") || null,
    coachSignupDate: sessionStorage.getItem("coachSignupDate") || null,
    admintToken: sessionStorage.getItem("admintToken") || null,
    admintId: sessionStorage.getItem("admintId") || null,
    admintEmail: sessionStorage.getItem("admintEmail") || null,
    admintSignupDate: sessionStorage.getItem("admintSignupDate") || null,
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return { ...store, message: action.payload };

    case "set_clients":
      return { ...store, clients: action.payload };

    case "set_admints":
      return { ...store, admints: action.payload };

    case "set_coachs":
      return { ...store, coachs: action.payload };

    case "set_emotions":
      return { ...store, emotions: action.payload };

    case "set_admint_posts":
      return { ...store, admint_posts: action.payload };
    
    case "set_reactions":
    return { ...store, reactions: action.payload };

    case "set_entries":
    return { ...store, entries: action.payload };

    case 'set_favorites':
    return { ...store, favorites: action.payload };

    case 'set_coach_favorites':
    return { ...store, coach_favorites: action.payload };

    case "set_clients_posts":
    return { ...store, clients_posts: action.payload };

    case "set_reaction_client":
    return { ...store, reaction_client: action.payload };

    case "set_access_coach":
    return { ...store, access_coach: action.payload };

    case "set_access_clients":
    return { ...store, access_clients: action.payload };

    case 'login_client':
    sessionStorage.setItem("clientToken", action.payload.token);
    sessionStorage.setItem("clientEmail", action.payload.client?.email || "");
    sessionStorage.setItem("clientId", action.payload.client?.id || "");
    sessionStorage.setItem("clientSignupDate", action.payload.client?.sign_up_date || "");
    return {
      ...store,
      clientToken: action.payload.token,
      clientEmail: action.payload.client?.email || null,
      clientId: action.payload.client?.id || null,
      clientSignupDate: action.payload.client?.sign_up_date || null,
    };

    case 'login_coach':
    sessionStorage.setItem("coachToken", action.payload.token);
    sessionStorage.setItem("coachEmail", action.payload.coach?.email || "");
    sessionStorage.setItem("coachId", action.payload.coach?.id || "");
    sessionStorage.setItem("coachSignupDate", action.payload.coach?.sign_up_date || "");
    return {
      ...store,
      coachToken: action.payload.token,
      coachEmail: action.payload.coach?.email || null,
      coachId: action.payload.coach?.id || null,
      coachSignupDate: action.payload.coach?.sign_up_date || null,
    };

    case 'login_admint':
    sessionStorage.setItem("admintToken", action.payload.token);
    sessionStorage.setItem("admintEmail", action.payload.admint?.email || "");
    sessionStorage.setItem("admintId", action.payload.admint?.id || "");
    sessionStorage.setItem("admintSignupDate", action.payload.admint?.sign_up_date || "");
    return {
      ...store,
      admintToken: action.payload.token,
      admintEmail: action.payload.admint?.email || null,
      admintId: action.payload.admint?.id || null,
      admintSignupDate: action.payload.admint?.sign_up_date || null,
    };

    case 'logout_client':
    sessionStorage.removeItem("clientToken")
    return { ...store, clientToken: null };

    case 'logout_coach':
    sessionStorage.removeItem("coachToken")
    return { ...store, coachToken: null };

    case 'logout_admint':
    sessionStorage.removeItem("admintToken")
    return { ...store, admintToken: null };
  
    default:
      throw Error("Unknown action.");
  }
}
