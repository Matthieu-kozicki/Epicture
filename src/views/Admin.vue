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


    <table class="table table-striped" id="mytable">
      <thead>
        <tr>
          <th scope="col">User</th>
          <th scope="col">Imgur</th>
          <th scope="col">Spotify</th>
          <th scope="col">Steam</th>
          <th scope="col">Weather</th>
          <th scope="col">Currency</th>
          <th scope="col">Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in userList" :key="user.name">
          <AdminWidget :NameProp="user.name" :Imgurbool="user.imgurbool" :Steambool="user.steambool" :UserId="user.id"
          :Spotifybool="user.spotifybool" :Currencybool="user.currencybool" :Weatherbool="user.weatherbool"/>
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
import AdminWidget from "./AdminWidget.vue"
import '@firebase/firestore'
import { db } from '../main'

export default {
  data () {
    return {
      value: "",
      connected: false,
      error: '',
      userList:[]
    }
  },
  methods: {
    submit() {
      console.log("here");
      if (this.value === "aze123") {
        this.connected = true;
      }
    },
    getUsers() {
      db.collection("users").get().then(function(querySnapshot) {
        querySnapshot.forEach(async function(doc) {
          db.collection("users").doc(doc.id).collection("services");

          // Check du service imgur
          let imgurbool = false;
          let tmp = db.collection("users").doc(doc.id).collection("services").doc("imgur");
          let mdoc =  await tmp.get();
          if (mdoc.exists) {
            imgurbool = true;
          }

          // Check du service spotify
          let spotifybool = false;
          tmp = db.collection("users").doc(doc.id).collection("services").doc("spotify");
          mdoc =  await tmp.get();
          if (mdoc.exists) {
            spotifybool = true;
          }
          // Check du service currency
          let currencybool = false;
          tmp = db.collection("users").doc(doc.id).collection("services").doc("currency");
          mdoc =  await tmp.get();
          if (mdoc.exists) {
            currencybool = true;
          }
          // Check du service weather
          let weatherbool = false;
          tmp = db.collection("users").doc(doc.id).collection("services").doc("weather");
          mdoc =  await tmp.get();
          if (mdoc.exists) {
            weatherbool = true;
          }
          // Check du service steam
          let steambool = false;
          tmp = db.collection("users").doc(doc.id).collection("services").doc("steam");
          mdoc =  await tmp.get();
          if (mdoc.exists) {
            steambool = true;
          }
          this.userList.unshift( {
            ...doc.data(),
            imgurbool,
            spotifybool,
            currencybool,
            weatherbool,
            steambool,
            id: doc.id
          })

        }.bind(this))
      }.bind(this));
    },
  },
  mounted() {
    this.getUsers();
  },
  components: { AdminWidget}
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
#mytable {
  margin-top: 5em;
}
#validate {
  margin-top: 1em;
}
</style>