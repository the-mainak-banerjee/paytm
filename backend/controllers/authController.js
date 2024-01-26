const z = require("zod");
const User = require("../models/userModel");
const { handleSigninWithToken } = require("../utils");

const newUserSchema = z.object({
  userName: z
    .string({
      required_error: "User name is required",
      invalid_type_error: "User name must be a string",
    })
    .min(3, { message: "User name must be 3 or more characters long" })
    .max(30, { message: "User name must be 30 or fewer characters long" })
    .email(),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(6, { message: "Password must be 6 or more characters long" }),
  firstName: z.string({
    required_error: "User name is required",
    invalid_type_error: "User name must be a string",
  }),
  lastName: z.string({
    required_error: "User name is required",
    invalid_type_error: "User name must be a string",
  }),
});

const existingUserSchema = z.object({
  userName: z
    .string({
      required_error: "User name is required",
      invalid_type_error: "User name must be a string",
    })
    .min(3, { message: "User name must be 3 or more characters long" })
    .max(30, { message: "User name must be 30 or fewer characters long" })
    .email(),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(6, { message: "Password must be 6 or more characters long" }),
});

exports.signup = async (req, res) => {
  try {
    const userDetails = req.body;
    const isValidUserData = newUserSchema.safeParse(userDetails);

    if (!isValidUserData.success) {
      res.status(411).json({ message: "Invalid format of credentials" });
      return;
    }

    const existingUser = await User.findOne({ userName: userDetails.userName });
    if (existingUser) {
      return res.status(411).json({
        message: "Email already taken/ Incorrect inputs",
      });
    }

    const user = await User.create(userDetails);
    const token = await handleSigninWithToken(user.userName);

    res.status(200).json({
      message: "Account created successfully",
      token: token,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const userDetails = req.body;
    const isValidUserData = existingUserSchema.safeParse(userDetails);
    if (!isValidUserData.success) {
      res.status(411).json({ message: "Invalid format of credentials" });
      return;
    }
    const user = await User.findOne({ userName: userDetails.userName });
    const isPasswordValid = user
      ? await user.matchPassword(userDetails.password, user.password)
      : false;
    if (!user || !isPasswordValid) {
      res.status(411).json({
        message: "Either username or password is incorrect",
      });
      return;
    }

    const token = handleSigninWithToken(user.userName);
    res.status(200).json({
      message: "Successfully signed in",
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
