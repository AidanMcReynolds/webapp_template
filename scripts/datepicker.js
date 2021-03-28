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

$(document).ready(function () {
    //$("#datepicker").datepicker("show");
    datepicker = true;
});

function changeDate(date) {
  console.log(date);
  date.setHours(1);
  today = date;
  updateDateBlock()
  let user = firebase.auth().currentUser;
  taskUpdate(user);
}
function updateDateBlock(){
  $("#date-day").html(today.toLocaleString('en-us', {  weekday: 'long' }));
  $("#date-date").html(today.getDate());
  $("#date-month").html(today.toLocaleString('en-us', {  month: 'long' }));
  $("#date-year").html(today.toLocaleString('en-us', {  year: 'numeric' }));
}

updateDateBlock();
