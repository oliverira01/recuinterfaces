import { createRouter, createWebHistory } from 'vue-router'
import IniCio from "@/components/IniCio.vue";
import AcerCa from "@/components/AcerCa.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: IniCio
    },
    {
      path: "/about",
      component: AcerCa
    }
  ],
})

export default router
