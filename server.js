const express = require('express')
const app = express() ;
const port = process.env.PORT || 5000;
const qr = require('qrcode')
// const dataArray = require('./data')
const util = require("util");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");

app.set('view engine', "ejs");
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/scan' , (req, res) => {
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
            console.log(obj.price);
           dataArray.push(obj);
           const stringdata = JSON.stringify(obj);
           const data = util.promisify(qr.toDataURL);
             await data(stringdata).then(result => {
              arr.push({ price: obj.price, src: result})
           }).catch((e)=> {console.log(e);})
         };;

         const forLoop = async () => {
           for (let index = 0; index < quantity; index++) {
             const numFruit = await GetInfoOneCard();
             if(index == quantity-1) {
                  res.render('scan', {arr, quantity})
             }
         }}
         forLoop();
})


app.listen(port, () => {
    console.log('server at 5000')
})