const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const token = jwt.sign(
    { _id: user._id, user: user.username },
    process.env.JWT_PK,
    {
      expiresIn: 60 * 60,
    }
  );
  return token;
};

module.exports = { generateToken };
