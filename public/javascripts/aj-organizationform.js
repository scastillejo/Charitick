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
      
      var name = $('#name').val();
      var briefdesc = $('#briefdesc').val();
      var address = $('#address').val();
      var state = $('#state').val();
      var city = $('#city').val();
      var zone = $('#zone').val();
      var phone = $('#phone').val();
      var email = $('#email').val();
      var website = $('#website').val();
      var category = $('#category').val();
      var type = $('#type').val();
      var username = $('#username').val();
      var password = $('#password').val();
      var password2 = $('#password2').val();
      var hint = $('#hint').val();
      var active = $('#active').val();
      var regmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      var regphone = /^(?! )((?!  )(?! $)[a-zA-Z0-9-+() ]){1,100}$/;
      var error = false;
      var inf = $('#inf').text();

      var data = {
        name: name,
        briefdesc: briefdesc,
        address: address,
        state: state,
        city: city,
        zone: zone,
        phone: phone,
        email:email,
        website:website,
        category:category,
        type:type,
        username: username, 
        password: password,
        password2: password2,
        hint: hint,
        active: active,
        inf:inf
      };

      if(!error){
        $.ajax({
          type: 'POST',
          url: '/organizationform',
          data: data,
          success: function(data){
            var str = JSON.stringify(data);
            if(str.substring(1,6) != 'Error'){
              if(inf == '-'){
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
      }
      return false;
   });
});

$(document).ajaxStart(function(){
    $("#loading").removeClass('hide');
}).ajaxStop(function(){
    $("#loading").addClass('hide');
});
