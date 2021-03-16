
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
