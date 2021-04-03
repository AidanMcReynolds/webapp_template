//display the task table when authentication is complete
firebase.auth().onAuthStateChanged(function (user) {
  taskUpdate(user);
});

//get the tasks to be displayed
function taskUpdate(user){
  cont = document.getElementById("task-container");
  db.collection("users").doc(user.uid).collection("tasks").where("deleted", "==", true).where("created","<=",today).orderBy('created').get().then((tasks) => {
    console.log(tasks);
    taskTable(tasks);
    taskStrikethrough(tasks)
  });
}

//display the tasks
function taskTable(tasks) {
  // update the size of the container for the task list
  cont = document.getElementById("task-container");
  cont.innerHTML = "";
      // update the size of the container for the task list
  let rows = ""
  for (i = 0; i < tasks.size; i++) {
    rows = rows + "40pt "
  }
  if (!datepicker){
    rows = rows + "40pt "
  }
  cont.style.gridTemplateRows = rows;
  //append the table with the user's tasks
  tasks.forEach((t) => {
    cont.innerHTML = cont.innerHTML + taskRow(t.data().name, t.id);
  });
  // tasks.forEach((t) => {
  //   checkboxUpdate(t);
  // });
  //append the table with the add task button
  if (!datepicker){
    cont.innerHTML = cont.innerHTML + deleteAllTask();
  } else if (tasks.size < 1) {
    cont.innerHTML = "<i>No tasks to display.</i>"
  }

  feather.replace()
  cont.style.visibility = "visible";
}

//the html code representing one task
function taskRow(taskName, taskID) {
  let r = '<div class="task-row">';
  // r = r + '<div class="task-check"><input class="form-check-input me-1" onclick="taskClick(this)" type="checkbox" id="check_' + taskID + '" value="' + taskID + '" aria-label="..."></div>';
  r = r + '<div class="task-unDel"><button type="button" class="btn btn-outline-secondary border-0 btn-sm" onclick="taskUnDel(this)" value="' + taskID + '"><i data-feather="rotate-ccw"></i></button></div>'
  r = r + '<div class="task-text" id="text_' + taskID + '">' + taskName + '</div>';
  r = r + '<div class="task-del"><button type="button" class="btn btn-outline-danger btn-sm" onclick="taskDelPerm(this)" value="' + taskID + '"><i data-feather="trash-2"></i></button></div>'
  r = r + "</div>"
  return r;
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
      //  console.log(checkbox);
      }
    }
  }
  })
}

//html code representing the add button 
function deleteAllTask() {
  return '<div class="task-row"><div class="task-delete-all"><button type="button" class="btn btn-outline-danger btn-sm" onclick="taskDelAll(this)"><i data-feather="trash-2"></i> Delete All </button></div></div>'
}

//deletes tasks when user clicks "trash" button
function taskDelPerm(e){
  if(confirm("Permanent Delete")){
    //check if field exist, if yes -> delete
    db.collection("users").doc(user.uid).collection("tasks").
    
    //after checking all fields delete doc() task

    let id = e.value;
    let user = firebase.auth().currentUser;
    db.collection("users").doc(user.uid).collection("tasks").doc(id).()({
      deleted: true
    });
    taskUpdate(user);
  }
}

//deletes tasks when user clicks "trash" button
function taskUnDel(e){
  let id = e.value;
  let user = firebase.auth().currentUser;
  db.collection("users").doc(user.uid).collection("tasks").doc(id).update({
    deleted: false
  });
  taskUpdate(user);
}

//returns today's date as a firebase timestamp 
function taskToday(){
  let now = new Date(Date.now())
  //time is encoded in a specific way as to ensure hours=0 while making them sort chronologically
  let d = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,now.getHours(),now.getMinutes(),now.getSeconds())
  return firebase.firestore.Timestamp.fromDate(d);
}
//testing in JS console
function displayTasks() {
  db.collection("users").doc(firebase.auth().currentUser.uid).collection("tasks").get()
  .then(function(snap){
      snap.forEach(function(doc){
          var n = doc.data().name;
          //console.log(n);
          var delet = doc.data().deleted;
          //console.log(delet);
          var createdTime = doc.data().created;
          //console.log(createdTime);
          var cromplete = doc.data().completed;
          //console.log(cromplete);
          // document.getElementById(cityId).textContent = n;
      })
    })
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
  let td = firebase.firestore.Timestamp.now();
  user = firebase.auth().currentUser;
  db.collection("users").doc(user.uid).collection("tasks").doc(id).get().then((task) => {
    dates = task.data().completed;
    for (i = 0; i < dates.length; i++) {
      if (td.toDate().toDateString() == dates[i].toDate().toDateString()) {
        return;
      }
    }
    db.collection("users").doc(user.uid).collection("tasks").doc(id).update({
      completed: firebase.firestore.FieldValue.arrayUnion(td)
    }).then(taskUpdate(user));
  });
}

//update database when user unchecks checkbox
function taskUndo(id) {
  let td = firebase.firestore.Timestamp.now();
  user = firebase.auth().currentUser;
  db.collection("users").doc(user.uid).collection("tasks").doc(id).get().then((task) => {
    dates = task.data().completed;
    for (i = 0; i < dates.length; i++) {
      if (td.toDate().toDateString() == dates[i].toDate().toDateString()) {
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

// //check off tasks that have been completed
// function checkboxUpdate(task) {
//   dates = task.data().completed;
//   if (dates != null) {
//     for (i = 0; i < dates.length; i++) {
//       if (today.toDateString() == dates[i].toDate().toDateString()) {
//         checkbox = document.getElementById("check_" + task.id);
//         checkbox.setAttribute("checked", true);
//       //  console.log(checkbox);
//       }
//     }
//   }

// }

