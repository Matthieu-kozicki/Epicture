import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase/app'
import { firebaseConfig } from '../firebase/firebase.js'

firebase.initializeApp(firebaseConfig)

createApp(App).use(router).mount('#app')
