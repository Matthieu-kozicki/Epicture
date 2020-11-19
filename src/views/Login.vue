<template>
  <div>
    <h1>Login</h1>
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<script>
import { firebase } from '@firebase/app'
import * as firebaseui from "firebaseui"
import "firebaseui/dist/firebaseui.css";

import '@firebase/auth'

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
        if (!ui) {
            ui = new firebaseui.auth.AuthUI(firebase.auth());
        }
        var uiConfig = {
            signInSuccessUrl: '#/dashboard', // This redirect can be achived by route using callback.
            signInFlow: "popup",
            signInOptions: [
                firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID
            ]
        };
        ui.start("#firebaseui-auth-container", uiConfig);
    }
}
</script>

<style scoped>
</style>