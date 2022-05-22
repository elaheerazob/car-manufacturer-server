const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port =process.env.PORT || 5000;
const app = express();

//middle Ware
app.use(cors());
app.use(express.json());

app.get('/',(req,res) =>{
    res.send('Car Connect')
})


app.listen(port,() =>{
    console.log('Now' ,port);
})