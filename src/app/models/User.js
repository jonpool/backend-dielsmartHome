const mongoose = require('../../database');
const bcrypt = require('bcryptjs');


const schema = new mongoose.Schema({
  name:{
    type: String,
    require: true,
  },
  email:{
    type: String,
    unique: true,
    required:true,
    lowecase: true,
  },
  password:{
    type: String,
    require: true,
    select: false,
  },
  passwordResetToken:{
    type:String,
    require: true,
    select: false,
  },
  referral:[{
    type : mongoose.Schema.Types.ObjectId,
    ref:'Referral',
  }],
  createdAt:{
    type: Date,
    default: Date.now,
  },
});


schema.pre('savePw', async function(next){
  const hash = await bcrypt.hash(this.password, 10)
  this.password = hash;
  next();
});

const User = mongoose.model('User', schema);
module.exports = User;

