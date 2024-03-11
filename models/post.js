const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  richDescription: {
    type: String,
    default: "",
  },
  image: {
    type: String,
  },
  images: [
    {
      type: String,
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    // required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

// these 4 lines to create id in post obj that has the value of _id so you can use is in frontend as id ez
postSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
postSchema.set("toJSON", {
  virtuals: true,
});

exports.Post = mongoose.model("Post", postSchema);
