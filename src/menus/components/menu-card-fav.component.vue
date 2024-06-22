<script>
import {useStore} from "vuex";
import {FoodApiService} from "../services/food-api.service.js";
import {UserApiService} from "../services/users.service.js";

export default {
  name: "menu-card-fav",
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
    deleteFavorite(id){
      if(this.userId){
        this.userService.deleteFavorite(this.userId, id).then((response)=>{

          this.notifySuccessfulAction('Menu removed from favorite');
        }).catch((error)=>{
          this.notifyErrorAction('Error removing menu from favorite');
        });

      }else{
        this.notifyErrorAction('You must be logged in to delete to favorite');
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
      <pv-button label="Add to cart" class="w-full p-button-text text-white buy" icon="pi pi-cart-arrow-down" ></pv-button>
      <div class="flex gap-4 mt-1">
        <pv-button label="View" class="p-button-text text-white view" @click="viewMenu" icon="pi pi-eye" ></pv-button>
        <pv-button label="Favorite" class="p-button-text text-white favorite" @click="deleteFavorite(menu._id)" icon="pi pi-trash" ></pv-button>
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