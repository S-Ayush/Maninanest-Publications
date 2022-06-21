jQuery(document).ready(function () {
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

  // helper functions

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
      newProject.total_slots = $(
        ".add-new-project-input-collection #total-slots"
      ).val();

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

  // api calls

  const API_HOST = "https://mnp-backend.herokuapp.com"; //"http://localhost:3000";

  const addNewProjectToDatabase = async (project) => {
    const res = await fetch(`${API_HOST}/addpublicproject`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "content-Type": "application/json",
      },
      body: JSON.stringify(project),
    });
    if (res.status == 200) {
      $(".submmited").removeClass("d-none");
      $(".project-form").addClass("d-none");
      return res.json();
    } else {
      alert("something went wrong");
    }
  };
});
