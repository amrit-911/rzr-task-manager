import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User Already Exists" });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error });
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User Doesn't Exists" });

    const passTrue = await user.matchPassword(password);
    if (passTrue) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid Password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error });
    next(error);
  }
};

const getAllUser = async (req, res, next) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export { registerUser, loginUser, getAllUser };
