$(document).ready(function(){

  $.ajax({
    url: './javascripts/json/states.json',
    dataType:'JSON',
    success:function(data){
      $.each(data.state, function(key, val){
        $('#state').append('<option id="' + val.name + '">' + val.name + '</option>');
      })
    },
    error:function(){
      $('#state').html('<option id="-1">select...</option>');
    }
  });

  $.ajax({
    url: './javascripts/json/orgcategory.json',
    dataType:'JSON',
    success:function(data){
      $.each(data.category, function(key, val){
        $('#category').append('<option id="' + val.name + '">' + val.name + '</option>');
      })
    },
    error:function(){
      $('#category').html('<option id="-1">select...</option>');
    }
  });

   $('#mainform').on('submit', function(){
       
      data = {
        name : $('#name').val(),
        briefdesc : $('#briefdesc').val(),
        address : $('#address').val(),
        state : $('#state').val(),
        city : $('#city').val(),
        zone : $('#zone').val(),
        phone : $('#phone').val(),
        email : $('#email').val(),
        website : $('#website').val(),
        category : $('#category').val(),
        type : $('#type').val(),
        username : $('#username').val(),
        password : $('#password').val(),
        password2 : $('#password2').val(),
        hint : $('#hint').val(),
        active : $('#active').val(),
        inf : $('#inf').text()
      };

      $.ajax({
        type: 'POST',
        url: '/organizationform',
        data: data,
        success: function(data){
          let str = JSON.stringify(data);
          if(str.substring(1,6) != 'Error'){
            if($('#inf').text() == '-'){
              $('#inf').text(data);
              alert('Organization created.');
            }
            else
              alert(data);
          }            
          else
            alert(data);
        },
        error:function(msg){
          alert(msg);
        }
      });
      return false;
   });
});

$(document).ajaxStart(function(){
    $("#loading").removeClass('hide');
}).ajaxStop(function(){
    $("#loading").addClass('hide');
});
