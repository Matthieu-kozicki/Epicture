import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Drag from '../views/Drag.vue'
import Service from '../views/Service.vue'

import { firebase } from '@firebase/app'
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
  },
  {
    path: '/drag',
    name: 'Drag',
    component: Drag,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/service/n/:test',
    name: 'Service',
    component: Service,
    meta: {
      requiresAuth: false
    }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = to.matched.some(x => x.meta.requiresAuth);

  if (auth && !firebase.auth().currentUser) {
    next("/");
  } else {
    next();
  }
})

export default router
