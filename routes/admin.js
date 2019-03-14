const { Router } = require("express");
const router = Router();

router.get("/", (_, res) => res.send("admin URL"));

router.get("/products", (_, res) => res.send("products URL"));

module.exports = router;
