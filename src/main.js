import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase/app'
import '@firebase/firestore'
import { firebaseConfig } from '../firebase/firebase.js'

import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import PanelMenu from 'primevue/panelmenu';
import Card from 'primevue/card';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const fb = firebase.initializeApp(firebaseConfig)
export const db = firebase.firestore();
const app = createApp(App);

app.use(ToastService)
app.use(router)

app.component('InputText', InputText);
app.component('Button', Button);
app.component('PanelMenu', PanelMenu)
app.component('Toast', Toast);
app.component('Card', Card);
app.component('Dialog', Dialog);

app.mount('#app');
