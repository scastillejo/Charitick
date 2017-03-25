$(document).ready(function(){
  
 $('#resultform').hide();

 $('#clockform').on('submit', function(){

  let date = new Date();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  $("#searchresults").empty();

  let data = {
    hour: hour,
    minute: minute,
    second: second,
    flag: 'find'
  };

  $.ajax({
    type: 'POST',
    url: '/',
    data: data,
    success: function(data){
      onSuccessSearchOrg(data, hour, minute, second);
    },
    error:function(msg){
      alert(msg);
    }
  });
  return false;
});

let onSuccessSearchOrg = (data, hour, minute, second) => {
  let str = JSON.stringify(data);
  if(str.substring(1,6) != 'Error'){
    if(Object.keys(data).length > 0){
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
} 

let formatTime = (val) => {
    if(val < 10)
      val = '0' + val;

    return val;
};

$('#resultform').on('submit', function(){
  alert('To do: credit card payment page');
    return false;
 });
});



