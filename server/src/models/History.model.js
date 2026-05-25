import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    type: {
      type: String,
      required: [true, "Operation type is required"],
      enum: ["translate", "analyze", "optimize", "explain"],
    },
    inputCode: {
      type: String,
      required: [true, "Input code is required"],
    },
    sourceLanguage: {
      type: String,
      required: [true, "Source language is required"],
    },
    targetLanguage: {
      type: String,
      default: null,
    },
    output: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Output is required"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

historySchema.index({ userId: 1, createdAt: -1 });
historySchema.index({ userId: 1, type: 1 });
historySchema.index({ userId: 1, favorite: 1 });

const History = mongoose.model("History", historySchema);
export default History;
