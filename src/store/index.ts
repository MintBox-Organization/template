import Vuex from "vuex";
import Vue from "vue";
Vue.use(Vuex);

export const UPDATE_ACCOUNT = "update-account";
export const UPDATE_CHAINID = "update-chainId";
export const UPDATE_CONTRACTADDR = "update-contractAddr";
export const UPDATE_LOGO = "update-logo";
export const UPDATE_NAME = "update-name";

interface AccountState {
  account: string;
  chainId: string;
  contractAddr: string;
  logo: string;
  name: string;
}

class InvoiceStore extends Vuex.Store<AccountState> {
  constructor() {
    super({
      state: {
        account: "",
        chainId: "",
        contractAddr: "",
        logo: "",
        name: "",
      },
      mutations: {
        [UPDATE_ACCOUNT](state: AccountState, account: string) {
          state.account = account;
        },
        [UPDATE_CHAINID](state: AccountState, chainId: string) {
          state.chainId = chainId;
        },
        [UPDATE_CONTRACTADDR](state: AccountState, contractAddr: string) {
          state.contractAddr = contractAddr;
        },
        [UPDATE_LOGO](state: AccountState, logo: string) {
          state.logo = logo;
        },
        [UPDATE_NAME](state: AccountState, name: string) {
          state.name = name;
        },
      },
    });
  }

  public init(state: AccountState) {
    this.commit(UPDATE_ACCOUNT, state.account);
    this.commit(UPDATE_CHAINID, state.chainId);
    this.commit(UPDATE_CONTRACTADDR, state.contractAddr);
    this.commit(UPDATE_LOGO, state.logo);
    this.commit(UPDATE_NAME, state.name);
  }
}

const store = new InvoiceStore();

export default store;
