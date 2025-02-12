import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/pages/LandingPage.vue'
import store from '@/store/index'

const routes = [
  {
    path: '/',
    name: 'landing-page',
    component: LandingPage
  },
  {
    path: '/daos',
    name: 'dao-list',
    component: () => import(/* webpackChunkName: "dao" */ '@/pages/DaoList.vue')
  },
  {
    path: '/dao/:id',
    name: 'dao',
    component: () => import(/* webpackChunkName: "dao" */ '@/pages/Dao.vue')
  },
  {
    path: '/create',
    name: 'dao-create',
    component: () => import(/* webpackChunkName: "dao" */ '@/pages/DaoCreate.vue'),
    beforeEnter: (to, from, next) => {
      if (store.getters['near/isSignedIn']) {
        next()
      } else {
        store.commit('near/signIn')
        next(false)
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router