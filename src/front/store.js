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
    reaction_entries: [],
    coach_favorites: [],
    clients_posts: [],
    reaction_client: [],
    access_coach: []
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

    case "set_reaction_entries":
    return {...store, reaction_entries: action.payload};

    case 'set_coach_favorites':
    return { ...store, coach_favorites: action.payload };

    case "set_clients_posts":
    return { ...store, clients_posts: action.payload };

    case "set_reaction_client":
    return { ...store, reaction_client: action.payload };

    case "set_access_coach":
    return { ...store, access_coach: action.payload };
  
    default:
      throw Error("Unknown action.");
  }
}
