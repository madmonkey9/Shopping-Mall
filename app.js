const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const loginRequired = require("./libs/loginRequired");

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
const auth = require("./routes/auth");
const home = require("./routes/home");
const chat = require("./routes/chat");

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
const connectMongo = require("connect-mongo");
const MongoStore = connectMongo(session);

const sessionMiddleWare = session({
  secret: "fastcampus",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 2000 * 60 * 60 //지속시간 2시간
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 14 * 24 * 60 * 60
  })
});
app.use(sessionMiddleWare);

//passport 적용
app.use(passport.initialize());
app.use(passport.session());

//플래시 메시지 관련
app.use(flash());

app.use((req, res, next) => {
  app.locals.isLogin = req.isAuthenticated();
  //app.locals.urlparameter = req.url; //현재 url 정보를 보내고 싶으면 이와같이 셋팅
  //app.locals.userData = req.user; //사용 정보를 보내고 싶으면 이와같이 셋팅
  next();
});
//로그인 정보 뷰에서만 변수로 셋팅, 전체 미들웨어는 router위에 두어야 에러가 안난다

// app.get("/", (req, res) => {
//   res.send("first app");
// });

app.use("/", home);
app.use("/admin", loginRequired, admin);
app.use("/accounts", accounts);
app.use("/auth", auth);
app.use("/chat", chat);

const server = app.listen(port, function() {
  console.log("Express listening on port", port);
});
const listen = require("socket.io");
const io = listen(server);

// socket io passport 접근하기 위한 미들웨어 적용
io.use((socket, next) => {
  sessionMiddleWare(socket.request, socket.request.res, next);
});

require("./libs/socketConnection")(io);
