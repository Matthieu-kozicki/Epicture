<template>
  <div id="background" v-if="!initialized">
    <InputText placeholder="Post" type="text" v-model="valueParam" />
    <InputText placeholder="Page" type="number" v-model="pageParam" />
    <InputText placeholder="Timer" type="number" v-model="timerParam" />
    <Button v-on:click="disconnect" label="Configure" class="p-button-secondary">Configure</Button>
  </div>
  <div id="background" v-else>
    <div id="disconnect">
      <Button v-on:click="disconnect" label="Secondary" class="p-button-secondary">Settings</Button>
      <Button v-on:click="disconnect" label="Secondary" class="p-button-secondary">Refresh</Button>
    </div>
  </div>
</template>

<script>
import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'
import { db } from '../../main'

export default {
  name: "imgur-search",
  props: {
    userId: String,
    valueParamProp: String,
    timerParamProp: Number,
    pageParamProp: Number,
  },
  data() {
    return {
      imgurKeys: {},
      requestRep: {},
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
    this.timerParam = this.timerParamProp;
    this.pageParam = this.pageParamProp;

    // Lancer la requète si le widget est init
    if (this.valueParam === undefined || this.valueParam === "undefined" || this.hasService === false) {
      this.initialized = false;
      return;
    } else {
      this.doRequest();
      this.interval = setInterval(() => this.doRequest(), this.timerParam);
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
    },
    configure() {

    },
    async updateFirebase() {
      let userRef = (await db.collection("users").doc(this.$props.userId).get()).data()
    }
  },
  unmounted() {
    clearInterval(this.interval);
  }
}
</script>

<style scoped>
#background {
  background-color: rgb(167, 167, 167);
  width: 30%;
  height: 200px;
  display: flex;
  flex-direction: column;
}
</style>