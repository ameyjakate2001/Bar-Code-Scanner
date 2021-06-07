const mongoose = require("mongoose");
const { stringify } = require("uuid");

const PrintBarcodeSchema = new mongoose.Schema(
  {
    price: {
      type: String,
    },
    src: {
      type: String,
      unique: true
    },
    product_Name: {
      type: String,
    },
    id: {
      type: String,
      required: true,
      unique: true
    },
    isScanned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const PrintBarcode = mongoose.model("PrintBarcode", PrintBarcodeSchema);

module.exports = {
  PrintBarcode,
};
