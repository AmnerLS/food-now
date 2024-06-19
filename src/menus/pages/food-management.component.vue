<script>
import {FoodApiService} from "../services/food-api.service.js";
import {FilterMatchMode} from "primevue/api";
import {Food} from "../model/food.entity.js";
import FoodCreateAndEditDialog from "../components/food-create-and-edit-dialog.component.vue";

export default {
  name: "food-management",
  components: {FoodCreateAndEditDialog},
  data(){
    return {
      foods:[],
      food: Food,
      selectedFoods: [],
      filters:{},
      foodService: null,
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false
    }
  },
  methods:{
    notifySuccessfulAction(message) {
      this.$toast.add({severity: "success", summary: "Success", detail: message, life: 3000,});
    },

    initFilters() {
      this.filters = {global: {value: null, matchMode: FilterMatchMode.CONTAINS}};
    },
    findIndexById(id) {
      return this.foods.findIndex((food) => food.id === id);
    },


    //#region Data Manager Event Handlers

    onNewItemEventHandler() {
      this.food = {};
      this.submitted = false;
      this.isEdit = false;
      this.createAndEditDialogIsVisible = true;
    },

    onEditItemEventHandler(item) {
      this.food = item;
      this.submitted = false;
      this.isEdit = true;
      this.createAndEditDialogIsVisible = true;
    },

    onDeleteItemEventHandler(item) {
      this.food = item;
      this.deleteFood();
    },

    onDeleteSelectedItemsEventHandler(selectedItems) {
      this.selectedFoods = selectedItems;
      this.deleteSelectedFoods();
    },

    //#endregion Data Manager Event Handlers

    //#region Food Item Create and Edit Dialog Event Handlers

    onCanceledEventHandler() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },

    onSavedEventHandler(item) {
      this.submitted = true;
      if (this.food.name.trim()) {
        if (item.id) {
          this.updateFood();
        } else {
          this.createFood();
        }
      }
      this.createAndEditDialogIsVisible = false;
      this.isEdit = false;
    },

    //#endregion Data Manager Event Handlers

    //#region Data Actions

    // Create a new item

    createFood() {
      this.food = Food.fromDisplayableFood(this.food);
      this.foodService.create(this.food)
          .then((response) => {
            this.food = Food.toDisplayableFood(response.data);
            this.foods.push(this.food);
            this.notifySuccessfulAction("Food Created");
          });
    },

    // Update an existing item

    updateFood() {
      this.food = Food.fromDisplayableFood(this.food);
      this.foodService
          .update(this.food.id, this.food)
          .then((response) => {
            this.foods[this.findIndexById(response.data.id)] =
                Food.toDisplayableFood(response.data);
            this.notifySuccessfulAction("Food Updated");
          });
    },

    // Delete a item

    deleteFood() {
      this.foodService.delete(this.food.id)
          .then(() => {
            this.foods = this.foods.filter((f) => f.id !== this.food.id);
            this.food = {};
            this.notifySuccessfulAction("Food Deleted");
          });
    },

    // Delete selected foods

    deleteSelectedFoods() {
      this.selectedFoods.forEach((food) => {
        this.foodService.delete(food.id).then(() => {
          this.foods = this.foods.filter((t) => t.id !== this.food.id);
        });
      });
      this.notifySuccessfulAction("Foods Deleted");
    }

    //#endregion Data Actions

  },
  created() {
    this.foodService = new FoodApiService();

    this.foodService.getAll().then((response)=>{
      let foods = response.data;
      this.foods = foods.map((food) => Food.toDisplayableFood(food));
      console.log(this.foods);
    });
    this.initFilters();
  }
}
</script>

<template>
  <div>
    <pv-data-table
        ref="dt"
        :value="foods"
        dataKey="id" selectionMode="single"
        :paginator="true"
        :rows="5"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5,10,25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
      <template #header>
        <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
          <pv-icon-field iconPosition="left">
            <pv-input-icon>
              <i class="pi pi-search" />
            </pv-input-icon>
            <pv-input-text v-model="filters['global'].value" placeholder="Search..." />
          </pv-icon-field>
          <pv-button label="Add Food" icon="pi pi-plus" severity="success" class="mr-2" @click="onNewItemEventHandler"/>
        </div>
      </template>
      <pv-column field="name" header="Food" style="min-width:15rem"></pv-column>
      <pv-column field="image" header="Image" style="min-width:20rem">
        <template #body="slotProps">
          <img :src="slotProps.data.image" alt="Food Image" v-if="slotProps.data.image" class="food-image"/>
        </template>
      </pv-column>
      <pv-column field="category" header="Category" style="min-width:10rem"></pv-column>
      <pv-column field="price" header="Price" style="min-width:10rem"></pv-column>
      <pv-column field="quantity" header="Quantity" style="min-width:10rem"></pv-column>

      <pv-column header="Actions" :exportable="false" style="min-width:8rem">
        <template #body="slotProps">
          <pv-button icon="pi pi-pencil" outlined rounded class="mr-2" @click="onEditItemEventHandler(slotProps.data)" />
          <pv-button icon="pi pi-trash" outlined rounded severity="danger" @click="onDeleteItemEventHandler(slotProps.data)" />
        </template>
      </pv-column>
    </pv-data-table>
  </div>
  <food-create-and-edit-dialog
      :entity="food"
      entityName="Food"
      :edit="isEdit"
      :visible="createAndEditDialogIsVisible"
      v-on:canceled="onCanceledEventHandler"
      v-on:saved="onSavedEventHandler($event)"/>

</template>

<style scoped>
.food-image {
  width: 40px;
  height: auto;
}
</style>