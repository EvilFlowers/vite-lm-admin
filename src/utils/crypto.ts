import CryptoJS from "crypto-js";
import constants from "@/utils/constant";

const KEY = CryptoJS.enc.Utf8.parse(constants.CRYPTO_KEY);
const IV = CryptoJS.enc.Utf8.parse(constants.CRYPTO_KEY);

export function Encrypt(word: string, keyStr: string, ivStr: string): string {
  let key = KEY;
  let iv = IV;
  if (keyStr) {
    key = CryptoJS.enc.Utf8.parse(keyStr);
    iv = CryptoJS.enc.Utf8.parse(ivStr);
  }
  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(word), key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  });

  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

export function Decrypt(word: string, keyStr: string, ivStr: string): string {
  let key = KEY;
  let iv = IV;
  if (keyStr) {
    key = CryptoJS.enc.Utf8.parse(keyStr);
    iv = CryptoJS.enc.Utf8.parse(ivStr);
  }

  const base64 = CryptoJS.enc.Base64.parse(word);
  const decrypted = CryptoJS.AES.decrypt(CryptoJS.enc.Base64.stringify(base64), key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  });
  const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}
