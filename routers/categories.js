const router = require("express").Router();
const Category = require("../models/category.js");

// get all categoreis
router.get("/", async (req, res) => {
  const categoryList = await Category.find();
  try {
    if (!categoryList) {
      res.status(400).json({ sucess: false });
    }
    res.status(200).json({ sucess: true, category: categoryList });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// get one category
router.get("/:id", async (req, res) => {
  const oneCategory = await Category.findById(req.params.id);
  try {
    if (!oneCategory) {
      res.status(400).json({ sucess: false });
    }
    res.status(200).send({ sucess: true, category: oneCategory });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// creating cateogry
router.post("/", async (req, res) => {
  try {
    let category = new Category({
      name: req.body.name,
      description: req.body.description,
    });
    category = await category.save();
    if (!category) {
      return res.status(404).send("the category cannot be created!");
    }
    res.status(200).json({ sucess: true, category: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// update category
router.put("/:id", async (req, res) => {
  let { name, icon, color } = req.body;
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
      },
      { new: true }
    );
    if (!category) {
      return res.status(400).send("category didn't updated");
    }
    res.status(200).json({ sucess: true, category: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// deleting category
router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let category = await Category.findByIdAndDelete(id);
    console.log(category);
    if (category) {
      return res
        .status(200)
        .json({ success: true, message: "category deleted" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "category not found!" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "server Error!" });
  }
});

module.exports = router;
