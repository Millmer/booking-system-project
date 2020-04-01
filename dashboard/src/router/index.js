import Vue from 'vue';
import Router from 'vue-router';
import { publicRoutes, protectedRoutes } from "./config";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import AuthEventBus from '@/utils/AuthEventBus';
import { getUser } from '@/utils/auth.js'
const routes = publicRoutes.concat(protectedRoutes);

Vue.use(Router);

// Setup Router
const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  linkActiveClass: "active",
  routes: routes
});

// Use authState
AuthEventBus.$on('authState', async (state) => {
  const pushPathes = {
    signedOut: () => {
      router.push({path: '/auth'});
    },
    passwordReset: () => { 
      router.push({path: '/auth/reset'});
    },
    forcePasswordReset: () => {
      router.push({path: '/auth/reset', query: { force: true }});
    },
    signIn: () => {
      router.push({path: '/auth'});
    },
    signedIn: () => {
      router.push({path: '/'});
    }
  }
  if (typeof pushPathes[state] === 'function') {
    pushPathes[state]();
  }
});

// Router guards
router.beforeResolve(async (to, from, next) => {
  if (to.name) NProgress.start();
  // Check if route requires auth
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Try to get user
    let user;
    try {
      const data = await getUser();
      if (data && data.signInUserSession) {
        // User logged in, let them through
        user = data;
        next();
      } else {
        next({path:'/auth'});
      }
    } catch(e) {
      // Uh oh, couldn't get user, redirect to be safe
      console.error(e);
      next({path:'/auth'});
    }

    if (!user) {
      // User doesn't have a session
      next({path:'/auth'});
    } else {
      next();
    }
  } else {
    // Route doesn't require auth
    next();
  }
});

// Stop progress
router.afterEach(() => {
  NProgress.done();
});

export default router;
