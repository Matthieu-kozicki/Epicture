<template>
  <div class="border border-dark" id="background" v-if="!initialized">
    <div id="mymid">
      <div>
        <h5>Select a currency</h5>
        <Dropdown v-model="currencyParam" :options="currencies" :filter="true" optionLabel="name" placeholder="Select a currency"/>
        <h5> Time to refresh </h5>
        <InputText placeholder="Timer" type="number" v-model="timerParam" />
      </div>
      <div>
        <Button id="myright" v-on:click="saveConfig" icon="pi pi-check" class="p-button-rounded p-button-secondary"/>
        <Button v-on:click="deleteWidget" icon="pi pi-trash" class="p-button-rounded p-button-secondary"/>
      </div>
    </div>
  </div>
  <div class="border border-dark" id="background" v-else>
    <div v-if="!requestLoading">
      <img src='https://www.countryflags.io/eu/flat/64.png' alt="EUR flag">
      <h2>1 EUR</h2>
      <div id="spacing" />
      <img :src='currencyParam.flag' alt="EUR flag">
      <h2>{{currencyRequest.currency[0]}} {{currencyRequest.currency[1]}}</h2>
      <div id="spacing" />
      <h2>{{currencyRequest.date}}</h2>
    </div>
    <div v-else>
      <h3>Request loading...</h3>
    </div>
    <div id="mybutton">
      <Button id="settings" v-on:click="editConfig" icon="pi pi-cog" class="p-button-rounded p-button-secondary"/>
      <Button icon="pi pi-refresh" class="p-button-rounded p-button-secondary" @click="doRequest"/>
    </div>
  </div>
</template>

<script>
import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'
import { db } from '../../main'

export const currencyName = "currency";

export function currencyAddCurrencyWidget() {
  const usr = JSON.parse(window.localStorage.getItem("currentUser"));
  db.collection("users").doc(usr.uid).collection("widgets").doc().set({
    currency: "",
    refresh: 60,
    type: currencyName
  }).then(
      () => {
    console.log("[CURRENCY SERVICE] ADDED WIDGET CURRENCY");
    }
  )
}

