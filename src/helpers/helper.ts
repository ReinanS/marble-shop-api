import CryptoJS from "crypto-js";
import { KEY_ENCRYPT_URL } from "./constants.helper";

export function encryptData(data: string): string {
const encryptedData = CryptoJS.AES.encrypt(
      data,
      KEY_ENCRYPT_URL || ""
    );
  return encodeURIComponent(encryptedData.toString());
}