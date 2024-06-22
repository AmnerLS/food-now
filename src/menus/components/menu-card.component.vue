<script>

import {FoodApiService} from "../services/food-api.service.js";
import {useStore} from "vuex";
import {UserApiService} from "../services/users.service.js";

export default {
  name: "menu-card",
  props: {menu: Object},
  data() {
    return {
      foodService: null,
      userService: null,
      description: "",
      userId: null,
      store: null
    };
  },
  methods: {
    notifySuccessfulAction(message) {
      this.$toast.add({severity: "success", summary: "Success", detail: message, life: 3000,});
    },
    notifyErrorAction(message) {
      this.$toast.add({severity: "danger", summary: "Error", detail: message, life: 3000,});
    },
    async buildDescription(foods) {
      let description = "Delicious menu with: ";
      const foodDescriptions = await Promise.all(foods.map(food => this.foodService.getById(food)));

      foodDescriptions.forEach(response => {
        description += `${response.data.name}, `;
      });
      this.description = description;
    },
    buyMenu() {
      // Recuperar los menús guardados del almacenamiento local
      let savedMenus = JSON.parse(localStorage.getItem('savedMenus')) || [];

      // Agregar el nuevo menú a la lista de menús guardados
      savedMenus.push(this.menu._id);

      // Guardar la lista actualizada de menús guardados en el almacenamiento local
      localStorage.setItem('savedMenus', JSON.stringify(savedMenus));

      this.notifySuccessfulAction('Menu added to cart successfully');
    },
    addFavorite(id){
      if(this.userId){
        this.userService.addFavorite(this.userId, id).then((response)=>{
          this.notifySuccessfulAction('Menu added to favorite successfully');
        }).catch((error)=>{
          this.notifyErrorAction('Menu already added to favorite');
        });
      }else{
        this.notifyErrorAction('You must be logged in to add to favorite ');
      }
    },
    viewMenu(){
      let menuId = this.menu._id;
      this.$router.push({name: "menuinfo", params: { id: menuId}});
    }
  },
  created() {
    this.store = useStore();
    this.foodService = new FoodApiService();
    this.userService = new UserApiService();
    this.userId = this.store.state.userId;
    this.buildDescription(this.menu.foods);
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
      <pv-button label="Add to cart" class="w-full p-button-text text-white buy" @click="buyMenu" icon="pi pi-cart-arrow-down" ></pv-button>
      <div class="flex gap-4 mt-1">
        <pv-button label="View" class="p-button-text text-white view" @click="viewMenu" icon="pi pi-eye" ></pv-button>
        <pv-button label="Favorite" class="p-button-text text-white favorite" @click="addFavorite(menu._id)" icon="pi pi-heart" ></pv-button>
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