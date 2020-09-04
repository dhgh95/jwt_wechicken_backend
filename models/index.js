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

model["Users"].hasMany(model["Blogs"], {
  foreignKey: "user_id",
  sourceKey: "id",
});
model["Blogs"].belongsTo(model["Users"], {
  foreignKey: "user_id",
  targetKey: "id",
});

model["Wecode_nth"].hasMany(model["Users"], {
  foreignKey: "wecode_nth",
  sourceKey: "nth",
});

model["Blog_type"].hasMany(model["Users"], {
  foreignKey: "blog_type_id",
  sourceKey: "id",
});
model["Users"].belongsTo(model["Blog_type"], {
  foreignKey: "blog_type_id",
  targetKey: "id",
});

model["Dates"].hasMany(model["Blogs"], {
  foreignKey: "date_id",
  sourceKey: "id",
});
model["Blogs"].belongsTo(model["Dates"], {
  foreignKey: "date_id",
  targetKey: "id",
});

model["Users"].belongsToMany(model["Blogs"], {
  through: "likes",
  foreignKey: "user_id",
  as: "like",
});
model["Blogs"].belongsToMany(model["Users"], {
  through: "likes",
  foreignKey: "blog_id",
  as: "like",
});

model["Users"].belongsToMany(model["Blogs"], {
  through: "bookmarks",
  foreignKey: "user_id",
  as: "bookmark",
});
model["Blogs"].belongsToMany(model["Users"], {
  through: "bookmarks",
  foreignKey: "blog_id",
  as: "bookmark",
});
module.exports = { model, sequelize };
