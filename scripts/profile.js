firebase.auth().onAuthStateChanged(function (user) {
  updateProfilePage(user);
});

function updateProfilePage(user){
  console.log(user.photoURL);
  // user.photoUrl = "./images/profile_random.jpeg";
  // document.getElementById("previewImag").innerHTML = user.photoUrl;
  setInputValue("displayNameText", "<h5>" + user.displayName + "</h5>");
  setInputValue("emailText", "<h5>" + user.email + "</h5>");

  document.getElementById("modalInputName").setAttribute("value", user.displayName);
  document.getElementById("modalInputEmail").setAttribute("value", user.email);

  document.getElementById("exampleModalName").addEventListener("submit", submitDisplayNameDB);
  document.getElementById("exampleModalEmail").addEventListener("submit", submitTaskDB);
  feather.replace();
}

function setInputValue(name, content) {
  document.getElementById(name).innerHTML = content;
}

function getInputValue(id) {
  return document.getElementById(id).value;
}

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

function submitDisplayNameDB(e) {
  e.preventDefault();

  var newDisplayName = getInputValue("modalInputName");
  changeDisplayName(newDisplayName);
}

function changeDisplayName(name){
  var user = firebase.auth().currentUser;

  console.log(db.collection("users").doc(user.uid));
  user.updateProfile({
    displayName: name
  }).then(function () {
    db.collection("users").doc(user.uid).update({
      name: user.displayName
    }).then(function () {
      console.log(name);
    }).catch(function (error) {
      console.log("Error changing display name: " + error);
    });
    
    $('#exampleModalName').modal('hide');
    updateProfilePage(user);
  });
}

function submitTaskDB(e) {
  e.preventDefault();

  var newEmail = getInputValue("modalInputEmail");
  changeEmail(newEmail);
}

function changeEmail(name) {
  var user = firebase.auth().currentUser;

  user.updateEmail(name).then(function () {
    // Update successful.
    console.log(name);
    db.collection("users").doc(user.uid).update({         //write to firestore                 //"users" collection
      email: user.email                          //with authenticated user's ID (user.uid)
    }).then(function () {
      console.log("changed user email");
      //window.location.assign("profile.html");       //re-direct to main.html after signup
    }).catch(function (error) {
      console.log("Error changing email: " + error);
    });

    $('#exampleModalEmail').modal('hide');
    updateProfilePage(user);
  });
}
