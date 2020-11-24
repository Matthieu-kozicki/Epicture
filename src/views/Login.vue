<template>
  <div>
    <div id="center">
        <h1>Log in / Register</h1>
        <div id="firebaseui-auth-container"></div>
    </div>
  </div>
</template>

<script>
import { firebase } from '@firebase/app'
import * as firebaseui from "firebaseui"
import "firebaseui/dist/firebaseui.css";
import '@firebase/auth'
import '@firebase/firestore'
import { db } from '../main'

export default {
  data () {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  mounted() {
    let ui = firebaseui.auth.AuthUI.getInstance();
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        window.localStorage.setItem("currentUser", JSON.stringify(user));
      } else {
        window.localStorage.setItem("currentUser", "null");
      }
    })
    if (!ui) {
        ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    var uiConfig = {
        signInSuccessUrl: '#/dashboard', // This redirect can be achived by route using callback.
        signInFlow: "popup",
        callbacks: {
          signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            console.log(authResult.user);
            window.localStorage.setItem("currentUser", JSON.stringify(authResult.user))
            db.collection("users").doc(authResult.user.uid).set({
              widgets: [],
              nbWidgets: 0,
            })
            return true;
          },
        },
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.TwitterAuthProvider.PROVIDER_ID,
          firebase.auth.GithubAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ]
    };
    ui.start("#firebaseui-auth-container", uiConfig);
  }
}
</script>

<style scoped>
#center {
  position: fixed;
  background-color:rgba(180, 180, 180, 0.561);
  border: 10px;
  border-bottom: 10px;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding-bottom: 20px;
  padding-top: 20px;
  padding-right: 20px;
  padding-left: 20px;
}
</style>