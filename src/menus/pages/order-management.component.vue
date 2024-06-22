<script>

import {OrderApiService} from "../services/order-api.service.js";
import {useStore} from "vuex";
import {MenuApiService} from "../services/menu-api.service.js";

export default {
  name: "order-management",
  data() {
    return {
      orders: [],
      menusIds: [],
      orderService: null,
      menuService: null,
      store: null,
      totalPrice: 1,
      userId: ''
    };
  },
  methods: {
    notifySuccessfulAction(message) {
      this.$toast.add({severity: "success", summary: "Success", detail: message, life: 2000,});
    },
    notifyErrorAction(message) {
      this.$toast.add({severity: "danger", summary: "Error", detail: message, life: 2000,});
    },
    increaseQuantity(item) {
      item.quantity++;
      this.getTotalPrice();
    },
    decreaseQuantity(item) {
      item.quantity--;
      if (item.quantity <= 1)
        item.quantity = 1;
      this.getTotalPrice();
    },
    getTotalPrice() {
      this.totalPrice = this.orders.reduce((acc, item) => acc + item.price * item.quantity, 0);
    },
    removeItem(item) {
      // Remove the item from the orders array
      this.orders = this.orders.filter(order => order !== item);

      // Remove the item's ID from the menusIds array
      this.menusIds = this.menusIds.filter(id => id !== item._id);

      // Update the local storage
      localStorage.setItem('savedMenus', JSON.stringify(this.menusIds));

      // Recalculate the total price
      this.getTotalPrice();
    },
    getAllMenus(){
      this.menuService.getAll().then((response)=>{
        this.orders = response.data.filter(menu => this.menusIds.includes(menu._id)).map(menu => {
          menu.quantity = 1;
          return menu;
        })
        this.getTotalPrice();
      }).catch((error)=>{
        console.error(error);
      });
    },
    completeOrders(){
      if (this.orders.length === 0) {
        this.notifyErrorAction('You must add at least one item to the order');
        return;
      }
      const reducedOrders = this.orders.map(order => ({
        name: order.name,
        price: order.price,
        quantity: order.quantity
      }));
      const orderResource = {
        client_id: this.userId.toString(),
        menus: reducedOrders,
        date: new Date(),
        status: 'completed',
        total: this.totalPrice

      };
      console.log(orderResource);
      this.orderService.buy(orderResource).then((response)=>{
        console.log(response);
        this.orders = [];
        this.menusIds = [];
        localStorage.setItem('savedMenus', JSON.stringify(this.menusIds));
        this.getTotalPrice();
        this.notifySuccessfulAction('Order completed successfully');
      }).catch((error)=>{
        console.error(error);
      });
    }
  },
  created() {
    this.orderService = new OrderApiService();
    this.menuService = new MenuApiService();
    this.store = useStore();
    // Recuperar los menús guardados del almacenamiento local
    let savedMenus = JSON.parse(localStorage.getItem('savedMenus')) || [];

    this.userId = this.store.state.userId;
    // Almacenar la lista de objetos de menú en orders
    this.menusIds = savedMenus;
    console.log(this.menusIds);
    this.getAllMenus();
    this.getTotalPrice();
  }
}
</script>

<template>
  <div class="container">
    <div class="side-70">
      <pv-dataview :value="orders" paginator :rows="5">
        <template #list="slotProps">
          <div class=" flex-col">
            <div v-for="(item, index) in slotProps.items" :key="item._id" class="w-full">
              <div class="flex flex-col items-center p-6 gap-4"
                   :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
                <div class="md:w-40 relative">
                  <img class="block xl:block mx-auto rounded w-full" :src="item.image" :alt="item.name"/>
                </div>
                <div class="flex flex-col items-center flex-1 gap-6">
                  <div class="flex flex-col justify-between items-start gap-2">
                    <div>
                      <div class="text-lg font-medium mt-2">{{ item.name }}</div>
                    </div>
                  </div>
                  <div class="flex flex-col items-end gap-8">
                    <span class="text-xl font-semibold">S/{{ item.price }}</span>
                    <div class="flex flex-col gap-2">
                      <pv-button icon="pi pi-trash" class="flex-initial whitespace-nowrap"
                                 @click="removeItem(item)"></pv-button>
                      <pv-button icon="pi pi-minus" class="flex-initial whitespace-nowrap"
                                 @click="decreaseQuantity(item)"></pv-button>
                      <span class="flex-initial whitespace-nowrap">{{ item.quantity }}</span>
                      <pv-button icon="pi pi-plus" class="flex-initial whitespace-nowrap"
                                 @click="increaseQuantity(item)"></pv-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </pv-dataview>
    </div>
    <div class="side-30">
      <pv-card>
        <template #title>Total Price: S/{{ totalPrice }} </template>
        <template #footer>
          <div class="flex gap-4 mt-1">
            <pv-button label="Buy" class="w-full" @click="completeOrders"/>
          </div>
        </template>
      </pv-card>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
}

.side-70 {
  flex: 70;
}

.side-30 {
  flex: 30;
}

.pv-dataview .flex {
  flex-direction: column;
}
</style>
