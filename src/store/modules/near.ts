import {getConfig} from "@/config/near"
import { NearService } from "@/services/nearService"
//import { signTransaction } from "near-api-js/lib/transaction"
import { Commit } from "vuex"

// initial state
const state = () => ({
  service: undefined
})

// getters
const getters = {
    isSignedIn: (state: any) => {
      return state.service.walletConnection.isSignedIn() ?? false
    },
    getAccountId: (state: any) => {
      return state.service.walletConnection.getAccountId()
    },
    getFactoryAccount: (state: any) => {
      return state.service.config !== undefined ? state.service.config.contractName : undefined
    },
    getWallet: (state: any) => {
      return state.service.walletConnection !== undefined ? state.service.walletConnection : undefined
    },
    getWalletUrl: (state: any) => {
      return state.service.config !== undefined ? state.service.config.walletUrl : undefined
    },
    getFactoryContract: (state: any) => {
      return state.service.factoryContract
    },
    getService: (state: any) => {
      return state.service
    }
}

// actions
const actions = {
    async init ({ commit }: { commit: Commit}) {
        const config = getConfig(process.env.NODE_ENV || "development");
        const service = new NearService(config)
        await service.init()
        //console.log(service)
        commit('setState', {service: service})
    }
}

// mutations
const mutations = {
  setState(state: any, payload: any) {
    state.service = payload.service
  },
  setContract(state: any, contractId: string) {
    state.service.contractPool.get(contractId)
  },
  signIn(state: any) {
    state.service.signIn()
  },
  signOut(state: any) {
    state.service.signOut()
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}