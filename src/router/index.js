import {createRouter, createWebHistory} from "vue-router";
import MenuSalesComponent from "../menus/pages/menu-sales.component.vue";
import FoodManagementComponent from "../menus/pages/food-management.component.vue";

import MenuManagementComponent from "../menus/pages/menu-management.component.vue";
import MenuInformationComponent from "../menus/components/menu-information.component.vue";


const router = createRouter({
    history: createWebHistory(),
    routes:[
        {path: '/menus', name: 'menus', component: MenuSalesComponent, meta: {title: 'Menus'}},
        {path: '/foods', name: 'foods', component: FoodManagementComponent, meta: {title: 'Foods'}},
        {path: '/menumanagement', name: 'menumanagement', component: MenuManagementComponent, meta: {title: 'MenuManagement'}},
        {path: '/menuinfo/:id', name: 'menuinfo', component: MenuInformationComponent, meta: {title: 'MenuInformation'}},
        { path: "/",        redirect: "/menus"},
    ]
});

export default router;