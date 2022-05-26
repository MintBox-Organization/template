<template>
  <div id="item" v-if="itemInfo" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="top">
      <div class="container item-container">
        <div class="top-box">
          <div class="time-cut" v-if="msec > 0">
            <span class="text"> {{ $t("mint.countdown") }} </span>
            <span class="num"
              >{{ this.hour | numFormat }} : {{ this.minute | numFormat }} :
              {{ this.second | numFormat }}
            </span>
          </div>
          <el-image :src="itemInfo.logo" class="item-icon">
            <div slot="error">
              <img src="@/assets/images/default.png" alt="" class="item-icon" />
            </div>
          </el-image>
          <p class="item-name">{{ itemInfo.name }}</p>
          <!-- <div class="item-link">
            <a :href="itemInfo.site">{{ itemInfo.site }}</a>
            <i
              class="el-icon-document-copy copy-icon"
              @click="copy(itemInfo.site)"
            ></i>
          </div> -->
          <div class="item-desc">
            {{ itemInfo.description }}
          </div>
          <div class="item-num" v-if="count > 0">
            <div class="left">
              <div class="num">{{ itemInfo.items }}</div>
              <div class="text">{{ $t("mint.items") }}</div>
            </div>
            <div class="right">
              <div class="num">{{ itemInfo.owners }}</div>
              <div class="text">{{ $t("mint.owners") }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container" v-if="nftList.length > 0" style="max-width: 1060px">
      <div class="main">
        <div class="nft-item" v-for="(item, index) in nftList" :key="index">
          <el-image
            class="nft-img"
            :src="item.url"
            alt=""
            @click="goToDetail(item)"
            lazy
          >
          </el-image>
          <div class="nft-footer">
            <div class="nft-name">
              {{ item.name + (item.tokenId ? "#" + item.tokenId : "") }}
            </div>
            <div class="nft-info">
              <span>{{ $t("mint.price") }}</span>
              <span class="price" v-if="item.price == '0'">{{
                $t("mint.free")
              }}</span>
              <span v-else>
                <span class="price">{{ item.price }}</span>
                {{ item.unit }}
              </span>
            </div>

            <div class="nft-owner-box" v-if="item.owner">
              {{ $t("mint.owner") }}: {{ formatAccount(item.owner) }}
            </div>
            <div class="nft-btn-box" v-else>
              <button
                class="nft-btn"
                :disabled="item.status !== '1' || whiteListData || isClaimed"
                @click="buyNftMutiple()"
              >
                {{ $t("mint.buy") }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <el-pagination
        class="pagination"
        :hide-on-single-page="true"
        background
        layout="prev, pager, next"
        :total="count"
        :page-size="pageSize"
        @current-change="pageChange"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { providers } from "ethers";
import {
  getNFTsCollectionItem,
  getNFTsCollectionItemList,
  getWhiteList,
} from "@/api";
import { uint256Max, formatNetwork } from "@/utils";
import { setContractAddress, getToken, connect } from "@/utils/auth";
import { MetaN1__factory } from "metan1";
if (!window.ethereum) {
  throw "no ethereum plugin";
}
const providersObj = new providers.Web3Provider(window.ethereum);
export default {
  name: "blinDetail",
  computed: {
    deployment() {
      return this.$store.state.contractAddr;
    },
    account() {
      return this.$store.state.account;
    },
  },
  filters: {
    numFormat(num) {
      if (num < 10) {
        return "0" + num;
      }
      return num;
    },
  },
  watch: {
    async account(value) {
      if (!value) {
        return;
      } else {
        this.checkClaimed();
      }
    },
  },
  data() {
    return {
      tokenId: "",
      itemInfo: null,
      nftList: [],
      type: "",
      count: 0,
      rootHash: "",
      fullscreenLoading: false,
      currentPage: 1,
      pageSize: 15,
      shouldApprove: true,
      endTime: 0,
      msec: null,
      hour: 0,
      minute: 0,
      second: 0,
      interval: null,
      whiteListData: true,
      MetaN1: null,
      isClaimed: false,
    };
  },
  methods: {
    async init() {
      if (!this.deployment) {
        await setContractAddress();
      }
      this.getNftsItemInfo();
      this.getNftsItemList();
      this.checkWhiteList();
      const signerOrProvider = await providersObj.getSigner();
      const MetaN1 = await MetaN1__factory.connect(
        this.deployment,
        signerOrProvider
      );
      this.MetaN1 = MetaN1;
      this.checkClaimed();
    },
    getNftsItemInfo() {
      getNFTsCollectionItem(this.deployment).then((res) => {
        this.itemInfo = res.data;
        this.$store.commit("update-logo", res.data.logo);
        this.$store.commit("update-name", res.data.name);
        this.endTime = res.data.mintStart;
        document.title = "MintBox-" + this.itemInfo.name;
        this.countdown();
      });
    },
    getNftsItemList() {
      getNFTsCollectionItemList(this.deployment, this.currentPage).then(
        (res) => {
          this.nftList = res.data.list;
          this.type = res.data.type;
          this.count = res.data.count;
          this.rootHash = res.data.rootHash;
          this.chainId = Number(res.data.chainId);
        }
      );
    },
    checkWhiteList() {
      getWhiteList(this.deployment).then((res) => {
        if (res.data.in) {
          if (res.data.left > 0) {
            this.whiteListData = false;
          } else {
            this.whiteListData = true;
          }
        } else {
          this.whiteListData = true;
        }
      });
    },
    pageChange(page) {
      this.currentPage = page;
      this.getNftsItemList();
    },
    goToDetail(item) {
      if (!item.cid) {
        return;
      }
      let cid = item.cid.replace("ipfs://", "");
      this.$router.push(`/nftDetail/${cid}`);
    },
    copy(data) {
      let url = data;
      let oInput = document.createElement("input");
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select();
      console.log(oInput.value);
      document.execCommand("Copy");
      this.$message({
        message: "Copy success",
        type: "success",
      });
      oInput.remove();
    },
    formatAccount(account) {
      if (account.length > 0) {
        return (
          account.substr(0, 10) + "...." + account.substr(account.length - 8, 8)
        );
      }
      return account;
    },
    async checkToken() {
      let token = getToken();
      if (!token) {
        connect();
        return false;
      } else if (!this.checkChainId()) {
        return false;
      } else {
        return true;
      }
    },
    async checkClaimed() {
      let that = this;
      if (!this.account) {
        setTimeout(() => {
          that.checkClaimed();
        }, 500);
      } else {
        try {
          const isClaimed = await this.MetaN1.isClaimed(this.account);
          if (isClaimed) {
            this.isClaimed = isClaimed;
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    async buyNftMutiple() {
      this.fullscreenLoading = true;
      const isToken = await this.checkToken();
      if (!isToken) {
        this.fullscreenLoading = false;
        return;
      }
      this.mint();
    },
    checkChainId() {
      const chainId = this.$store.state.chainId;
      if (this.chainId !== chainId) {
        const network = formatNetwork(this.chainId);
        this.$message.error(this.$t("mint.checkNetwork", { network }));

        window.web3.currentProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x" + this.chainId.toString(16) }],
        });
        return false;
      }
      return true;
    },
    async mint() {
      try {
        const tx = await this.MetaN1.mint();
        const receipt = await tx.wait();
        if (receipt) {
          this.fullscreenLoading = false;
          this.success();
          this.$router.push("/mynfts");
        }
      } catch (error) {
        this.fullscreenLoading = false;
      }
    },
    success() {
      this.$message({
        message: "Mint Success",
        type: "success",
      });
      setTimeout(() => {
        this.getNftsItemInfo();
        this.getNftsItemList();
      }, 500);
    },
    countdown() {
      const end = this.endTime;
      const now = Date.parse(new Date());
      const msec = end - now;
      this.msec = msec;
      this.second = (msec / 1000) % 60;
      this.minute = parseInt((msec / 1000 / 60) % 60);
      this.hour = parseInt(msec / 1000 / 60 / 60);

      const that = this;
      if (msec === 0) {
        this.init();
      } else if (msec < 0) {
        return;
      } else {
        this.interval = setTimeout(that.countdown, 1000);
      }
    },
  },
  async mounted() {
    this.init();
  },
};
</script>
<style lang="less" scoped>
#item {
  .top {
    background-image: url("../assets/images/KakaoTalk_Image.jpeg");
    background-color: rgba(217, 208, 216, 0.5);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    min-height: 400px;
    .item-container {
      background-color: rgba(255, 255, 255, 0.65);
      .top-box {
        min-height: 400px;
        margin: 0 auto;
        text-align: center;
        padding: 40px;
        box-sizing: border-box;
        .time-cut {
          width: 250px;
          height: 50px;
          line-height: 50px;
          background-color: #fff;
          margin: 0 auto;
          color: #564e65;
          border-radius: 5px;
          margin-bottom: 20px;
          padding: 0 10px;
          .text {
            font-size: 16px;
            margin-right: 5px;
          }
          .num {
            font-size: 28px;
            font-weight: bold;
          }
        }
        .item-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          margin-bottom: 20px;
        }
        .item-name {
          font-size: 16px;
          color: #000;
          margin-bottom: 12px;
        }
        .item-link {
          font-size: 12px;
          color: #2a7eed;
          margin-bottom: 13px;
          a {
            color: #2a7eed;
            margin-right: 5px;
          }
          .copy-icon {
            cursor: pointer;
          }
        }
        .item-desc {
          max-width: 600px;
          margin: 0 auto;
          font-size: 12px;
          color: #666;
          margin-bottom: 24px;
          word-break: break-all;
        }
        .item-num {
          display: flex;
          justify-content: center;
          width: 240px;
          border: 1px solid #484d72;
          border-radius: 50px;
          margin: 0 auto;
          .left {
            width: 120px;
            border-right: 1px solid #484d72;
          }
          .right {
            width: 120px;
          }
          .num {
            font-size: 16px;
            color: #000;
            font-weight: bold;
          }
          .text {
            font-size: 10px;
            color: #666;
          }
        }
      }
    }
  }
  .main {
    display: flex;
    flex-wrap: wrap;
    margin-top: 50px;
    .nft-item {
      border: 1px solid #e0e2e4;
      margin: 25px;
      text-align: center;
      .nft-img {
        width: 300px;
        height: 300px;
        cursor: pointer;
      }
      .nft-footer {
        padding: 20px;
        .nft-name {
          font-size: 16px;
          font-weight: bold;
          color: #000;
        }
        .nft-info {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #999;
          .price {
            color: #000;
            font-weight: bold;
          }
        }
        .nft-btn-box {
          text-align: right;
          margin-top: 20px;
          .nft-btn {
            width: 64px;
            height: 28px;
            background-color: #a27ec6;
            color: #fff;
            border: 1px solid #a27ec6;
            border-radius: 5px;
            cursor: pointer;
          }
          .nft-btn:disabled {
            background: #ccc;
            border: none;
            cursor: not-allowed;
          }
        }
        .nft-owner-box {
          margin-top: 10px;
          text-align: left;
          font-size: 12px;
          color: #999999;
        }
      }
    }
  }
  .pagination {
    text-align: center;
    margin: 40px 0;
    margin-bottom: 200px;
  }
}
</style>
