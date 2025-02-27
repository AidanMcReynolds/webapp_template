//display the task table when authentication is complete
firebase.auth().onAuthStateChanged(function (user) {
  taskUpdate(user);
});

//get the tasks to be displayed
function taskUpdate(user){
  cont = document.getElementById("task-container");
  db.collection("users").doc(user.uid).collection("tasks").where("deleted", "==", false).where("created","<=",today).orderBy('created').get().then((tasks) => {
    taskTable(tasks);
    taskStrikethrough(tasks);
  });
}

//display the tasks
function taskTable(tasks) {
  // update the size of the container for the task list
  cont = document.getElementById("task-container");
  cont.innerHTML = "";
  // update the size of the container for the task list
  let rows = "";
  for (i = 0; i < tasks.size; i++) {
    rows = rows + "40pt ";
  }
  if (!datepicker){
    rows = rows + "40pt ";
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
  if (!datepicker){
    cont.innerHTML = cont.innerHTML + taskAdd();
  } else if (tasks.size < 1) {
    cont.innerHTML = "<i>No tasks to display.</i>";
  }
  addTaskModal();
  //add task listener
  document.getElementById("exampleModalTask").addEventListener("submit", submitTaskDB);
  feather.replace();
  cont.style.visibility = "visible";
}

//the html code representing one task
function taskRow(taskName, taskID) {
  let r = '<div class="task-row">';
  r = r + '<div class="task-check"><input class="form-check-input me-1" onclick="taskClick(this)" type="checkbox" id="check_' + taskID + '" value="' + taskID + '" aria-label="..."></div>';
  r = r + '<div class="task-text" id="text_' + taskID + '">' + taskName + '</div>';
  r = r + '<div class="task-del"><button type="button" class="btn btn-outline-danger btn-sm" onclick="taskDel(this)" value="' + taskID + '"><i data-feather="trash-2"></i></button></div>';
  r = r + "</div>";
  return r;
}

function addTaskModal(){
  let addTModal = document.getElementById("tm");
  let atm = '<div class="modal fade" id="exampleModalTask" tabindex="-1" aria-labelledby="exModalTask" aria-hidden="true"><div class="modal-dialog"><div class="modal-content">';
  atm = atm + '<form id="form-task" action="#"><div class="modal-header"><h5 class="modal-title" id="exampleModalLabel">Task</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>';
  atm = atm + '<div class="modal-body"><input id="task" type="text" placeholder="new task" maxlength="26" required="required"></div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>';
  atm = atm + '<button type="submit" class="btn btn-primary">Save</button></div></form></div></div></div>';
  addTModal.innerHTML = atm;
}

//strikes through tasks that have been completed
function taskStrikethrough(tasks){
  tasks.forEach((t) => {
    dates = t.data().completed;
    if (dates != null) {
    for (i = 0; i < dates.length; i++) {
      if (today.toDateString() == dates[i].toDate().toDateString()) {
        elem = document.getElementById("text_" + t.id);
        elem.innerHTML = "<s>"+elem.innerHTML+"</s>";
      }
    }
  }
  });
}

//html code representing the add button 
function taskAdd() {
  return '<div class="task-row"><div class="task-add"><button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModalTask"><i data-feather="plus"></i></button></div></div>';
}

//deletes tasks when user clicks "trash" button
function taskDel(e){
  let id = e.value;
  let user = firebase.auth().currentUser;
  db.collection("users").doc(user.uid).collection("tasks").doc(id).update({
    deleted: true
  });
  taskUpdate(user);
}

//add task
function submitTaskDB(e) {
  e.preventDefault();
  var user = firebase.auth().currentUser;
  var task = getInputValue("task");
  saveTask(task);
  $('#exampleModalTask').modal('hide');
  document.getElementById("form-task").reset();
  taskUpdate(user);
}

//get element value (helper function)
function getInputValue(id) {
  return document.getElementById(id).value;
}

//add task fields to firebase
function saveTask(name) {
  var taskRef = db.collection("users").doc(firebase.auth().currentUser.uid).collection("tasks");
  taskRef.add({
    name: name,
    deleted: false,
    created: taskToday(),
    completed: []
  });
}

//returns today's date as a firebase timestamp 
function taskToday(){
  let now = new Date(Date.now());
  //time is encoded in a specific way as to ensure hours=0 while making them sort chronologically
  let d = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,now.getHours(),now.getMinutes(),now.getSeconds());
  return firebase.firestore.Timestamp.fromDate(d);
}

//when user clicks checkbox update database
function taskClick(id) {
  if (id.checked) {
    taskDo(id.value);
  } else {
    taskUndo(id.value);
  }
}

//update databse when user completes task
function taskDo(id) {
  //let td = firebase.firestore.Timestamp.now();
  user = firebase.auth().currentUser;
  db.collection("users").doc(user.uid).collection("tasks").doc(id).get().then((task) => {
    dates = task.data().completed;
    for (i = 0; i < dates.length; i++) {
      if (today.toDateString() == dates[i].toDate().toDateString()) {
        return;
      }
    }
    db.collection("users").doc(user.uid).collection("tasks").doc(id).update({
      completed: firebase.firestore.FieldValue.arrayUnion(firebase.firestore.Timestamp.fromDate(today))
    }).then(taskUpdate(user));
  });
}

//update database when user unchecks checkbox
function taskUndo(id) {
  user = firebase.auth().currentUser;
  db.collection("users").doc(user.uid).collection("tasks").doc(id).get().then((task) => {
    dates = task.data().completed;
    for (i = 0; i < dates.length; i++) {
      if (today.toDateString() == dates[i].toDate().toDateString()) {
        db.collection("users").doc(user.uid).collection("tasks").doc(id).update({
          completed: firebase.firestore.FieldValue.arrayRemove(dates[i])
        }).then(taskUpdate(user));
      }
    }
  });
}

//equals true when on the datepicker page
var datepicker = false;

//date that is currently being displayed 
var today = firebase.firestore.Timestamp.now().toDate();

//check off tasks that have been completed
function checkboxUpdate(task) {
  dates = task.data().completed;
  if (dates != null) {
    for (i = 0; i < dates.length; i++) {
      if (today.toDateString() == dates[i].toDate().toDateString()) {
        checkbox = document.getElementById("check_" + task.id);
        checkbox.setAttribute("checked", true);
      }
    }
  }
}

