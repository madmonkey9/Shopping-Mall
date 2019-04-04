const { Router } = require("express");
const router = Router();
const ProductsModel = require("../models/ProductsModel");
const CommentsModel = require("../models/CommentsModel");
const co = require("co");

// csurf 셋팅
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });

//이미지 저장되는 위치 설정
var path = require("path");
var uploadDir = path.join(__dirname, "../uploads"); // 루트의 uploads위치에 저장한다.
var fs = require("fs");

//multer 셋팅
var multer = require("multer");
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    //이미지가 저장되는 도착지 지정
    callback(null, uploadDir);
  },
  filename: function(req, file, callback) {
    // products-날짜.jpg(png) 저장
    callback(
      null,
      "products-" + Date.now() + "." + file.mimetype.split("/")[1]
    );
  }
});
var upload = multer({ storage: storage });

router.get("/", (_, res) => res.send("admin URL"));

router.get("/products", (_, res) => {
  // res.send("products URL")

  ProductsModel.find({}, (err, products) => {
    res.render("admin/products", {
      products
    });
  });
});

router.get("/products/write", csrfProtection, function(req, res) {
  res.render("admin/form", {
    product: "",
    csrfToken: req.csrfToken()
  });
});

router.post(
  "/products/write",
  upload.single("thumbnail"),
  csrfProtection,
  (req, res) => {
    req.body.thumbnail = req.file ? req.file.filename : "";
    req.body.username = req.user.username;

    const product = new ProductsModel(req.body);

    if (!product.validateSync()) {
      product.save(function(err) {
        res.redirect("/admin/products");
      });
    }
  }
);

router.get("/products/detail/:id", async (req, res) => {
  try {
    const product = await ProductsModel.findOne({ id: req.param.id }).exec();
    const comments = await CommentsModel.find({
      product_id: req.param.id
    }).exec();
    res.render("admin/productsDetail", { product, comments });
  } catch (error) {}
});

router.get("/products/edit/:id", csrfProtection, (req, res) => {
  // 기존에 폼의 value안에 값을 셋팅하기 위해
  ProductsModel.findOne({ id: req.params.id }, (err, product) => {
    res.render("admin/form", {
      product,
      csrfToken: req.csrfToken()
    });
  });
});

router.post("/products/edit/:id", csrfProtection, function(req, res) {
  //update의 첫번째 인자는 조건, 두번째 인자는 바뀔 값들
  ProductsModel.update({ id: req.params.id }, { $set: req.body }, err => {
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

router.post("/products/ajax_comment/delete", function(req, res) {
  CommentsModel.remove({ id: req.body.comment_id }, function(err) {
    res.json({ message: "success" });
  });
});

module.exports = router;
