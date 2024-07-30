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

export const decryptString = (encodedData) => atob(encodedData.replaceAll('-', '+').replaceAll('_', '/'));

export const encryptString = (stringToEncode) => btoa(encodeURIComponent(stringToEncode)).replaceAll('+','-').replaceAll('/','_').replaceAll('=','');
