<script>
import {MenuApiService} from "../services/menu-api.service.js";
import {useStore} from "vuex";
import {UserApiService} from "../services/users.service.js";
import MenuCard from "../components/menu-card.component.vue";
import MenuCardFav from "../components/menu-card-fav.component.vue";

export default {
  name: "favorite-menus",
  components: {MenuCardFav, MenuCard},
  data() {
    return {
      favoriteMenuIds: [],
      favoriteMenus: [],
      menuService: null,
      userService: null,
      store: null,
      userId: null
    };
  },
  methods:{
    getUser(){
      this.userService.getById(this.userId).then((response)=>{
        this.favoriteMenuIds = response.data.favoriteMenus;
        console.log(this.favoriteMenuIds);
        this.getFavoriteMenus();
      });
    },
    getFavoriteMenus() {
      console.log(this.favoriteMenuIds);
      this.favoriteMenuIds.forEach((menuId) => {
        this.menuService.getById(menuId).then((response) => {
          this.favoriteMenus.push(response.data);
        });
      });
      console.log(this.favoriteMenus);
    },
  },
  created() {
    this.store = useStore();
    this.menuService = new MenuApiService();
    this.userService = new UserApiService();
    this.userId = this.store.state.userId;
    this.getUser();
  },
}
</script>

<template>
  <h1> Favorites </h1>
  <div v-for="menu in favoriteMenus">
    <menu-card-fav :menu="menu"/>
  </div>
</template>

<style scoped>
div {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}
</style>