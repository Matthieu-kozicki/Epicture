<template>
  <div id="container_main" class="container-fluid">
    <div class="row">
      <!-- left side -->
      <div id="left" class="col-2">
        <div id="card">
          <Card>
            <template v-slot:header>
              <img alt="If you can read this it means that your profile picture couldn't be loaded :'(" v-bind:src="userData.profilePic">
              <i class="pi pi-user"></i>
            </template>
            <template v-slot:title>
              {{ userData.displayName }}
            </template>
          </Card>
        </div>

        <div id="pannel">
          <PanelMenu id="menu" :model="items" />
        </div>

        <div id="disconnect">
          <Button v-on:click="disconnect" label="Secondary" class="p-button-secondary">Disconnect</Button>
        </div>
      </div>



      <!-- right side -->
      <div id="right" class="col-10">
        <div class="col-sm-1">
          <h2> Dashboard </h2>
        </div>
        <div class="col-sm-10"></div>
        <!-- here should be the widget -->
      </div>
    </div>
  </div>
</template>

<script>
import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'
import { db } from '../main'
import { spotifyRegister } from './Service.vue'

export default {
  async mounted() {

    // Check pour voir si le user est connecté
    if (window.localStorage.getItem("currentUser") === "null") {
      console.log("User not connected !")
      this.$router.replace({name: "Login"})
    } else {
      this.$data.user = JSON.parse(window.localStorage.getItem("currentUser"));
      console.log("User connected !");
      console.log(this.$data.user);
      this.$data.userData.displayName = this.$data.user.displayName;
      this.$data.userData.profilePic = this.$data.user.photoURL;
    }

    // Check du service imgur
    let doc = db.collection("users").doc(this.$data.user.uid).collection("services").doc("imgur");
    let mdoc =  await doc.get();
    if (mdoc.exists) {
      this.$data.userData.imgurService = true;
      console.log("Imgur service found");
    }

    // Check du service spotify
    doc = db.collection("users").doc(this.$data.user.uid).collection("services").doc("spotify");
    mdoc =  await doc.get();
    if (mdoc.exists) {
      this.$data.userData.imgurService = true;
      console.log("Spotify service found");
    }

    // Init imgur panel
    if (this.$data.userData.imgurService) {
        this.$data.items[0].items = [
        {label: 'Connected to imgur :)', icon: 'pi pi-fw pi-key'}
      ]
    } else {
      this.$data.items[0].items = [
        {label: 'Connect to imgur', icon: 'pi pi-fw pi-key', command: (event) => { this.imgurRegister() },}
      ]
    }

    // Init spotify panel
    if (this.$data.userData.spotifyService) {
        this.$data.items[1].items = [
        {label: 'Connected to Spotify :)', icon: 'pi pi-fw pi-key'}
      ]
    } else {
      this.$data.items[1].items = [
        {label: 'Connect to Spotify', icon: 'pi pi-fw pi-key', command: (event) => { this.spotifyAddService() },}
      ]
    }

  },
  methods:
  {
    disconnect: function() {
      console.log("Disconnected !")
      firebase.auth().signOut()
      window.localStorage.setItem("currentUser", "null")
      this.$router.replace({name: "Login"})
    },
    toggle(event) {
      this.$refs.menu.toggle(event);
    },
    imgurRegister() {
      console.log("going imgur !!!")
      // https://stackoverflow.com/questions/35664550/vue-js-redirection-to-another-page
      window.location.href = "https://api.imgur.com/oauth2/authorize?client_id=cec086e98fbd327&response_type=token";
    },
    spotifyAddService() {
      spotifyRegister();
    }
  },
  data() {
		return {
      user: {},
      userData: {
        imgurService: false,
        spotifyService: false,
        displayName: "",
        profilePic: "",
      },
			items: [
            {
              label: 'Imgur',
              icon:'pi pi-fw pi-images',
              items: [
                  {
                    label: 'Widget1',
                    icon:'pi pi-fw pi-align-justify'
                  },
                  {
                    label: 'Widget2',
                    icon:'pi pi-fw pi-align-justify'
                  },
                  {
                    label: 'Widget3',
                    icon:'pi pi-fw pi-align-justify'
                  }
              ]
            },
            {
              label: 'Spotify',
              icon:'pi pi-fw pi-volume-up',
              items: [
                  {
                    label: 'Widget1',
                    icon:'pi pi-fw pi-align-justify'
                  },
                  {
                    label: 'Widget2',
                    icon:'pi pi-fw pi-align-justify'
                  },
                  {
                    label: 'Widget3',
                    icon:'pi pi-fw pi-align-justify'
                  }
              ]
            },
            {
              label: 'Service3',
              icon:'pi pi-fw pi-image',
              items: [
                  {
                    label: 'Widget1',
                    icon:'pi pi-fw pi-align-justify'
                  },
                  {
                    label: 'Widget2',
                    icon:'pi pi-fw pi-align-justify'
                  },
                  {
                    label: 'Widget3',
                    icon:'pi pi-fw pi-align-justify'
                  }
              ]
            }
        ]
		}
	}
}
</script>

<style>
@import './../../css/bootstrap.min.css';
#left {
  display: flex;
  flex-direction: column;
  height: 98.4vh;
  background-color:whitesmoke;
}
#right {
  background-color: white;
}
*, #container_main {
  padding: 0;
  margin: 0;
}
#pannel{
  width: 100%;
  margin: 1%
}
#nav {
  padding: 0;
  margin: 0;
}
#disconnect {
  align-self: center;
  position: absolute;
  bottom: 0;
}
#card {
  padding: 5%;
}

</style>