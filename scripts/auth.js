
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log("hello " + user.email)
  } else {
    window.location.pathname = "/index.html"
  }
 
});
firebase.auth().onAuthStateChanged(function (user) {
  db.collection("users").doc(user.uid).get().then(function(u) {
    if (u.exists) {
      console.log("hello " + u.data().name);
    }
  });
});

window.addEventListener("load", () => {
  var user = firebase.auth().currentUser;
  if (user != null){
    console.log(user.uid);
  } else {
    console.log("blah");
  }
});

const logout = document.querySelector("#logOut");
logout.addEventListener("click",(e)=>{
  e.preventDefault();

  firebase.auth().signOut().then(() => {
    console.log("Sign-Out Successful!");
  }).catch((error) => {
    console.log("An error happened.");
  });
});

