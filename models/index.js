const sequelize = require("../database");

const init = ({ sequelize, models }) => {
  return [...models].reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: require(`./${curr}`)(sequelize),
    };
  }, {});
};

const models = [
  "Users",
  "Blogs",
  "Datas",
  "Bookmarks",
  "Likes",
  "Wecode_nth",
  "Blog_type",
];
const model = init({ sequelize, models });

module.exports = { model, sequelize };
