const { Router } = require("express");
const router = Router();
const ProductsModel = require("../models/ProductsModel");
const CommentsModel = require("../models/CommentsModel");

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
  res.render("admin/form", { product: "" });
});

router.post("/products/write", function(req, res) {
  var product = new ProductsModel(req.body);
  product.save(function(err) {
    res.redirect("/admin/products");
  });
});

router.get("/products/detail/:id", (req, res) => {
  //url 에서 변수 값을 받아올떈 req.params.id 로 받아온다
  ProductsModel.findOne({ id: req.params.id }, (err, product) => {
    CommentsModel.find({ product_id: req.params.id }, function(err, comments) {
      res.render("admin/productsDetail", {
        product,
        comments
      });
    });
  });
});

router.get("/products/edit/:id", (req, res) => {
  // 기존에 폼의 value안에 값을 셋팅하기 위해
  ProductsModel.findOne({ id: req.params.id }, (err, product) => {
    res.render("admin/form", { product });
  });
});

router.post("/products/edit/:id", function(req, res) {
  //넣을 변수 값을 셋팅한다
  var query = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description
  };

  //update의 첫번째 인자는 조건, 두번째 인자는 바뀔 값들
  ProductsModel.update({ id: req.params.id }, { $set: query }, err => {
    res.redirect("/admin/products/detail/" + req.params.id); //수정후 본래보던 상세페이지로 이동
  });
});

router.get("/products/delete/:id", (req, res) => {
  ProductsModel.remove({ id: req.params.id }, err => {
    res.redirect("/admin/products");
  });
});

router.post("/products/ajax_comment/insert", (req, res) => {
  const comment = new CommentsModel({
    content: req.body.content,
    product_id: req.body.product_id
  });

  comment.save((_, comment) => {
    res.json({
      id: comment.it,
      content: comment.content,
      message: "success"
    });
  });
});

module.exports = router;
