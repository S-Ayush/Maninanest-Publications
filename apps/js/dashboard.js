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
  $(".dashboard-tabs").on("click", ".logout", function () {
    console.log("logout");
    document.location = "/contact.html";
    logoutUser();
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
        isCompiler = !isCompiler
          ? compiler.name.toLowerCase().includes(searchValue)
          : true;
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
  $(".projects-actions").on("click", ".add-new-project", function () {
    document.location = "#add-new-project-tab";
    getTabs();
  });
  $(".add-new-project-input-collection").on(
    "click",
    ".add-new-compiler-button",
    function () {
      fetchNewCompilerSection();
    }
  );
  $(".add-new-project-input-collection").on(
    "click",
    "#add-new-project-btn",
    function () {
      addNewProject();
    }
  );

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

  const addNewProject = async () => {
    if (validateAddNewProject()) {
      var newProject = {
        project_name: "",
        project_theme: "",
        project_genre: "",
        project_language: "",
        project_type: "",
        package: "",
        compiler: [],
        total_slots: 0,
        filled_slots: 0,
        paid: 0,
        submitted: 0,
      };
      newProject.project_name = $(
        ".add-new-project-input-collection #projectname"
      )
        .val()
        .toLowerCase();
      newProject.project_theme = $(
        ".add-new-project-input-collection #projecttheme"
      )
        .val()
        .toLowerCase();
      newProject.project_genre = $(
        ".add-new-project-input-collection #projectgenre"
      )
        .val()
        .toLowerCase();
      newProject.project_language = $(
        ".add-new-project-input-collection #projectlanguage"
      )
        .val()
        .toLowerCase();
      newProject.project_type = $(
        ".add-new-project-input-collection #projecttype"
      )
        .val()
        .toLowerCase();
      newProject.package = $(".add-new-project-input-collection #package")
        .val()
        .toLowerCase();

      var compilerCount = $(
        ".add-new-project-input-collection .compiler-division"
      ).children().length;
      for (i = 1; i <= compilerCount; i++) {
        var name = $(`.compiler${i} #Compilername${i}`).val().toLowerCase();
        var email = $(`.compiler${i} #compileremail${i}`).val();
        var mobile = $(`.compiler${i} #compilermobile${i}`).val();
        newProject.compiler.push({ name, email, mobile });
      }
      console.log(newProject);
      var addedProject = await addNewProjectToDatabase(newProject);
      projects.push(addedProject);
      fetchProjects(projects);
      const tab = $("#add-new-project-tab");
      document.location.hash = "";
      getTabs(tab);
    }
  };

  const validateAddNewProject = () => {
    if ($(".add-new-project-input-collection #projectname").val() === "") {
      var element = $(".add-new-project-input-collection #projectname");
      element.focus();
      element.addClass("required");
      setTimeout(function () {
        element.removeClass("required");
      }, 2000);
      return false;
    } else if (
      $(".add-new-project-input-collection #projecttheme").val() === ""
    ) {
      var element = $(".add-new-project-input-collection #projecttheme");
      element.focus();
      element.addClass("required");
      setTimeout(function () {
        element.removeClass("required");
      }, 2000);
      return false;
    } else if (
      $(".add-new-project-input-collection #projectgenre").val() === ""
    ) {
      var element = $(".add-new-project-input-collection #projectgenre");
      element.focus();
      element.addClass("required");
      setTimeout(function () {
        element.removeClass("required");
      }, 2000);
      return false;
    } else if (
      $(".add-new-project-input-collection #projectlanguage").val() === ""
    ) {
      var element = $(".add-new-project-input-collection #projectlanguage");
      element.focus();
      element.addClass("required");
      setTimeout(function () {
        element.removeClass("required");
      }, 3000);
      return false;
    }
    var compilerCount = $(
      ".add-new-project-input-collection .compiler-division"
    ).children().length;
    for (i = 1; i <= compilerCount; i++) {
      if ($(`.compiler${i} #Compilername${i}`).val() === "") {
        var element = $(`.compiler${i} #Compilername${i}`);
        element.focus();
        element.addClass("required");
        setTimeout(function () {
          element.removeClass("required");
        }, 3000);
        return false;
      } else if ($(`.compiler${i} #compileremail${i}`).val() === "") {
        var element = $(`.compiler${i} #compileremail${i}`);
        element.focus();
        element.addClass("required");
        setTimeout(function () {
          element.removeClass("required");
        }, 3000);
        return false;
      } else if ($(`.compiler${i} #compilermobile${i}`).val() === "") {
        var element = $(`.compiler${i} #compilermobile${i}`);
        element.focus();
        element.addClass("required");
        setTimeout(function () {
          element.removeClass("required");
        }, 3000);
        return false;
      }
    }
    return true;
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
        </div>
        <button id="logout" class="btn btn-danger mt-2 logout">LogOut</button>`;
    $(tab).html(html);
  };

  const fetchProjects = (filteredProjects) => {
    var html = "";
    filteredProjects.length
      ? filteredProjects.map((project) => {
          html += `<div class="project" id="${project._id}">
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

  var compilerCount = 1;
  const fetchNewCompilerSection = () => {
    compilerCount++;
    html = `<div
                    class="compiler${compilerCount}"
                    style="
                      zoom: 0.8;
                      box-shadow: 2px 2px 8px 2px grey;
                      padding: 10px;
                      margin-bottom: 10px;
                    "
                  >
                    <h5>compiler ${compilerCount}</h5>
                    <div class="form-field row">
                      <div class="project-label col-md-3">
                        <label for="Compilername${compilerCount}">Compiler Name</label>
                      </div>
                      <div class="col-md-9">
                        <input
                          id="Compilername${compilerCount}"
                          name="Compilername${compilerCount}"
                          class="projectinput"
                          placeholder="Compiler Name"
                          required
                        />
                      </div>
                    </div>
                    <div class="form-field row">
                      <div class="project-label col-md-3">
                        <label for="compileremail${compilerCount}">Compiler Email</label>
                      </div>
                      <div class="col-md-9">
                        <input
                          id="compileremail${compilerCount}"
                          name="compileremail${compilerCount}"
                          class="projectinput"
                          placeholder="Compiler Email"
                          required
                        />
                      </div>
                    </div>
                    <div class="form-field row">
                      <div class="project-label col-md-3">
                        <label for="compilermobile${compilerCount}">Compiler Mobile</label>
                      </div>
                      <div class="col-md-9">
                        <input
                          id="compilermobile${compilerCount}"
                          name="compilermobile${compilerCount}"
                          class="projectinput"
                          placeholder="Compiler Mobile"
                          required
                        />
                      </div>
                    </div>
                  </div>`;
    $(".compiler-division").append(html);
  };
  //api calls

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

  const logoutUser = async () => {
    const res = await fetch(`${API_HOST}/logout`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "content-Type": "application/json",
      },
      credentials: "include",
      cookies: document.cookie,
    });
    console.log(res.data);
  };

  const addNewProjectToDatabase = async (project) => {
    const res = await fetch(`${API_HOST}/project`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(project),
      cookies: document.cookie,
    });
    return res.json();
  };

  setTimeout(async function () {
    let data = await getUserData();
    userData = await data.user;
    projects = await data.projects;
    console.log(projects);
    fetchUserInfo("#get-user-info");
    fetchProjects(projects);
  }, 1);
});
