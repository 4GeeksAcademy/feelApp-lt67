export const initialStore = () => {
    return {
        message: null,
        clients: [],
        admints: [],
        coachs: [],
        emotions: [],
        admint_posts: []
    }
}

export default function storeReducer(store, action = {}) {
    switch (action.type) {
        case 'set_hello':
            return { ...store, message: action.payload };

        case 'set_clients':
            return { ...store, clients: action.payload };

        case 'set_admints':
            return { ...store, admints: action.payload };

        case 'set_coachs':
            return { ...store, coachs: action.payload };

        case 'set_emotions':
            return { ...store, emotions: action.payload };

        case 'set_admint_posts':
             return { ...store, admint_posts: action.payload };

        default:
            throw Error('Unknown action.');
    }
}

