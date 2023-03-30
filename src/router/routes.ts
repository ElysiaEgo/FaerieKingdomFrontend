/* eslint-disable @typescript-eslint/promise-function-async */
import { RouteRecordRaw } from 'vue-router'

const mainRoutes: RouteRecordRaw[] = [
  {
    name: 'home',
    path: '/',
    component: () => import('../views/home.vue'),
    meta: {
      title: 'Home',
      requiresAuth: true
    }
  },
  {
    name: 'about',
    path: '/about',
    component: () => import('../views/about.vue'),
    meta: {
      title: 'About',
      requiresAuth: true
    }
  },
  {
    name: 'profile',
    path: '/profile',
    component: () => import('../views/profile.vue'),
    meta: {
      title: 'Profile',
      requiresAuth: true
    }
  }
]

const routes: RouteRecordRaw[] = [
  {
    name: 'login',
    path: '/login',
    component: () => import('../views/login.vue'),
    meta: {
      title: 'Sign In'
    }
  },
  {
    name: 'layout',
    path: '/',
    component: () => import('../layouts/index.vue'),
    children: mainRoutes
  },
  // ## not found page
  {
    name: 'not-found',
    path: '/:path*',
    component: () => import('../views/error.vue'),
    meta: {
      title: 'Oh no!'
    }
  }
]

export default routes
