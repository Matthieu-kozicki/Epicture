import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'

import { firebase } from '@firebase/app'
import "firebaseui/dist/firebaseui.css";

import '@firebase/auth'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = to.matched.some(x => x.meta.requiresAuth);

  console.log("utilisateur ->", firebase.auth().currentUser);

  if (auth && !firebase.auth().currentUser) {
    next("/");
  } else {
    next();
  }
})

export default router
