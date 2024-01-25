// Composables
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "",
        name: "Home",
        meta: {
          mainMenu: true,
          prompt: "Raíz",
        },
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
        props: true,
      },
      {
        path: "/mydata",
        name: "mydata",
        meta: {
          mainMenu: true,
          prompt: "Mis datos",
        },
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/MyDataView.vue"),
        props: true,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
