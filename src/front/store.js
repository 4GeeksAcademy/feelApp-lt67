export const initialStore = () => {
    return {
        message: null,
        clients: [],
        admints: [],
        coachs: [],
        emotions: []
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

        default:
            throw Error('Unknown action.');
    }
}

