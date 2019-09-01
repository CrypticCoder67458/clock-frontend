import { getField, updateField } from "vuex-map-fields";
import ContractService from "@/services/contract.service";

const state = {
  contracts: []
};

const getters = {
  getField
};

const mutations = {
  updateField,
  addContract(state, payload) {
    state.contracts.push(payload);
  },
  updateContract(state, payload) {
    const { id } = payload;
    state.contracts = [
      ...state.contracts.filter(contract => contract.uuid !== id),
      payload
    ];
  },
  setContracts(state, payload) {
    state.contracts = payload;
  }
};

const actions = {
  addContract({ commit }, payload) {
    commit("addContract", payload);
  },
  updateContract({ commit }, payload) {
    commit("updateContract", payload);
  },
  setContracts({ commit }, payload) {
    commit("setContracts", payload);
  },
  async queryContracts({ commit }) {
    const contracts = await ContractService.list();

    commit("setContracts", contracts.data);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
