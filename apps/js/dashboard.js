jQuery(document).ready(function () {
  var userData = {};

  setTimeout(function () {
    $(".header").addClass("hide");
  }, 1100);

  // dom events

  var sideBarOpen = true;
  $("#open-side-bar").on("click", function () {
    $("#side-bar").toggleClass("show");
    $("#open-side-bar").toggleClass("slide");
    if (sideBarOpen) {
      $("#open-side-bar img").attr("src", "../images/sidebar_hide_icon.png");
      sideBarOpen = !sideBarOpen;
    } else {
      $("#open-side-bar img").attr("src", "../images/dashboard-sidebar.png");
      sideBarOpen = !sideBarOpen;
    }
  });

  $("#user-info").on("click", function () {
    document.location = "#get-user-info";
    getTabs();
    fetchUserInfo("#get-user-info");
  });

  $(".dashboard-tabs").on("click", ".close-dashboard-tab", function () {
    const tab = $(this).parent();
    document.location.hash = "";
    getTabs(tab);
  });

  // helpers functions

  const getTabs = (tab) => {
    const tabId = document.location.hash;
    tabId ? $(tabId).removeClass("hide") : $(tab).addClass("hide");
  };

  //fetch dom elements

  const fetchUserInfo = async (tab) => {
    userData = await getUserData();
    console.log(userData);
    const html = `<div class="close-dashboard-tab">
          <i class="far fa-times-circle"></i>
        </div>
        <div class="upper">
          <div class="for-img">
            <i class="fas fa-user"></i>
          </div>
          <div class="for-name">
            <h3 style="font-weight: 700">${userData.name}</h3>
            <h5 style="font-weight: 600">${userData.designation}</h5>
          </div>
        </div>
        <div class="lower">
          <div class="left">
            <b>Name</b> : ${userData.name} <br />
            <b>email</b> : ${userData.email}<br />
            <b>Mobile</b> : ${userData.mobile}<br />
            <b>Total Projects</b> : 78<br />
            <b>project Completed</b> : 48<br />
            <b>pending Projects</b> : 30
          </div>
        </div>`;
    $(tab).html(html);
  };
  //api calls

  const API_HOST = "http://localhost:3000"; //"https://mnp-backend.herokuapp.com"; //"http://localhost:3000";
  const getUserData = async (data) => {
    debugger;
    const res = await fetch(`${API_HOST}/userData`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "content-Type": "application/json",
      },
      credentials: "include",
      cookies: document.cookie,
    });
    if (res.status === 200) {
      return res.json();
    }
    if (res.status === 401) {
      document.location = "/";
    }
  };
  getUserData();
  getTabs();
});
