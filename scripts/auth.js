//if the user is not logged in redirect them to the homepage
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log("hello " + user.email);
    sayHello();
    navBarInit();
    logOutUser();
  } else {
    window.location.pathname = "/index.html";
  }
});

//logout User
function logOutUser() {
  const logout = document.querySelector("#logOut");

  logout.addEventListener("click", (e) => {
    e.preventDefault();

    firebase.auth().signOut().then(() => {
      // console.log("Sign-Out Successful!");
    }).catch((error) => {
      console.log("An error happened.\n" + error.message);
    });
  });
}

//display username on page
function sayHello() {
  firebase.auth().onAuthStateChanged(function (somebody) {
    if (somebody) {
      //console.log(somebody.uid);
      db.collection("users")
        .doc(somebody.uid)
        .get() //READ !!!
        .then(function (doc) {
          //console.log(doc.data().name);
          var n = doc.data().name;
          $("#name-goes-here").text(n);
          // get other things and do other things for this person
        })
    }
  })
}

//display nav
function navBarInit(){
  let navTitle = document.getElementById("navTitle");
  let progress = document.getElementById("prog");
  let calendarNav = document.getElementById("cal");
  let dropDownNavMenu = document.getElementById("btnNav");

  navTitle.innerHTML = '<a class="nav-link active" aria-current="page" href="./main.html"><i data-feather="dribbble"></i> Healthy Reminder</a>';
  progress.innerHTML = '<a class="nav-link right-s-nav" title="progress bar" href="./progress.html"><i data-feather="bar-chart"></i></a>';
  calendarNav.innerHTML = '<a class="nav-link right-s-nav" title="calendar" href="./datepicker.html"><i data-feather="calendar"></i></a>';
  let r = '<button type="button" class="btn btn-light dropdown-toggle right-s-nav" data-bs-toggle="dropdown" aria-expanded="false"><i data-feather="user"></i></button>';
  r += '<ul class="dropdown-menu"> <li><a class="dropdown-item" href="./profile.html"><i data-feather="user"></i> profile</a></li>'; 
  r += '<li><a class="dropdown-item" href="./trash.html"><i data-feather="trash-2"></i> trash</a></li>';
  r += '<li><a id="logOut" class="dropdown-item" href="index.html"><i data-feather="log-out"></i> log out</a></li><hr class="dropdown-divider"></li></ul>';
  dropDownNavMenu.innerHTML = r;
}