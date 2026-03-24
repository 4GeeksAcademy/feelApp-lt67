export const initialStore = () => {
  return {
    message: null,
    clients: [],
    admints: [],
    coachs: [],
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

    case "delete_coach":
      return {
        ...store,
        coachs: store.coachs.filter((coach) => coach.id !== action.payload),
      };

    default:
      return store;
  }
}
