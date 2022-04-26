jQuery(document).ready(function () {
  var userData = {};
  var projects = [];
  var projectFilters = [];
  var updateProjectObj = {};
  const packages = [
    { package: "1000 Elite", total_slots: "15" },
    { package: "700 Platinum", total_slots: "20" },
    { package: "500 Diamond", total_slots: "30" },
    { package: "375 Gold", total_slots: "40" },
    { package: "250 Sapphire", total_slots: "40" },
    { package: "200 Coral", total_slots: "45" },
    { package: "150 Pearl", total_slots: "50" },
    { package: "90 Classic", total_slots: "75" },
    { package: "50 Classic Bio", total_slots: "150" },
    { package: "30 Pocket", total_slots: "200" },
    { package: "200 E-book", total_slots: "60" },
    { package: "400 Hard Copy", total_slots: "60" },
  ];

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
      $(".compiler-division").append(fetchNewCompilerSection());
    }
  );
  $(".add-new-project-input-collection").on(
    "click",
    "#add-new-project-btn",
    function () {
      addNewProject();
    }
  );
  $("#project-container").on("click", ".view-project", async function () {
    const projectId = $(this).attr("id");
    viewProject(projectId);
  });
  var updateCompiler = true;
  var compilerArray = [];
  $("#project-container").on("click", ".edit-project", function () {
    $(".analysis-tabs").find(".update-project").remove();
    updateProjectObj = {};
    updateCompiler = true;
    const projectId = $(this).attr("id");
    const projectDetails = projects.find((project) => project._id == projectId);
    compilerArray = projectDetails.compiler;
    console.log(projectDetails);
    $(".analysis-tabs .specific-project-name").html(
      `<input type="text" name="project_name" value = "${projectDetails.project_name.toUpperCase()}" class=specific-project-name-input>`
    );
    $(".analysis-tabs .specific-project-theme").html(
      `<input type="text" name="project_theme" value = "${projectDetails.project_theme}" class=specific-project-theme-input>`
    );
    $(".analysis-tabs .specific-project-genre").html(
      `<input type="text" name="project_genre" value = "${projectDetails.project_genre}" class=specific-project-genre-input>`
    );
    $(".analysis-tabs .specific-project-language").html(
      `<input type="text" name="project_language" value = "${projectDetails.project_language}" class=specific-project-language-input>`
    );
    $(".analysis-tabs .specific-project-type").html(
      `<input type="text" name="project_type" value = "${projectDetails.project_type}" class=specific-project-type-input>`
    );
    $(".analysis-tabs .specific-project-package").html(
      `<input type="text" name="package" value = "${projectDetails.package}" class=specific-project-package-input>`
    );
    $(".analysis-tabs .specific-project-total-slots").html(
      `<input type="text" name="total_slots" value = "${projectDetails.total_slots}" class=specific-project-total-slots-input>`
    );
    $(".analysis-tabs .specific-project-filled-slots").html(
      `<input type="text" name="filled_slots" value = "${projectDetails.filled_slots}" class=specific-project-filled-slots-input>`
    );
    var html = "";
    projectDetails.compiler.map((compiler, index) => {
      html += `
        <h5>Compiler ${index + 1}</h5>
          <table class="table table-striped">
            <tr>
              <td>Name</td>
              <td><input type="text" value = "${
                compiler.name
              }" class=specific-project-compiler-name-input name="compiler-name-${index}" id="${projectId}"></td>
            </tr>
            <tr>
              <td>Email</td>
              <td><input type="text" value = "${
                compiler.email
              }" class=specific-project-compiler-email-input name="compiler-email-${index}" id="${projectId}"></td>
            </tr>
            <tr>
              <td>Mobile</td>
              <td><input type="text" value = "${
                compiler.mobile
              }" class=specific-project-compiler-mobile-input name="compiler-mobile-${index}" id="${projectId}"></td>
            </tr>
          </table>
      `;
    });
    $(".analysis-tabs .specific-project-compiler-container").html(html);

    html = `<div class="update-project btn btn-success" id="${projectId}">
              Update
            </div>`;
    $(".analysis-tabs #specific-project-details-tab").append(html);
    $(".analysis-navItem.active").removeClass("active");
    $("#specific-project-details")
      .removeClass("display-none")
      .addClass("display-block active");
    $(".analysis-content.active").removeClass("active");
    $(`#specific-project-details-tab`).addClass("active");
  });
  $(".analysis-tabs #specific-project-details-tab").on(
    "keyup paste",
    "input",
    function (e) {
      if (e.target.name.split("-")[0] !== "compiler") {
        updateProjectObj = {
          ...updateProjectObj,
          [e.target.name]: e.target.value,
        };
      } else {
        const index = e.target.name.split("-")[2];
        let targetCompiler = compilerArray[index];
        targetCompiler = {
          ...targetCompiler,
          [e.target.name.split("-")[1]]: e.target.value,
        };
        compilerArray.splice(index, 1, targetCompiler);
        updateProjectObj = {
          ...updateProjectObj,
          compiler: compilerArray,
        };
      }
      console.log(updateProjectObj);
    }
  );
  $(".analysis-tabs").on("click", ".update-project", function () {
    const projectId = $(this).attr("id");
    updateProject(projectId, updateProjectObj).then((data) => {
      const index = projects.findIndex((project) => project._id == projectId);
      projects.splice(index, 1, data);
      fetchProjects(projects);
      viewProject(projectId);
    });
  });
  $("#project-container").on("click", ".delete-project", function () {
    const id = $(this).attr("id");
    deleteProject(id).then((data) => {
      console.log(data);
      projects = projects.filter((project) => project._id !== id);
      fetchProjects(projects);
    });
  });

  $(".analysis-navbar").on("click", ".analysis-navItem", function () {
    $(".analysis-navItem.active").removeClass("active");
    $(this).addClass("active");
    const id = $(this).attr("id");
    $(".analysis-content.active").removeClass("active");
    $(`#${id}-tab`).addClass("active");
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

  const addNewProject = async () => {
    if (validateAddNewProject()) {
      //if (true) {
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
      const selectedPackage = packages.find((package) => {
        return (
          package.package.toLowerCase() == newProject.package.toLowerCase()
        );
      });
      newProject.total_slots = selectedPackage.total_slots;
      console.log(newProject);
      var addedProject = await addNewProjectToDatabase(newProject);
      projects.push(addedProject);
      fetchProjects(projects);
      const tab = $("#add-new-project-tab");
      document.location.hash = "";
      getTabs(tab);
      refreshAddNewProjectTab(tab);
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

  const viewProject = (projectId) => {
    $(".analysis-tabs").find(".update-project").remove();
    const projectDetails = projects.find((project) => project._id == projectId);
    console.log(projectDetails);
    $(".analysis-tabs .specific-project-name").html(
      projectDetails.project_name.toUpperCase()
    );
    $(".analysis-tabs .specific-project-theme").html(
      projectDetails.project_theme
    );
    $(".analysis-tabs .specific-project-genre").html(
      projectDetails.project_genre
    );
    $(".analysis-tabs .specific-project-language").html(
      projectDetails.project_language
    );
    $(".analysis-tabs .specific-project-type").html(
      projectDetails.project_type
    );
    $(".analysis-tabs .specific-project-package").html(projectDetails.package);
    $(".analysis-tabs .specific-project-total-slots").html(
      projectDetails.total_slots
    );
    $(".analysis-tabs .specific-project-filled-slots").html(
      projectDetails.filled_slots
    );
    var html = "";
    projectDetails.compiler.map((compiler, index) => {
      html += `
        <h5>Compiler ${index + 1}</h5>
          <table class="table table-striped">
            <tr>
              <td>Name</td>
              <td>${compiler.name}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>${compiler.email}</td>
            </tr>
            <tr>
              <td>Mobile</td>
              <td>${compiler.mobile}</td>
            </tr>
          </table>
      `;
    });
    $(".analysis-tabs .specific-project-compiler-container").html(html);
    $(".analysis-navItem.active").removeClass("active");
    $("#specific-project-details")
      .removeClass("display-none")
      .addClass("display-block active");
    $(".analysis-content.active").removeClass("active");
    $(`#specific-project-details-tab`).addClass("active");
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
              <div class="project-sidebar">
                <div class="view-project" style="color: #585858" id="${
                  project._id
                }">
                  <i class="fas fa-eye"></i>
                </div>
                <div class="edit-project" style="color: #0077f7" id="${
                  project._id
                }">
                  <i class="fas fa-edit"></i>
                </div>
                <div class="delete-project" style="color: #dc1c1c" id="${
                  project._id
                }">
                  <i class="fas fa-trash-alt"></i>
                </div>
              </div>
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
    return html;
  };

  const refreshAddNewProjectTab = (tab) => {
    $(".add-new-project-input-collection #projectname").value = "";
    $(".add-new-project-input-collection #projecttheme").value = "";
    $(".add-new-project-input-collection #projectgenre").value = "";
    $(".add-new-project-input-collection #projectlanguage").value = "";
    compilerCount = 0;
    $(".compiler-division").html(fetchNewCompilerSection());
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
    if (res.status === 200) {
      return res.json();
    }
    if (res.status === 401) {
      document.location = "/";
    }
  };

  const getTeam = async () => {
    const res = await fetch(`${API_HOST}/team`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "content-Type": "application/json",
      },
      credentials: "include",
      cookies: document.cookie,
    });
    if (res.status === 200) {
      console.log(await res.json());
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
    if (res.status == 200) {
      return res.json();
    }
    if (res.status == 401) {
      document.location = "/";
    }
  };

  const getProjectDetails = async (projectId) => {
    const res = await fetch(`${API_HOST}/project/${projectId}`, {
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
  const updateProject = async (projectId, project) => {
    const res = await fetch(`${API_HOST}/project/${projectId}`, {
      method: "PUT",
      headers: {
        Accept: "*/*",
        "content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(project),
      cookies: document.cookie,
    });
    if (res.status == 200) {
      return res.json();
    }
    if (res.status == 401) {
      document.location = "/";
    }
  };
  const deleteProject = async (projectId) => {
    const res = await fetch(`${API_HOST}/project/${projectId}`, {
      method: "DELETE",
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
  setTimeout(async function () {
    let data = await getUserData();
    userData = await data.user;
    projects = await data.projects;
    console.log(projects);
    fetchUserInfo("#get-user-info");
    fetchProjects(projects);
    getTeam();
  }, 1);
});
