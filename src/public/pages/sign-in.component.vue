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
    ...mapMutations(['setAuthenticated', 'setInstitution', 'setUserId']),
    async signIn() {
      try {
        const response = await axios.post('http://localhost:3000/signin', {
          name: this.name,
          password: this.password,
        });

        if (response) {
          console.log(response.data);
          this.setAuthenticated(true);

          // Retrieve the value of 'institution' from local storage
          const institutionItem = response.data.institution;
          const userId = response.data.id;
          console.log('User ID:', userId);
          // Check if 'institutionItem' is not null before parsing it as JSON
          const institution = institutionItem ? JSON.parse(institutionItem) : false;

          this.setInstitution(institution);
          this.setUserId(userId);
          console.log('Institution:', institution);
          this.$router.push('/menus');
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