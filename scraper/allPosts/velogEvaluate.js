module.exports = async () => {
  const posts = document.querySelectorAll(
    "#root > div:nth-child(2) > div:nth-child(3) > div:nth-child(4) > div:nth-child(3) > div > div"
  );

  let postsArray = [];

  for (let post of [...posts]) {
    const link = `https://velog.io${
      post.querySelector("a")?.attributes.href.value
    }`;
    const thumbnail = post.querySelector("a > div > img")?.src;
    const title = post.querySelector("a > h2")?.innerText;
    const subtitle = post.querySelector("p")?.innerText;

    let date = post.querySelector("div.subinfo > span")?.innerText;
    date = await changeDateFormat(date);

    postsArray = [...postsArray, { title, subtitle, date, link, thumbnail }];
  }

  return postsArray;
};
