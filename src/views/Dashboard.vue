<template>
  <div id="container_main" class="container-fluid">
    <div class="row">
      <!-- left side -->
      <div id="left" class="col-2">
        <div id="card">
          <Card>
            <template v-slot:header v-if="userData.profilePic">
              <img alt="You don't have Profile picture" v-bind:src="userData.profilePic">
            </template>
            <template v-slot:header v-else>
              <img id="icon" alt="You don't have Profile pi" src='../assets/empty.png'>
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
        <div class="col-sm-10"></div>
        <!-- here should be the widget -->
        <draggable  id="mydrag" class="dragArea list-group w-full" :list="userData.widgets">
          <div v-for="wi in userData.widgets" :key="wi.id">
            <imgur-search
              :widgetId="wi.id"
              :userId="this.user.uid"
              :pageParamProp="wi.page"
              :timerParamProp="wi.refresh"
              :valueParamProp="wi.search"
              v-if="wi.type === 'imgursearch'"
            />
            <imgur-profile
              :widgetId="wi.id"
              :userId="this.user.uid"
              :userParamProp="wi.user"
              :timerParamProp="wi.refresh"
              v-if="wi.type === 'imgurprofile'"
            />
            <spotify-artist
              :widgetId="wi.id"
              :userId="this.user.uid"
              :artistIdProp="wi.artistId"
              :timerParamProp="wi.refresh"
              v-if="wi.type === 'spotifyartist'"
            />
            <spotify-profile
              :widgetId="wi.id"
              :userId="this.user.uid"
              :profileIdProp="wi.profileId"
              :timerParamProp="wi.refresh"
              v-if="wi.type === 'spotifyprofile'"
            />
            <steam-game-info
              :widgetId="wi.id"
              :userId="this.user.uid"
              :gameIdProp="wi.gameId"
              :timerParamProp="wi.refresh"
              v-if="wi.type === 'steamgameinfo'"
            />
            <weather-city
            :cityParam="this.city"
            :userId="this.user.uid"
            :widgetId="wi.id"
            :timerParamProp="wi.refresh"
            v-if="wi.type === 'weathercity'"
            />
            <currency
            :userId="this.user.uid"
            :widgetId="wi.id"
            :currencyProp="wi.currency"
            :timerParamProp="wi.refresh"
            v-if="wi.type === 'currency'"
            />
          </div>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import { VueDraggableNext } from 'vue-draggable-next'

// Firebase
import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'
import { db } from '../main'

// Services
import { imgurUnregister, spotifyRegister, spotifyUnregister, steamRegister, weatherRegister, steamUnregister, weatherUnregister, currencyUnregister, currencyRegister } from './Service.vue'

// Widgets
import ImgurSearch, { imgurAddSearchWidget } from '../widgets/Imgur/ImgurSearch.vue'
import ImgurProfile, { imgurAddProfileWidget } from '../widgets/Imgur/ImgurProfile.vue'
import SpotifyArtist, { spotifyAddArtistWidget } from '../widgets/Spotify/SpotifyArtist.vue'
import SpotifyProfile, { spotifyAddProfileWidget } from '../widgets/Spotify/SpotifyProfile.vue'
import WeatherCity, { weatherAddCityWidget, WeatherCityWidget } from '../widgets/Weather/WeatherCity.vue'
import SteamGameInfo, { steamAddGameinfoWidget } from '../widgets/Steam/SteamGameInfo.vue'
import Currency, { currencyAddCurrencyWidget } from '../widgets/Currency/Currency.vue'

