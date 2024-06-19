<script>
import {Food} from "../model/food.entity.js";
import {Menu} from "../model/menu.entity.js";
import {FilterMatchMode} from "primevue/api";
import {MenuApiService} from "../services/menu-api.service.js";
import MenuCreateAndEditDialog from "../components/menu-create-and-edit-dialog.component.vue";
import FoodCreateAndEditDialog from "../components/food-create-and-edit-dialog.component.vue";
import {FoodApiService} from "../services/food-api.service.js";

export default {
  name: "menu-management",
  components: {FoodCreateAndEditDialog, MenuCreateAndEditDialog},
  data(){
    return{
      menus:[],
      foods:[],
      dessertDrinks:[],
      appetizers:[],
      mainDish:[],
      menu: Menu,
      selectedMenus: [],
      filters:{},
      menuService: null,
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
      return this.menus.findIndex((menu) => menu.id === id);
    },


    //#region Data Manager Event Handlers

    onNewItemEventHandler() {
      this.menu = {};
      this.submitted = false;
      this.isEdit = false;
      this.createAndEditDialogIsVisible = true;
    },

    onEditItemEventHandler(item) {
      this.menu = item;
      this.submitted = false;
      this.isEdit = true;
      this.createAndEditDialogIsVisible = true;
    },

    onDeleteItemEventHandler(item) {
      this.menu = item;
      this.deleteMenu();
    },

    onDeleteSelectedItemsEventHandler(selectedItems) {
      this.selectedMenus = selectedItems;
      this.deleteSelectedMenus();
    },

    //#endregion Data Manager Event Handlers

    //#region menu Item Create and Edit Dialog Event Handlers

    onCanceledEventHandler() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },

    onSavedEventHandler(item) {
      this.submitted = true;
      if (this.menu.name.trim()) {
        if (item.id) {
          this.updateMenu();
        } else {
          this.createMenu();
        }
      }
      this.createAndEditDialogIsVisible = false;
      this.isEdit = false;
    },

    //#endregion Data Manager Event Handlers

    //#region Data Actions

    // Create a new item

    createMenu() {
      this.menu = Menu.fromDisplayableMenu(this.menu);
      this.menuService.create(this.menu)
          .then((response) => {
            this.menu = Menu.toDisplayableMenu(response.data);
            this.menus.push(this.menu);
            this.notifySuccessfulAction("Menu Created");
          });
    },

    // Update an existing item

    updateMenu() {
      this.menu = Menu.fromDisplayableMenu(this.menu);
      this.menuService
          .update(this.menu.id, this.menu)
          .then((response) => {
            this.menus[this.findIndexById(response.data.id)] =
                Menu.toDisplayableMenu(response.data);
            this.notifySuccessfulAction("Menu Updated");
          });
    },

    // Delete a item

    deleteMenu() {
      this.menuService.delete(this.menu.id)
          .then(() => {
            this.menus = this.menus.filter((f) => f.id !== this.menu.id);
            this.menu = {};
            this.notifySuccessfulAction("Menu Deleted");
          });
    },

    // Delete selected menus

    deleteSelectedMenus() {
      this.selectedMenus.forEach((menu) => {
        this.menuService.delete(menu.id).then(() => {
          this.menus = this.menus.filter((t) => t.id !== this.menu.id);
        });
      });
      this.notifySuccessfulAction("Menus Deleted");
    },

    //#endregion Data Actions
    getAllFoods(){
      this.foodService.getAll().then((response)=>{
        let foods = response.data;
        this.foods = foods.map((food) => Food.toDisplayableFood(food));
        this.foodService.getAll().then((response)=>{
          let foods = response.data;
          this.foods = foods.map((food) => Food.toDisplayableFood(food));
          this.appetizers = foods.filter(food => food.category === 'Appetizer').map((food) => ({label: food.name, value: food._id}));
          this.dessertDrinks = foods.filter(food => food.category === 'Dessert' || food.category === 'Drink').map((food) => ({label: food.name, value: food._id}));
          this.mainDish = foods.filter(food => food.category === 'Main dish').map((food) => ({label: food.name, value: food._id}));
          console.log(this.appetizers);
          console.log(this.dessertDrinks);
          console.log(this.mainDish);
        });
      });

    }
  },
  created() {
    this.menuService = new MenuApiService();
    this.foodService = new FoodApiService();

    this.menuService.getAll().then((response)=>{
      let menus = response.data;
      this.menus = menus.map((menu) => Menu.toDisplayableMenu(menu));
    });

    this.getAllFoods();
    this.initFilters();
  }
}
</script>

<template>
  <div>
    <pv-data-table
        ref="dt"
        :value="menus"
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
          <pv-button label="Add Menu" icon="pi pi-plus" severity="success" class="mr-2" @click="onNewItemEventHandler"/>
        </div>
      </template>
      <pv-column field="name" header="Menu" style="min-width:15rem"></pv-column>
      <pv-column field="image" header="Image" style="min-width:20rem">
        <template #body="slotProps">
          <img :src="slotProps.data.image" alt="Food Image" v-if="slotProps.data.image" class="food-image"/>
        </template>
      </pv-column>
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

  <menu-create-and-edit-dialog
      :entity="menu"
      :appetizers="appetizers"
      :dessertDrinks="dessertDrinks"
      :mainDish="mainDish"
      entityName="Food"
      :edit="isEdit"
      :visible="createAndEditDialogIsVisible"
      v-on:canceled="onCanceledEventHandler"
      v-on:saved="onSavedEventHandler($event)"
  />
</template>

<style scoped>
.food-image {
  width: 40px;
  height: auto;
}
</style>