firebase.auth().onAuthStateChanged((user) => {
  updateProfilePage(user);
});

function updateProfilePage(user) {
  console.log(user.photoURL);

  // user.photoUrl = "./images/profile_random.jpeg";
  // document.getElementById("previewImag").innerHTML = user.photoUrl;
  setInputValue("displayNameText", "<h5>" + user.displayName + "</h5>");
  setInputValue("emailText", "<h5>" + user.email + "</h5>");

  document.getElementById("modalInputName").setAttribute("value", user.displayName);
  document.getElementById("modalInputEmail").setAttribute("value", user.email);

  document.getElementById("exampleModalName").addEventListener("submit", submitDisplayNameDB);
  document.getElementById("exampleModalEmail").addEventListener("submit", submitEmailDB);
  document.getElementById("exampleModalPassword").addEventListener("submit", submitPasswordDB);
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
var popoverList = popoverTriggerList.map((popoverTriggerEl) => {
  return new bootstrap.Popover(popoverTriggerEl);
});

//preview replace image
function previewFile() {
  var fileImg = document.getElementById("previewImag");
  var file = document.querySelector("input[type=file]").files[0];
  var reader = new FileReader();

  reader.addEventListener("load", () => {
    fileImg.src = reader.result;
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}

function reAuthenticate(currentPassword) {
  var user = firebase.auth().currentUser;
  var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);

  return user.reauthenticateWithCredential(cred);
}

function submitPasswordDB(e) {
  e.preventDefault();

  var currPassword = getInputValue("modalInputCurrPassword");
  reAuthenticate(currPassword).then(() => {
    var user = firebase.auth().currentUser;
    var newPassword = getInputValue("modalInputPassword");

    user.updatePassword(newPassword).then(() => {
      alert("Password was changed");
    }).catch((error) => {
      alert(error.message);
    });
  });
}

function submitDisplayNameDB(e) {
  e.preventDefault();

  var newDisplayName = getInputValue("modalInputName");
  changeDisplayName(newDisplayName);
  setInputValue("displayNameText", "<h5>" + newDisplayName + "</h5>");
}

function changeDisplayName(name) {
  var user = firebase.auth().currentUser;

  console.log(db.collection("users").doc(user.uid));
  user.updateProfile({
    displayName: name
  }).then(() => {
    db.collection("users").doc(user.uid).update({
      name: user.displayName
    });
  }).then(() => {
    console.log(name);
  }).catch(error => {
    alert(error.message);
  });
  $('#exampleModalName').modal('hide');
}

function submitEmailDB(e) {
  e.preventDefault();

  var newEmail = getInputValue("modalInputEmail");

  var currPassword = getInputValue("modalInputCurrPasswordE");
  reAuthenticate(currPassword).then(() => {
    changeEmail(newEmail);
  }).catch((e) => {
    alert(e.message);
  });
  setInputValue("emailText", "<h5>" + newEmail + "</h5>");
}

function changeEmail(name) {
  var user = firebase.auth().currentUser;

  user.updateEmail(name).then(() => {
    // Update successful.
    console.log(name);
    db.collection("users").doc(user.uid).update({         //write to firestore                 //"users" collection
      email: user.email                          //with authenticated user's ID (user.uid)
    })
  }).then(() => {
    alert("Email was changed");
    console.log("changed user email in DB");
  }).catch(error => {
    alert(error.message);
  });
  $('#exampleModalEmail').modal('hide');
  updateProfilePage(user);
}

