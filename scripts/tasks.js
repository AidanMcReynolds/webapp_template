firebase.auth().onAuthStateChanged(function (user) {
  taskUpdate(user);
});
function taskUpdate(user){
  cont = document.getElementById("task-container");
  cont.innerHTML="";
  db.collection("users").doc(user.uid).collection("tasks").where("deleted", "!=", true).get().then((tasks) => {
    console.log(tasks.size);
    tasks.forEach((t) => {
      console.log(t.data().name);
    });
    // update the size of the container for the task list
    let rows = ""
    for (i = 0; i <= tasks.size; i++) {
      rows = rows + "15vh "
    }
    cont.style.gridTemplateRows = rows;
    //append the table with the user's tasks
    tasks.forEach((t) => {
      cont.innerHTML = cont.innerHTML + taskRow(t.data().name);
    });
    //append the table with the add task button
    cont.innerHTML = cont.innerHTML + taskAdd();
    feather.replace()
    cont.style.visibility = "visible";

    //listen for submit click
    document.getElementById("exampleModalTask").addEventListener("submit", submitTaskDB);
    taskTable(tasks);

    displayTasks();
  });
}
function taskTable(tasks) {
  // update the size of the container for the task list
  cont = document.getElementById("task-container");
  cont.innerHTML = "";
  let rows = ""
  for (i = 0; i <= tasks.size; i++) {
    rows = rows + "40pt "
  }
  cont.style.gridTemplateRows = rows;
  //append the table with the user's tasks
  tasks.forEach((t) => {
    cont.innerHTML = cont.innerHTML + taskRow(t.data().name, t.id);
  });
  tasks.forEach((t) => {
    checkboxUpdate(t);
  });
  //append the table with the add task button
  cont.innerHTML = cont.innerHTML + taskAdd();
  feather.replace()
  cont.style.visibility = "visible";
}
function taskRow(taskName, taskID) {
  let r = '<div class="task-row">';
  r = r + '<div class="task-check"><input class="form-check-input me-1" onclick="taskClick(this)" type="checkbox" id="check_' + taskID + '" value="' + taskID + '" aria-label="..."></div>';
  r = r + '<div class="task-text">' + taskName + '</div>';
  r = r + '<div class="task-del"><button type="button" class="btn btn-outline-danger btn-sm" onclick="taskDel(this)" value="' + taskID + '"><i data-feather="trash-2"></i></button></div>'
  r = r + "</div>"
  return r;
}
function taskAdd() {
  return '<div class="task-row"><div class="task-add"><button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModalTask"><i data-feather="plus"></i></button></div></div>'
}
function taskDel(e){
  let id = e.value;
  let user = firebase.auth().currentUser;
  db.collection("users").doc(user.uid).collection("tasks").doc(id).update({
    deleted: true
  });
  taskUpdate(user);
}

function submitTaskDB(e) {
  e.preventDefault();

  var user = firebase.auth().currentUser;
  var task = getInputValue("task");
  console.log(task);
  console.log(new Date().getTime());

  saveTask(task);
  $('#exampleModalTask').modal('hide');
  document.getElementById("form-task").reset();
  taskUpdate(user);
}
function getInputValue(id) {
  return document.getElementById(id).value;
}
function saveTask(name) {
  var taskRef = db.collection("users").doc(firebase.auth().currentUser.uid).collection("tasks");

  taskRef.add({
    name: name,
    deleted: false,
    created: firebase.firestore.Timestamp.now(),
    completed: []
  });
}
//testing in JS console
function displayTasks() {
  db.collection("users").doc(firebase.auth().currentUser.uid).collection("tasks").get()
  .then(function(snap){
      snap.forEach(function(doc){
          var n = doc.data().name;
          console.log(n);
          var delet = doc.data().deleted;
          console.log(delet);
          var createdTime = doc.data().created;
          console.log(createdTime);
          var cromplete = doc.data().completed;
          console.log(cromplete);
          // document.getElementById(cityId).textContent = n;
      })
    })
}

function taskClick(id) {
  if (id.checked) {
    console.log("checked");
    taskDo(id.value);
  } else {
    console.log("unchecked");
    taskUndo(id.value);
  }
}
function taskDo(id) {
  today = firebase.firestore.Timestamp.now();
  user = firebase.auth().currentUser;
  db.collection("users").doc(user.uid).collection("tasks").doc(id).get().then((task) => {
    dates = task.data().completed;
    for (i = 0; i < dates.length; i++) {
      if (today.toDate().toDateString() == dates[i].toDate().toDateString()) {
        return;
      }
    }
    db.collection("users").doc(user.uid).collection("tasks").doc(id).update({
      completed: firebase.firestore.FieldValue.arrayUnion(today)
    });
  });

}
function taskUndo(id) {
  today = firebase.firestore.Timestamp.now();
  user = firebase.auth().currentUser;
  db.collection("users").doc(user.uid).collection("tasks").doc(id).get().then((task) => {
    dates = task.data().completed;
    for (i = 0; i < dates.length; i++) {
      if (today.toDate().toDateString() == dates[i].toDate().toDateString()) {
        db.collection("users").doc(user.uid).collection("tasks").doc(id).update({
          completed: firebase.firestore.FieldValue.arrayRemove(dates[i])
        });
      }
    }
  });
}
function checkboxUpdate(task) {
  today = firebase.firestore.Timestamp.now();
  dates = task.data().completed;
  if (dates != null) {
    for (i = 0; i < dates.length; i++) {
      if (today.toDate().toDateString() == dates[i].toDate().toDateString()) {
        checkbox = document.getElementById("check_" + task.id);
        checkbox.setAttribute("checked", true);
        console.log(checkbox);
      }
    }
  }

}

