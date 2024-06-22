import {createRouter, createWebHistory} from "vue-router";
import { requireAuth, requireInstitution} from '../public/components/routeGuard.js';  // Importa las funciones de guardia de navegación
import MenuSalesComponent from "../menus/pages/menu-sales.component.vue";
import FoodManagementComponent from "../menus/pages/food-management.component.vue";
import MenuManagementComponent from "../menus/pages/menu-management.component.vue";
import SignInComponent  from "../public/pages/sign-in.component.vue";
import SignUpComponent  from "../public/pages/sign-up.component.vue";
import MenuInformationComponent from "../menus/pages/menu-information.component.vue";
import FavoriteMenusComponent from "../menus/pages/favorite-menus.component.vue";
import OrderManagementComponent from "../menus/pages/order-management.component.vue";
import OrderHistoryComponent from "../menus/pages/order-history.component.vue";


const router = createRouter({
    history: createWebHistory(),
    routes:[
        {path: '/menus', name: 'menus', component: MenuSalesComponent, meta: {title: 'Menus'}},
        {path: '/foods', name: 'foods', component: FoodManagementComponent, meta: {title: 'Foods'}, beforeEnter: requireInstitution},
        {path: '/menumanagement', name: 'menumanagement', component: MenuManagementComponent, meta: {title: 'MenuManagement'}, beforeEnter: requireInstitution},
        {path: '/menuinfo/:id', name: 'menuinfo', component: MenuInformationComponent, meta: {title: 'MenuInformation'}},
        {path: '/menus/favorites', name: 'favorites', component: FavoriteMenusComponent, meta: {title: 'Favorites'}, beforeEnter: requireAuth},
        {path: '/orders', name: 'orders', component: OrderManagementComponent, meta: {title: 'Orders'},beforeEnter: requireAuth},
        {path: '/orders/history', name: 'order-history', component: OrderHistoryComponent, meta: {title: 'OrderHistory'},beforeEnter: requireAuth},
        { path: "/",        redirect: "/menus"},
        {path: "/signin", name: "signin", component: SignInComponent, meta: {title: 'Sign In'}},
        {path: "/signup", name: "signup", component: SignUpComponent, meta: {title: 'Sign Up'}},
    ]
});

export default router;