/*schedule*/

function checkTime() {
  var now = new Date();
  var hour = now.getHours();
  var date = now.getDate();
  var timstamp = now.getHours()*100 + (now.getMinutes() * 5/3);

  //if(now.getMonth() == 1 && now.getFullYear() == 2017) {
    $('.schedule tr').each(function() {
      var date = $(this).parent('.date').attr('value');

      if($(this).hasClass('time')) {
        console.log('timtime: ' + timstamp);
        var eTime = parseFloat($(this).attr('value'));

        //current event is going on
        if(date == now.getDate() && (eTime - 15) < timstamp && (eTime + 80) > timstamp) {
          $(this).addClass('current');
        } else if(date < now.getDate() || (date == now.getDate() && (eTime + 80) < timstamp)) {
          $(this).removeClass('current');
          $(this).addClass('past');
        }

      }
    }) //end of loop
  //} //end of check month, year
}

/*live site configurations*/
function resizeMe() {
  if($(window).width()>=768){
    $('.twitter').css('height', $(window).height()- $('.twitter').offset().top-35 - 150);
    $('.schedule-table').css('height',$(window).height()- $('.schedule-table').offset().top-35 - 150);
  }
}

$(document).ready(function() {

  resizeMe();
  checkTime();
  setInterval(checkTime, 1000 * 60); //every minute

  //scroll to current event
  $('.schedule-table').scrollTop($('.current').position().top);
});

$( window ).resize(function() {
  resizeMe();
})
