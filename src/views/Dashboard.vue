<template>
  <h1>Dashboard</h1>
  <button v-on:click="disconnect">
    Disconnect
  </button>
</template>

<script>
import { firebase } from '@firebase/app'

import '@firebase/auth'
export default {
  methods: {
    disconnect: function() {
      console.log("Disconnected !")
      firebase.auth().signOut()
      this.$router.replace({name: "Login"})
    }
  }
}
</script>

<style>

</style>