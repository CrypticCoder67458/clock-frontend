import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import AuthService from "@/services/auth";

import auth from "@/store/modules/auth";
import clock from "@/store/modules/clock";
import selectedContract from "@/store/modules/selectedContract";
import snackbar from "@/store/modules/snackbar";
import contentData from "@/store/modules/contentData";
import faq from "@/store/modules/faq";

import i18n, { selectedLocale, switchDateFnsLocale } from "@/plugins/i18n";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loadingData: true,
    locale: selectedLocale,
    user: {
      first_name: ""
    },
    backendOffline: false,
    userLoading: false,
    onboardingSkipped: false
  },
  getters: {
    user: (state) => state.user,
    personnelNumber: (state) => state.user.personal_number,
    userLoading: (state) => state.userLoading,
    locale: (state) => state.locale
  },
  actions: {
    skipOnboarding({ commit }) {
      commit("setOnboardingSkipped", true);
    },
    changeLocale({ commit }, locale) {
      i18n.locale = locale;
      switchDateFnsLocale(locale);
      commit("updateLocale", locale);
    },
    toggleBackend({ commit }) {
      commit("toggleBackend");
    },
    GET_USER({ commit, dispatch, state }) {
      state.userLoading = true;
      return AuthService.getUser()
        .then((response) => {
          commit("SET_USER", response.data);
          dispatch("changeLocale", response.data.language);

          return Promise.resolve(response);
        })
        .finally(() => {
          state.userLoading = false;
        });
    },
    UPDATE_SETTINGS({ commit, dispatch, state }, settings) {
      state.userLoading = true;
      return AuthService.updateSettings(settings)
        .then((response) => {
          commit("SET_USER", response.data);
          dispatch("changeLocale", response.data.language);
        })
        .finally(() => {
          state.userLoading = false;
        });
    },
    startLoading({ commit }) {
      commit("startLoading");
    },
    stopLoading({ commit }) {
      commit("stopLoading");
    },
    setUser({ commit }, payload) {
      commit("setUser", payload);
    }
  },
  mutations: {
    setOnboardingSkipped(state, value) {
      state.onboardingSkipped = value;
    },
    updateLocale(state, locale) {
      state.locale = locale;
    },
    SET_USER(state, payload) {
      state.user = payload;
    },
    toggleBackend(state) {
      state.backendOffline = !state.backendOffline;
    },
    startLoading(state) {
      state.loadingData = true;
    },
    stopLoading(state) {
      state.loadingData = false;
    },
    setUser(state, payload) {
      state.user = { ...payload };
    }
  },
  modules: {
    auth,
    clock,
    contentData,
    selectedContract,
    snackbar,
    faq
  },
  plugins: [
    createPersistedState({
      key: "clock1.0",
      paths: ["auth.accessToken", "auth.refreshToken", "locale"]
    })
  ]
});
