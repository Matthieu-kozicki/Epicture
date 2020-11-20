<template>
  <h1 id="center">Adding service...</h1>
</template>

<script>
import { firebase } from '@firebase/app'
import '@firebase/firestore'
import '@firebase/auth'
import { db } from '../main'

export default {
  mounted() {
    let state_re = /state=(.*?)&/;

    const url = window.location.href + '&';


    if (state_re.exec(url)[1] == "imgurService") {
      console.log("Parsed imgur url !!!");
      this.parseImgurService(url);
    }
  },
  methods: {
    parseImgurService(url) {
      let acess_token_re = /access_token=(.*?)&/;
      let expiration_re = /expires_in=(.*?)&/;
      let refresh_token_re = /refresh_token=(.*?)&/;
      let username_re = /account_username=(.*?)&/;
      let id_re = /account_id=(.*?)&/;

      if (!firebase.auth().currentUser) {
        console.log("Not connected dummy !");
        return;
      } else {
        console.log("Adding imgur service for user");
        db.collection("users").doc(firebase.auth().currentUser.uid).collection("services").doc("imgur").set({
            acess_token: acess_token_re.exec(url)[1],
            expiration_token: expiration_re.exec(url)[1],
            refresh_token: refresh_token_re.exec(url)[1],
            username: username_re.exec(url)[1],
            id: id_re.exec(url)[1],
            date: new Date().toJSON()
        }).then(
          () => {this.$router.replace({name: "Dashboard"})}
        )
      }
    }
  }
}
</script>

<style scoped>
#center {
  position: fixed;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>