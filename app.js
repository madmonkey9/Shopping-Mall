const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

//flash  메시지 관련
const flash = require("connect-flash");

//passport 로그인 관련
const passport = require("passport");
const session = require("express-session");

//MongoDB 접속
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on("error", console.error);
db.once("open", () => {
  console.log("mongodb connect");
});

mongoose.connect("mongodb://127.0.0.1:27017/fastcampus", {
  useMongoClient: true
});

const admin = require("./routes/admin");
const accounts = require("./routes/accounts");

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
app.use(cookieParser());

// 업로드 path 추가
app.use("/uploads", express.static("uploads"));

//session 관련 셋팅
app.use(
  session({
    secret: "fastcampus",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 2000 * 60 * 60 //지속시간 2시간
    }
  })
);

//passport 적용
app.use(passport.initialize());
app.use(passport.session());

//플래시 메시지 관련
app.use(flash());

app.get("/", function(_, res) {
  res.send("first app");
});

// app.get("/", (req, res) => {
//   res.send("first app");
// });

app.use("/admin", admin);
app.use("/accounts", accounts);

app.listen(port, function() {
  console.log("Express listening on port", port);
});
