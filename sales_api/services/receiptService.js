let currentReceiptNumber = 0;

const generateReceiptId = () => {
  currentReceiptNumber += 1;
  return `BOL-${currentReceiptNumber.toString().padStart(9, '0')}`;
};

module.exports = { generateReceiptId };
