<template>
  <div class="border border-dark" id="background" v-if="!initialized">
    <div id="mymid">
      <div>
        <h5>Configure the widget</h5>
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
    <div id="myscroll" v-if="!requestLoading && typeParam.code === 'artists'" >
      <h3>Top artists {{delayParam.name}}</h3>
      <div v-for="(artist, index) in spotifyRequest.items" :key="artist.id">
        <h3>Rank {{index + 1}} : {{artist.name}}</h3>
        <img id="artistImage" :src="artist.images[0].url">
        <ProgressBar :value="artist.popularity">
        Popularity {{artist.popularity}}%
        </ProgressBar>
      </div>
    </div>
    <div id="myscroll" v-if="!requestLoading && typeParam.code === 'tracks'" >
      <h3>Top tracks {{delayParam.name}}</h3>
      <div v-for="(track, index) in spotifyRequest.items" :key="track.id">
        <h4>Rank {{index + 1}} : {{track.name}} by {{track.artists[0].name}}</h4>
        <img id="artistImage" :src="track.album.images[0].url">
        <ProgressBar :value="track.popularity">
        Popularity {{track.popularity}}%
        </ProgressBar>
      </div>
    </div>
    <div v-if="requestLoading">
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
    typeParam: {},
    delayParam: {},
    refresh: "60",
    type: spotifyTopName
  }).then(
      () => {
    console.log("[SPOTIFY SERVICE] ADDED WIDGET TOP");
    }
  )
}

/**
 * This component renders the spotifytop widget
 * It takes a type and delay param
 */
export default {
  name: "spotify-top",
  props: {
    userId: String,
    widgetId: String,
    typeProp: Object,
    delayProp: Object,
    timerParamProp: String,
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
  /**
   * The mounted function checks if the user has the service
   * If so the widget is launched and the request is done, if not the user has to configure the widget
  */
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
    this.typeParam = this.typeProp;
    this.delayParam = this.delayProp;
    this.timerParam = this.timerParamProp;

    // Lancer la requète si le widget est init
    if (this.typeParam.code === undefined || this.typeParam.code === "undefined" || this.hasService === false || this.typeParam.code === ""
    || this.delayParam.code === undefined || this.delayParam.code === "undefined" || this.delayParam.code === "" ) {
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
    /**
     * This function does the request to get informations about a user top tracks / artists
     */
    async doRequest() {
      this.requestLoading = true;
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${this.spotifyKeys.access_token}`);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      }

      let rep = await (await fetch(`https://api.spotify.com/v1/me/top/${this.typeParam.code}?time_range=${this.delayParam.code}`, requestOptions)).json();
      this.requestLoading = false;
      this.spotifyRequest = rep;
    },
    /**
     * This function is used to save the widget configuration
    */
    saveConfig() {
      this.updateFirebase();
      this.interval = setInterval(() => this.doRequest(), this.timerParam * 1000);
      this.requestLoading = true;
      this.initialized = true;
    },
    /**
     * This function is used to change the component to its configuration mode
     */
    editConfig() {
      clearInterval(this.interval);
      this.initialized = false;
    },
    /**
     * This function updates the widget parameters by storing them into firebase
     * It takes the props and stores them into the widget document
    */
    async updateFirebase() {
      let widgetRef = db.collection("users").doc(this.userId).collection("widgets").doc(this.widgetId);

      let type = {name: this.typeParam.name, code: this.typeParam.code}
      let delay = {name: this.delayParam.name, code: this.delayParam.code}

      widgetRef.update({
        typeParam: type,
        delayParam: delay,
        refresh: this.timerParam
      })
    },
    /**
     * Deletes the widget
    */
    deleteWidget() {
      db.collection("users").doc(this.userId).collection("widgets").doc(this.widgetId).delete();
      clearInterval(this.interval);
      console.log("Widget deleted !");
    }
  },
  beforeUnmount() {
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
  border-radius: 15px;
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
#myscroll::-webkit-scrollbar { /* WebKit */
    width: 0;
    height: 0;
}
#artistImage{
  width: 200px;
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
#myscroll{
  overflow-y: scroll;
}
h3 {
  color: green;
}
h4 {
  color: green;
  text-align: center;
}
.p-progressbar {
  color: green;
  background-color: white;
  margin: 5px;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>