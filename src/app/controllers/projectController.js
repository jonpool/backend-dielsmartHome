const express = require('express');
const authMiddleware = require('../middlewares/auth')

const Projects = require('../models/project');
const Task = require('../models/task');

const router = express.Router();

router.use(authMiddleware);


router.get('/', async (req, res)=>{
          try{
              const projects = await Projects.find().populate(['user','tasks']);
              return res.send({projects});

          }catch(err){
              console.log(err);
              res.status(400).send({ error:'Erro listing project' });
          }
});

//create a new post
router.post('/', async (req,res)=>{

            try{
                const { title, description, tasks} = req.body;

                const project  = await Projects.create({ title, description, user: req.userId });

                await Promise.all(tasks.map(async task =>{

                  const projectTask = new Task({...task, project: project._id});
                  await projectTask.save()
                  project.tasks.push(projectTask);

                }));

                await project.save();

                return res.send({ project });

              }
          catch(err){
                
                res.status(400).send({ error:'Erro creating new project' });
              }

              //retorno para minha request
              res.send({ user: req.userId });
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


module.exports = app => app.use('/projects', router);
