jQuery(document).ready(function () {
  const API_HOST = "http://localhost:3000"; //"https://mnp-backend.herokuapp.com"; //"http://localhost:3000";
  const getUserData = async (data) => {
    const res = await fetch(`${API_HOST}/userData`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "content-Type": "application/json",
      },
      credentials: "include",
      cookies: document.cookie,
    });
    if (res.status === 401) {
      document.location = "/";
    }
  };
  getUserData();
});
