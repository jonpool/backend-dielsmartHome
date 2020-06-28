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
  createdAt:{
    type: Date,
    default: Date.now,
  },
});


schema.pre('save', async function(next){
  const hash = await bcrypt.hash(this.password, 10)
  this.password = hash;

  next();
});

const User = mongoose.model('User', schema);
module.exports = User;

