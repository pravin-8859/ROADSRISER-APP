// gstin validation using checksum algorithm
const factor = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
const base36Chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function validateGSTIN(gstin) {
  if (!gstin || typeof gstin !== 'string') return false;
  gstin = gstin.trim().toUpperCase();
  if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin)) return false;
  // checksum
  const calcCheck = gstinChecksum(gstin.slice(0, 14));
  return calcCheck === gstin[14];
}

function gstinChecksum(input) {
  const codePoints = Array.from(input).map(c => base36Chars.indexOf(c));
  let sum = 0;
  for (let i=0;i<codePoints.length;i++){
    sum += (codePoints[i] * (i%2===0 ? 1 : 2));
  }
  const checkCodePoint = (36 - (sum % 36)) % 36;
  return base36Chars[checkCodePoint];
}
