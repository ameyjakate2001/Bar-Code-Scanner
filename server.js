const express = require('express')
const app = express() ;
const port = process.env.PORT || 5000;
const bp = require('body-parser')
const qr = require('qrcode')

app.set('view engine', "ejs");
app.use(express.urlencoded({extended:false}))
app.use(express.json());

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/scan' , (req, res) => {
   const url = req.body.url;
   if(url.length === 0)
      res.send("empty Data !!")
    
      qr.toDataURL(url, (err, src) => {
          if(err) res.send('error occured')
          console.log(src);
          res.render("scan", {src})
      })
})


app.listen(port, () => {
    console.log('server at 5000')
})