const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/facebook-login", async (req, res) => {
  const { access_token } = req.body;

  try {
    const fbRes = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,picture,email&access_token=${access_token}`
    );

    const { id, name, picture, email } = fbRes.data;

    let user = await User.findOne({ facebookId: id });
    if (!user) {
      user = new User({
        facebookId: id,
        name,
        email: email || `${id}@facebook.com`,
        picture: picture?.data?.url,
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error("Facebook login error:", error.message);
    res.status(500).json({ message: "Facebook Login Failed" });
  }
});

module.exports = router;
