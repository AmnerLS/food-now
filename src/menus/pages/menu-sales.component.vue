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
  <div class="menu-container" v-for="menu in menus" >
    <menu-card :menu="menu" />
  </div>
  <pv-paginator :rows="10" :totalRecords="menus.length" template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" />
</template>

<style scoped>
.menu-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  padding: 10px;
}
</style>