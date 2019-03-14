const express = require("express");
const router = require("./routes/admin");
const path = require("path");

const app = express();
const port = 3000;

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
