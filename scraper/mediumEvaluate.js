module.exports = () => {
  const [_, featured, __, ...contents] = [
    ...document.querySelector(
      "#root > div > section > div:nth-child(3) > div:nth-child(1)"
    ).children,
  ];

  const posts = [];

  for (content of [featured, ...contents]) {
    const thumbnail = content.querySelector(
      "section > figure > div > div > div > div > img"
    )?.src;

    const title = content.querySelector("h1")?.innerText;
    const subtitle = content.querySelector("h2")?.innerText;
    const date = content.querySelector(
      "div > div > div > div > div > span > span > div > a"
    )?.innerText;
    const link = content.querySelector("div > div:nth-child(2) > a")?.href;

    const result = title && {
      title,
      subtitle,
      date,
      link,
      thumbnail,
    };

    result && posts.push(result);
  }

  return posts;
};
