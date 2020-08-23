const axios = require("axios");
const jwt = require("jsonwebtoken");

const googleAuth = async (googleToken) => {
  const { sub, email, name, picture } = axios.get(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`
  );
  return { sub, email, name, picture };
};

const createToken = (userId) => {
  const token = jwt.sign({ id: userId.toString() }, process.env.SECRET_KEY);
  return token;
};

module.exports = { googleAuth, createToken };
