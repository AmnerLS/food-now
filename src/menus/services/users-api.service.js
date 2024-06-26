import { createStore } from 'vuex';

export default createStore({
    state: {
        isAuthenticated: false,
        isInstitution: false,
        userId:''
    },
    mutations: {
        setAuthenticated(state, value) {
            state.isAuthenticated = value;
        },
        setInstitution(state, value) {
            state.isInstitution = value;
        },
        setUserId(state, value) {
            state.userId = value;
        }
    },
    actions: {},
    modules: {}
});