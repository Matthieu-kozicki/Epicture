<template>
  <div class="border border-dark" id="background" v-if="!initialized">
    <div id="mymid">
      <div>
        <h5>Select a channel name</h5>
        <InputText placeholder="Enter a channel name" type="text" v-model="channelNameParam" />
        <h5> Time to refresh </h5>
        <InputText placeholder="Timer" type="number" v-model="timerParam" />
      </div>
      <div>
        <Button id="myright" v-on:click="saveConfig" icon="pi pi-check" class="p-button-rounded p-button-danger"/>
        <Button v-on:click="deleteWidget" icon="pi pi-trash" class="p-button-rounded p-button-danger"/>
      </div>
    </div>
  </div>
  <div class="border border-dark" id="background" v-else>
    <div v-if="!requestLoading">
      <div v-if="okayRequest === true">
        <h2>{{channelRequest.items[0].snippet.title}}</h2>
        <img id="thumb" :src="channelRequest.items[0].snippet.thumbnails.medium.url" />
        <div id ="myicons" v-if="!subsRequest.items[0].statistics.hiddenSubscriberCount">
          <img id ="myicon" src="https://img.icons8.com/metro/26/000000/user-male.png"/>
          <h4>{{subsRequest.items[0].statistics.subscriberCount}}</h4>
        </div>
        <div id="myicons">
          <img id ="myicon" src="https://img.icons8.com/ios-glyphs/30/000000/visible--v1.png"/>
          <h4>{{subsRequest.items[0].statistics.viewCount}}</h4>
        </div>
        <div id="myicons">
          <img id ="myicon" src="https://img.icons8.com/material-rounded/24/000000/video.png"/>
          <h4>{{subsRequest.items[0].statistics.videoCount}}</h4>
        </div>
      </div>
      <div v-else>
        <h2>No such channel :(</h2>
      </div>
    </div>
    <div v-else>
      <h3>Request loading...</h3>
    </div>
    <div id="mybutton">
      <Button id="settings" v-on:click="editConfig" icon="pi pi-cog" class="p-button-rounded p-button-danger"/>
      <Button icon="pi pi-refresh" class="p-button-rounded p-button-danger" @click="doRequest"/>
    </div>
  </div>
</template>

<script>
import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'
import { db } from '../../main'

// curl https://www.googleapis.com/youtube/v3/channels\?part=statistics&id=UCiSJjx1wNPr3e9RXbVcKVMg&key=AIzaSyCbvbigahv1ogH-kl9IoTexdWOkzlF4u_c

/**
 * curl \
  'https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&forUsername=Amixem&key=[YOUR_API_KEY]' \
  --header 'Authorization: Bearer [YOUR_ACCESS_TOKEN]' \
  --header 'Accept: application/json' \
  --compressed
 */

export const channelName = "ytbchannel";

export function youtubeAddChannelWidget() {
  const usr = JSON.parse(window.localStorage.getItem("currentUser"));
  db.collection("users").doc(usr.uid).collection("widgets").doc().set({
    channelName: "",
    refresh: "60",
    type: channelName
  }).then(
      () => {
    console.log("[YOUTUBE SERVICE] ADDED WIDGET CHANNEL");
    }
  )
}

export default {
  name: "ytb",
  props: {
    userId: String,
    widgetId: String,
    channelNameProp: String,
    timerParamProp: String,
  },
  data() {
    return {
      channelRequest: {},
      subsRequest: {},
      okayRequest: false,
      requestLoading: true,
      channelNameParam: "",
      timerParam: 0,
      initialized: false,
      hasService: false,
      interval: 0,
    };
  },
  async mounted() {

    // Savoir si l'utilisateur possède le service
    let doc = db.collection("users").doc(this.$props.userId).collection("services").doc("youtube");
    let mdoc =  await doc.get();
    if (mdoc.exists) {
      this.$data.hasService = true;
    } else {
      this.$data.hasService = false;
    }

    // Récupérer les props et le passer aux state
    this.channelNameParam = this.channelNameProp;
    this.timerParam = this.timerParamProp;

    // Lancer la requète si le widget est init
    if (this.channelNameParam === undefined || this.channelNameParam === "undefined" || this.hasService === false || this.channelNameParam === "") {
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

      let search = await (await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${this.channelNameParam}&type=channel&key=AIzaSyCbvbigahv1ogH-kl9IoTexdWOkzlF4u_c`, { method: 'GET', redirect: 'follow' })).json();

      if (!search.items) {
        this.okayRequest = false;
      } else {
        let subs = await (await fetch(`https://www.googleapis.com/youtube/v3/channels\?part=statistics&id=${search.items[0].id.channelId}&key=AIzaSyCbvbigahv1ogH-kl9IoTexdWOkzlF4u_c`, { method: 'GET', redirect: 'follow' })).json();
        console.log(subs);
        /*
        hiddenSubscriberCount: false
  subscriberCount: "6740000"
  videoCount: "538"
  viewCount: "1699792776"
        */
        this.requestLoading = false;
        this.channelRequest = search;
        this.subsRequest = subs;
        this.okayRequest = true;
      }
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
        channelName: this.channelNameParam,
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
  background: rgb(245, 116, 116);
  width: 300px;
  height: 400px;
  display: flex;
  border-radius: 15px;
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
#thumb{
  height: 100px;
}
#myicons{
  margin: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
#myicon{
  position: relative;
  top: -10px;
  margin-top: 10px;
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
#spacing {
  margin: 25px;
}
</style>