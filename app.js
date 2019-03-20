const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");

//MongoDB 접속
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on("error", console.error);
db.once("open", function() {
  console.log("mongodb connect");
});

mongoose.connect("mongodb://127.0.0.1:27017/fastcampus", {
  useMongoClient: true
});

const router = require("./routes/admin");

const app = express();
const port = 3000;

// 확장자가 ejs 로 끝나는 뷰 엔진을 추가.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
console.log(__dirname);

// 미들웨어 셋팅
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(_, res) {
  res.send("first app");
});

// app.get("/", (req, res) => {
//   res.send("first app");
// });

app.use("/admin", router);

app.listen(port, function() {
  console.log("Express listening on port", port);
});
