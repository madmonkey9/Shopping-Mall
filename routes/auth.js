const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const dotenv = require("dotenv");

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new FacebookStrategy(
    {
      // https://developers.facebook.com에서 appId 및 scretID 발급
      clientID: process.env.FB_ID,
      clientSecret: process.env.FB_PW,
      callbackURL: "https://localhost:3000/auth/facebook/callback",
      profileFields: ["id", "displayName", " photos", "email"] // 받고 싶은 필드 나열
    },
    (accessToken, refreshToken, profile, done) => {
      UserModel.findOne({ username: "fb_" + profile.id }, (err, user) => {
        console.log(profile);

        if (!user) {
          // 없으면 회원가입 후 로그인 성공페이지 이동
          const regData = {
            //DB에 등록 및 세션에 등록될 데이터
            username: "fb_" + profile.id,
            password: "facebook_login",
            displayName: profile.displayName
          };
          const User = new UserModel(regData);
          User.save(err => {
            // DB저장
            done(null, regData); // 세션 등록
          });
        } else {
          // 있으면 DB에서 가져와서 세션 등록
          done(null, user);
        }
      });
    }
  )
);

// http://localhost:3000/auth/facebook 접근시 facebook으로 넘길 url 작성해줌
router.get("/facebook", passport.authenticate("facebook", { scope: "email" }));

//인증후 페이스북에서 이 주소로 리턴해줌. 상단에 적은 callbackURL과 일치
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/auth/facebook/fail"
  })
);

// 로그인 성공시 이동할 주소
router.get("/facebook/success", (req, res) => {
  res.send(req.user);
});

router.get("/facebook/fail", (req, res) => {
  res.send("facebook login fail");
});

module.exports = router;
