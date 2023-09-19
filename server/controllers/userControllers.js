import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.json({
        message: "Please fill all fields",
      });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.json({ message: "Email already exists" });
    }
    const hashpass = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      name,
      email,
      password: hashpass,
      role,
    });
    const user = await newUser.save();
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Please fill all the fields");
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("User not registered");
    }
    const isMatchedPassword = await bcrypt.compare(password, user.password);
    if (!isMatchedPassword) {
      res.status(401);
      throw new Error("Email and Password is not correct");
    }

    const token = jwt.sign({ id: user._id }, "mysupersecret786", {
      expiresIn: "5d",
    });

    return res
      .cookie("token", token, {
        // httpOnly: true,
        // secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
        // sameSite: "strict", // Prevent CSRF attacks
        // maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      })
      .json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
  } catch (error) {
    res.json({ message: error.message });
  }
};
const getALLUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    res.status(401);
    throw new Error(error);
  }
};

const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    return res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res) => {
  const { name, role, email, password } = req.body;
  const hashpass = await bcrypt.hash(password, 10);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        password: hashpass,
        role,
      },
      { new: true }
    )
      .select(`-password`)
      .select(`-createdAt`)
      .select(`-updatedAt`)
      .select(`-__v`);
    return res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
};
const deleteUser = async (req, res) => {
  try {
    const daletedUser = await User.findByIdAndDelete(req.params.id);
    return res.json(daletedUser);
  } catch (error) {
    throw new Error(error);
  }
};
const loggedIn = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json(false);
    const decode = jwt.verify(token, "mysupersecret786");
    const id = decode.id;
    req.user = await User.findById(id);

    res.send(req.user.role);
    // res.send(true);
  } catch (err) {
    res.json(false);
  }
};
export {
  register,
  login,
  getALLUsers,
  logout,
  getUser,
  updateUser,
  deleteUser,
  loggedIn,
};
