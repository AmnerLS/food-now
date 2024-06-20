<script>

import {FoodApiService} from "../services/food-api.service.js";

export default {
  name: "menu-card",
  props: {menu: Object},
  data() {
    return {
      foodService: null,
      description: ""
    };
  },
  methods: {
    async buildDescription(foods) {
      let description = "Delicious menu with: ";
      const foodDescriptions = await Promise.all(foods.map(food => this.foodService.getById(food)));

      foodDescriptions.forEach(response => {
        description += `${response.data.name}, `;
      });
      this.description = description;
    },

    viewMenu(){
      let menuId = this.menu._id;
      this.$router.push({name: "menuinfo", params: { id: menuId}});
    }
  },
  created() {
    this.foodService = new FoodApiService();
    this.buildDescription(this.menu.foods)
  }
}
</script>

<template>
  <pv-card style="width: 20rem;">
    <template #header>
      <img alt="menu header" :src="menu.image" style="width: auto; height: 100px;"/>
    </template>
    <template #title>{{ menu.name }}</template>
    <template #subtitle>S/{{ menu.price }}</template>
    <template #content>
      <p class="m-0">{{ description }} </p>
    </template>
    <template #footer>
      <pv-button label="Buy" class="w-full p-button-text text-white buy" icon="pi pi-cart-arrow-down" ></pv-button>
      <div class="flex gap-4 mt-1">
        <pv-button label="View" class="p-button-text text-white view" @click="viewMenu" icon="pi pi-eye" ></pv-button>
        <pv-button label="Favorite" class="p-button-text text-white favorite" icon="pi pi-heart" ></pv-button>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
.buy{
  background-color: #f44336;
  color: white;
}
.view{
  background-color: #4CAF50;
  color: white;
}
.favorite{
  background-color: #2196F3;
  color: white;
}
</style>