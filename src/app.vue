<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import {useRouter} from 'vue-router';

export default {
  name: 'app',
  setup() {
    const store = useStore();
    const router = useRouter();

    const items = computed(() => {
      if (store.state.institution) {
        return [
          {label: 'Home', to: '/foods'},
          {label: 'About', to: '/menumanagement'},
          {label: 'Sign Out', action: signOut}
        ];
      } else {
        return [
          {label: 'Sign In', to: '/signin'},
          {label: 'Sign Up', to: '/signup'}
        ];
      }
    });

    function signOut() {
      store.commit('setAuthenticated', false);
      store.commit('setInstitution', false);
      router.push({path: '/signin'});
    }

    return {
      items,
      signOut,
      store,
      router
    }
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
            <pv-button v-if="!store.state.isAuthenticated || item.label !== 'Sign In' && item.label !== 'Sign Up'"
                       :href="href" class="p-button-text text-white" @click="navigate">{{ item.label }}
            </pv-button>
          </router-link>
          <!-- Agrega los botones de Home y About aquí -->
          <pv-button v-if="store.state.isAuthenticated" class="p-button-text text-white" @click="router.push('/foods')">Home</pv-button>
          <pv-button v-if="store.state.isAuthenticated" class="p-button-text text-white" @click="router.push('/menumanagement')">About</pv-button>
          <pv-button v-if="store.state.isAuthenticated" class="p-button-text text-white" @click="router.push('/menus')">Menus</pv-button>

        </div>
      </template>
      <template #end>
        <pv-button class="p-button-text text-white" icon="pi pi-heart" ></pv-button>
        <pv-button v-if="store.state.isAuthenticated" class="p-button-text text-white" @click="signOut">Sign Out
        </pv-button>
        <pv-button v-else class="p-button-text text-white" icon="pi pi-shopping-cart"></pv-button>
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