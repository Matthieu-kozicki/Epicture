<template>
  <div id="container_main" class="container-fluid">
    <div class="row">
      <!-- left side -->
      <div id="left" class="col-2">
        <div id="card">
          <Card>
            <template v-slot:header>
              <img alt="You don't have Profile picture" v-bind:src="userData.profilePic">
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
        <div v-for="wi in userData.widgets" :key="wi.type">
          <imgur-search
            :widgetId="wi.id"
            :userId="this.user.uid"
            :pageParamProp="wi.page"
            :timerParamProp="wi.refresh"
            :valueParamProp="wi.search"
            v-if="wi.type === 'imgursearch'"
          />
        </div>
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
import ImgurSearch, { imgurAddSearchWidget } from '../widgets/Imgur/ImgurSearch.vue'

export default {
  components: { ImgurSearch },
  async mounted() {

    // Check pour voir si le user est connecté
    if (window.localStorage.getItem("currentUser") === "null") {
      console.log("User not connected !")
      this.$router.replace({name: "Login"})
    } else {
      this.$data.user = JSON.parse(window.localStorage.getItem("currentUser"));

      // Boucler dans la collection widget de l'utilisateur
      db.collection("users").doc(this.$data.user.uid).collection("widgets").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
        console.log(doc.id, " widget id => widget data ", doc.data());
        this.userData.widgets.unshift({
          ...doc.data(),
          id: doc.id,
        })
        }.bind(this))
      }.bind(this));

      this.$data.userData.displayName = this.$data.user.displayName;
      this.$data.userData.profilePic = this.$data.user.photoURL;
      console.log(this.userData.widgets, "<--- widgets")
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
      this.$data.userData.spotifyService = true;
      console.log("Spotify service found");
    }

    // Init imgur panel
    if (this.$data.userData.imgurService) {
        this.$data.items[0].items = [
        {label: 'widget 1', icon: 'pi pi-fw pi-key', command: (event) => { this.imgutSearch() },}
      ]
    } else {
      this.$data.items[0].items = [
        {label: 'Connect to imgur', icon: 'pi pi-fw pi-key', command: (event) => { this.imgurRegister() },}
      ]
    }

    // Init spotify panel
    if (this.$data.userData.spotifyService) {
        this.$data.items[1].items = [
        {label: 'widget 1', icon: 'pi pi-fw pi-key'}
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
    imgutSearch() {
      imgurAddSearchWidget();
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
        widgets: [],
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