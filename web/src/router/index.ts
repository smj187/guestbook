import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home-view.vue')
  },
  {
    path: '/create',
    name: 'Create',
    component: () => import('../views/create-view.vue')
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("../views/admin-view.vue")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
