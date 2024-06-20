<script>
import {MenuApiService} from "../services/menu-api.service.js";
import MenuCard from "../components/menu-card.component.vue";
import {FoodApiService} from "../services/food-api.service.js";

export default {
  name: "menu-sales",
  components: {MenuCard},
  data(){
    return {
      menus:[],
      menusService: null
    }
  },
  methods:{
    getAllMenus(){
      this.menusService.getAll().then(response => {
        this.menus = response.data;
      });
    }
  },
  created() {
    this.menusService = new MenuApiService();
    this.getAllMenus();
  }
}
</script>

<template>
  <h1> Menus</h1>
  <div v-for="menu in menus">
    <menu-card :menu="menu"/>
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