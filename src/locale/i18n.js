import Vue from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);
let locale = JSON.parse(localStorage.getItem("mintBoxPersonal-lang"));
if (!locale) {
  locale = "ko";
}
export const i18n = new VueI18n({
  locale,
  silentFallbackWarn: true,
  messages: {
    ko: {
      nav: {
        mint: "민팅하기",
        myNfts: "내 NFT",
        connectWallet: "지갑 연결하기",
      },
      mint: {
        items: "아이템",
        owners: "소유자",
        owner: "소유자",
        price: "가격",
        free: "무료",
        buy: "구매",
        paymentFail: "심볼을 입력해주세요.",

        checkNetwork: "{network} 네트워크를 선택하십시오.",
      },
      nftDetail: {
        detail: "디테일",
        contractAddress: "컨트랙트 주소",
        tokenID: "토큰 ID",
        tokenStandard: "토큰 스탠다드",
        blockchain: "블록체인",
        hash: "해시",
        copySuccess: "복사 성공",
      },
      myNfts: {
        noNfts: "표시할 NFT가 없습니다!",
        download: "다운로드",
        tokenHash: "토큰 해시",
      },
    },
    en: {
      nav: {
        mint: "MINT",
        myNfts: "My NFTS",
        connectWallet: "Connect Wallet",
      },
      mint: {
        items: "Items",
        owners: "Owners",
        owner: "owner",
        price: "Price",
        free: "Free",
        buy: "Buy",
        paymentFail: "Payment failed due to insufficient wallet balance.",

        checkNetwork: "Please select the {network} network.",
      },
      nftDetail: {
        detail: "Detail",
        contractAddress: "Contract address",
        tokenID: "Token ID",
        tokenStandard: "Token Standard",
        blockchain: "Blockchain	",
        hash: " Hash",
        copySuccess: "Copy success",
      },
      myNfts: {
        noNfts: "No NFTs to display!",
        tokenHash: "Token Hash",
        download: "DOWNLOAD",
      },
    },
  },
});
