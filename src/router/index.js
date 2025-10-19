import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../views/Index.vue')
  },
  {
    path: '/pixel',
    name: 'PixelCat',
    component: () => import('../views/PixelCat.vue')
  },
  {
    path: '/sketch',
    name: 'SketchCat',
    component: () => import('../views/SketchCat.vue')
  },
  {
    path: '/pixel-auto',
    name: 'PixelCatAuto',
    component: () => import('../views/PixelCatAuto.vue')
  },
  {
    path: '/sketch-auto',
    name: 'SketchCatAuto',
    component: () => import('../views/SketchCatAuto.vue')
  }
  ,
  {
    path: '/pixel-play',
    name: 'PixelPlay',
    component: () => import('../views/PixelPlay.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

