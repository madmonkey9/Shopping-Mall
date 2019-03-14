const express = require("express");
const path = require("path");

const router = require("./routes/admin");

const app = express();
const port = 3000;

// 확장자가 ejs 로 끝나는 뷰 엔진을 추가.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
console.log(__dirname);

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
