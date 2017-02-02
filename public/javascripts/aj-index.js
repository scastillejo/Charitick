$(document).ready(function(){
  
 $('#resultform').hide();

 $('#clockform').on('submit', function(){
  var date = new Date();
  var hour = date.getHours();
  var minute = date.getMinutes();;
  var second = date.getSeconds();
  var error = false;

  $("#searchresults").empty();

  var data = {
    hour: hour,
    minute: minute,
    second: second,
    flag: 'find'
  };

  if(!error){
    $.ajax({
      type: 'POST',
      url: '/',
      data: data,
      success: function(data){
        var str = JSON.stringify(data);
        if(str.substring(1,6) != 'Error'){
          var leng = Object.keys(data).length;
          if(leng > 0){
            $("#searchresults").empty();
            $('#searchresults').append('<p>Organization found:</p>');
            $('#searchresults').append('<li id="fname">' + data.name + '</li>');
            $('#searchresults').append('<p></p>');
            $('#searchresults').append('<li id="fbriefdesc">' + data.briefdesc + '</li>');
            $('#searchresults').append('<p></p>');
            $('#searchresults').append('<li id="faddress">Address: ' + data.address + '</li>');
            $('#searchresults').append('<li id="fstate">State: ' + data.state + '</li>');
            $('#searchresults').append('<li id="fcity">City: ' + data.city + '</li>');
            $('#searchresults').append('<li id="fzone">Zone/Locality: ' + data.zone + '</li>');
            $('#searchresults').append('<li id="fphone">Phone: ' + data.phone + '</li>');
            $('#searchresults').append('<li id="femail">Email: ' + data.email + '</li>');
            $('#searchresults').append('<li id="fwebsite">Website: ' + data.website + '</li>');
            $('#searchresults').append('<li id="fcategory">Category: ' + data.category + '</li>');
            $('#searchresults').append('<li id="ftype">Type: ' + data.type + '</li>');
            $('#searchresults').append('<p></p>');
            $('#searchresults').append('<li id="ftime">Their time: ' + formatTime(data.hour) + ':' + formatTime(data.minute) + ':' + formatTime(data.second) + '</li>');
            $('#searchresults').append('<p>Your time: ' + formatTime(hour) + ':' + formatTime(minute) + ':' + formatTime(second) + '</p>');
            $("#resultform").show();
          }
        }            
        else
          alert(data);
      },
      error:function(msg){
        alert(msg);
      }
    });
  }
  return false;
});

function formatTime(val){
    if(val < 10)
      val = '0' + val;

    return val;
};

$('#resultform').on('submit', function(){
  alert('To do: credit card payment page');
    return false;
 });
});



