import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ["To-Do", "In-Progress", "Completed"],
      default: "To-Do",
    },
    dueDate: { type: Date },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // To validate ownership
  },
  { timestamps: true }
);
export default mongoose.model("Task", TaskSchema);
