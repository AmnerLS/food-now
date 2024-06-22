<script>
import {OrderApiService} from "../services/order-api.service.js";
import {useStore} from "vuex";

export default {
  name: "order-history",
  data() {
    return {
      orders: [],
      orderService: null,
      store: null,
      userId: '',
      expandedRows: {}
    };
  },
  methods: {
    onRowExpand(event) {
      this.$toast.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
    },
    onRowCollapse(event)  {
      this.$toast.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
    },
    collapseAll(){
      this.expandedRows = [];
    },
    expandAll(){
      this.expandedRows = this.orders.menus;
    },
    getOrders() {
      this.orderService.getByUserId(this.userId).then((response) => {
        console.log(response);
        this.orders = response.data.map((order, index) => {
          order.name = `Order ${index + 1}`;
          return order;
        });
        console.log(this.orders);
      });
    }
  },
  created() {
    this.store = useStore();
    this.orderService = new OrderApiService();
    this.userId = this.store.state.userId.toString();
    this.getOrders();
  },

}
</script>

<template>
  <pv-data-table v-model:expandedRows="expandedRows" :value="orders" dataKey="id"
             @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" tableStyle="min-width: 60rem">
    <template #header>
      <div class="flex flex-wrap justify-end gap-2">
        <pv-button text icon="pi pi-plus" label="Expand All" @click="expandAll" />
        <pv-button text icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
      </div>
    </template>
    <pv-column expander style="width: 5rem" />
    <pv-column field="name" header="Name"></pv-column>
    <pv-column field="date" header="Date" sortable></pv-column>
    <pv-column field="price" header="Total">
      <template #body="slotProps"> S/
        {{ slotProps.data.total }}
      </template>
    </pv-column>
    <template #expansion="slotProps">
      <div class="p-4">
        <h5>Menus for {{ slotProps.data.name }}</h5>
        <pv-data-table :value="slotProps.data.menus">
          <pv-column field="name" header="Menu name" sortable></pv-column>
          <pv-column field="price" header="Price" sortable>
            <template #body="slotProps">
              S/ {{ slotProps.data.price }}
            </template>
          </pv-column>
          <pv-column field="quantity" header="Quantity" sortable></pv-column>
        </pv-data-table>
      </div>
    </template>
  </pv-data-table>
</template>

<style scoped>

</style>