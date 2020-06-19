const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const authconfig = require ('../config/auth')


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

module.exports = app => app.use('/auth', router);