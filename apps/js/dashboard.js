jQuery(document).ready(function () {
  var userData = {};
  var projects = [];
  var projectFilters = [];
  setTimeout(function () {
    $(".header").addClass("hide");
  }, 1100);

  // dom events

  /////// side bar events
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

  ///// dashboard tabs event
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

  ///// project events
  $("#open-more-search-actions").on("click", function () {
    $(".projects-actions").toggleClass("grow");
  });

  $("#project-search-bar").on("change keyup paste", function () {
    var searchValue = $(this).val().toLowerCase();
    var searchedProjects = [];
    projects.map((project) => {
      var isCompiler = false;
      project.compiler.map((compiler) => {
        isCompiler = compiler.name.toLowerCase().includes(searchValue);
      });
      if (
        project.project_name.toLowerCase().includes(searchValue) ||
        isCompiler ||
        project.project_theme.toLowerCase().includes(searchValue)
      ) {
        searchedProjects.push(project);
      }
    });
    console.log(searchedProjects);
    fetchProjects(searchedProjects);
  });

  $(".projects-actions").on("click", ".project-filter", function () {
    $(this).hasClass("active")
      ? $(this).removeClass("active")
      : $(this).addClass("active");
    $(this).hasClass("active")
      ? projectFilters.push($(this).attr("value"))
      : (projectFilters = projectFilters.filter(
          (filter) => filter !== $(this).attr("value")
        ));
    getFilteredprojects();
  });
  // helpers functions

  const getTabs = (tab) => {
    const tabId = document.location.hash;
    tabId ? $(tabId).removeClass("hide") : $(tab).addClass("hide");
  };

  const getFilteredprojects = () => {
    var filteredProjects = [];
    projectFilters.length
      ? projectFilters.map((filter) => {
          switch (filter.toLowerCase()) {
            case "completed": {
              projects.map((project) => {
                if (project.total_slots === project.filled_slots) {
                  filteredProjects.includes(project)
                    ? ""
                    : filteredProjects.push(project);
                }
              });
              break;
            }
            case "pending": {
              projects.map((project) => {
                if (project.total_slots > project.filled_slots) {
                  filteredProjects.includes(project)
                    ? ""
                    : filteredProjects.push(project);
                }
              });
              break;
            }
          }
        })
      : (filteredProjects = projects);
    fetchProjects(filteredProjects);
  };
  //fetch dom elements

  const fetchUserInfo = async (tab) => {
    const html = `<div class="close-dashboard-tab">
          <i class="far fa-times-circle"></i>
        </div>
        <div class="upper">
          <div class="for-img">
            <i class="fas fa-user"></i>
          </div>
          <div class="for-name">
            <h3 style="font-weight: 700">${userData.name.toUpperCase()}</h3>
            <h5 style="font-weight: 600">${userData.designation.toUpperCase()}</h5>
          </div>
        </div>
        <div class="lower">
          <div class="left">
            <b>Name</b> : ${userData.name.toUpperCase()} <br />
            <b>email</b> : ${userData.email}<br />
            <b>Mobile</b> : ${userData.mobile}<br />
            <b>Total Projects</b> : 78<br />
            <b>project Completed</b> : 48<br />
            <b>pending Projects</b> : 30
          </div>
        </div>`;
    $(tab).html(html);
  };

  const fetchProjects = (filteredProjects) => {
    var html = "";
    filteredProjects.length
      ? filteredProjects.map((project) => {
          html += `<div class="project" id="${project.id}">
              <h2 class="project-title">${project.project_name.toUpperCase()}</h2>
              <p style="color: grey; margin-top: -5px">${project.project_theme.toUpperCase()}</p>
              <div class="project-analytics">
                <div class="container" style="zoom: 0.5; width: 50%; margin: 0">
                  <div class="progress" data-percentage="${
                    (project.filled_slots / project.total_slots) * 100
                  }">
                    <span class="progress-left">
                      <span class="progress-bar"></span>
                    </span>
                    <span class="progress-right">
                      <span class="progress-bar"></span>
                    </span>
                    <div class="progress-value">
                      <div style="zoom: 2.3; font-weight: 700; color: #13de13">
                        ${project.filled_slots}/${project.total_slots}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <b>Language</b>: ${project.project_language}<br />
                  <b>genre</b> : All
                </div>
              </div>
              <h5 class="compiler">${project.compiler.map((complier, index) => {
                return complier.name.toUpperCase();
              })} </h5>
              <div></div>
            </div>`;
        })
      : (html = `<div
              class="project"
              style="
                margin: 20px 15px 15px 5px;
                height: 257px;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <h2 class="project-title">No Projects Found</h2>
              <div></div>
            </div>`);
    $("#project-container").html(html);
  };
  //api calls

  const API_HOST = "https://mnp-backend.herokuapp.com"; //"http://localhost:3000";
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
    fetch(`${API_HOST}/`, {
      method: "post",
      headers: {
        Accept: "*/*",
        "content-Type": "application/json",
      },
      body: JSON.stringify({ get: "apple" }),
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
  setTimeout(async function () {
    let data = await getUserData();
    userData = await data.user;
    projects = await data.projects;
    console.log(projects);
    fetchProjects(projects);
  }, 1);
});
