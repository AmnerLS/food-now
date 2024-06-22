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
      return {
        itemsInstitution: [
          { label: 'Menu Sales', to: '/menus' },
          { label: 'Food Management', to: '/foods' },
          { label: 'Menu Management', to: '/menumanagement' },
        ],
        itemsNonInstitution: [
          { label: 'Menu', to: '/menus' },
        ],
      }
    });

    function signOut() {
      store.commit('setAuthenticated', false);
      store.commit('setInstitution', false);
      // Establece 'institution' en el almacenamiento local a 'false'
      localStorage.setItem('institution', JSON.stringify(false));
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
          <router-link v-for="item in (store.state.isInstitution ? items.itemsInstitution : items.itemsNonInstitution)" :key="item.label" v-slot="{navigate, href}" :to="item.to" custom>
            <pv-button :href="href" class="p-button-text text-white" @click="navigate">{{ item.label }}</pv-button>
          </router-link>
        </div>
      </template>
      <template #end>
        <pv-button v-if="!store.state.isInstitution" class="p-button-text text-white" @click="() => router.push('/orders/history')">My Orders</pv-button>
        <pv-button v-if="!store.state.isInstitution" class="p-button-text text-white" icon="pi pi-heart" @click="() => router.push('/menus/favorites')"></pv-button>
        <pv-button v-if="!store.state.isInstitution" class="p-button-text text-white" icon="pi pi-shopping-cart" @click="() => router.push('/orders')"></pv-button>
        <pv-button v-if="!store.state.isAuthenticated" class="p-button-text text-white" @click="() => router.push('/signin')">Sign In</pv-button>
        <pv-button v-if="!store.state.isAuthenticated" class="p-button-text text-white" @click="() => router.push('/signup')">Sign Up</pv-button>
        <pv-button v-if="store.state.isAuthenticated" class="p-button-text text-white" @click="signOut">Sign Out</pv-button>

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