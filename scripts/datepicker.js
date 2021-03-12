$(function () {
    $('#datepicker').datepicker({

        inline: true,
        showOtherMonths: true,
        dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        altField: "#date",
    });
});

$(document).ready(function () {
    $("#datepicker").datepicker("show");

});