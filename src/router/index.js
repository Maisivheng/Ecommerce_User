
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import register from "@/views/register.vue";
import login from "@/views/login.vue";
// import DetailPage from "../components/DetailPage.vue";
// import Checkout from "@/views/Checkout.vue";
// import Success from "@/views/Success.vue";
import { useauthStore } from "@/stores/auth";
import forgotpassword from '@/views/forgotPass/forgotpassword.vue'
import resetpassword from '@/views/forgotPass/resetpassword.vue'
import verityOtp from '@/views/forgotPass/verityOtp.vue'
import profile from '@/views/Profile.vue'
// import resetpassword from '@/views/forgotPassword/resetpassword.vue'
// import resetPassword from '@/views/forgotPassword/resetPassword.vue'


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
    },{
      path: '/contactUS',
      name: 'contactUS',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: 'contactUS',
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
      path: "/forgotpassword",
      name: "forgotPassword",
      component: forgotpassword,
      meta: {
        title: "forgot-Password",
      },
    },

    {
      path: "/verityOtp",
      name: "verityOtp",
      component: verityOtp,
      meta: {
        title: "Verity-Otp",
      },
    },

    {
      path: "/resetpassword",
      name: "resetpassword",
      component: resetpassword,
      meta: {
        title: "Reset-Password",
      },
    },
  ],
});

router.beforeEach((to)=>{
  // const auth = useauthStore()
  document.title = to.meta.title
  router.beforeEach((to, from) => {
  let auth = useauthStore();
  if(!auth.success && !to.path == '/login'){
    return {name : 'login'}
  }
  if(auth.success && to.path == '/login'){
    return '/'
  }
  return true;
})
})
export default router;
