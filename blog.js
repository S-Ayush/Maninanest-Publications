import { blog } from "./blogContent.js";

// const blog = [
//   {
//     title: "Finding simplicity in life",
//     img: "img/life.jpg",
//     publishedDate: "July 23, 2019",
//     displayedContent:
//       "Life can get complicated really quickly, but it doesn't have to be! There are many ways to simplify your life, a few of which we've explored in the past. This week we're taking a bit of a approach through, in how you can find simplicity in the life you already leaving.",
//     remainingContent:
//       "Life can get complicated really quickly, but it doesn't have to be! There are many ways to simplify your life, a few of which we've explored in the past. This week we're taking a bit of a approach through, in how you can find simplicity in the life you already leaving.",
//     Comment: 3,
//   },
//   {
//     title: "Keeping cooking simple",
//     img: "img/food.jpg",
//     publishedDate: "July 19, 2019",
//     displayedContent:
//       "Food is a very important part of everyone's life. If you want to be healthy, you have to eat healthy. One of the easiest way to do that is to keep your cooking nice and simple.",
//     remainingContent:
//       "Life can get complicated really quickly, but it doesn't have to be! There are many ways to simplify your life, a few of which we've explored in the past. This week we're taking a bit of a approach through, in how you can find simplicity in the life you already leaving.",
//     Comment: 3,
//   },
//   {
//     title: "Simplicity and work",
//     img: "img/work.jpg",
//     publishedDate: "July 12, 2019",
//     displayedContent:
//       "Work is often a major source of stress. People get frustrated, it ruins their relationship with others and it leads to burnout. By keeping your work life as simple as possible, it will help balance everything out.",
//     remainingContent:
//       "Life can get complicated really quickly, but it doesn't have to be! There are many ways to simplify your life, a few of which we've explored in the past. This week we're taking a bit of a approach through, in how you can find simplicity in the life you already leaving.",
//     Comment: 3,
//   },
//   {
//     title: "Simple decoration",
//     img: "img/deco.jpg",
//     publishedDate: "July 3, 2019",
//     displayedContent:
//       "A home isn't a home untill you've decorated a little. People either don't decorate, or they go overboard and it doesn't have the impact they were hoping for. Staying simple will help draw the eye where you want it to and make things pop like never before.",
//     remainingContent:
//       "Life can get complicated really quickly, but it doesn't have to be! There are many ways to simplify your life, a few of which we've explored in the past. This week we're taking a bit of a approach through, in how you can find simplicity in the life you already leaving.",
//     Comment: 3,
//   },
// ];

var id = document.location.search.charAt(4);
if (!id) {
  id = blog.length - 1;
}

function start() {
  document.getElementById("blog-title").innerHTML = blog[id].title;
  document.getElementById("blog-img").src = blog[id].img;
  document.getElementById("blog-publishedDate").innerHTML =
    blog[id].publishedDate;
  document.getElementById("blog-author").innerHTML += blog[id].author;
  document.getElementById("blog-displayedContent").innerHTML =
    blog[id].displayedContent;
  document.getElementById("blog-remainingContent").innerHTML =
    blog[id].remainingContent;

  blog.map((item, index) => {
    if (index != id) {
      document.getElementById("blog").innerHTML +=
        '<article class="article-recent"><div class="article-recent-main"><h2 class="article-title">' +
        item.title +
        '</h2><p class="article-body">' +
        item.displayedContent +
        '</p><a href="#" class="article-read-more" onclick="setHeader(' +
        index +
        ')">CONTINUE READING</a></div><div class="article-recent-secondary"><img src=' +
        item.img +
        ' alt="" class="article-image" onclick="setHeader(' +
        index +
        ')"/><p class="article-info">' +
        item.publishedDate +
        " | " +
        item.Comment +
        " comments</p></div></article>";
    }
  });
}

start();
