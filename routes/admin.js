const { Router } = require("express");
const router = Router();
const ProductsModel = require("../models/ProductsModel");

router.get("/", (_, res) => res.send("admin URL"));

router.get("/products", (_, res) => {
  // res.send("products URL")

  ProductsModel.find({}, (err, products) => {
    res.render("admin/products", {
      products
    });
  });
});

router.get("/products/write", function(_, res) {
  res.render("admin/form");
});

router.post("/products/write", function(req, res) {
  var product = new ProductsModel(req.body);
  product.save(function(err) {
    res.redirect("/admin/products");
  });
});

router.get("/products/detail/:id", function(req, res) {
  //url 에서 변수 값을 받아올떈 req.params.id 로 받아온다
  ProductsModel.findOne({ id: req.params.id }, function(err, product) {
    res.render("admin/productsDetail", { product });
  });
});

module.exports = router;
