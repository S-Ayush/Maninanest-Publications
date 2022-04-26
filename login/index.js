jQuery(document).ready(function () {
  const API_HOST = "https://mnp-backend.herokuapp.com"; //"http://localhost:3000";
  $(".navbar-toggler").on("click", function () {
    $("#login-modal-open-button").toggleClass("hidden");
  });
  $("#login-modal-open-button").on("click", async function () {
    $("#login-modal-background").addClass("show").removeClass("hidden");
    $("#login-modal").addClass("show").removeClass("hidden");
    const res = await confirmAuth();
    if (res.status !== 401) {
      document.location = "/apps/dashboard.html";
    }
  });
  $("#close-login-modal").on("click", function () {
    $("#login-modal-background").addClass("hidden").removeClass("show");
    $("#login-modal").addClass("hidden").removeClass("show");
  });
  $("#Login-user").on("click", async function () {
    const email = $("#login-email").val();
    const password = $("#login-password").val();
    const html = `<p 
      style="color:red;
      position:absolute;
      margin:auto;
      bottom: 10px;
      left: 50%;
      transform: translate(-50%,0px);">
      Invalid Email Or Password
      </p>`;
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email || !email.toLowerCase().match(emailRegex) || !password) {
      $("#login-modal").append(html);
      setTimeout(function () {
        $("#login-modal p").remove();
      }, 5000);
    } else {
      console.log(email, password);
      const res = await authenticateUser({ email, password });
      console.log(res);
      if (res.err) {
        $("#login-modal").append(html);
        setTimeout(function () {
          $("#login-modal p").remove();
        }, 5000);
      } else {
        $("#login-modal-background").addClass("hidden").removeClass("show");
        $("#login-modal").addClass("hidden").removeClass("show");
        document.location = "/apps/dashboard.html";
      }
    }
  });

  // API CALLS

  const confirmAuth = async () => {
    const res = await fetch(`${API_HOST}/`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "content-Type": "application/json",
      },
      credentials: "include",
    });
    return res;
  };

  const authenticateUser = async (data) => {
    const res = await fetch(`${API_HOST}/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return res.json();
  };
});