export default {
  components: { ImgurSearch, draggable: VueDraggableNext, ImgurProfile, SpotifyArtist, SpotifyProfile, SteamGameInfo, WeatherCity, Currency },
  async mounted() {
    this.getWidgets();
    this.getServices();
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
    },
    getWidgets() {
      // Check pour voir si le user est connecté
      if (window.localStorage.getItem("currentUser") === "null") {
        console.log("User not connected !")
        this.$router.replace({name: "Login"})
      } else {
        this.$data.user = JSON.parse(window.localStorage.getItem("currentUser"));
        // Boucler dans la collection widget de l'utilisateur
        db.collection("users").doc(this.$data.user.uid).collection("widgets").onSnapshot(
          function(querySnapshot) {
            var widgets = []
            querySnapshot.forEach(function(doc) {
              widgets.unshift({
                ...doc.data(),
                id: doc.id,
              })
            }.bind(this))
            this.userData.widgets = widgets;
          }.bind(this));
        this.$data.userData.displayName = this.$data.user.displayName;
        this.$data.userData.profilePic = this.$data.user.photoURL;
      }
    },
    getServices() {
      // Check pour voir si le user est connecté
      if (window.localStorage.getItem("currentUser") === "null") {
        console.log("User not connected !")
        this.$router.replace({name: "Login"})
      } else {
        this.$data.user = JSON.parse(window.localStorage.getItem("currentUser"));
        // Boucler dans la collection widget de l'utilisateur
        db.collection("users").doc(this.$data.user.uid).collection("services").onSnapshot(
          function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              console.log("doc id: ", doc.id);
              if (doc.id === "imgur") {
                this.userData.imgurService = true;
              }
              if (doc.id === "spotify") {
                this.userData.spotifyService = true;
              }
              if (doc.id === "steam") {
                this.userData.steamService = true;
              }
              if (doc.id === "weather") {
                this.userData.weatherService = true;
              }
              if (doc.id === "currency") {
                this.userData.currencyService = true;
              }
            }.bind(this))
            this.initPanels();
          }.bind(this));
      }
    },
    initPanels() {
      // Init Imgur panel
      if (this.$data.userData.imgurService) {
        this.$data.items[0].items = [
        {label: 'Search Widget', icon: 'pi pi-fw pi-search', command: (event) => { imgurAddSearchWidget() }},
        {label: 'Profile Widget', icon: 'pi pi-fw pi-user', command: (event) => { imgurAddProfileWidget() }},
        {label: 'Remove Spotify Service', icon: 'pi pi-fw pi-sign-out', command: (event) => { imgurUnregister() }},
      ]
      } else {
        this.$data.items[0].items = [
          {label: 'Connect to imgur', icon: 'pi pi-fw pi-sign-in', command: (event) => { this.imgurRegister() },}
        ]
      }
      // Init Spotify panel
      if (this.$data.userData.spotifyService) {
          this.$data.items[1].items = [
          {label: 'Artist Widget', icon: 'pi pi-fw pi-volume-up', command: (event) => { spotifyAddArtistWidget() }},
          {label: 'Profile Widget', icon: 'pi pi-fw pi-user', command: (event) => { spotifyAddProfileWidget() }},
          {label: 'Remove Spotify Service', icon: 'pi pi-fw pi-sign-out', command: (event) => { spotifyUnregister() }},
        ]
      } else {
        this.$data.items[1].items = [
          {label: 'Connect to Spotify', icon: 'pi pi-fw pi-sign-in', command: (event) => { this.spotifyAddService() },}
        ]
      }
      // Init Steam panel
      if (this.userData.steamService) {
        this.items[2].items = [
          {label: 'Game info Widget', icon: 'pi pi-fw pi-key', command: (event) => { steamAddGameinfoWidget() },},
          {label: 'Remove Steam service', icon: 'pi pi-fw pi-sign-out', command: (event) => { steamUnregister() },}
        ]
      } else {
        this.items[2].items = [
          {label: 'Add Steam service', icon: 'pi pi-fw pi-sign-in', command: (event) => { steamRegister() },},
        ]
      }
      // Init weather panel
      if (this.userData.weatherService) {
        this.items[3].items = [
          {label: 'Weather Widget', icon: 'pi pi-fw pi-cloud-upload', command: (event) => { weatherAddCityWidget() },},
          {label: 'Remove Weather service', icon: 'pi pi-fw pi-sign-out', command: (event) => { weatherUnregister() },}
        ]
      } else {
        this.items[3].items = [
          {label: 'Add Weather service', icon: 'pi pi-fw pi-sign-in', command: (event) => { weatherRegister() },},
        ]
      }
      // Init currency panel
      if (this.userData.currencyService) {
        this.items[4].items = [
          {label: 'Currency Widget', icon: 'pi pi-fw pi-money-bill', command: (event) => { currencyAddCurrencyWidget() },},
          {label: 'Remove Currency service', icon: 'pi pi-fw pi-sign-out', command: (event) => { currencyUnregister() },}
        ]
      } else {
        this.items[4].items = [
          {label: 'Add Currency service', icon: 'pi pi-fw pi-sign-in', command: (event) => { currencyRegister() },},
        ]
      }
    }
  },
  data() {
		return {
      user: {},
      userData: {
        imgurService: false,
        spotifyService: false,
        steamService: false,
        weatherService: false,
        currencyService: false,
        displayName: "",
        profilePic: "",
        widgets: [],
      },
			items: [
            {
              label: 'Imgur',
              icon:'pi pi-fw pi-images',
              items: [
              ]
            },
            {
              label: 'Spotify',
              icon:'pi pi-fw pi-volume-up',
              items: [
              ]
            },
            {
              label: 'Steam',
              icon:'pi pi-fw pi-desktop',
              items: [
              ]
            },
            {
              label: 'Weather',
              icon:'pi pi-fw pi-cloud',
              items: [
              ]
            },
            {
              label: 'Currency',
              icon:'pi pi-fw pi-money-bill',
              items: [
              ]
            },
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
#mydrag {
  flex-direction: row;
  flex-wrap: wrap;
}
#icon{
  width: 125px;
}
</style>