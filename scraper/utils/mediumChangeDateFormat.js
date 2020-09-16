const months = require("./months");

module.exports = function (originalDate) {
  if (originalDate) {
    const [month, day, year] = originalDate.split(" ");
    const currentYear = new Date().getFullYear();
    return `${year ? year : currentYear}.${months[month]}.${
      day.length === 1 ? `0${day}` : day
    }`;
  }
};
