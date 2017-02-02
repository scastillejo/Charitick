$(document).ready(function(){
  $('.list-group > li a').click(function() {
      $(this).parent().find('ul').toggle();
  });
});

