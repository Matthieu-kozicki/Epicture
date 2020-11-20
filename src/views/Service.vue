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
      console.log("[IMGUR SERVICE] Parsed imgurService");
      this.parseImgurService(url);
    }
  },
  methods: {
    async parseImgurService(url) {
      let acess_token_re = /access_token=(.*?)&/;
      let expiration_re = /expires_in=(.*?)&/;
      let refresh_token_re = /refresh_token=(.*?)&/;
      let username_re = /account_username=(.*?)&/;
      let id_re = /account_id=(.*?)&/;

      if (window.localStorage.getItem("currentUser") === "null")
        console.log("Not connected dummy !");
      else {
        console.log("[IMGUR SERVICE] Found user");
        const usr = await JSON.parse(window.localStorage.getItem("currentUser"))
        db.collection("users").doc(usr.uid).collection("services").doc("imgur").set({
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