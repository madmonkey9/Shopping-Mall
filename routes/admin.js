const { Router } = require("express");
const router = Router();

router.get("/", (_, res) => res.send("admin URL"));

router.get("/products", (_, res) => {
  // res.send("products URL")
  res.render("admin/products", {
    message: "hello",
    school: "nodejs"
  });
});
module.exports = router;
