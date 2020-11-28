<template>
  <div class="border border-dark" id="background" v-if="!initialized">
    <div id="mymid">
      <div>
        <h5>Spotify artist ID</h5>
        <Dropdown v-model="typeParam" :options="type" optionLabel="name" placeholder="Select a type"/>
        <Dropdown v-model="delayParam" :options="delay" optionLabel="name" placeholder="Select a delay"/>
        <h5> Time to refresh </h5>
        <InputText placeholder="Timer" type="number" v-model="timerParam" />
      </div>
      <div>
        <Button id="myright" v-on:click="saveConfig" icon="pi pi-check" class="p-button-rounded p-button-success"/>
        <Button v-on:click="deleteWidget" icon="pi pi-trash" class="p-button-rounded p-button-success"/>
      </div>
    </div>
  </div>
  <div class="border border-dark" id="background" v-else>
    <div v-if="!requestLoading">
      <h2 id="mycolor">{{spotifyRequest.name}}</h2>
      <img alt="No pic for this artist :/" v-bind:src="spotifyRequest.images[2].url" />
      <h3>Followers: <span id="mycolor">{{spotifyRequest.followers.total}} </span></h3>
      <h4> Genres </h4>
      <h5 id="mycolorscroll">{{spotifyRequest.genres.join(' ')}}</h5>
      <h4>Popularity: <span id="mycolor">{{spotifyRequest.popularity}} </span></h4>
    </div>
    <div v-else>
      <h3>Request loading...</h3>
    </div>
    <div id="mybutton">
      <Button id="settings" v-on:click="editConfig" icon="pi pi-cog" class="p-button-rounded p-button-success"/>
      <Button icon="pi pi-refresh" class="p-button-rounded p-button-success" @click="doRequest"/>
    </div>
  </div>
</template>

<script>
import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'
import { db } from '../../main'

export const spotifyTopName = "spotifytop";

export function spotifyAddTopWidget() {
  const usr = JSON.parse(window.localStorage.getItem("currentUser"));
  db.collection("users").doc(usr.uid).collection("widgets").doc().set({
    typeParam: "",
    delayParam: "",
    refresh: 60,
    type: spotifyTopName
  }).then(
      () => {
    console.log("[SPOTIFY SERVICE] ADDED WIDGET TOP");
    }
  )
}

export default {
  name: "spotify-top",
  props: {
    userId: String,
    widgetId: String,
    typeProp: String,
    delayProp: String,
    timerParamProp: Number,
  },
  data() {
    return {
      spotifyKeys: {},
      spotifyRequest: {},
      requestLoading: true,
      typeParam: "",
      delayParam: "",
      timerParam: 0,
      initialized: false,
      hasService: false,
      interval: 0,
      type: [
        {name: 'Show artists', code: 'artists'},
        {name: 'Show tracks', code: 'tracks'},
      ],
      delay: [
        {name: 'Long term', code: 'long_term'},
        {name: 'Medium term', code: 'medium_term'},
        {name: 'Short term', code: 'short_term'},
      ]
    };
  },
  async mounted() {

    // Savoir si l'utilisateur possède le service
    let doc = db.collection("users").doc(this.$props.userId).collection("services").doc("spotify");
    let mdoc =  await doc.get();
    if (mdoc.exists) {
      this.spotifyKeys = mdoc.data();
      this.$data.hasService = true;
    } else {
      this.$data.hasService = false;
    }

    // Récupérer les props et le passer aux state
    this.artistIdParam = this.artistIdProp;
    this.timerParam = parseInt(this.timerParamProp);

    // Lancer la requète si le widget est init
    if (this.typeParam === undefined || this.typeParam === "undefined" || this.hasService === false || this.typeParam === ""
    || this.delayParam === undefined || this.delayParam === "undefined" || this.delayParam === "" ) {
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
      myHeaders.append("Authorization", `Bearer ${this.spotifyKeys.access_token}`);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      }

      let rep = await (await fetch(`https://api.spotify.com/v1/artists/${this.artistIdParam}`, requestOptions)).json();
      this.requestLoading = false;
      console.log(rep);
      this.spotifyRequest = rep;
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
  background-color: rgb(185, 240, 169);
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
  height: 20px;
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