const  mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const plm = require("passport-local-mongoose")
const { type } = require("os")
const jwt = require("jsonwebtoken")


const userSchema = mongoose.Schema({
    username:String,
    email:{
      type:String,
      unique: true,
      required:[true,"Email is required"],
    },
    password :{
      type:String
    },
    category:String,
    secret:String,
    adress:String,
    phoneNumber:Number,
    like:{
        type:Array,
        default:[],
    },
    order:[{
    holder:{
      type : mongoose.Schema.Types.ObjectId,
      ref:'user',
    },
    paymentId: {
      type: String,
  
    },
    orderId: {
      type: String,
      required: true
    },
    successful: {
      type: Boolean,
      default: false
    },
  
    }],
    cart : [
      {
        pro:{
          type : mongoose.Schema.Types.ObjectId,
          ref : 'product',
  
        },
        quantity:Number
      }
    ],
     
      wishlist : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'product'
      }],
      product :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'product'
      }],
      SUM:Number,
  

    
})

userSchema.pre("save",function (){
  if(!this.isModified("password")){
      return;
  }
  
      let salt = bcrypt.genSaltSync(10)
      this.password = bcrypt.hashSync(this.password,salt)
  
  })
  
  userSchema.methods.comparepassword =function (password) {
      return bcrypt.compareSync(password , this.password)
      
  }
  userSchema.methods.getjwttoken = function () {
    return jwt.sign({ id: this._id },'piyush', {
      expiresIn: '24h',
    });
  };

userSchema.plugin(plm)
module.exports = mongoose.model("user",userSchema)
