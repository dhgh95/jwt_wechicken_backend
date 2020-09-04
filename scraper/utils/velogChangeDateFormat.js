const moment = require("moment");

module.exports = function (originalDate) {
  if (originalDate.includes("년")) {
    const date = originalDate.match(/[0-9]+/g);
    return `${date[0]}.${date[1].length === 1 ? `0${date[1]}` : date[1]}.${
      date[2].length === 1 ? `0${date[2]}` : date[2]
    }`;
  }
  const currentDate = moment();
  if (originalDate.includes(`방금 전`)) {
    return currentDate.format("YYYY.MM.DD");
  }
  if (originalDate.includes(`어제`)) {
    return currentDate.subtract(1, "d").format("YYYY.MM.DD");
  }
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
