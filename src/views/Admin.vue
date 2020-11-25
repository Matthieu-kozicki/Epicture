<template>
  <div id="center" v-if="!connected">
    <h2>Admin code</h2>
    <InputText type="password" v-model="value" />
    <div id="validate">
      <Button v-on:click="submit" label="Secondary" class="p-button-secondary">Validation</Button>
    </div>
  </div>

  <div v-else>
    <h1>Admin pannel</h1>


    <table class="table">
      <thead>
        <tr>
          <th scope="col">User</th>
          <th scope="col">Service</th>
          <th scope="col">Widget</th>
          <th scope="col">Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
        </tr>
        <tr>
          <th scope="row">3</th>
          <td>Larry</td>
          <td>the Bird</td>
          <td>@twitter</td>
        </tr>
      </tbody>
    </table>


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
      if (this.value === "aze123") {
        this.connected = true;
      }
    }
  },
}
</script>

<style scoped>
@import './../../css/bootstrap.min.css';
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
#validate {
  margin-top: 1em;
}
</style>