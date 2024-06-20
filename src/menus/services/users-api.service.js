import { createStore } from 'vuex';

export default createStore({
    state: {
        isAuthenticated: false,
        institution: false
    },
    mutations: {
        setAuthenticated(state, value) {
            state.isAuthenticated = value;
        },
        setInstitution(state, value) {
            state.institution = value;
        }
    },
    actions: {},
    modules: {}
});