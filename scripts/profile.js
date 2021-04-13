firebase.auth().onAuthStateChanged((user) => {
  updateProfilePage(user);
});

//load profile page
function updateProfilePage(user) {
  document.getElementById("file-input").setAttribute("onchange", "previewFile()");
  //check if profile pic is set & stored at Firebase Storage
  db.collection("users").doc(user.uid).get().then((t) => {
    if(t.data().profilePic !== null){
      document.getElementById("previewImag").setAttribute("src", t.data().profilePic);
    } else {
     alert("No such document!\n"+ e.message);
    }
  });
  //set user displayName & Email attributes
  let inputName = document.getElementById("modalInputName");
  let inputEmail = document.getElementById("modalInputEmail");
  let modalName = document.getElementById("exampleModalName");
  let modalEmail = document.getElementById("exampleModalEmail");
  let modalPassword = document.getElementById("exampleModalPassword")

  setInputValue("displayNameText", "<h5>" + user.displayName + "</h5>");
  setInputValue("emailText", "<h5>" + user.email + "</h5>");
  inputName.setAttribute("value", user.displayName);
  inputEmail.setAttribute("value", user.email);
  //listeners
  modalName.addEventListener("submit", submitDisplayNameDB);
  modalEmail.addEventListener("submit", submitEmailDB);
  modalPassword.addEventListener("submit", submitPasswordDB);
  feather.replace();
}

//set html of an element (helper function)
function setInputValue(name, content) {
  document.getElementById(name).innerHTML = content;
}

//get value of an element (helper function)
function getInputValue(id) {
  return document.getElementById(id).value;
}

//popover enabled
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
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
    saveProfilePic(file);
  }
}

//save profile pic to firebase storage
function saveProfilePic(file) {
  user = firebase.auth().currentUser;
  var storageRef = firebase.storage().ref("images/" + user.uid + ".jpg"); // Get reference
  storageRef.put(file).then(function () {
    //save url of firebase storage to firebase
    storageRef.getDownloadURL()
    .then(function (url) { // Get URL of the uploaded file
      db.collection("users").doc(user.uid).update({
        "profilePic": url
      }).then(() => {
        // Upload picked file to cloud storage
      });
    });
  }); 
}

//reAuthentication
function reAuthenticate(currentPassword) {
  var user = firebase.auth().currentUser;
  var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);

  return user.reauthenticateWithCredential(cred);
}

//change password
function submitPasswordDB(e) {
  e.preventDefault();
  var currPassword = getInputValue("modalInputCurrPassword");
  //reAuthenticate user prior to change password
  reAuthenticate(currPassword).then(() => {
    var user = firebase.auth().currentUser;
    var newPassword = getInputValue("modalInputPassword");
    var confirmPassword = getInputValue("modalInputPasswordConfirm");

    if (newPassword !== confirmPassword) {
      alert("New password and confirm new password not same");
    } else {
      //change pw Authentication
      user.updatePassword(newPassword).then(() => {
        alert("Password was changed");
      }).catch((error) => {
        alert(error.message);
      });
    }
  }).catch((e) => {
    alert(e.message);
  });
  $('#exampleModalPassword').modal('hide');
}

//show changed display name
function submitDisplayNameDB(e) {
  e.preventDefault();
  var newDisplayName = getInputValue("modalInputName");
  changeDisplayName(newDisplayName);
  setInputValue("displayNameText", "<h5>" + newDisplayName + "</h5>");
}

//change display name
function changeDisplayName(name) {
  var user = firebase.auth().currentUser;
  //update user attribute
  user.updateProfile({
    displayName: name
  }).then(() => {
    //update firebase
    db.collection("users").doc(user.uid).update({
      name: user.displayName
    });
  }).catch(error => {
    alert(error.message);
  });
  $('#exampleModalName').modal('hide');
}

//change user email
function submitEmailDB(e) {
  e.preventDefault();
  var newEmail = getInputValue("modalInputEmail");
  var currPassword = getInputValue("modalInputCurrPasswordE");
  //reAuthenticate
  reAuthenticate(currPassword).then(() => {
    changeEmail(newEmail);
  }).catch((e) => {
    alert(e.message);
  });
  setInputValue("emailText", "<h5>" + newEmail + "</h5>");
}

//change email
function changeEmail(name) {
  var user = firebase.auth().currentUser;
  //update in Authentication
  user.updateEmail(name).then(() => {
    //successfully update in firebase
    db.collection("users").doc(user.uid).update({ 
      email: user.email
    })
  }).then(() => {
    alert("Email was changed");
    //changed user email in DB
  }).catch(error => {
    alert(error.message);
  });
  $('#exampleModalEmail').modal('hide');
}

