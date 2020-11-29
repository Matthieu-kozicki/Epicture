<template>
  <div id="container_main" class="container-fluid">
    <div class="row">
      <!-- left side -->
      <div id="left" class="col-2">
        <div id="card">
          <Card>
            <template v-slot:header v-if="userData.profilePic">
              <img id="icon" alt="You don't have Profile picture" v-bind:src="userData.profilePic" />
            </template>
            <template v-slot:header v-else>
              <img id="icon" alt="You don't have Profile pic" src='../assets/empty.png' />
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
            <spotify-top
              :widgetId="wi.id"
              :userId="this.user.uid"
              :typeProp="wi.typeParam"
              :delayProp="wi.delayParam"
              :timerParamProp="wi.refresh"
              v-if="wi.type === 'spotifytop'"
            />
            <steam-game-info
              :widgetId="wi.id"
              :userId="this.user.uid"
              :gameIdProp="wi.gameId"
              :timerParamProp="wi.refresh"
              v-if="wi.type === 'steamgameinfo'"
            />
            <weather-city
              :cityProp="wi.city"
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
            <channel
              :userId="this.user.uid"
              :widgetId="wi.id"
              :channelNameProp="wi.channelName"
              :timerParamProp="wi.refresh"
              v-if="wi.type === 'ytbchannel'"
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
import { spotifyRegister, steamRegister, weatherRegister, currencyRegister, youtubeRegister } from './Service.vue'

// Widgets
import ImgurSearch, { imgurAddSearchWidget } from '../widgets/Imgur/ImgurSearch.vue'
import ImgurProfile, { imgurAddProfileWidget } from '../widgets/Imgur/ImgurProfile.vue'
import SpotifyArtist, { spotifyAddArtistWidget } from '../widgets/Spotify/SpotifyArtist.vue'
import SpotifyProfile, { spotifyAddProfileWidget } from '../widgets/Spotify/SpotifyProfile.vue'
import SpotifyTop, { spotifyAddTopWidget } from '../widgets/Spotify/SpotifyTop.vue'
import WeatherCity, { weatherAddCityWidget, WeatherCityWidget } from '../widgets/Weather/WeatherCity.vue'
import SteamGameInfo, { steamAddGameinfoWidget } from '../widgets/Steam/SteamGameInfo.vue'
import Currency, { currencyAddCurrencyWidget } from '../widgets/Currency/Currency.vue'
import Channel, { youtubeAddChannelWidget } from '../widgets/Youtube/Channel.vue'

/**
 * Main component of our application, the Dashboard renders
 * all widgets and informations about the currently connected user
 */
