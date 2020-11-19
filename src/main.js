// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase/app'

var firebaseConfig = {
    apiKey: "AIzaSyCbvbigahv1ogH-kl9IoTexdWOkzlF4u_c",
    authDomain: "dashboard-93.firebaseapp.com",
    databaseURL: "https://dashboard-93.firebaseio.com",
    projectId: "dashboard-93",
    storageBucket: "dashboard-93.appspot.com",
    messagingSenderId: "404943818447",
    appId: "1:404943818447:web:b59d902fdfee4f0f50b1ba"
};

firebase.initializeApp(firebaseConfig)

createApp(App).use(router).mount('#app')
