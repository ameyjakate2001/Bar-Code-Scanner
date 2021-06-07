const express = require('express')
const router = express.Router();
const qr = require("qrcode");
const util = require("util");
const { PrintBarcode } = require("../models/PrintedHistory");
const { UserHistory } = require("../models/UserScanHistory");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");
const {
  ensureAuthenticatedasAdmin,
  ensureAuthenticatedasUser,
} = require("../config/auth");

router.get("/scan", ensureAuthenticatedasUser, (req, res) => {
  res.render("index");
});

let savedBarcodes = [];

router.post("/scan", ensureAuthenticatedasUser, (req, res) => {
  const { Product_Name, Price, quantity } = req.body;
  if (Product_Name.length === 0) res.send("empty Data !!");
  var dataArray = [];
  var arr = [];

  const GetInfoOneCard = async () => {
    const obj = {
      product_Name: Product_Name,
      price: Price,
      id: uuidv1(),
    };
    dataArray.push(obj);
    const stringdata = JSON.stringify(obj);
    const data = util.promisify(qr.toDataURL);
    await data(stringdata)
      .then((result) => {
        arr.push({
          price: obj.price,
          src: result,
          product_Name: obj.product_Name,
          id: obj.id,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const forLoop = async () => {
    for (let index = 0; index < quantity; index++) {
      const numFruit = await GetInfoOneCard();
      if (index == quantity - 1) {
        savedBarcodes = [...arr];
        res.render("scan", { arr, quantity });
      }
    }
  };
  forLoop();
});


router.post("/saveAllBarcodes", ensureAuthenticatedasAdmin, async(req, res) => {
  // alert('Do you want to save to dat/abase ?')
  try {
    await PrintBarcode.insertMany(savedBarcodes);
    console.log('saved to database');
  }
  catch(e) {
    console.log(e.message);
  }
});


router.get("/generatedBarcode", ensureAuthenticatedasAdmin, async(req, res) => {
  try {
    const arr = await PrintBarcode.find();
    if(!arr) {
      return res.render("adminPanel", { users: [] });
    }
    // console.log(arr);
    res.render('HistoryScan', {arr, quantity:arr.length})
  }
  catch(e) {
    console.log(e.message);
  }
});

router.post('/user/scan', ensureAuthenticatedasAdmin, async(req, res) =>{ 
  const { user_id, product_Name, Price, id } = req.body;
  const oneBarcode = {
    product_Name,
    Price,
    id
  }
  // const ScannedBarcodes = []
  const barcode = await PrintBarcode.findOne({id: id})
  if(barcode.isScanned) {
    return res.json({success: false, msg: 'Barcode Invalid'});
  } else {
    barcode.isScanned = true;
    await barcode.save();
    const isUser = await UserHistory.findOne({user: user_id});
    if(!isUser) {
      await UserHistory.create({
        user: user_id,
        ScannedBarcodes: [oneBarcode]
      });
      console.log('user created and Barcode saved');
    } else {
      isUser.ScannedBarcodes.push(oneBarcode);
      await isUser.save();
      console.log('added to the user');
      return res.json({success: true, msg: 'Added as user scanned'})
    }
    
  }
})

router.get('/user/scan/:id', async(req, res) => {
  const scannedBarcodes = await UserHistory.findOne({user: req.params.id})
  if(!scannedBarcodes) return res.json({success: false, msg: 'No scanned Barcodes'})
  return res.json({success: true, response:scannedBarcodes.ScannedBarcodes})
})


module.exports = router