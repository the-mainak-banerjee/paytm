const mongoose = require("mongoose");
const { handleHashPassword, handleMatchPassword } = require("../utils");

const userModelSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    toLowerCase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
});

userModelSchema.pre("save", async function (next) {
  const protectedPassword = await handleHashPassword(this.password);
  this.password = protectedPassword;
  next();
});

userModelSchema.methods.matchPassword = function (
  providedPassword,
  hashedPassword
) {
  return handleMatchPassword(providedPassword, hashedPassword);
};

const User = mongoose.model("User", userModelSchema);

module.exports = User;