export default {
  name: "currency",
  props: {
    userId: String,
    widgetId: String,
    currencyProp: String,
    timerParamProp: Number,
  },
  data() {
    return {
      currencyRequest: {},
      requestLoading: true,
      currencyParam: "",
      timerParam: 0,
      initialized: false,
      hasService: false,
      interval: 0,
      currencies: [
        {name: 'Us dollar', code: 'USD', flag: "https://www.countryflags.io/us/flat/64.png"},
        {name: 'Japanese yen', code: 'JPY', flag: "https://www.countryflags.io/jp/flat/64.png"},
        {name: 'Bulgarian lev', code: 'BGN', flag: "https://www.countryflags.io/bg/flat/64.png"},
        {name: 'Czech koruna', code: 'CZK', flag: "https://www.countryflags.io/cz/flat/64.png"},
        {name: 'Danish krone', code: 'DKK', flag: "https://www.countryflags.io/dk/flat/64.png"},
        {name: 'Pound sterling', code: 'GBP', flag: "https://www.countryflags.io/gb/flat/64.png"},
        {name: 'Hungarian forint', code: 'HUF', flag: "https://www.countryflags.io/hu/flat/64.png"},
        {name: 'Polish zloty', code: 'PLN', flag: "https://www.countryflags.io/pl/flat/64.png"},
        {name: 'Romanian leu', code: 'RON', flag: "https://www.countryflags.io/ro/flat/64.png"},
        {name: 'Swedish krona', code: 'SEK', flag: "https://www.countryflags.io/se/flat/64.png"},
        {name: 'Swiss franc', code: 'CHF', flag: "https://www.countryflags.io/ch/flat/64.png"},
        {name: 'Icelandic krona', code: 'ISK', flag: "https://www.countryflags.io/is/flat/64.png"},
        {name: 'Norwegian krone', code: 'NOK', flag: "https://www.countryflags.io/no/flat/64.png"},
        {name: 'Croatian kuna', code: 'HRK', flag: "https://www.countryflags.io/hr/flat/64.png"},
        {name: 'Russian rouble', code: 'RUB', flag: "https://www.countryflags.io/ru/flat/64.png"},
        {name: 'Turkish lira', code: 'TRY', flag: "https://www.countryflags.io/tr/flat/64.png"},
        {name: 'Australian dollar', code: 'AUD', flag: "https://www.countryflags.io/au/flat/64.png"},
        {name: 'Brazilian real', code: 'BRL', flag: "https://www.countryflags.io/br/flat/64.png"},
        {name: 'Canadian dollar', code: 'CAD', flag: "https://www.countryflags.io/ca/flat/64.png"},
        {name: 'Chinese yuan renminbi', code: 'CNY', flag: "https://www.countryflags.io/cn/flat/64.png"},
        {name: 'Hong Kong dollar', code: 'HKD', flag: "https://www.countryflags.io/hk/flat/64.png"},
        {name: 'Indonesian rupiah', code: 'IDR', flag: "https://www.countryflags.io/id/flat/64.png"},
        {name: 'Israeli shekel', code: 'ILS', flag: "https://www.countryflags.io/il/flat/64.png"},
        {name: 'Indian rupee', code: 'INR', flag: "https://www.countryflags.io/in/flat/64.png"},
        {name: 'South Korean won', code: 'KRW', flag: "https://www.countryflags.io/kr/flat/64.png"},
        {name: 'Mexican peso', code: 'MXN', flag: "https://www.countryflags.io/mx/flat/64.png"},
        {name: 'Malaysian ringgit', code: 'MYR', flag: "https://www.countryflags.io/my/flat/64.png"},
        {name: 'New Zealand dollar', code: 'NZD', flag: "https://www.countryflags.io/nz/flat/64.png"},
        {name: 'Philippine peso', code: 'PHP', flag: "https://www.countryflags.io/ph/flat/64.png"},
        {name: 'Singapore dollar', code: 'SGD', flag: "https://www.countryflags.io/sg/flat/64.png"},
        {name: 'Thai baht', code: 'THB', flag: "https://www.countryflags.io/th/flat/64.png"},
        {name: 'South African rand', code: 'ZAR', flag: "https://www.countryflags.io/za/flat/64.png"},
      ]
    };
  },
  async mounted() {

    // Savoir si l'utilisateur possède le service
    let doc = db.collection("users").doc(this.$props.userId).collection("services").doc("currency");
    let mdoc =  await doc.get();
    if (mdoc.exists) {
      this.$data.hasService = true;
    } else {
      this.$data.hasService = false;
    }

    // Récupérer les props et le passer aux state
    this.currencyParam = this.currencyProp;
    this.timerParam = parseInt(this.timerParamProp);

    // Lancer la requète si le widget est init
    if (this.currencyParam === undefined || this.currencyParam === "undefined" || this.hasService === false || this.currencyParam === "") {
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
    async doRequest() {
      this.requestLoading = true;
      var myHeaders = new Headers();

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      }

      let rep = await (await fetch(`https://api.exchangeratesapi.io/latest`, requestOptions)).json();
      let tmp = {}
      let i = 0;
      let keys = Object.keys(rep.rates);
      for (let val of Object.values(rep.rates)) {
        if (keys[i].toLowerCase() === this.currencyParam.code.toLowerCase()) {
          tmp = {
            currency: [keys[i], val],
            date: rep.date
          }
        }
        i++;
      }
      this.requestLoading = false;
      console.log(tmp);
      this.currencyRequest = tmp;
    },
    saveConfig() {
      this.updateFirebase();
      this.interval = setInterval(() => this.doRequest(), this.timerParam * 1000);
      this.initialized = true;
    },
    editConfig() {
      clearInterval(this.interval);
      this.initialized = false;
    },
    async updateFirebase() {
      let widgetRef = db.collection("users").doc(this.userId).collection("widgets").doc(this.widgetId);

      widgetRef.update({
        currency: this.currencyParam,
        refresh: this.timerParam
      })
    },
    deleteWidget() {
      db.collection("users").doc(this.userId).collection("widgets").doc(this.widgetId).delete();
      clearInterval(this.interval);
      console.log("Widget deleted !");
    }
  },
  beforeUnmount() {
    console.log("Cleared intervall :", this.interval);
    clearInterval(this.interval);
  }
}
</script>

<style scoped>
@import './../../../css/bootstrap.min.css';
#background {
  margin-left: 20px;
  background-color: rgb(245, 245, 245);
  border-radius: 15px;
  width: 300px;
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
#myscroll{
  overflow-y: scroll;
}
#mybutton {
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
#spacing {
  margin: 25px;
}
</style>