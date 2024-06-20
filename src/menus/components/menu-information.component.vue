<script>
import {MenuApiService} from "../services/menu-api.service.js";
import {FoodApiService} from "../services/food-api.service.js";
import {Comment} from "../model/comment.entity.js";

export default {
  name: "menu-information",
  data() {
    return {
      menuId: this.$route.params.id,
      menu: Object,
      foods: [],
      comments: [],
      comment: Comment,
      rating: 0,
      menuService: null,
      foodService: null,
      isAddingComment: false,
      newComment: ''
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
        console.log(this.foods);
      });
    },
    addComment() {
      // Aquí puedes agregar el código para añadir el comentario
      // Por ejemplo, podrías hacer algo como esto:
      this.comment = Comment.fromDisplayableComment(this.comment);
      console.log(this.comment);
      this.menuService.addComment(this.menu._id, this.comment).then((response)=>{
        this.comment = Comment.toDisplayableComment(response.data);
        this.comments.push(this.comment);
      });
      this.isAddingComment = false;
      this.newComment = '';
    },
    promScore() {
      let sum = 0;
      this.menu.scores.forEach((score)=>{
        sum += score;
      });
      this.rating = sum / this.menu.scores.length;
    }
  },
  created() {
    this.menuService = new MenuApiService();
    this.foodService = new FoodApiService();
    this.getMenu();

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
          <span v-for="n in 5" :key="n" class="star">
          <i class="pi" :class="n <= rating ? 'pi-star-fill' : 'pi-star'"></i>
          </span>
      </div>
      <h3>S/ {{ menu.price }}</h3>
      <pv-button label="Buy" class="p-button-text text-white" icon="pi pi-shopping-cart"></pv-button>
      <pv-button class="p-button-text text-white" icon="pi pi-heart"></pv-button>
    </pv-splitter-panel>
  </pv-splitter>
  <div>
    <h3>Add Score</h3>

  </div>
  <div>
    <h3>Comments</h3>
    <div>
      <pv-button label="Add Comment" class="p-button-text text-white" icon="pi pi-comment" v-if="!isAddingComment" @click="isAddingComment = true"></pv-button>
      <div v-if="isAddingComment" >
        <pv-input-text v-model="comment.content" placeholder="Enter your comment" class="input-text-large"></pv-input-text>
        <pv-button label="Submit Comment" @click="addComment" class="button-below"></pv-button>
      </div>
    </div>
    <div v-for="comment in comments">
      <div>
        <h4>{{comment.author}}</h4>
        <p>{{comment.content}}</p>
      </div>
    </div>
  </div>

</template>

<style scoped>
.star-rating {
  display: flex;
  align-items: center;
}
.star {
  font-size: 24px;
  color: black;

  margin-right: 5px;
}
.input-text-large {
  width: 600px;
  height: 100px;
}

.button-below {
  display: block;
}
</style>