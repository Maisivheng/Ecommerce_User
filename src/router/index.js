import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import register from '@/views/register.vue'
import login from '@/views/login.vue'
import profile from '@/views/Profile/profile.vue'
import { useauthStore } from '@/stores/auth'
import forgotpassword from '@/views/forgotPassword/forgotPassword.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        title: "Home",
      },
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
      meta: {
        title: "About",
      },
    },
    {
      path: "/register",
      name: "register",
      component: register,
      meta: {
        title: "Register",
      },
    },
    {
      path: "/login",
      name: "login",
      component: login,
      meta: {
        title: "Login",
      },
    },
    {
      path: "/profile",
      name: "profile",
      component: profile,
      meta: {
        title: "Profile",
      },
    },

    {
      path: "/forgot-password",
      name: "forgot-password",
      component: forgotpassword,
      meta: {
        title: "Forgot Password",
      },
    },
  ],
});

router.beforeEach((to)=>{
  const auth = useauthStore()
  document.title = to.meta.title
  if(!auth.token && to.path !== '/login'){
    return '/login'
  }
  if(auth.token && to.path == '/login'){
    return '/'
  }
  return true

})
export default router;
