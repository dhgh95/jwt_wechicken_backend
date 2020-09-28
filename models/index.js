const sequelize = require("../database");

const init = ({ sequelize, models }) => {
  return models.reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: require(`./${curr}`)(sequelize),
    };
  }, {});
};

const models = [
  "Users",
  "Blogs",
  "Dates",
  "Bookmarks",
  "Likes",
  "Wecode",
  "Blog_type",
];
const model = init({ sequelize, models });

model["Users"].hasMany(model["Blogs"]);
model["Blogs"].belongsTo(model["Users"]);

model["Wecode"].hasMany(model["Users"], { foreignKey: "wecode_nth" });
model["Users"].belongsTo(model["Wecode"], { foreignKey: "wecode_nth" });

model["Blog_type"].hasMany(model["Users"]);
model["Users"].belongsTo(model["Blog_type"]);

model["Dates"].hasMany(model["Blogs"]);
model["Blogs"].belongsTo(model["Dates"]);

model["Users"].hasMany(model["Likes"]);
model["Likes"].belongsTo(model["Users"]);
model["Blogs"].hasMany(model["Likes"]);
model["Likes"].belongsTo(model["Blogs"]);

model["Users"].hasMany(model["Bookmarks"]);
model["Bookmarks"].belongsTo(model["Users"]);
model["Blogs"].hasMany(model["Bookmarks"]);
model["Bookmarks"].belongsTo(model["Blogs"]);

module.exports = { ...model, sequelize, model };
