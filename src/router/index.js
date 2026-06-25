import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import { useauthStore } from "@/stores/auth";
import shopPage from "@/views/shop/shopPage.vue";
import Register from "@/views/register.vue";
import Login from "@/views/login.vue";
import DetailPage from "../components/DetailPage.vue";
import CheckoutView from "@/views/CheckoutView.vue";
import Profile from "@/views/Profile.vue";
import ContactUS from "@/views/ContactUS.vue";
import AddtoCart from "@/components/AddtoCart.vue";
import ForgotPassword from "@/views/forgotPass/forgotpassword.vue";
import ResetPassword from "@/views/forgotPass/resetpassword.vue";
import VerityOtp from "@/views/forgotPass/verityOtp.vue";
import sellPage from "@/views/sellPage.vue";
import sellProduct from "@/components/profiles/sellProduct.vue";
import AboutView from "@/views/AboutView.vue";

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
      path: "/contactUS",
      name: "contactUS",
      component: ContactUS,
      meta: {
        title: "Contact Us",
      },
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
      meta: {
        title: "About Us",
      },
    },
    {
      path: "/sellProduct",
      name: "SellProduct",
      component: sellProduct,
      meta: {
        title: "Sell Product",
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
      path: "/purchased",
      name: "purchased",
      component: () => import('@/views/PurchasedView.vue'),
      meta: {
        title: "Purchased",
        requiresAuth: true,
      },
    },
    {
      path: "/checkout",
      name: "checkout",
      component: CheckoutView,
      meta: {
        title: "Checkout",
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
    {
      path: "/shop-page",
      name: "shop",
      component: shopPage,
      meta: {
        title: "shop",
      },
    },
    {
      path: "/detailpage/:id",
      name: "detailpage",
      component: DetailPage,
      meta: {
        title: "Detail Page",
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
      path: "/sellPage/:id?",
      name: "sellPage",
      component: sellPage,
      meta: {
        title: "Sell Page",
        requiresAuth: true,
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
  if (auth.token && to.path == "/login") {
    return "/";
  }

  return true;
});

export default router;