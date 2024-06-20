<script>

export default {
  name: 'app',
  data() {
    return {
      drawer: false,
      items: [
        { label: 'Home', to: '/foods'},
        { label: 'Menus', to: '/menus' },
        { label: 'About', to: '/menumanagement'}
      ]
    }
  },
  methods: {

  },
  created() {

  }
}
</script>

<template>
  <pv-toast/>
  <header>
    <pv-toolbar class="fixed-toolbar pv-toolbar bg-primary" fixed>
      <template #start>
        <h2>FoodNow</h2>
      </template>
      <template #center>
        <div class="flex-column">
          <router-link v-for="item in items" :key="item.label" v-slot="{navigate, href}" :to="item.to" custom>
            <pv-button :href="href" class="p-button-text text-white" @click="navigate">{{item.label}}</pv-button>
          </router-link>
        </div>
      </template>
      <template #end>
        <pv-button class="p-button-text text-white" icon="pi pi-heart" ></pv-button>
        <pv-button class="p-button-text text-white" icon="pi pi-shopping-cart" ></pv-button>
      </template>
    </pv-toolbar>
  </header>

  <div class="router">
    <router-view/>
  </div>

</template>

<style scoped>
.fixed-toolbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.pv-toolbar {
  display: flex;
  justify-content: space-between;
}

.router {
  margin-top: 100px; /* Ajusta este valor según la altura de tu toolbar */
}
</style>
