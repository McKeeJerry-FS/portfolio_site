function fetchBlogData() {
  const baseURL = "https://thetechpulse.up.railway.app";

  fetch(`${baseURL}/api/BlogPosts/portfolio/3`)
    .then((response) => response.json())
    .then(function (data) {
      displayBlogData(data, baseURL);
    });
}

function stripHtml(input) {
  let div = document.createElement("div");
  div.innerHTML = input || "";
  return div.textContent || div.innerText || "";
}

function isBlogPublished(blogPost) {
  if (typeof blogPost.isPublished === "boolean") return blogPost.isPublished;
  if (typeof blogPost.published === "boolean") return blogPost.published;

  if (blogPost.publishedDate) {
    const publishedDate = new Date(blogPost.publishedDate);
    return (
      !Number.isNaN(publishedDate.getTime()) && publishedDate <= new Date()
    );
  }

  // If no explicit publish flag/date exists, default to published.
  return true;
}

function displayBlogData(blogPosts, baseUrl) {
  let template = document.getElementById("blog-template");
  let blogSection = document.getElementById("blog");

  blogPosts.forEach((blogPost) => {
    const blogPostCard = document.importNode(template.content, true);
    const articleCard = blogPostCard.querySelector(".blog-article");
    const published = isBlogPublished(blogPost);

    // format image
    let imageLink = blogPostCard.querySelector('[data-blog="imageLink"]');
    imageLink.setAttribute("href", `${baseUrl}/content/${blogPost.slug}`);
    imageLink.href = `${baseUrl}/content/${blogPost.slug}`;

    let imgTag = blogPostCard.querySelector(".blog-image");
    const defaultBlogImage = "/img/Blog/Blog_CodeTag.jpg";
    const hasApiImage =
      typeof blogPost.imageData === "string" &&
      blogPost.imageData.length > 0 &&
      typeof blogPost.imageType === "string" &&
      blogPost.imageType.length > 0;

    imgTag.src = hasApiImage
      ? `data:${blogPost.imageType};base64,${blogPost.imageData}`
      : defaultBlogImage;
    imgTag.loading = "lazy";
    imgTag.decoding = "async";
    imgTag.alt = blogPost.title
      ? `${blogPost.title} featured image`
      : "Blog featured image";
    //add title
    let blogTitleDiv = blogPostCard.querySelector('[data-blog="title"]');
    blogTitleDiv.innerHTML = blogPost.title;

    let blogDate = new Date(blogPost.createdDate); // 2009-11-10
    let month = blogDate.toLocaleString("default", { month: "long" });
    let day = blogDate.getDate();

    //add day
    let blogDayDiv = blogPostCard.querySelector('[data-blog="day"]');
    blogDayDiv.innerHTML = day;

    //add month
    let blogMonthDiv = blogPostCard.querySelector('[data-blog="month"]');

    blogMonthDiv.innerHTML = month;

    // add abstract/content snippet (always abstract-first for card previews)
    let blogContentDiv = blogPostCard.querySelector('[data-blog="content"]');
    const abstract = blogPost.abstract || blogPost.description || "";
    const abstractFallback = stripHtml(abstract || blogPost.content).slice(
      0,
      240,
    );
    blogContentDiv.textContent = abstractFallback;

    //readmore link
    let blogLink = blogPostCard.querySelector('[data-blog="readMoreLink"]');
    blogLink.setAttribute("href", `${baseUrl}/content/${blogPost.slug}`);

    let blogPubDate = blogPostCard.querySelector('[data-blog="publishedDate"]');
    let comingSoonBanner = blogPostCard.querySelector(
      '[data-blog="comingSoonBanner"]',
    );

    if (!published) {
      articleCard.classList.add("blog-unpublished");
      comingSoonBanner.classList.remove("d-none");

      blogLink.setAttribute("aria-disabled", "true");
      blogLink.setAttribute("tabindex", "-1");
      blogLink.classList.add("disabled");
      blogLink.textContent = "Coming Soon";
      blogLink.removeAttribute("href");

      imageLink.removeAttribute("href");
      imageLink.setAttribute("aria-disabled", "true");
      imageLink.setAttribute("tabindex", "-1");

      blogPubDate.innerHTML = "Coming Soon";
      blogSection.appendChild(blogPostCard);
      return;
    }

    let dateToday = new Date();
    let createdDate = new Date(
      blogPost.lastUpdated != null
        ? blogPost.lastUpdated
        : blogPost.createdDate,
    );
    let diffTime = Math.abs(dateToday.getTime() - createdDate.getTime());
    let lastUpdated = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (lastUpdated == 1) {
      blogPubDate.innerHTML = `Published ${lastUpdated} day ago`;
    } else {
      blogPubDate.innerHTML = `Published ${lastUpdated} days ago`;
    }

    blogSection.appendChild(blogPostCard);
  });
}
