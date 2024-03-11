const express = require("express");
const { Post } = require("../models/post");
const router = express.Router();
const Category = require("../models/category");
const mongoose = require("mongoose");

// get all posts
router.get(`/`, async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }

  // to choose specific prop to be showed like title and imgage
  // const postList = await Post.find().select("title image brand");

  //to show everything post list

  try {
    const postList = await Post.find(filter).populate("category");
    if (!postList) {
      res.status(400).json({ success: false });
    }
    res.send(postList);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// get one post
router.get(`/:id`, async (req, res) => {
  const post = await Post.findById(req.params.id).populate("category");
  try {
    if (!post) {
      res.status(500).json({ success: false });
    }
    res.send(post);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// create new post
router.post(`/`, async (req, res) => {
  try {
    // const category = await Category.findById(req.body.category);
    // if (!category) {
    //   return res.status(400).send("invalid Category");
    // }
    let {
      title,
      description,
      image,
      brand,
      price,
      richDescriptoin,
      countInStock,
      rating,
      numReviews,
      isFeatured,
    } = req.body;

    const post = new Post({
      title,
      description,
      image,
      brand,
      price,
      category: req.body.category,
      richDescriptoin,
      countInStock,
      rating,
      numReviews,
      isFeatured,
    });

    const newpost = await post.save();

    if (!newpost) {
      res.status(500).json({
        success: false,
        message: "failed to create post!",
      });
    }
    return res.status(201).json(newpost);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// update post
router.put(`/:id`, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid post id");
    }
    // const category = await Category.findById(req.body.category);
    // if (!category) {
    //   return res.status(400).send("invalid Category");
    // }

    const updatedpost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        richDescriptoin: req.body.richDescriptoin,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      },
      { new: true }
    );

    if (!updatedpost) {
      res.status(500).json({
        success: false,
        message: "failed to update post!",
      });
    }
    return res.status(201).json(updatedpost);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// deleting post
router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let post = await Post.findByIdAndDelete(id);
    if (post) {
      return res.status(200).json({ success: true, message: "post deleted" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "post not found!" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// count of posts
router.get("/get/count", async (req, res) => {
  try {
    const postsCount = await Post.countDocuments();
    if (!postsCount) {
      return res.status(400).json({ success: false });
    }
    res.json({
      count: postsCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
