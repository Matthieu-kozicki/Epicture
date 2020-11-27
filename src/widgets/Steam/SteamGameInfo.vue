<template>
  <div class="border border-dark" id="background" v-if="!initialized">
    <div id="mycenter">
      <div>
        <h5>Game name</h5>
        <InputText placeholder="Enter a steam game" type="text" v-model="gameIdParam" />
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
    <div id="mycenter" v-if="!requestLoading">
      <h2>widget !</h2>
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

export const steamGameinfoName = "steamgameinfo";

export function steamAddGameinfoWidget() {
  const usr = JSON.parse(window.localStorage.getItem("currentUser"));
  db.collection("users").doc(usr.uid).collection("widgets").doc().set({
    gameId: "",
    refresh: 60,
    type: steamGameinfoName
  }).then(
      () => {
    console.log("[STEAM SERVICE] ADDED WIDGET GAMEINFO");
    }
  )
}

export default {
  name: "steam-game-info",
  props: {
    userId: String,
    widgetId: String,
    gameIdProp: String,
    timerParamProp: Number,
  },
  data() {
    return {
      steamRequest: {},
      filteredGame: [],
      requestLoading: true,
      gameIdParam: "",
      timerParam: 0,
      initialized: false,
      hasService: false,
      interval: 0,
    };
  },
  async mounted() {

    // Savoir si l'utilisateur possède le service
    let doc = db.collection("users").doc(this.$props.userId).collection("services").doc("steam");
    let mdoc =  await doc.get();
    if (mdoc.exists) {
      this.$data.hasService = true;
    } else {
      this.$data.hasService = false;
    }

    // Récupérer les props et le passer aux state
    this.gameIdParam = this.gameIdProp;
    this.timerParam = parseInt(this.timerParamProp);

    // Lancer la requète si le widget est init
    if (this.gameIdParam === undefined || this.gameIdParam === "undefined" || this.hasService === false || this.gameIdParam === "") {
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
      var header = new Headers();
      header.append("Access-Control-Allow-Origin", "*")
      header.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

      var requestOptions = {
        method: 'GET',
        headers: header,
        redirect: 'follow'
      }

      let rep = await (await fetch(`https://api.steampowered.com/ISteamApps/GetAppList/v2/`, requestOptions)).json();
      this.requestLoading = false;
      this.steamRequest = rep;
      this.filteredGame = this.steamRequest.apps.filter(game => game.toLowerCase() === this.gameIdParam);
      console.log(this.filteredGame);
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
        gameId: this.gameIdParam,
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
  background-color: rgb(216, 216, 216);
  width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
}
#userImage {
  width: 100px;
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