export default {
  components: { ImgurSearch, draggable: VueDraggableNext, ImgurProfile, SpotifyArtist, SpotifyProfile, SteamGameInfo, WeatherCity, Currency, Channel, SpotifyTop },
  async mounted() {
    this.getWidgets();
    this.getServices();
  },
  methods:
  {
    /**
     * Method to disconnect the currently connected user
     */
    disconnect: function() {
      console.log("Disconnected !")
      firebase.auth().signOut()
      window.localStorage.setItem("currentUser", "null")
      this.$router.replace({name: "Login"})
    },
    /**
     * @private
     */
    toggle(event) {
      this.$refs.menu.toggle(event);
    },
    /**
     * This function allows the user to register to the imgur service
     */
    imgurRegister() {
      window.location.href = "https://api.imgur.com/oauth2/authorize?client_id=cec086e98fbd327&response_type=token";
    },
    /**
     * This function allows the user to unregister from a service
     * it accepts a serviceName param which is the name of the service
     */
    unregisterService(serviceName) {
      const usr = JSON.parse(window.localStorage.getItem("currentUser"));
      db.collection("users").doc(usr.uid).collection("services").doc(serviceName).delete();

      if (serviceName === "imgur")
          this.userData.imgurService = false;
      if (serviceName === "spotify")
          this.userData.spotifyService = false;
      if (serviceName === "steam")
          this.userData.steamService = false;
      if (serviceName === "weather")
          this.userData.weatherService = false;
      if (serviceName === "currency")
          this.userData.currencyService = false;
      if (serviceName === "youtube")
          this.userData.youtubeService = false;
    },
    /**
     * This function is used to get the widgets of the currently connected user
     */
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
    /**
     * This function is used to get the services of the currently connected user
     */
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
              if (doc.id === "youtube") {
                this.userData.youtubeService = true;
              }
            }.bind(this))
            this.initPanels();
          }.bind(this));
      }
    },
    /**
     * @private
     */
    initPanels() {
      // Init Imgur panel
      if (this.$data.userData.imgurService) {
        this.$data.items[0].items = [
        {label: 'Search Widget', icon: 'pi pi-fw pi-search', command: (event) => { imgurAddSearchWidget() }},
        {label: 'Profile Widget', icon: 'pi pi-fw pi-user', command: (event) => { imgurAddProfileWidget() }},
        {label: 'Remove Imgur Service', icon: 'pi pi-fw pi-sign-out', command: (event) => { this.unregisterService("imgur") }},
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
          {label: 'Top Widget', icon: 'pi pi-fw pi-star', command: (event) => { spotifyAddTopWidget() }},
          {label: 'Remove Spotify Service', icon: 'pi pi-fw pi-sign-out', command: (event) => { this.unregisterService("spotify") }},
        ]
      } else {
        this.$data.items[1].items = [
          {label: 'Connect to Spotify', icon: 'pi pi-fw pi-sign-in', command: (event) => { spotifyRegister() },}
        ]
      }
      // Init weather panel
      if (this.userData.weatherService) {
        this.items[2].items = [
          {label: 'Weather Widget', icon: 'pi pi-fw pi-cloud-upload', command: (event) => { weatherAddCityWidget() },},
          {label: 'Remove Weather service', icon: 'pi pi-fw pi-sign-out', command: (event) => { this.unregisterService("weather") },}
        ]
      } else {
        this.items[2].items = [
          {label: 'Add Weather service', icon: 'pi pi-fw pi-sign-in', command: (event) => { weatherRegister() },},
        ]
      }
      // Init currency panel
      if (this.userData.currencyService) {
        this.items[3].items = [
          {label: 'Currency Widget', icon: 'pi pi-fw pi-money-bill', command: (event) => { currencyAddCurrencyWidget() },},
          {label: 'Remove Currency service', icon: 'pi pi-fw pi-sign-out', command: (event) => { this.unregisterService("currency") },}
        ]
      } else {
        this.items[3].items = [
          {label: 'Add Currency service', icon: 'pi pi-fw pi-sign-in', command: (event) => { currencyRegister() },},
        ]
      }
      // Init youtube panel
      if (this.userData.youtubeService) {
        this.items[4].items = [
          {label: 'Channel Widget', icon: 'pi pi-fw pi-chart-line', command: (event) => { youtubeAddChannelWidget() },},
          {label: 'Remove Youtube service', icon: 'pi pi-fw pi-sign-out', command: (event) => { this.unregisterService("youtube") },}
        ]
      } else {
        this.items[4].items = [
          {label: 'Add Youtube service', icon: 'pi pi-fw pi-sign-in', command: (event) => { youtubeRegister() },},
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
        youtubeService: false,
        displayName: "",
        profilePic: "",
        widgets: [],
      },
			items: [
            {
              label: 'Imgur',
              icon:'pi pi-fw pi-images',
              items: []
            },
            {
              label: 'Spotify',
              icon:'pi pi-fw pi-volume-up',
              items: []
            },
            {
              label: 'Weather',
              icon:'pi pi-fw pi-cloud',
              items: []
            },
            {
              label: 'Currency',
              icon:'pi pi-fw pi-money-bill',
              items: []
            },
            {
              label: 'Youtube',
              icon: 'pi pi-fw pi-video',
              items: []
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
  padding-left: 65px;
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
  margin-top: 20px;
  width: 125px;
}
</style>