import store from "../../menus/services/users-api.service.js"

export function requireAuth(to, from, next) {
    if (!store.state.isAuthenticated) {
        next({
            path: '/signin',
            query: { redirect: to.fullPath }
        });
    } else {
        next();
    }
}

export function requireInstitution(to, from, next) {
    if (store.state.isAuthenticated && !store.state.isInstitution && (to.path === '/foods' || to.path === '/menumanagement')) {
        next({
            path: '/signin',
            query: { redirect: to.fullPath }
        });
    } else {
        next();
    }
}
