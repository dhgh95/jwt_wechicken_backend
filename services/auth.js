const axios = require("axios");
const jwt = require("jsonwebtoken");

const googleAuth = async (googleToken) => {
  const { data } = await axios.get(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`
  );
  return data;
};

const createToken = (user_id, wecode_nth) => {
  return jwt.sign({ user_id, wecode_nth }, process.env.SECRET_KEY);
};

module.exports = { googleAuth, createToken };
