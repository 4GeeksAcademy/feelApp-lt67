export const initialStore = () => {
    return {
        message: null,
        clients: [],
        admints: []
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
        default:
            throw Error('Unknown action.');
    }
}

