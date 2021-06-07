const mongoose = require("mongoose");
const { stringify } = require("uuid");

const UserScanHistory = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ScannedBarcodes: [
    {
      src: String,
      product_Name: String,
      Price: String,
      id: String
    },{
      timestamps: true
    }
  ]
}, {
  timestamps: true
});

const UserHistory = mongoose.model("UserHistory", UserScanHistory);

module.exports = {
  UserHistory,
};
