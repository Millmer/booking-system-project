import { AuthLayout, DefaultLayout } from "@/components/layouts"

const publicRoutes = [
    {
        path: "/auth",
        component: AuthLayout,
        meta: { title: "Login" },
        redirect: "/auth/login",
        hidden: true,
        children: [
          {
            path: "login",
            name: "login",
            meta: { title: "Login" },
            component: () => import(/* webpackChunkName: "login" */ "@/views/auth/Login.vue")
          },
          {
            path: "reset",
            name: "reset",
            meta: { title: "Password Login" },
            component: () => import(/* webpackChunkName: "password-reset" */ "@/views/auth/PasswordReset.vue")
          }
        ]
    },
    {
      path: "/401",
      name: "401",
      meta: { title: "Unauthorized" },
      component: () => import(/* webpackChunkName: "errors-404" */ "@/views/error/Unauthorized.vue")
    },
    {
      path: "/404",
      name: "404",
      meta: { title: "Not Found" },
      component: () => import(/* webpackChunkName: "errors-404" */ "@/views/error/NotFound.vue")
    },
    {
      path: "/400",
      name: "400",
      meta: { title: "Bad Request" },
      component: () => import(/* webpackChunkName: "errors-400" */ "@/views/error/BadRequest.vue")
    },
    {
      path: "/500",
      name: "500",
      meta: { title: "Server Error" },
      component: () => import(/* webpackChunkName: "errors-500" */ "@/views/error/Error.vue")
    }
]

const protectedRoutes = [
    {
      path: '/',
      name: 'dashboard',
      meta: { title: "Dashboard", group: "apps", icon: "" },
      component: DefaultLayout,
      redirect: '/dashboard',
      alias: '/home',
      children: [
        {
          path: "/dashboard",
          name: "Dashboard",
          meta: { title: "Home", group: "apps", icon: "mdi-view-dashboard" },
          component: () => import(/* webpackChunkName: "dashboard" */ "@/views/Dashboard.vue")
        },
        {
          path: "/403",
          name: "403",
          meta: { title: "Access Denied", hiddenInMenu: true },
          component: () => import(/* webpackChunkName: "error-403" */ "@/views/error/Deny.vue")
        }
      ]
    },
    {
      path: "/cms",
      component: DefaultLayout,
      redirect: "/cms/hosts/list",
      meta: { title: "CMS", icon: "mdi-view-compact", group: "cms" },
      children: [
        {
          path: "/cms/bookings/list",
          name: "Bookings.list",
          meta: { title: "Bookings", icon: "mdi-calendar-check", group: "bookings" },
          component: () => import(/* webpackChunkName: "bookings" */ "@/views/bookings/List.vue")
        },
        {
            path: "/cms/calendar",
            name: "Calendar",
            meta: { title: "Calendar", icon: "mdi-calendar-today", group: "calendar" },
            component: () => import(/* webpackChunkName: "calendar" */ "@/views/calendar/Calendar.vue")
        },
        {
            path: "/cms/locations/list",
            name: "Locations.list",
            meta: { title: "Locations", icon: "mdi-city", group: "locations" },
            component: () => import(/* webpackChunkName: "locations" */ "@/views/locations/List.vue")
        },
        {
          path: "/cms/locations/create",
          name: "Locations.create",
          meta: { title: "Locations", icon: "mdi-city", group: "locations" },
          component: () => import(/* webpackChunkName: "locations" */ "@/views/locations/Create.vue")
        },
        {
          path: "/cms/locations/:id/edit",
          name: "Locations.edit",
          meta: { title: "Locations", icon: "mdi-city", group: "locations" },
          component: () => import(/* webpackChunkName: "locations" */ "@/views/locations/Edit.vue")
        },
        {
            path: "/cms/users/list",
            name: "Users.list",
            meta: { title: "Users", icon: "mdi-account-multiple", group: "users" },
            component: () => import(/* webpackChunkName: "users" */ "@/views/users/List.vue")
        },
        {
          path: "/cms/users/create",
          name: "Users.create",
          meta: { title: "Users", icon: "mdi-account-multiple", group: "users", breadcrumbPath: "/cms/users/list" },
          component: () => import(/* webpackChunkName: "users" */ "@/views/users/Create.vue")
        },
        {
          path: "/cms/users/:id/edit",
          name: "Users.edit",
          meta: { title: "Users", icon: "mdi-account-multiple", group: "users", breadcrumbPath: "/cms/users/list" },
          component: () => import(/* webpackChunkName: "users" */ "@/views/users/Edit.vue")
        },
        {
          path: "/cms/countries/list",
          name: "Countries.list",
          meta: { title: "Countries", icon: "mdi-map", group: "countries" },
          component: () => import(/* webpackChunkName: "countries" */ "@/views/countries/List.vue")
        },
        {
          path: "/cms/countries/create",
          name: "Countries.create",
          meta: { title: "Countries", icon: "mdi-map", group: "countries", breadcrumbPath: "/cms/countries/list" },
          component: () => import(/* webpackChunkName: "countries" */ "@/views/countries/Create.vue")
        },
        {
          path: "/cms/countries/:id/edit",
          name: "Countries.edit",
          meta: { title: "Countries", icon: "mdi-globe", group: "countries", breadcrumbPath: "/cms/countries/list" },
          component: () => import(/* webpackChunkName: "countries" */ "@/views/countries/Edit.vue")
        },
        {
          path: "/cms/cities/list",
          name: "Cities.list",
          meta: { title: "Cities", icon: "mdi-city", group: "cities" },
          component: () => import(/* webpackChunkName: "cities" */ "@/views/cities/List.vue")
        },
        {
          path: "/cms/cities/create",
          name: "Cities.create",
          meta: { title: "Cities", icon: "mdi-city", group: "cities", breadcrumbPath: "/cms/cities/list" },
          component: () => import(/* webpackChunkName: "cities" */ "@/views/cities/Create.vue")
        },
        {
          path: "/cms/cities/:id/edit",
          name: "Cities.edit",
          meta: { title: "Cities", icon: "mdi-city", group: "cities", breadcrumbPath: "/cms/cities/list" },
          component: () => import(/* webpackChunkName: "cities" */ "@/views/cities/Edit.vue")
        }
      ]
    }
];

const mapRoutesAuth = (route, requiresAuth) => route.meta = {requiresAuth, ...route.meta};
publicRoutes.forEach(route => mapRoutesAuth(route, false));
protectedRoutes.forEach(route => mapRoutesAuth(route, true));

export { publicRoutes, protectedRoutes };