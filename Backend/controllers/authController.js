import UserModel from "../models/User.js";
import jwt  from "jsonwebtoken";
import bcrypt from "bcryptjs";


const signup = async (req,res) => {
  try {
    console.log(req.body);
    const { username, email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400)
        .json({ message: "User already exist, you can Login!", success: false });
    }
    const userModel = new UserModel({ username, email, password });
    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();
    res.status(201)
     .json({
       message: "Signup successfully",
       success:true
     })
  }
  catch (error) {
    res.status(500)
      .json({
        message: "Internal server error",
        success:false
    })
  }
}

const login = async (req,res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const errorMsg = 'Authorization failed email or password is wrong';
    if (!user) {
      return res.status(403)
        .json({ message: errorMsg, success: false });
    }
     const isPassEqual= await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403)
        .json({ message: errorMsg, success: false });
    }
    const jwtToken = jwt.sign(
      { email: user.email, id: user.id }, //payload
      process.env.JWT_SECRET,
      {expiresIn :'24h'}
    )
    res.status(200).json({
      message: "Login successfully",
      success: true,
      jwtToken,
      email: user.email,
      name: user.username
    });    
  }
  catch (error) {
    res.status(500)
      .json({
        message: "Internal server error",
        success:false
    })
  }
}

export { signup, login };