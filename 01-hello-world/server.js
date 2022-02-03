const express = require('express');
const { receiveMessages } = require('./receive');
const { sendMessage } = require('./send');

const app = express();
const router = express.Router();

require('dotenv').config();

const port = process.env.NODE_PORT;


app.use(express.urlencoded({extended: true}));
app.use(express.json());

router.post('/send',sendMessage);
router.get('/receive',receiveMessages);

app.use('/',router);


app.listen(port,()=> {
    console.log('Server listening on port:', port);
}) 