const express = require('express')
const app = express()
const cors = require('cors');
const config = require('./config/key');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require("path");

//bodyparser는  클라이언트로 부터 받은 데이터를 파싱하는 부분
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

app.use('/api/users', require('./routes/users'));
app.use('/api/video', require('./routes/video'));
app.use('/api/subscribe', require('./routes/subscribe'));
app.use('/api/comment', require('./routes/comment'));
app.use('/api/like', require('./routes/like'));


app.use('/uploads', express.static('uploads'));


const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('mongodb Connected'))
  .catch(err => console.log(err))


if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/bulid"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}


const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))