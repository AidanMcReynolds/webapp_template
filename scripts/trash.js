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
  
  //If no task
if (tasks.size < 1) {
    cont.innerHTML = "<i>No tasks to display.</i>";
  }

  feather.replace()
  cont.style.visibility = "visible";
}

//the html code representing one task
function taskRow(taskName, taskID) {
  let r = '<div class="task-row">';
  // r = r + '<div class="task-check"><input class="form-check-input me-1" onclick="taskClick(this)" type="checkbox" id="check_' + taskID + '" value="' + taskID + '" aria-label="..."></div>';
  r = r + '<div class="task-text" id="text_' + taskID + '">' + taskName + '</div>';
  r = r + '<div class="task-unDel"><button type="button" class="btn btn-outline-secondary border-0 btn-sm" onclick="taskUnDel(this)" value="' + taskID + '"><i data-feather="rotate-ccw"></i></button></div>';  r = r + "</div>"
  return r;
}

//restore tasks when user clicks un-delete button
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

//equals true when on the datepicker page
var datepicker = false;

//date that is currently being displayed 
var today = firebase.firestore.Timestamp.now().toDate();
