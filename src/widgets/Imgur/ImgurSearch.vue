<template>
  <div id="background" v-if="!initialized">
    <InputText placeholder="Post" type="text" v-model="valueParam" />
    <InputText placeholder="Page" type="number" v-model="pageParam" />
    <InputText placeholder="Timer" type="number" v-model="timerParam" />
    <Button v-on:click="saveConfig" label="Configure" class="p-button-secondary">Configure</Button>
    <Button v-on:click="deleteWidget" label="Delete widget" class="p-button-secondary">Delete widget</Button>
  </div>
  <div id="background" v-else>
    <div id="myscroll">
      <div v-for="img in imgurRequest.data" :key="img.id">
        <div v-if="img.images">
          <div v-if="img.images[0].type=='video/mp4'">
            <!-- video -->
          </div>
          <div v-else>
            <h3>{{img.title}}</h3>
            <img id ="myimage" :src="img.images[0].link">
          </div>
        </div>
        <div v-if="!img.images" >
          <div v-if="img.type=='video/mp4'">
            <!-- <h3>video</h3> -->
          </div>
          <div v-else>
            <h3>{{img.title}}</h3>
            <img id ="myimage" :src="img.link">
          </div>
        </div>
      </div>
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

export const imgurSearchName = "imgursearch";

export function imgurAddSearchWidget() {
  const usr = JSON.parse(window.localStorage.getItem("currentUser"));
  db.collection("users").doc(usr.uid).collection("widgets").doc().set({
    search: "",
    page: 0,
    refresh: 60,
    type: imgurSearchName
  }).then(
      () => {
    console.log("[IMGUR SERVICE] ADDED WIDGET SEARCH");
    }
  )
}

export default {
  name: "imgur-search",
  props: {
    userId: String,
    widgetId: String,
    valueParamProp: String,
    timerParamProp: Number,
    pageParamProp: String,
  },
  data() {
    return {
      imgurKeys: {},
      imgurRequest: {},
      valueParam: "",
      timerParam: 0,
      pageParam: 0,
      initialized: false,
      hasService: false,
      interval: 0,
    };
  },
  async mounted() {

    // Savoir si l'utilisateur possède le service
    let doc = db.collection("users").doc(this.$props.userId).collection("services").doc("imgur");
    let mdoc =  await doc.get();
    if (mdoc.exists) {
      this.$data.imgurKeys = mdoc.data();
      this.$data.hasService = true;
    } else {
      this.$data.hasService = false;
    }

    // Récupérer les props et le passer aux state
    this.valueParam = this.valueParamProp;
    this.timerParam = parseInt(this.timerParamProp);
    this.pageParam = parseInt(this.pageParamProp);

    // Lancer la requète si le widget est init
    if (this.valueParam === undefined || this.valueParam === "undefined" || this.hasService === false) {
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
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${this.imgurKeys.access_token}`);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      }

      let rep = await (await fetch(`https://api.imgur.com/3/gallery/search/time/top/all/?q=${encodeURI(this.valueParam)}&page=${this.pageParam}`, requestOptions)).json();

      console.log(rep);
      this.imgurRequest = rep;
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
        search: this.valueParam,
        page: this.pageParam,
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
  width: 400px;
  height: 400px;
  display: flex;
  flex-direction: column;
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