function fetchBlogData() {
    const baseURL = "https://thetechpulse.up.railway.app/";
    
      fetch(`${baseURL}/api/BlogPosts/portfolio/3`)
        .then((response) => response.json())
        .then(function (data) {
          displayBlog(data, baseURL);
        });
  }
  
  function displayBlog(data, _baseURL) {
    //blogs = getData();
  
    let template = document.getElementById("blog-template");
    let blogSection = document.getElementById("blogs");
    /* 
    "title": "string",
    "slug": "string",
    "abstract": "string",
    "content": "string",
    "created": "2022-08-24",
    "updated": "2022-08-24",  
    "imageData": "string",
    "imageType": "string",
    */
  
    data.forEach((article) => {
      const articleCard = document.importNode(template.content, true);
      //format image
      imageDiv = articleCard.querySelector('[data-blog="imageLink"]');
      imageDiv.setAttribute(
        "href",
        `https://thetechpulse.up.railway.app/content/${article.slug}`
      );
  
      imgTag = document.createElement("img");
      imgTag.setAttribute(
        "src",
        `data:${article.imageType};base64,${article.imageData}`
      );
      imgTag.classList.add("blog-image");
      imageDiv.appendChild(imgTag);
      // <img src="data:image/gif;base64,xxxxxxxxxxxxx..." class="blog-image" alt="...">
      //add title
      cardTitleDiv = articleCard.querySelector("[data-blog='title']");
      cardTitleDiv.innerHTML = article.title;
  
      let blogDate = new Date(article.created); // 2009-11-10
      let month = blogDate.toLocaleString("default", { month: "long" });
      let day = blogDate.getDate();
  
      //add day
      blogDayDiv = articleCard.querySelector("[data-blog='day']");
      blogDayDiv.innerHTML = day;
  
      //add month
      blogMonthDiv = articleCard.querySelector("[data-blog='month']");
  
      blogMonthDiv.innerHTML = month;
  
      //add content
      blogContentDiv = articleCard.querySelector("[data-blog='content']");
      blogContentDiv.innerHTML = article.content;
  
      //readmore link
      blogLink = articleCard.querySelector("[data-blog='readMoreLink']");
      blogLink.setAttribute(
        "href",
        `https://thetechpulse.up.railway.app/content/${article.slug}`
      );
  
      blogPubDate = articleCard.querySelector("[data-blog='publishedDate']");
  
      dateToday = new Date();
      createdDate = new Date(
        article.updated != null ? article.updated : article.created
      );
      diffTime = Math.abs(dateToday.getTime() - createdDate.getTime());
      lastUpdated = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (lastUpdated == 1) {
          blogPubDate.innerHTML = `Published ${lastUpdated} day ago`;
      } else {
          blogPubDate.innerHTML = `Published ${lastUpdated} days ago`;
      }
  
      blogSection.appendChild(articleCard);
    });
  }