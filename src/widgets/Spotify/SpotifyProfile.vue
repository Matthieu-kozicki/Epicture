<template>
  <div class="border border-dark" id="background" v-if="!initialized">
    <div id="mycenter">
      <div>
        <h5>Spotify user</h5>
        <InputText placeholder="Enter a valid spotify user ID" type="text" v-model="profileIdParam" />
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
    <div id="mycenter" v-if="!requestLoading">
      <h2 id="mycolor">{{spotifyRequest.display_name}}</h2>
      <img id="userImage" alt="No pic for this user :/" v-bind:src="spotifyRequest.images[0].url" />
      <h3>Followers: <span id="mycolor">{{spotifyRequest.followers.total}} </span></h3>
      <a id="mycolor" v-bind:href="spotifyRequest.external_urls.spotify">See profile</a>
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

export const spotifyProfileName = "spotifyprofile";

export function spotifyAddProfileWidget() {
  const usr = JSON.parse(window.localStorage.getItem("currentUser"));
  db.collection("users").doc(usr.uid).collection("widgets").doc().set({
    profileId: "",
    refresh: 60,
    type: spotifyProfileName
  }).then(
      () => {
    console.log("[SPOTIFY SERVICE] ADDED WIDGET ARTIST");
    }
  )
}

export default {
  name: "spotify-profile",
  props: {
    userId: String,
    widgetId: String,
    profileIdProp: String,
    timerParamProp: Number,
  },
  data() {
    return {
      spotifyKeys: {},
      spotifyRequest: {},
      requestLoading: true,
      profileIdParam: "",
      timerParam: 0,
      initialized: false,
      hasService: false,
      interval: 0,
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
    this.profileIdParam = this.profileIdProp;
    this.timerParam = parseInt(this.timerParamProp);

    // Lancer la requète si le widget est init
    if (this.profileIdParam === undefined || this.profileIdParam === "undefined" || this.hasService === false || this.profileIdParam === "") {
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

      let rep = await (await fetch(`https://api.spotify.com/v1/users/${this.profileIdParam}`, requestOptions)).json();
      this.requestLoading = false;
      console.log(rep);
      this.spotifyRequest = rep;
    },
    saveConfig() {
      this.updateFirebase();
      this.interval = setInterval(() => this.doRequest(), this.timerParam * 1000);
      this.initialized = true;
      this.requestLoading = true;
    },
    editConfig() {
      clearInterval(this.interval);
      this.initialized = false;
    },
    async updateFirebase() {
      let widgetRef = db.collection("users").doc(this.userId).collection("widgets").doc(this.widgetId);

      widgetRef.update({
        profileId: this.profileIdParam,
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
#userImage {
  width: 100px;
}
#mycolor{
  color: green;
}
#mycenter{
  margin: auto;
}
#inputs {
  width: 40%;overflow: scroll;
  height: 80px;
  margin: 5px;
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
#myright{
  margin-right: 3px;
}
</style>