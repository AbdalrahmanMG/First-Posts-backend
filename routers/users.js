const bcrypt = require("bcryptjs/dist/bcrypt");
const { User } = require("../models/user");
const router = require("express").Router();
const jwt = require("jsonwebtoken");

// get all users
router.get("/", async (req, res) => {
  const userList = await User.find().select("-passwordHash");
  try {
    if (!userList) {
      res.status(400).json({ success: false });
    }
    res.send(userList);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// get users count
router.get("/get/count", async (req, res) => {
  const usersCount = await User.countDocuments();
  try {
    if (!usersCount) {
      res.status(400).json({ success: false });
    }
    res.json({
      count: usersCount,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// create new user
router.post(`/`, async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      city: req.body.city,
      country: req.body.country,
    });

    const newUser = await user.save();

    if (!newUser) {
      res.status(400).json({
        success: false,
        message: "failed to create user!",
      });
    }
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// user register
router.post(`/register`, async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      // Generate hash for password
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      city: req.body.city,
      country: req.body.country,
    });

    const newUser = await user.save();

    if (!newUser) {
      res.status(400).json({
        success: false,
        message: "Failed to create user!",
      });
    }
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// get one user
router.get("/:id", async (req, res) => {
  const oneuser = await User.findById(req.params.id).select("-passwordHash");
  try {
    if (!oneuser) {
      res.status(500).json({ sucess: false });
    }
    res.status(200).send(oneuser);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// login
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  try {
    if (!user) {
      return res.status(400).send("User is not found");
    }
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const secret = process.env.SECRET;
      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin,
        },
        secret,
        { expiresIn: "1d" }
      );

      return res
        .status(200)
        .send({ message: "User is Authenticated", token: token });
    } else {
      return res.status(400).send("password is wrong");
    }

    // return res.status(200).send(user);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// deleting user
router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let user = await User.findByIdAndDelete(id);
    if (user) {
      return res.status(200).json({ success: true, message: "user deleted" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "user not found!" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "server Error!" });
  }
});

module.exports = router;
