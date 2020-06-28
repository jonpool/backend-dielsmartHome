const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require ('crypto');
const mailer = require('../../modules/mailer');
const authconfig = require ('../../config/auth');


const User = require('../models/User');
const router = express.Router();

function generateToken(params = {}){
  return jwt.sign(params, authconfig.secret,{
     expiresIn:86400,
  });
}


router.post('/register', async (req, res)=>{

  const { email } = req.body;
  try{

    if(await User.findOne({ email }))
      return res.status(400).send({ error: 'User already exist'});
    
    const user = await User.create(req.body);
    
    user.password = undefined;
    return res.send({user, 
      token: generateToken({id: user.id }),
    });
  }
  catch(err){
    return res.status(400).send({error: err});

  }
});

router.post('/autenticate',async (req ,res) =>{
  const {email, password} = req.body;
  const user = await User.findOne({ email }).select('+password');

  if(!user)
    return res.status(400).send({error: 'User not found'});
  if(!await bcrypt.compare(password, user.password))
    return res.status(400).send({error: 'Bad Password'});
  user.password = undefined;

  
  

  res.send({user,
     token: generateToken({id: user.id }),
    });


});

router.post('/forgot_password', async (req , res)=>{
  const {email} = req.body;

  try{
      const user = await User.findOne({ email });
      if(!user)
        return res.status(400).send({error: 'User not found'});
      
      const token = crypto.randomBytes(20).toString('hex');
            
      const now = new Date();
      now.setHours(now.getHours() + 1);
      
      await User.findByIdAndUpdate(user.id,{
        '$set':{
          passwordResetToken: token,
          passwordResetExpire: now,
        }
      });

      mailer.sendMail({
          to: email,
          from: 'info@inforprize.com',
          template: 'templates/forgot_password',
          context: {token},
      }), (err)=>{
        if (err)
            return res.status(400).send({error: 'Cannot send forgot password email'});
          }
       return res.send();
  }
  catch(err){
    console.log(err);
    res.status(400).send({error: 'Erro on forgot password, Try Again'});
  }

});

router.post('/reset_password',async(req, res)=>{
  const {email, token, password} = req.body;
  try{

    const user = await User.findOne({email})
        .select('+passwordResetToken passwordResetExpire');

    

    if(!user)
       return res.status(400).send({error: "User not found"});

    if(token !== user.passwordResetToken)
      return res.status(400).send({error: "Token is invalid"});
    const now = new Date();

    if(now > user.passwordResetExpire)
      return res.status(400).send({error:"Token expired, please request another token"});
    
    user.password = password;



    await user.save();

    res.send();



  }catch(err){
    console.log(err);
    res.status(400).send({error: {err}});
  }

});

module.exports = app => app.use('/auth', router);