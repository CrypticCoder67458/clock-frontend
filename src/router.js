import Vue from "vue";
import Router from "vue-router";
import TokenService from "@/services/storage.service";
import ViewLogin from "@/views/ViewLogin";
import ViewLogout from "@/views/ViewLogout";
import ViewCalendar from "@/views/ViewCalendar.vue";
import ViewShiftForm from "@/views/ViewShiftForm";
import ViewShiftList from "@/views/ViewShiftList";
import ViewContractForm from "@/views/ViewContractForm";
import ViewContractList from "@/views/ViewContractList";
import ViewClockInOut from "@/views/ViewClockInOut";
import store from "@/store";

Vue.use(Router);

function queryData(to, from, next) {
  Promise.all([
    store.dispatch("shift/queryShifts"),
    store.dispatch("contract/queryContracts")
  ])
    .then(() => {
      store.dispatch("stopLoading");
      next();
    })
    .catch(() => next({ path: "uhoh" }));
}

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "login",
      component: ViewLogin,
      meta: {
        public: true,
        onlyWhenLoggedOut: true
      }
    },
    {
      path: "/logout",
      name: "logout",
      component: ViewLogout,
      meta: {
        public: false,
        onlyWhenLoggedOut: false
      }
    },
    {
      path: "/",
      name: "c",
      component: ViewCalendar,
      beforeEnter: queryData
    },
    {
      path: "/:type/:year/:month/:day",
      name: "calendar",
      component: ViewCalendar,
      props: true
    },
    {
      path: "/shifts/:uuid/edit",
      name: "editShift",
      component: ViewShiftForm,
      props: true
    },
    {
      path: "/shifts/create",
      name: "createShift",
      component: ViewShiftForm
    },
    {
      path: "/shifts/",
      name: "shiftList",
      component: ViewShiftList,
      beforeEnter: queryData
    },
    {
      path: "/contracts/create",
      name: "createContract",
      component: ViewContractForm
    },
    {
      path: "/contracts/:uuid/edit",
      name: "editContract",
      component: ViewContractForm,
      props: true
    },
    {
      path: "/contracts/",
      name: "contractList",
      component: ViewContractList,
      beforeEnter: queryData
    },
    {
      path: "/clock",
      name: "clockInOut",
      component: ViewClockInOut
    }
  ]
});

router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some(record => record.meta.public);
  const onlyWhenLoggedOut = to.matched.some(
    record => record.meta.onlyWhenLoggedOut
  );
  const loggedIn = !!TokenService.getToken();

  if (!isPublic && !loggedIn) {
    return next({
      path: "/login",
      query: { redirect: to.fullPath } // Store the full path to redirect the user to after login
    });
  }

  // Do not allow user to visit login page or register page if they are logged in
  if (loggedIn && onlyWhenLoggedOut) {
    return next("/");
  }

  next();
});

export default router;
