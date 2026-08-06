import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const locationSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const mediaSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const roomSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    location: {
      type: [locationSchema],
      default: [],
    },
    media: {
      type: [mediaSchema],
      default: [],
    },
  },
  { timestamps: true },
);
const namespaceSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  href: {
    type: String,
    required: true,
  },
  rooms: {
    type: [roomSchema],
    default: [],
  },
});

export const NamespaceModel = mongoose.model("Namespace", namespaceSchema);
