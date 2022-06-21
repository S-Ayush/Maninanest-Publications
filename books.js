jQuery(document).ready(function () {
  const API_HOST = "https://mnp-backend.herokuapp.com"; //"http://localhost:3000";
  let allBooks = [];
  let myBooks = [];
  let user = "";
  let activeTab = "Books";

  $("#close-books-login-modal").on("click", function () {
    $("#books-login-modal-background").addClass("hidden").removeClass("show");
    $("#books-login-modal").addClass("hidden").removeClass("show");
  });

  $("#books-Login-user").on("click", async function () {
    const email = $("#books-login-email").val();
    const html = `<p 
      style="color:red;
      position:absolute;
      margin:auto;
      bottom: 10px;
      left: 50%;
      transform: translate(-50%,0px);">
      Invalid Email
      </p>`;
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email || !email.toLowerCase().match(emailRegex)) {
      $("#books-login-modal").append(html);
      setTimeout(function () {
        $("#books-login-modal p").remove();
      }, 5000);
    } else {
      console.log(email);
      const res = await authenticateUser({ email });
      console.log(res);
      if (res.err) {
        $("#books-login-modal").append(html);
        setTimeout(function () {
          $("#books-login-modal p").remove();
        }, 5000);
      } else {
        $("#books-login-modal-background")
          .addClass("hidden")
          .removeClass("show");
        $("#books-login-modal").addClass("hidden").removeClass("show");
        checkAuthentication();
        // document.location = "/apps/dashboard.html";
      }
    }
  });

  $(".analysis-navbar").on("click", ".analysis-navItem", function () {
    $(".analysis-navItem.active").removeClass("active");
    $(this).addClass("active");
    activeTab = $(this).html().trim();
    printBooks(activeTab === "Books" ? allBooks : myBooks);
  });

  $("#booksTab").on("click", ".books-item", function () {
    if (activeTab === "My Books") {
      window.open($(this).attr("id"), "_blank");
    } else if (user) {
      document.location.href = `/apps/dashboard.html?book_name=${$(this).attr(
        "data-name"
      )}&book_id=${$(this).attr("data-id")}`;
    }
  });

  // books html functions

  const printBooks = (books) => {
    let html = "";
    books.forEach((book) => {
      html += `
            <div class="books-item col-md-3 col-4" id="${book.drive_url}" data-name="${book.title}" data-id="${book._id}">
          <div class="books-image">
            <img src="${book.cover_url}" alt="" />
          </div>
          <div class="books-details">
            <p class="books-title">${book.title}</p>
            <p class="books-author">${book.authors}</p>
          </div>
        </div>
        `;
    });
    $("#booksTab").html(html);
  };

  const checkUser = () => {
    let queryString = document.location.search;
    if (queryString) {
      var query = {};
      var pairs = (
        queryString[0] === "?" ? queryString.substr(1) : queryString
      ).split("&");
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split("=");
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
      }
      user = query.userid;
    }
  };

  // API CALLS

  const getBooks = async () => {
    const res = await fetch(`${API_HOST}/book`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "content-Type": "application/json",
      },
      credentials: "include",
    });
    debugger;
    if (res.status === 200) {
      allBooks = await res.json();
      printBooks(allBooks);
    }
    if (res.status === 401) {
      console.log("something went wrong");
    }
  };

  const checkAuthentication = async () => {
    const res = await fetch(`${API_HOST}/user/book`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "content-Type": "application/json",
      },
      credentials: "include",
    });
    if (res.status === 200) {
      debugger;
      const tempMyBooks = await res.json();
      myBooks = await tempMyBooks[0].booksDetails;
      $("#analysis-navbar").removeClass("hidden");
    } else {
      $("#books-login-modal-background").addClass("show").removeClass("hidden");
      $("#books-login-modal").addClass("show").removeClass("hidden");
    }
  };

  const authenticateUser = async (data) => {
    const res = await fetch(`${API_HOST}/book/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return res.json();
  };

  getBooks();
  checkAuthentication();
  checkUser();
});
