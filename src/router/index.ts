import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import GameView from '../views/GameView.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/games/',
    name: 'Home',
    component: Home
  },
  {
    path: '/games/:gameId',
    name: 'Games',
    component: GameView
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: '/farkel-ui/',
  routes
})

export default router
