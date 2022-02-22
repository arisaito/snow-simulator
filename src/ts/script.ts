import Info from "./modules/Info";
import Stage from "./modules/Stage";

// MEMO: グローバルオブジェクトを定義
declare global {
  interface Window {
    APP: any;
  }
}
export const APP = window.APP || {};

const hideSplash = () => {
  const splash = document.getElementById("splash");
  splash.classList.add("is-hidden");
};

// MEMO: オブジェクトを初期化
const initApp = () => {
  window.APP = APP;
  APP.Info = new Info();
  APP.Stage = new Stage();
  setTimeout(hideSplash, 2000);
};

// MEMO: DOMが読み込めたら初期化を開始
window.addEventListener("load", initApp);

const disableDefaultScale = (e) => {
  if (e.touches.length >= 2) e.preventDefault();
};
window.addEventListener("touchstart", disableDefaultScale, { passive: false });
