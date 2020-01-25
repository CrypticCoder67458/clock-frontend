import { UserService } from "@/services/user";
import ApiService from "@/services/api";
import router from "@/router";
import { log } from "@/utils/log";

const state = {
  accessToken: null,
  refreshToken: null,
  refreshTokenPromise: null
};

const getters = {
  loggedIn: state => state.accessToken !== null,
  accessToken: state => state.accessToken,
  refreshToken: state => state.refreshToken
};

const actions = {
  LOGIN({ commit }, { email, password }) {
    return UserService.login(email, password).then(response => {
      log("AuthVuex.login: resolved");
      commit("LOGIN", response.data);
      ApiService.setHeader(response.data.access);

      // Redirect the user to the page he first tried to visit or to the home view
      router.push(
        router.history.current.query.redirect || { name: "contractSelect" }
      );
    });
  },
  LOGOUT({ commit }) {
    UserService.logout();

    commit("LOGOUT");
    // We need to catch errors here. Otherwise we get the "NavigationDuplicated" error.
    // See: https://github.com/vuejs/vue-router/issues/2872#issuecomment-519073998
    router.push("/login").catch(() => {});
  },
  REFRESH_TOKEN({ commit, state }) {
    // If this is the first time the refreshToken has been called, make a request
    // otherwise return the same promise to the caller
    if (state.refreshTokenPromise !== null) {
      return state.refreshTokenPromise;
    }

    const refreshPromise = UserService.refreshToken(state.refreshToken);
    commit("SET_REFRESH_TOKEN_PROMISE", refreshPromise);

    // Wait for the UserService.refreshToken() to resolve. On success set the token and clear promise
    // Clear the promise on error as well.
    return refreshPromise
      .then(response => {
        commit("LOGIN", response.data);
        ApiService.setHeader(response.data.access);

        return Promise.resolve(response);
      })
      .catch(error => {
        return Promise.reject(error);
      })
      .finally(() => commit("SET_REFRESH_TOKEN_PROMISE", null));
  }
};

const mutations = {
  LOGIN(state, { access: accessToken, refresh: refreshToken }) {
    state.accessToken = accessToken;

    // eslint-disable-next-line no-extra-boolean-cast
    if (!!refreshToken) {
      // Set the refreshToken if it is provided in the response;
      state.refreshToken = refreshToken;
    }
  },
  LOGOUT(state) {
    state.accessToken = null;
    state.refreshToken = null;
  },
  SET_REFRESH_TOKEN_PROMISE(state, payload) {
    state.refreshTokenPromise = payload;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
