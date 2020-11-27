<template>
  <div class="border border-dark" id="background" v-if="!initialized">
    <div id="mymid">
      <div>
        <h5>Enter a city</h5>
        <InputText placeholder="Enter a valid spotify artist ID" type="text" v-model="artistIdParam" />
        <h5> Time to refresh </h5>
        <InputText placeholder="Timer" type="number" v-model="timerParam" />
      </div>
      <div>
        <Button id="myright" v-on:click="saveConfig" label="Configure" class="p-button-secondary">Configure</Button>
        <Button v-on:click="deleteWidget" label="Delete widget" class="p-button-secondary">Delete widget</Button>
      </div>
    </div>
  </div>
  <div class="border border-dark" id="background" v-else>
    <div v-if="!requestLoading">
      <h2>AGA AGA</h2>
    </div>
    <div v-else>
      <h3>Request loading...</h3>
    </div>
    <div id="mybutton">
      <Button id="settings" v-on:click="editConfig" label="Secondary" class="p-button-secondary">Settings</Button>
      <Button label="Secondary" class="p-button-secondary" @click="doRequest">Force Refresh</Button>
    </div>
  </div>
</template>

<script>
import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'
import { db } from '../../main'

export const weatherCityName = "weathercity";

export function weatherAddCityWidget() {
  const usr = JSON.parse(window.localStorage.getItem("currentUser"));
  db.collection("users").doc(usr.uid).collection("widgets").doc().set({
    city: "",
    refresh: 60,
    type: weatherCityName
  }).then(
      () => {
    console.log("[WEATHER SERVICE] ADDED WIDGET CITY");
    }
  )
}

export default {
  name: "weather-city",
  props: {
    userId: String,
    widgetId: String,
    cityProp: String,
    timerParamProp: Number,
  },
  data() {
    return {
      weatherRequest: {},
      requestLoading: true,
      cityParam: "",
      timerParam: 0,
      initialized: false,
      hasService: false,
      interval: 0,
    };
  },
  async mounted() {

    // Savoir si l'utilisateur possède le service
    let doc = db.collection("users").doc(this.$props.userId).collection("services").doc("weather");
    let mdoc =  await doc.get();
    if (mdoc.exists) {
      this.$data.hasService = true;
    } else {
      this.$data.hasService = false;
    }

    // Récupérer les props et le passer aux state
    this.cityParam = this.cityProp;
    this.timerParam = parseInt(this.timerParamProp);

    // Lancer la requète si le widget est init
    if (this.cityParam === undefined || this.cityParam === "undefined" || this.hasService === false || this.cityParam === "") {
      this.initialized = false;
      return;
    } else {
      this.doRequest();
      this.interval = setInterval(() => this.doRequest(), this.timerParam * 1000);
      console.log("Created interval : ", this.interval)
      this.initialized = true;
    }
  },
  methods: {
    async doRequest() {
      this.requestLoading = true;
      var myHeaders = new Headers();
     // myHeaders.append("Authorization", `Bearer ${this.spotifyKeys.access_token}`);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      }

      // let rep = await (await fetch(`https://api.spotify.com/v1/artists/${this.artistIdParam}`, requestOptions)).json();
      // this.requestLoading = false;
      // console.log(rep);
      // this.spotifyRequest = rep;
    },
    saveConfig() {
      this.updateFirebase();
      this.interval = setInterval(() => this.doRequest(), this.timerParam * 1000);
      this.requestLoading = true;
      this.initialized = true;
    },
    editConfig() {
      clearInterval(this.interval);
      this.initialized = false;
    },
    async updateFirebase() {
      let widgetRef = db.collection("users").doc(this.userId).collection("widgets").doc(this.widgetId);

      widgetRef.update({
        artistId: this.artistIdParam,
        refresh: this.timerParam
      })
    },
    deleteWidget() {
      db.collection("users").doc(this.userId).collection("widgets").doc(this.widgetId).delete();
      clearInterval(this.interval);
      console.log("Widget deleted !");
    }
  },
  beforeUnmount() {
    console.log("Cleared intervall :", this.interval);
    clearInterval(this.interval);
  }
}
</script>

<style scoped>
@import './../../../css/bootstrap.min.css';
#background {
  margin-left: 20px;
  background-color: rgb(245, 245, 245);
  width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
  margin :10px;
}
#inputs {
  width: 40%;overflow: scroll;
  height: 80px;
  margin: 5px;
}
#myright{
  margin-right: 3px;
}
#mycolor{
  color: green;
}
#mycolorscroll{
  height: 18px;
  color: green;
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;
}
#mycolorscroll::-webkit-scrollbar { /* WebKit */
    width: 0;
    height: 0;
}
#myimage{
  width: 350px;
  height: 350px;
}
#myscroll{
  overflow-y: scroll;
}
#mybutton {
  margin-top: 2px;
  margin-bottom: 2px;
  margin-left: 1px;
}
#settings{
  margin-right: 3px;
}
#mymid{
  margin: auto;
  justify-content: center;
  align-items: center;
}
</style>