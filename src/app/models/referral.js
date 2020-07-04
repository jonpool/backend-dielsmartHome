const mongoose = require('../../database');
const bcrypt = require('bcryptjs');


const ReferralSchema = new mongoose.Schema({
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
  phone: {
    type: String,
    unique: true,
    required:true,
    lowecase: true,
  },
  Status:{
    type : Boolean,
    required: true,
    default: false,
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  createdAt:{
    type: Date,
    default: Date.now,
  },
});


const Referral = mongoose.model('Referral', ReferralSchema);
module.exports = Referral;

