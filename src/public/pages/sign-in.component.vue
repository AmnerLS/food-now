<template>
  <div>
    <h2>Sign In</h2>
    <form @submit.prevent="signIn">
      <input type="text" v-model="name" placeholder="Name" required>
      <input type="password" v-model="password" placeholder="Password" required>
      <button type="submit">Sign In</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import {mapMutations} from 'vuex';


export default {
  data() {
    return {
      name: '',
      password: '',
    }
  },
  methods: {
    ...mapMutations(['setAuthenticated', 'setInstitution']),
    async signIn() {
      try {
        const response = await axios.post('http://localhost:3000/signin', {
          name: this.name,
          password: this.password,
        });

        if (response) {
          console.log(response.data);
          this.setAuthenticated(true);
          this.setInstitution(response.data.institution); // Suponiendo que la respuesta contiene el valor de 'institution'

          if (this.$store.state.institution) {
            this.$router.replace({ path: '/menus' }); // Redirige a '/menus' si 'institution' es true
          } else {
            this.$router.replace({ path: '/foods' }); // Redirige a '/foods' si 'institution' es false
          }
        } else {
          console.error('No response from the server');
        }

      }
      catch (error) {
        console.error(error.response ? error.response.data : error);
        if (error.response && error.response.data.message === 'Invalid password') {
          this.errorMessage = 'La contraseña ingresada es incorrecta';
        } else {
          this.errorMessage = error.response ? error.response.data.message : 'Error during sign in';
        }
      }
    }
  }
}
</script>