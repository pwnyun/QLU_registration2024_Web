import CryptoJS from 'crypto-js'

export const validateIdCard = (idCard) => {
  if (typeof idCard !== "string")
    return false;

  if (idCard.length !== 18)
    return false;

  var factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  var checkCode = '10X98765432';
  var sum = 0;

  for (var i = 0; i < 17; i++) {
    sum += parseInt(idCard.charAt(i)) * factors[i];
  }

  var mod = sum % 11;
  var checkDigit = checkCode.charAt(mod);
  return checkDigit === idCard.charAt(17).toUpperCase();
}

export function encrypt(data, key = "WLYW, 0531-89631358") {
  return CryptoJS.AES.encrypt(encodeURI(JSON.stringify(data)), key).toString()
}

export function decrypt(ciphertext, key = "WLYW, 0531-89631358") {
  let hex = CryptoJS.AES.decrypt(ciphertext, key).toString()
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }

  return JSON.parse(decodeURI(str));
}

export function formDataToJson(formData) {
  return Object.fromEntries(formData.entries());
}
