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
    coachToken: sessionStorage.getItem("coachToken") || null,
    admintToken: sessionStorage.getItem("admintToken") || null,
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
    sessionStorage.setItem("clientToken", action.payload);
    return { ...store, clientToken: action.payload };

    case 'logout_client':
    sessionStorage.removeItem("clientToken")
    return { ...store, clientToken: null };

    case 'login_coach':
    sessionStorage.setItem("coachToken", action.payload)
    return { ...store, coachToken: action.payload };

    case 'logout_coach':
    sessionStorage.removeItem("coachToken")
    return { ...store, coachToken: null };

    case 'login_admint':
    sessionStorage.setItem("admintToken", action.payload)
    return { ...store, admintToken: action.payload };

    case 'logout_admint':
    sessionStorage.removeItem("admintToken")
    return { ...store, admintToken: null };
  
    default:
      throw Error("Unknown action.");
  }
}
