<template>
  <h1 id="center">Adding service...</h1>
</template>

<script>
import { firebase } from '@firebase/app'
import '@firebase/firestore'
import '@firebase/auth'
import { db } from '../main'

/**
 * Function that allows the user to add the Spotify Service !
 */
export function spotifyRegister() {
  let spotifyWindow = window.open("https://accounts.spotify.com/authorize?client_id=b02c25c09f0e48db83d0a7e28fa17cb6&response_type=token&scope=user-top-read&redirect_uri=http%3A%2F%2Flocalhost%3A8081%2F%23%2Fservice%2Fn&state=spotifyService")

  let inter = setInterval(function() {
  let state_re = /state=(.*?)&/;

  const url = spotifyWindow.location.href + '&';

  if (spotifyWindow.closed) {
    clearInterval(inter);
    console.log("[SPOTIFY SERVICE] Window closed, couldn't add service :(");
  }
  if (state_re.exec(url)[1] === "spotifyService") {
    let acess_token_re = /access_token=(.*?)&/;
    let expiration_re = /expires_in=(.*?)&/;

    if (acess_token_re.exec(url)[1] !== null && expiration_re.exec(url)[1] !== null) {
      console.log("[SPOTIFY SERVICE] Adding spotify service to user");
      if (window.localStorage.getItem("currentUser") === "null") {
        console.log("Not connected dummy !");
      } else {
        console.log("[SPOTIFY SERVICE] <---", url);
        const usr = JSON.parse(window.localStorage.getItem("currentUser"));
        db.collection("users").doc(usr.uid).collection("services").doc("spotify").set({
          access_token: acess_token_re.exec(url)[1],
          expiration_token: expiration_re.exec(url)[1],
          date: new Date().toJSON()
        }).then(
          () => {
            spotifyWindow.close();
            clearInterval(inter);
            console.log("[SPOTIFY SERVICE] OKAY");
          }
        )
      }
    }
    }
  }, 500);
}

export function steamRegister() {
  if (window.localStorage.getItem("currentUser") === "null") {
    console.log("Not connected dummy !");
  } else {
    console.log("[STEAM SERVICE] Found user");
    const usr = JSON.parse(window.localStorage.getItem("currentUser"));
    db.collection("users").doc(usr.uid).collection("services").doc("steam").set({
      access_token: "no need",
      expiration_token: "no need",
      date: new Date().toJSON()
    }).then(
      () => {
        console.log("[STEAM SERVICE] OKAY");
      }
    )
  }
}

export function weatherRegister() {
  if (window.localStorage.getItem("currentUser") === "null") {
    console.log("Not connected dummy !");
  } else {
    console.log("[Weather SERVICE] Found user");
    const usr = JSON.parse(window.localStorage.getItem("currentUser"));
    db.collection("users").doc(usr.uid).collection("services").doc("weather").set({
      access_token: "no need",
      expiration_token: "no need",
      date: new Date().toJSON()
    }).then(
      () => {
        console.log("[Weather SERVICE] OKAY");
      }
    )
  }
}

export function currencyRegister() {
  if (window.localStorage.getItem("currentUser") === "null") {
    console.log("Not connected dummy !");
  } else {
    console.log("[CURRENCY SERVICE] Found user");
    const usr = JSON.parse(window.localStorage.getItem("currentUser"));
    db.collection("users").doc(usr.uid).collection("services").doc("currency").set({
      access_token: "no need",
      expiration_token: "no need",
      date: new Date().toJSON()
    }).then(
      () => {
        console.log("[CURRENCY SERVICE] OKAY");
      }
    )
  }
}

export function youtubeRegister() {
  if (window.localStorage.getItem("currentUser") === "null") {
    console.log("Not connected dummy !");
  } else {
    console.log("[CURRENCY SERVICE] Found user");
    const usr = JSON.parse(window.localStorage.getItem("currentUser"));
    db.collection("users").doc(usr.uid).collection("services").doc("youtube").set({
      access_token: "no need",
      expiration_token: "no need",
      date: new Date().toJSON()
    }).then(
      () => {
        console.log("[YOUTUBE SERVICE] OKAY");
      }
    )
  }
}

/**
 * This component renders a page that is used to parse the tokens
 * when a user adds a service
 */
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
            access_token: acess_token_re.exec(url)[1],
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