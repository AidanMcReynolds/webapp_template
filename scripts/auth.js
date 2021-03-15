firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log("hello " + user.email)
  } else {
    window.location.pathname = "/index.html"
  }
});