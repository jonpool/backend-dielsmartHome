const express = require('express');
const authMiddleware = require('../middlewares/auth')

const User= require('../models/User');
const Referral = require('../models/referral');

const router = express.Router();

router.use(authMiddleware);


router.get('/', async (req, res)=>{
          try{
              console.log(req.userId);
              const user = await User.findById(req.userId).populate('referral');;
              return res.send({user});

          }catch(err){
              console.log(err);
              res.status(400).send({ error:'Erro listing referral' });
          }
});

//create a new post
router.post('/', async (req,res)=>{

            try{
                const { name, email, phone} = req.body;
                const user = await User.findById(req.userId);

                console.log (name,email,phone);
                const referral  = await Referral.create({ name, email, phone, user: req.userId });
                console.log(referral);
                user.referral.push(referral._id);
                user.save();
                return res.status(200).send({Message: 'Referral Created'});

              }
          catch(err){
                console.log(err);
                res.status(400).send({ error:'Erro creating new referral' });
              }
});

router.get('/:referralId', async (req, res)=>{
  
          try{
            const referral = await Referral.findById(req.params.referralId);
            return res.send({referral});

            }catch(err){
                res.status(400).send({ error:'Erro listing project' });
            }
});

router.put('/:projectId', async (req, res)=>{
          try{
            const { title, description, tasks} = req.body;

            const project  = await Projects.findByIdAndUpdate(req.params.projectId,{ 
                  title,
                  description,
                },{ new: true});

            project.tasks =[];
            await Task.deleteMany({project: project._id });

            await Promise.all(tasks.map(async task =>{

              const projectTask = new Task({...task, project: project._id});
              await projectTask.save()
              project.tasks.push(projectTask);

            }));

            await project.save();

            return res.send({ project });

          }
          catch(err){
              
              res.status(400).send({ error:'Erro updating new project' });
            }
  });

router.get('/:projectId', async (req, res)=>{

try{
  const projects = await Projects.findById(req.params.projectId).populate(['user','tasks']);
  return res.send({projects});

  }catch(err){
      console.log(err);
      res.status(400).send({ error:'Erro listing project' });
  }
});

router.delete('/:projectId', async (req, res)=>{
      try{
        const projects = await Projects.findByIdAndRemove(req.params.projectId).populate('user');
        return res.send();

        }catch(err){
          
          res.status(400).send({ error:'Erro deleting project' });
        }
    });


module.exports = app => app.use('/referral', router);
