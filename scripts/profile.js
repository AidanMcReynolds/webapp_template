
//popover enabled
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
});

//preview replace image
function previewFile() {
  var fileImg = document.getElementById("previewImag");
  var file = document.querySelector("input[type=file]").files[0];
  var reader = new FileReader();

  reader.addEventListener("load", function () {
    fileImg.src = reader.result;
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}

firebase.auth().onAuthStateChanged(function (user) {
  console.log(user.photoURL);
  // user.photoUrl = "./images/profile_random.jpeg";
  // document.getElementById("previewImag").innerHTML = user.photoUrl;
  setInputValue("displayNameText", "<h5>" + user.displayName + "</h5>");
  setInputValue("emailText", "<h5>" + user.email + "</h5>");

  document.getElementById("modalInputName").setAttribute("value", user.displayName);
  document.getElementById("modalInputEmail").setAttribute("value", user.email);

  document.getElementById("exampleModalEmail").addEventListener("submit", submitTaskDB);
  feather.replace()
});

function submitTaskDB(e) {
  e.preventDefault();

  var user = firebase.auth().currentUser;
  var newEmail = getInputValue("task");
  //console.log(task);
  //console.log(new Date().getTime());

  changeEmail(newEmail);
  $('#exampleModalEmail').modal('hide');
  document.getElementById("form-task").reset();
  taskUpdate(user);
}

function setInputValue(name, content){
  document.getElementById(name).innerHTML = content;
}

function getInputValue(id) {
  return document.getElementById(id).value;
}
function changeEmail(name) {

  firebase.auth().currentUser.updateEmail(name).then(function () {
    // Update successful.
    console.log(name);
    db.collection("users").doc(user.uid).update({         //write to firestore                 //"users" collection
      email: user.email                          //with authenticated user's ID (user.uid)
    }).then(function () {
      console.log("changed user email");
      window.location.assign("profile.html");       //re-direct to main.html after signup
    }).catch(function (error) {
      console.log("Error adding new user: " + error);
    });
  });
}