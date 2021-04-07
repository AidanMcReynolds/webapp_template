//defines the datepicker
$(function () {
    $('#datepicker').datepicker({
        inline: true,
        showOtherMonths: true,
        dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        altField: "#date",
        onSelect: function(dateText, inst){
          changeDate($(this).datepicker("getDate"));
        }
    });
});

//this lets tasks.js know user is on datepicker page
$(document).ready(function () {
    datepicker = true;
});

//this changes the date to the selected date. 
function changeDate(date) {
  date.setHours(1);
  today = date;
  updateDateBlock()
  let user = firebase.auth().currentUser;
  taskUpdate(user);
}

//display the selected date
function updateDateBlock(){
  $("#date-day").html(today.toLocaleString('en-us', {  weekday: 'long' }));
  $("#date-date").html(today.getDate());
  $("#date-month").html(today.toLocaleString('en-us', {  month: 'long' }));
  $("#date-year").html(today.toLocaleString('en-us', {  year: 'numeric' }));
}

//call updateDateblock so that the date block displays the current date when user loads the page
updateDateBlock();
