const mongoose = require('../../database');
const bcrypt = require('bcryptjs');


const TaskSchema = new mongoose.Schema({
  title:{
    type: String,
    require: true,
  },
  project:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    require: true,
  },
  assignedTo:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  Completed:{
    type : Boolean,
    required: true,
    default: false,
  },

  createdAt:{
    type: Date,
    default: Date.now,
  },
});


const Task = mongoose.model('Tasks', TaskSchema);
module.exports = Task;

