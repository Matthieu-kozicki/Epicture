<template>
  <div class="border border-dark" id="background" v-if="!initialized">
    <div id="mymid">
      <div>
        <h5>Enter a city</h5>
        <InputText placeholder="Enter a city" type="text" v-model="cityParam" />
        <h5> Time to refresh </h5>
        <InputText placeholder="Timer" type="number" v-model="timerParam" />
      </div>
      <div>
        <Button id="myright" v-on:click="saveConfig" icon="pi pi-check" class="p-button-rounded p-button-info"/>
        <Button v-on:click="deleteWidget" icon="pi pi-trash" class="p-button-rounded p-button-info"/>
      </div>
    </div>
  </div>
  <div class="border border-dark" id="background" v-else>
    <div v-if="!requestLoading">
      <h2>{{weatherRequest.name}}</h2>
      <div>
        <img :src="'http://openweathermap.org/img/wn/' + weatherRequest.weather[0].icon + '@2x.png'" alt="image">
        <h3>{{weatherRequest.main.temp}}°C</h3>
      </div>
      <div id="myhumidity">
        <img id="myrain" src='../../assets/humidity.png' alt="image">
        <h3>{{weatherRequest.main.humidity}}%</h3>
      </div>
    </div>
    <div v-else>
      <h3>Request loading...</h3>
    </div>
    <div id="mybutton">
      <Button id="settings" v-on:click="editConfig" icon="pi pi-cog" class="p-button-rounded p-button-info"/>
      <Button icon="pi pi-refresh" class="p-button-rounded p-button-info" @click="doRequest"/>
    </div>
  </div>
</template>

<script>
import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'
import { db } from '../../main'

export const weatherCityName = "weathercity";

export function weatherAddCityWidget() {
  const usr = JSON.parse(window.localStorage.getItem("currentUser"));
  db.collection("users").doc(usr.uid).collection("widgets").doc().set({
    city: "",
    refresh: "60",
    type: weatherCityName
  }).then(
      () => {
    console.log("[WEATHER SERVICE] ADDED WIDGET CITY");
    }
  )
}

/**
 * This component renders the weathercity widget
 * It takes a city param
 */
export default {
  name: "weather-city",
  props: {
    userId: String,
    widgetId: String,
    cityProp: String,
    timerParamProp: String,
  },
  data() {
    return {
      weatherRequest: {},
      requestLoading: true,
      cityParam: "",
      timerParam: 0,
      initialized: false,
      hasService: false,
      interval: 0,
    };
  },
  /**
   * The mounted function checks if the user has the service
   * If so the widget is launched and the request is done, if not the user has to configure the widget
  */
  async mounted() {
    console.log(this.cityProp);
    // Savoir si l'utilisateur possède le service
    let doc = db.collection("users").doc(this.$props.userId).collection("services").doc("weather");
    let mdoc =  await doc.get();
    if (mdoc.exists) {
      this.$data.hasService = true;
    } else {
      this.$data.hasService = false;
    }

    // Récupérer les props et le passer aux state
    this.cityParam = this.cityProp;
    this.timerParam = this.timerParamProp;

    // Lancer la requète si le widget est init
    if (this.cityParam === undefined || this.cityParam === "undefined" || this.hasService === false || this.cityParam === "") {
      this.initialized = false;
      return;
    } else {
      this.doRequest();
      this.interval = setInterval(() => this.doRequest(), this.timerParam * 1000);
      console.log("Created interval : ", this.interval)
      this.initialized = true;
    }
  },
  methods: {
      /**
     * This function does the request to get the meteo about a city
     */
    async doRequest() {
      this.requestLoading = true;
      var myHeaders = new Headers();

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      }

      let rep = await (await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${this.cityParam}&appid=95f1c29934da792bce4e521d7043b3ba&http://api.openweathermap.org/data/2.5/weather?q=Paris&appid=95f1c29934da792bce4e521d7043b3ba&units=metric`)).json();
      this.requestLoading = false;
      console.log(rep);
      this.weatherRequest = rep;
    },
    /**
     * This function is used to save the widget configuration
    */
    saveConfig() {
      this.updateFirebase();
      this.interval = setInterval(() => this.doRequest(), this.timerParam * 1000);
      this.initialized = true;
    },
    /**
     * This function is used to change the component to its configuration mode
     */
    editConfig() {
      clearInterval(this.interval);
      this.initialized = false;
    },
    /**
     * This function updates the widget parameters by storing them into firebase
     * It takes the props and stores them into the widget document
    */
    async updateFirebase() {
      let widgetRef = db.collection("users").doc(this.userId).collection("widgets").doc(this.widgetId);

      widgetRef.update({
        city: this.cityParam,
        refresh: this.timerParam
      })
    },
    /**
     * Deletes the widget
    */
    deleteWidget() {
      db.collection("users").doc(this.userId).collection("widgets").doc(this.widgetId).delete();
      clearInterval(this.interval);
      console.log("Widget deleted !");
    }
  },
  beforeUnmount() {
    clearInterval(this.interval);
  }
}
</script>

<style scoped>
@import './../../../css/bootstrap.min.css';
#background {
  margin-left: 20px;
  background: rgb(209,209,209);
  background: radial-gradient(circle, rgba(209,209,209,1) 20%, rgba(142,202,228,1) 100%);
  width: 300px;
  border-radius: 15px;
  height: 400px;
  display: flex;
  flex-direction: column;
  margin :10px;
}
#inputs {
  width: 40%;overflow: scroll;
  height: 80px;
  margin: 5px;
}
#myright{
  margin-right: 3px;
}
#mycolor{
  color: green;
}
#myicon{
  width: 120px;
}
#mycolorscroll{
  height: 18px;
  color: green;
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;
}
#mycolorscroll::-webkit-scrollbar { /* WebKit */
    width: 0;
    height: 0;
}
#myimage{
  width: 350px;
  height: 350px;
}
#myrain{
  margin-top: -17px;
}
#myscroll{
  overflow-y: scroll;
}
#myhumidity {
  margin: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
#mybutton {
  display: table-cell;
  vertical-align: bottom;
  margin-top: 2px;
  margin-bottom: 2px;
  margin-left: 1px;
}
#settings{
  margin-right: 3px;
}
#mymid{
  margin: auto;
  justify-content: center;
  align-items: center;
}
</style>