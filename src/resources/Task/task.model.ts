import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  {
    timestamps: true
  }
);

taskSchema.pre('save', async function(next) {
  // const task = this; // object thats being modified. eg. user

  // execute something here...
  // console.log("task middleware here!!");

  next(); // proceed...
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
