const months = require("./months");
const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

const refineMediumPosts = (posts) => {
  const changeDateFormat = (originalDate) => {
    const [month, day, year] = originalDate.split(" ");
    const currentYear = new Date().getFullYear();
    return `${year ? year : currentYear}.${months[month]}.${day}`;
  };

  return posts.map((post) => {
    return {
      ...post,
      date: changeDateFormat(post.date),
    };
  });
};

const refineVelogPosts = (posts) => {
  const refineDate = (originalDate) => {
    if (originalDate.includes("년")) {
      const date = originalDate.match(/[0-9]+/g);
      return `${date[0]}.${date[1].length === 1 ? `0${date[1]}` : date[1]}.${
        date[2].length === 1 ? `0${date[2]}` : date[2]
      }`;
    }
    const currentDate = moment();
    if (originalDate.includes(`일 전`)) {
      const beforeDay = originalDate.match(/[0-9]/gi)[0];
      return currentDate.subtract(beforeDay, "d").format("YYYY.MM.DD");
    }
    if (originalDate.includes("시간")) {
      const beforeTime = originalDate.match(/[0-9]+/gi)[0];
      return currentDate.subtract(beforeTime, "H").format("YYYY.MM.DD");
    }
    if (originalDate.includes("분")) {
      const beforeMinute = originalDate.match(/[0-9]+/gi)[0];
      return currentDate.subtract(beforeMinute, "m").format("YYYY.MM.DD");
    }
  };

  return posts.map((post) => {
    return { ...post, date: refineDate(post.date) };
  });
};

module.exports = function (posts, blogType) {
  return blogType === "medium"
    ? refineMediumPosts(posts)
    : refineVelogPosts(posts);
};
