<template>
  <div class="border border-dark" id="background" v-if="!initialized">
    <div id="mycenter">
      <div>
        <h5>Profile name</h5>
        <InputText placeholder="Enter an existing imgur user name" type="text" v-model="userParam" />
        <h5> Time to refresh </h5>
        <InputText placeholder="Timer" type="number" v-model="timerParam" />
      </div>
      <div id="mybutton">
        <Button id="myright" v-on:click="saveConfig" icon="pi pi-check" class="p-button-rounded p-button-secondary"/>
        <Button  v-on:click="deleteWidget" icon="pi pi-trash" class="p-button-rounded p-button-secondary"/>
      </div>
    </div>
  </div>
  <div class="border border-dark" id="background" v-else>
    <div v-if="!requestLoading">
      <div id="profile" :style="{ backgroundImage: `url(${imgurRequest.data.cover})`}"/>
      <img id="avatar" class="rounded-circle" :src="imgurRequest.data.avatar">
      <h6 id="myname">Name</h6>
      <h6 id="mybot">{{imgurRequest.data.url}}</h6>
      <h6>About</h6>
      <h6><p id="mycolorscroll">{{imgurRequest.data.bio}}</p></h6>
      <h6>Internet Points</h6>
      <h6 id="mybot">{{imgurRequest.data.reputation}}</h6>
      <h6>Notoriety</h6>
      <h6 id="mybot">{{imgurRequest.data.reputation_name}}</h6>
    </div>
    <div v-else>
      <h3>Request loading...</h3>
    </div>
    <div id="rmbutton">
      <Button id="myright" v-on:click="editConfig" icon="pi pi-cog" class="p-button-rounded p-button-secondary"/>
      <Button icon="pi pi-refresh" class="p-button-rounded p-button-secondary" @click="doRequest"/>
    </div>
  </div>
</template>

<script>
import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'
import { db } from '../../main'

export const imgurProfileName = "imgurprofile";

export function imgurAddProfileWidget() {
  const usr = JSON.parse(window.localStorage.getItem("currentUser"));
  db.collection("users").doc(usr.uid).collection("widgets").doc().set({
    user: "",
    refresh: 60,
    type: imgurProfileName
  }).then(
      () => {
    console.log("[IMGUR SERVICE] ADDED WIDGET PROFILE");
    }
  )
}

export default {
  name: "imgur-profile",
  props: {
    userId: String,
    widgetId: String,
    userParamProp: String,
    timerParamProp: Number,
  },
  data() {
    return {
      imgurKeys: {},
      imgurRequest: {},
      requestLoading: true,
      userParam: "",
      timerParam: 0,
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
    this.userParam = this.userParamProp;
    this.timerParam = parseInt(this.timerParamProp);

    // Lancer la requète si le widget est init
    if (this.userParam === undefined || this.userParam === "undefined" || this.hasService === false || this.userParam === "") {
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
      myHeaders.append("Authorization", `Bearer ${this.imgurKeys.access_token}`);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      }

      let rep = await (await fetch(`https://api.imgur.com/3/account/${this.userParam}`, requestOptions)).json();
      this.requestLoading = false;
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
        user: this.userParam,
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
  background-color: rgb(165, 165, 165);
  width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
  margin :10px;
}
#inputs {
  width: 40%;
  height: 80px;
  margin: 5px;
}
#mybutton {
  margin-top: 2px;
  margin-bottom: 2px;
  margin-left: 1px;
}
#myright{
  margin-right: 3px;
}
#mycolorscroll{
  height: 18px;
  color: white;
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;
}
#mycolorscroll::-webkit-scrollbar { /* WebKit */
    width: 0;
    height: 0;
}
#mycenter{
  margin: auto;
}
#profile{
  background-size: cover;
  height: 35%;
}
#avatar{
  margin-top: -80px;
  height: 50px;
  width: 50px;
}
#myname{
  margin-top: -20px;
}
#mybot{
  color: white;
  margin-bottom: 16px;
}
#rmbutton{
  position: relative;
  bottom: 0px;
  padding-top: 103px;
}
</style>