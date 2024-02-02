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
          prompt: "Inicio",
          mainMenu: true,
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
      {
        path: "/candidates",
        name: "candidates",
        meta: {
          mainMenu: true,
          prompt: "Candidatos",
        },
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/CandidatesView.vue"),
        props: true,
        children: [
          {
            path: "/:candidate/UCs",
            name: "candidateUCs",
            meta: {
              prompt: "UCs",
              candidateMenu: true,
            },
            component: () =>
              import(/* webpackChunkName: "home" */ "@/views/UCsView.vue"),
            props: true,
          },
          {
            path: "/:candidate/activities",
            name: "candidateActivities",
            meta: {
              prompt: "Actividades del candidato",
              candidateMenu: true,
            },
            component: () =>
              import(
                /* webpackChunkName: "home" */ "@/views/CandidateActivitiesView.vue"
              ),
            props: true,
          },
        ],
      },
      {
        path: "/sessions",
        name: "sessions",
        meta: {
          mainMenu: true,
          prompt: "Sesiones",
        },
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/SessionsView.vue"),
        props: true,
        children: [
          {
            path: "/:session",
            name: "session",
            meta: {
              prompt: "Sesión",
            },
            component: () =>
              import(/* webpackChunkName: "home" */ "@/views/SessionView.vue"),
            props: true,
          },
        ],
      },
      {
        path: "/ucsasesorables",
        name: "UCsAsesorables",
        meta: {
          mainMenu: true,
          prompt: "UCs asesorables",
        },
        component: () =>
          import(
            /* webpackChunkName: "home" */ "@/views/UCsAsesorablesView.vue"
          ),
        props: true,
      },
      {
        path: "/URLs",
        name: "URLs",
        meta: {
          prompt: "URLs",
          mainMenu: true,
        },
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/URLs.vue"),
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
