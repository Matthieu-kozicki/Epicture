<template>
  <div id="background" v-if="!initialized">
    <InputText placeholder="Post" type="text" v-model="valueParam" />
    <InputText placeholder="Timer" type="number" v-model="timerParam" />
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
import { db } from '../main'

export default {
  props: {
    userId: String,
    valueParamProp: String,
    timerParamProp: Number,
  },
  data() {
    return {
      imgurKeys: {},
      requestRep: {},
      valueParam: "",
      timerParam: 0,
      pageParam: 0,
      sortParam: "time",
      initialized: false,
      hasService: false,
    };
  },
  async mounted() {

    let doc = db.collection("users").doc(this.$props.userId).collection("services").doc("imgur");
    let mdoc =  await doc.get();
    if (mdoc.exists) {
      this.$data.imgurKeys = mdoc.data();
      this.$data.hasService = true;
    } else {
      this.$data.hasService = false;
    }

    this.valueParam = this.valueParamProp;

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${this.imgurKeys.access_token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    }

    let rep = await (await fetch(`https://api.imgur.com/3/gallery/search/${this.sortParam}/top/all/?q=${encodeURI(this.valueParam)}&page=${this.pageParam}`, requestOptions)).json();

    console.log(rep);
  }
}
</script>

<style scoped>
#background {
  background-color: rgb(167, 167, 167);
  width: 30%;
}
</style>