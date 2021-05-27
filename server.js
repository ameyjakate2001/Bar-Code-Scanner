const express = require('express')
const app = express() ;
const port = process.env.PORT || 5000;
const bp = require('body-parser')
const qr = require('qrcode')
const { v1: uuidv1, v4: uuidv4 } = require("uuid");

app.set('view engine', "ejs");
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/scan' , (req, res) => {
    const { Product_Name, quantity } = req.body;
    const data = {
      Product_Name,
      Price:200,
      id: uuidv1(),
    };
    let stringdata = JSON.stringify(data);

    if (Product_Name.length === 0) res.send("empty Data !!");
    
    qr.toDataURL(stringdata, (err, src) => {
      if (err) res.send("error occured");
      console.log(src);
      res.render("scan", { src, quantity });
    });
})


app.listen(port, () => {
    console.log('server at 5000')
})