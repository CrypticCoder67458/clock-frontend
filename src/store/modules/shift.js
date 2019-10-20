import { getField, updateField } from "vuex-map-fields";
import ShiftService from "@/services/shift.service";

import { Shift } from "@/models/ShiftModel";

const state = {
  shifts: [],
  clockedShift: null,
  stagedShift: new Shift({
    type: { text: "shift", value: "st" },
    contract: "4e2dd4dd-79b2-4099-a4c2-c6f33e2b793e",
    date: {
      start: new Date(2019, 9, 7, 15),
      end: new Date(2019, 9, 8, 10)
    }
  }),
  pseudoShifts: []
};

const getters = {
  getField,
  stagedShift: state => {
    return state.stagedShift;
  },
  pseudoShifts: state => {
    return state.pseudoShifts;
  }
};

const mutations = {
  updateField,
  clockShift(state, payload) {
    state.clockedShift = payload;
  },
  clearClockedShift(state) {
    state.clockedShift = null;
  },
  addShift(state, payload) {
    state.shifts.push(payload);
  },
  updateShift(state, payload) {
    state.shifts = [
      ...state.shifts.filter(shift => shift.uuid !== payload.uuid),
      payload
    ];
  },
  updatePseudoShift(state, payload) {
    state.pseudoShifts = [
      ...state.pseudoShifts.filter(shift => shift.uuid !== payload.uuid),
      payload
    ];
  },
  deleteShift(state, payload) {
    state.shifts = state.shifts.filter(shift => shift.uuid !== payload);
  },
  deletePseudoShift(state, payload) {
    state.pseudoShifts = state.pseudoShifts.filter(
      shift => shift.uuid !== payload
    );
  },
  setShifts(state, payload) {
    state.shifts = payload;
  },
  setPseudoShifts(state, payload) {
    state.pseudoShifts = payload;
  }
};

const actions = {
  clockShift({ commit }, payload) {
    commit("clockShift", payload);
  },
  clearClockedShift({ commit }) {
    commit("clearClockedShift");
  },
  addShift({ commit }, payload) {
    commit("addShift", payload);
  },
  updateShift({ commit }, payload) {
    commit("updateShift", payload);
  },
  deleteShift({ commit }, payload) {
    commit("deleteShift", payload);
  },
  setShifts({ commit }, payload) {
    commit("setShifts", payload);
  },
  updatePseudoShift({ commit }, payload) {
    commit("updatePseudoShift", payload);
  },
  deletePseudoShift({ commit }, payload) {
    commit("deletePseudoShift", payload);
  },
  setPseudoShifts({ commit }, payload) {
    commit("setPseudoShifts", payload);
  },
  async queryShifts({ commit }) {
    const shifts = await ShiftService.list();

    commit("setShifts", shifts.data);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
