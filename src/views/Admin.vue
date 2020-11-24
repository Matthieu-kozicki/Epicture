<template>
  <div id="center" v-if="!connected">
    <h2>Admin code</h2>
    <InputText type="password" v-model="value" />
    <Button v-on:click="submit" label="Secondary" class="p-button-secondary">Validation</Button>
  </div>

  <div v-else>
    <h1>Admin pannel</h1>
  </div>
</template>

<script>
import { firebase } from '@firebase/app'
import * as firebaseui from "firebaseui"
import "firebaseui/dist/firebaseui.css";
import '@firebase/auth'
import '@firebase/firestore'
import { db } from '../main'

export default {
  data () {
    return {
      value: "",
      connected: false,
      error: ''
    }
  },
  methods: {
    submit() {
      console.log("here");
      if (this.value === "AZER") {
        this.connected = true;
      }
    }
  }
}
</script>

<style scoped>
#center {
  position: fixed;
  background-color:rgba(180, 180, 180, 0.561);
  border: 10px;
  border-bottom: 10px;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding-bottom: 20px;
  padding-top: 20px;
  padding-right: 20px;
  padding-left: 20px;
}
</style>