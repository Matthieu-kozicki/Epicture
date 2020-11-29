import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Admin from '../views/Admin.vue'
import Service from '../views/Service.vue'

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
    path: '/admin',
    name: 'Admin',
    component: Admin,
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
  {
    path: '/access_token*',
    name: 'Service2',
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

  if (window.localStorage.getItem("currentUser") === "null" && auth) {
    next("/");
  } else {
    next();
  }
})

export default router
