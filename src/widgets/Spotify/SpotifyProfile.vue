<template>
  <div id="background" v-if="!initialized">
    <InputText placeholder="Enter a valid spotify user ID" type="text" v-model="profileIdParam" />
    <InputText placeholder="Timer" type="number" v-model="timerParam" />
    <Button v-on:click="saveConfig" label="Configure" class="p-button-secondary">Configure</Button>
    <Button v-on:click="deleteWidget" label="Delete widget" class="p-button-secondary">Delete widget</Button>
  </div>
  <div id="background" v-else>
    <div v-if="!requestLoading">
      <h2>{{spotifyRequest.display_name}}</h2>
      <img id="userImage" alt="No pic for this user :/" v-bind:src="spotifyRequest.images[0].url" />
      <h3>Followers: {{spotifyRequest.followers.total}}</h3>
      <a v-bind:href="spotifyRequest.external_urls.spotify">See profile</a>
    </div>
    <div v-else>
      <h3>Request loading...</h3>
    </div>
    <div id="mybutton">
      <Button id="settings" v-on:click="editConfig" label="Secondary" class="p-button-secondary">Settings</Button>
      <Button label="Secondary" class="p-button-secondary">Force Refresh</Button>
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
#background {
  margin-left: 20px;
  background-color: rgb(216, 216, 216);
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
}
#userImage {
  width: 100px;
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
  background-color: rgb(214, 214, 214);
  margin-top: 2px;
  margin-bottom: 2px;
  margin-left: 1px;
}
#settings{
  margin-right: 3px;
}
</style>