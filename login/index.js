jQuery(document).ready(function () {
  $(".navbar-toggler").on("click", function () {
    $("#login-modal-open-button").toggleClass("hidden");
  });
  $("#login-modal-open-button").on("click", function () {
    $("#login-modal-background").addClass("show").removeClass("hidden");
    $("#login-modal").addClass("show").removeClass("hidden");
  });
  $("#close-login-modal").on("click", function () {
    $("#login-modal-background").addClass("hidden").removeClass("show");
    $("#login-modal").addClass("hidden").removeClass("show");
  });
});
