var express = require("express");
var router = express.Router();
const userModel = require("../models/users");
var Razorpay = require('razorpay')
const productModel = require("../models/product");
const upload = require("./multer");
const passport = require("passport");
const localStrategy = require("passport-local");
const product = require("../models/product");
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt");
const cookieparser=require("cookie-parser")
const {isLoggedIn} = require("../middleWares/auth.js")


const { indexpage, paymentCheck ,homepage, detailpage, createProductpage,searchSection, bookpage, Wishlistpage, removeLikeid, profilepage, postproductpage, likeProductid, productpage, createOrderId, LoginUser, cartAdd, removeItem, addMoreItem, orderDetailPage, orderPage, accountDelete } = require("../controllers/indexController.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const { log } = require("console");
// const { token } = require("morgan");


var instance = new Razorpay({
  key_id: process.env.key_Id,
  key_secret: process.env.key_Secret,
});

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", indexpage);
router.get("/products", productpage);

router.get("/LoginUser",isLoggedIn,LoginUser)

router.get("/home",isLoggedIn ,homepage);
router.get("/search/:name",isLoggedIn ,searchSection);

router.get("/detail/:id", isLoggedIn,detailpage );


router.get("/like/:id", isLoggedIn,likeProductid);

router.get("/wishlist", isLoggedIn, Wishlistpage);

router.get("/likes/remove/:wishId",isLoggedIn,removeLikeid);

router.get("/profile", isLoggedIn,profilepage );


router.get("/postproduct", isLoggedIn, postproductpage);

////// product create /////
router.post("/pro",isLoggedIn,createProductpage);

router.get("/book",isLoggedIn , bookpage)

// router.post('/create/orderId', createOrderId)

router.post("/order",isLoggedIn,orderPage)
router.post("/payment",isLoggedIn,paymentCheck)
router.post("/order/:id",isLoggedIn,orderDetailPage)
router.post("/deleteAccount",isLoggedIn,accountDelete)


  router.get("/cart", isLoggedIn, async function (req, res, next) {
    try {
     
      const user = await userModel.findById(req.id).populate("cart.pro").exec();
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      let sum = 0;
  
      user.cart.forEach((item) => {
   
        sum += Number(item.pro.price) * Number(item.quantity);
      });
  
      user.SUM = sum ;

      await user.save();
  
      res.json(user);
  
    } catch (error) {
      console.error(error);
      next(error); 
    }
  });
  
router.get("/cart/add/:id", isLoggedIn, cartAdd );



router.get("/cart/remove/:id", isLoggedIn, removeItem );



router.get("/cart/addMore/:id",isLoggedIn,addMoreItem );

router.post("/register",async(req,res,next)=>{
  console.log(req.body);
 try {
  const user = await new userModel(req.body).save()
  const token = user.getjwttoken();
  const options = {
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Expires in 1 day
    httpOnly: true,
    secure: true,
    // sameSite: "None",
    maxAge: 1000 * 60 * 60 * 5,
  };
  console.log(token+"register");
  res
    .status(201)
    .cookie("token", token, options)
    .json({ success: true, id: user._id, token });
 } catch (error) {
  res.json({
    error
  })
 }
  

});

router.post("/login", async (req, res, next) => {
 
 try {
  const{email,password}=req.body;

  const user =await userModel.findOne({email});
  // console.log(user+"ppp");
  
  
  if(!user){
   res.status(401).json({
        message:"invalid credentials"
      })
      return;
  }
  bcrypt.compare(password,user.password,(err,result)=>{
      if(err){
        res.status(401).json({
          message:"invalid credentials"
        })
        return;
      }
      const token = user.getjwttoken();
      const options = {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Expires in 1 day
        httpOnly: true,
        secure: true,
        // sameSite: "None",
        maxAge: 1000 * 60 * 60 * 5,
      };
      console.log(token+"login");
      res
        .status(200)
        .cookie("token", token, options)
        .json({ success: true, id: user._id, token });

        console.log(user+"ppp");
        
  })
 } catch (error) {
  console.log('====================================');
  console.log(error);
  console.log('====================================');
  res.json({error})
 }


  })
  router.get("/logout", async (req, res) => {
    res.clearCookie("token"); 
    res.send("you are logged out");
  });

  
//   function isLoggedIn() {
//     return (req, res, next) => {
  
  
//       const token = req.cookies;
//       if(!token) return next(new ErrorHandler("please login to access the resource",401));
//       const id = jwt.verify(token,"piyush" )
//       req.id = id;
//        // res.json({id,token})
//        next();
//     }
//   }





  // const { username, password } = req.body;
  // let user = await userModel.findOne({ email:req.body.email })

  //         if(!user){
  //           return next(new ErrorHandler("User with this email if not found",404) )
  //         }
  //         const isMatch =  user.comparepassword(password,req.body.password)
  //         if(!isMatch){
  //            return next(new ErrorHandler("Wrong crendentials",404))
  //         }
  //         // console.log(req.body);
  //         // sendtoken(user,200,res)
  
  //         res.status(200).json(user) 
     //  res.json({id,token})
  //   let token = req.cookies.token;
  //   if (token) {
  //    jwt.verify(token, "piyush", (err, result) => {
  //       if (result) {
  //         next();
  //       } else {
  //         res.redirect("/login");
  //       }
  //     });
   
  //   } else {
  //     res.redirect("/login");
  //   }



// router.post(
//   "/prouploads",
//   isLoggedIn,
//   async function (req, res) {
//     const product = await productModel.findOne({
//       username: req.session.passport.user,
//     });

//     console.log(req.file.filename);
//     product.img = req.file.filename;
//     await product.save();

//     res.redirect("/postproduct", { product });
//   }
// );

// router.post("/register", function (req, res, next) {
//   console.log(req.params);
//   console.log(req.body);
//   var userdata = new userModel({
//     username: req.body.username,
//     email: req.body.email,
//     category: req.body.category,
//     secret: req.body.secret,
//     adress:req.body.adress
//   });

//   userModel
//     .register(userdata, req.body.password)
//     .then(function (registereduser) {
//       passport.authenticate("local")(req, res, function () {
//         res.redirect("/home");
//       });
//     });
// });

// router.post("/login",passport.authenticate("local", 
//   {
//     successRedirect: "/home",
//     failureRedirect: "/",
//   }),
//   function (req, res) {
// console.log(req.body.formData);

//   }
// );

// router.get("/logout", function (req, res, next) {
//   req.logout(function (err) {
//     if (err) return next(err);
//     res.redirect("/");
//   });
// });

// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect("/");
// }

module.exports = router;