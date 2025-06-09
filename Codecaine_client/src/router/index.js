import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "mainLayout",
      component: () => import("../layouts/MainLayout.vue"),
      children: [
        {
          path: "",
          name: "redirect", //沒有name vue會報錯 但可以用 先隨便加個name試試
          redirect: "/trending",
        },
        {
          path: "your-work",
          name: "your-work",
          component: () => import("../views/YourWork.vue"),
        },
        {
          path: "following",
          name: "following",
          component: () => import("../views/Following.vue"),
        },
        {
          path: "trending",
          name: "trending",
          component: () => import("../views/Trending.vue"),
        },
        {
          path: "user/:userId",
          name: "profile",
          component: () => import("../layouts/ProfileLayout.vue"),
        },
        {
          path: "search",
          name: "search",
          component: () => import("../views/Search.vue"),
        },
        {
          path: "search/:category",
          name: "search-category",
          component: () => import("../views/Search.vue"),
        },
        {
          path: "signup",
          name: "signup",
          component: () => import("../views/Signup.vue"),
          meta: {
            requiresGuest: true,
          },
        },
        {
          path: "login",
          name: "login",
          component: () => import("../views/Login.vue"),
          meta: {
            requiresGuest: true,
          },
        },
        {
          path: "profile",
          component: () => import("../layouts/ProfileLayout.vue"),
          children: [
            {
              path: "",
              redirect: "/profile/caines",
            },
            {
              path: "caines",
              name: "userscaines",
              component: () => import("../views/usersCaines.vue"),
              children: [
                {
                  path: "",
                  redirect: "/profile/caines/showcase",
                },
                {
                  path: "showcase",
                  name: "cainesshowcase",
                  component: () => import("../views/Showcase.vue"),
                },
                {
                  path: "public",
                  name: "cainesPublic",
                  component: () => import("../views/Public.vue"),
                },
                {
                  path: "private",
                  name: "cainesprivate",
                  component: () => import("../views/Private.vue"),
                },
                {
                  path: "loved",
                  name: "cainesloved",
                  component: () => import("../views/Loved.vue"),
                },
              ],
            },
            {
              path: "following",
              name: "Profilefollowing",
              component: () => import("../views/usersFollowing.vue"),
            },
            {
              path: "followers",
              name: "Profilefollowers",
              component: () => import("../views/usersFollowers.vue"),
            },
          ],
        },
        {
          path: "settings",
          component: () => import("../layouts/SettingLayout.vue"),
          children: [
            {
              path: "",
              redirect: "/settings/profile",
            },
            {
              path: "profile",
              name: "SettingProfile",
              component: () => import("../views/SettingProfile.vue"),
            },
            {
              path: "account",
              name: "settingAccount",
              component: () => import("../views/SettingAccount.vue"),
            },
          ],
        },
      ],
    },
    {
      path: "/pen",
      name: "newPen",
      component: () => import("../views/Pen.vue"),
    },
    {
      path: "/:username/pen/:id",
      name: "pen",
      component: () => import("../views/Pen.vue"),
    },
    {
      path: "/:username/details/:pen_id",
      name: "pen-details",
      component: () => import("../views/PenDetailPage.vue"),
      meta: { canBeModal: true },
    },
  ],
});
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresGuest && authStore.idToken) {
    // 已登入就導回首頁
    return next("/");
  }
  next();
}); //進入signup後 codepne是500頁面 可以再做調整
export default router;
