firebase.auth().onAuthStateChanged((user) => {
  updateProfilePage(user);
});

function updateProfilePage(user) {
  console.log(user.photoURL);
  
  db.collection("users").doc(user.uid).doc("profile-pic").get().then((doc) => {
    if (doc.exists) {
        console.log("Document data:", doc.data());
        document.getElementById("previewImag").setAttribute("src", doc.data());
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        document.getElementById("previewImag").setAttribute("src", "./images/profile_random.jpeg");
    }
}).catch((error) => {
    console.log("Error getting document:", error);
    document.getElementById("previewImag").setAttribute("src", "./images/profile_random.jpeg");
});

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
    saveProfilePic(file);
  }
}

function saveProfilePic(file) {
  user = firebase.auth().currentUser;
  var storageRef = firebase.storage().ref("images/" + user.uid + ".jpg"); // Get reference
  storageRef.put(file).then(function () {
    console.log('Uploaded to Cloud Storage.');

    storageRef.getDownloadURL()
    .then(function (url) { // Get URL of the uploaded file
      console.log(url); // Save the URL into users collection
      db.collection("users").doc(user.uid).update({
        "profile-pic": url
      }).then(() => {
        // Upload picked file to cloud storage
        console.log('Added Profile Pic URL to Firestore.');
      })
    })
  }); 
  
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
    var confirmPassword = getInputValue("modalInputPasswordConfirm");

    if (newPassword !== confirmPassword) {
      alert("New password and confirm new password not same");
    } else {
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
}

