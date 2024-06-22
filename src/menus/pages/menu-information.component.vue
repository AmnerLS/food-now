<script>
import {MenuApiService} from "../services/menu-api.service.js";
import {FoodApiService} from "../services/food-api.service.js";
import {Comment} from "../model/comment.entity.js";
import {useStore} from "vuex";
import {UserApiService} from "../services/users.service.js";

export default {
  name: "menu-information",
  data() {
    return {
      menuId: this.$route.params.id,
      menu: Object,
      foods: [],
      comments: [],
      comment: Comment,
      userName: '',
      rating: 0,
      newRating: 0,
      menuService: null,
      foodService: null,
      userService: null,
      isAddingComment: false,
      newComment: '',
      store: null,
      userId: null
    };
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler(newVal, oldVal) {
        console.log('selectedSowingId changed from', oldVal, 'to', newVal);
        this.menuId = newVal;
      }
    }
  },
  methods: {
    notifySuccessfulAction(message) {
      this.$toast.add({severity: "success", summary: "Success", detail: message, life: 3000,});
    },
    notifyErrorAction(message) {
      this.$toast.add({severity: "danger", summary: "Error", detail: message, life: 3000,});
    },
    getFoods(foods) {
      foods.forEach((food) => {
        this.foodService.getById(food).then(response => {
          this.foods.push(response.data);
        });
      })
    },
    getMenu() {
      console.log(this.menuId);
      this.menuService.getById(this.menuId).then(response => {
        this.menu = response.data;
        this.comments = this.menu.comments.map((comment) => Comment.toDisplayableComment(comment));
        this.getFoods(this.menu.foods);
        this.promScore();
        console.log(this.comments);
      });
    },
    getUser(){
      this.userService.getById(this.userId).then((response)=>{
        this.userName = response.data.name;
        console.log(this.userName);
      });
    },
    addComment() {
      if(this.userId){
        console.log(this.newComment);
        this.comment = Comment.fromDisplayableComment(this.userName,this.newComment);
        this.menuService.addComment(this.menu._id, this.comment).then((response)=>{
          this.comment = Comment.toDisplayableComment(response.data);
          console.log(this.comment);
          this.comments.push(this.comment);
        });
        this.isAddingComment = false;
        this.newComment = '';
        this.notifySuccessfulAction('Comment added successfully');
      }else{
        this.notifyErrorAction('You must be logged in to comment');
      }
    },
    addFavorite(){
      if(this.userId){
        this.userService.addFavorite(this.userId, this.menu._id).then((response)=>{
          console.log(response);
          this.notifySuccessfulAction('Menu added to favorite successfully');
        });
      }else{
        this.notifyErrorAction('You must be logged in to add to favorite');
      }
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
    promScore() {
      let sum = 0;
      this.menu.scores.forEach((s)=>{
        sum += s.score;
      });
      this.rating = sum / this.menu.scores.length;
    },
    addScore(){
      if(this.userId){
        const scoreResource = {
          score: this.newRating
        }
        this.menuService.addRating(this.menu._id, scoreResource).then((response)=>{
          this.menu = response.data;
          this.promScore();
          this.notifySuccessfulAction('Score added successfully');
        });
      }else{
        this.notifyErrorAction('You must be logged in to score');
      }
    }
  },
  created() {
    this.store = useStore();
    this.menuService = new MenuApiService();
    this.foodService = new FoodApiService();
    this.userService = new UserApiService();
    this.userId = this.store.state.userId;
    this.getMenu();
    this.getUser();
  }
}
</script>

<template>

  <pv-splitter style="height: 550px; " class="mb-12">
    <pv-splitter-panel class="flex items-center justify-center">
      <pv-carousel :value="foods" :numVisible="1" :numScroll="1" orientation="vertical" verticalViewPortHeight="350px"
                   containerClass="flex items-center">
        <template #item="slotProps">
          <div class="border border-surface-200 dark:border-surface-700 rounded m-2  p-4">
            <div class="mb-4">
              <div class="mb-4 font-medium">{{ slotProps.data.name }}</div>
              <div class="relative mx-auto">
                <img :src=" slotProps.data.image" :alt="slotProps.data.name" class="w-full rounded"
                     style="width: auto; height: 200px;"/>
              </div>
            </div>
          </div>
        </template>
      </pv-carousel>
    </pv-splitter-panel>
    <pv-splitter-panel class="justify-content-center">
      <h2>{{ menu.name }}</h2>
      <div class="star-rating justify-content-center">
        <pv-rating v-model="rating" readonly :cancel="false"/>
      </div>
      <h3>S/ {{ menu.price }}</h3>
      <pv-button label="Add to cart" class="p-button-text text-white" icon="pi pi-shopping-cart" @click="buyMenu"></pv-button>
      <pv-button class="p-button-text text-white" icon="pi pi-heart" @click="addFavorite"></pv-button>
    </pv-splitter-panel>
  </pv-splitter>
  <div>
    <h3>Add Score</h3>
    <pv-rating v-model="newRating" @click="addScore"/>
  </div>
  <div>
    <h3>Comments</h3>
    <div>
      <pv-button label="Add Comment" class="p-button-text text-white" icon="pi pi-comment" v-if="!isAddingComment" @click="isAddingComment = true"></pv-button>
      <div v-if="isAddingComment" >
        <pv-input-text v-model="newComment" placeholder="Enter your comment" class="input-text-large"></pv-input-text>
        <pv-button label="Submit Comment" @click="addComment" class="button-below"></pv-button>
      </div>
    </div>
    <div v-for="comment in comments">
      <pv-panel :header="comment.username">
        <p class="m-0"> {{comment.comment}} </p>
      </pv-panel>
    </div>
  </div>

</template>

<style scoped>
.star-rating {
  display: flex;
  align-items: center;
}
.input-text-large {
  width: 600px;
  height: 100px;
}

.button-below {
  display: block;
}
</style>