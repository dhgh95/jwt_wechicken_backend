module.exports = async (currentDate) => {
  const posts = document.querySelectorAll(
    "#root > div:nth-child(2) > div:nth-child(3) > div:nth-child(4) > div:nth-child(3) > div > div"
  );
  let todayPosts = [];

  for (let post of [...posts]) {
    let date = post.querySelector("div.subinfo > span").innerText;
    date = await changeDateFormat(date);

    if (date !== currentDate) break;

    const link = `https://velog.io${
      post.querySelector("a").attributes.href.value
    }`;
    const thumnail = post.querySelector("a > div > img")?.attributes.src.value;
    const title = post.querySelector("a > h2").innerText;
    const subtitle = post.querySelector("p")?.innerText;

    todayPosts = [...todayPosts, { link, thumnail, title, subtitle, date }];
  }
  return todayPosts;
};
