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
  "Dates",
  "Bookmarks",
  "Likes",
  "Wecode_nth",
  "Blog_type",
];
const model = init({ sequelize, models });

model["Users"].hasMany(model["Blogs"]);
model["Wecode_nth"].hasMany(model["Users"], {
  foreignKey: "wecode_nth",
});
model["Blog_type"].hasMany(model["Users"]);
model["Dates"].hasMany(model["Blogs"]);
model["Users"].belongsToMany(model["Blogs"], {
  through: "likes",
});
model["Blogs"].belongsToMany(model["Users"], {
  through: "likes",
});
model["Users"].belongsToMany(model["Blogs"], {
  through: "bookmars",
});
model["Blogs"].belongsToMany(model["Users"], {
  through: "bookmars",
});

module.exports = { model, sequelize };
