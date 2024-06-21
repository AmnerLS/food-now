<template>
  <div>
    <h2>Sign Up</h2>
    <form @submit.prevent="signUp">
      <input type="text" v-model="name" placeholder="Name" required>
      <input type="email" v-model="email" placeholder="Email" required>
      <input type="password" v-model="password" placeholder="Password" required>
      <input type="checkbox" v-model="institution" id="institution">
      <label for="institution">Institution</label>
      <button type="submit">Sign Up</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import router from "../../router/index.js";

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      institution: false
    }
  },
  methods: {
    signUp() {
      const userData = {
        name: this.name,
        email: this.email,
        password: this.password,
        institution: this.institution
      };

      console.log(userData); // Log userData

      axios.post('http://localhost:3000/signup', userData)
          .then(response => {
            console.log(response.data);
            // Guarda el valor de 'institution' en el almacenamiento local
            localStorage.setItem('institution', JSON.stringify(this.institution));
            router.push('/signin');
          })
          .catch(error => {
            console.error(error.response.data);
          });
    }
  }
}
</script>