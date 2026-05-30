import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import Register from "@/views/register.vue";
import Login from "@/views/login.vue";
import DetailPage from "../components/DetailPage.vue";
import AddtoCart from "@/components/AddtoCart.vue";
import ContactUS from "@/views/ContactUS.vue";
import Checkout from "@/views/Checkout.vue";
import Success from "@/views/Success.vue";
import Profile from "@/views/Profile.vue";

import ForgotPassword from "@/views/forgotPass/forgotpassword.vue";
import ResetPassword from "@/views/forgotPass/resetpassword.vue";
import VerityOtp from "@/views/forgotPass/verityOtp.vue";

import { useauthStore } from "@/stores/auth.js";

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
      path: "/ContactUS",
      name: "ContactUS",
      component: ContactUS,
      meta: {
        title: "Contact Us",
      },
    },

    {
      path: "/register",
      name: "register",
      component: Register,
      meta: {
        title: "Register",
        guestOnly: true,
      },
    },

    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        title: "Login",
        guestOnly: true,
      },
    },

    {
      path: "/profile",
      name: "profile",
      component: Profile,
      meta: {
        title: "Profile",
        requiresAuth: true,
      },
    },

    {
      path: "/detail/:id",
      name: "detail",
      component: DetailPage,
      meta: {
        title: "Detail",
      },
    },
    {
      path: "/addtoCart",
      name: "addtoCart",
      component: AddtoCart,
      meta: {
        title: "Cart",
        requiresAuth: true,
      },
    },
    {
      path: "/checkout",
      name: "checkout",
      component: Checkout,
      meta: {
        title: "Checkout",
        requiresAuth: true,
      },
    },

    {
      path: "/success",
      name: "success",
      component: Success,
      meta: {
        title: "Success",
        requiresAuth: true,
      },
    },

    {
      path: "/forgotpassword",
      name: "forgotPassword",
      component: ForgotPassword,
      meta: {
        title: "Forgot Password",
      },
    },

    {
      path: "/verityOtp",
      name: "verityOtp",
      component: VerityOtp,
      meta: {
        title: "Verify OTP",
      },
    },

    {
      path: "/resetpassword",
      name: "resetpassword",
      component: ResetPassword,
      meta: {
        title: "Reset Password",
      },
    },
  ],
});

router.beforeEach((to) => {

  const auth = useauthStore();
  // Change browser title
  document.title = `${to.meta.title} | ពិភពទំនិញ`;

  // Protect routes
  if (to.meta.requiresAuth && !auth.token) {
    return "/login";
  }


  return true;
});

export default router;
