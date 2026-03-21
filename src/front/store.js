export const initialStore = () => {
    return {
        message: null,
        clients: []
    }
}

export default function storeReducer(store, action = {}) {
    switch (action.type) {
        case 'set_hello':
            return { ...store, message: action.payload };

        case 'set_clients':
            return { ...store, clients: action.payload };

        default:
            throw Error('Unknown action.');
    }
}

