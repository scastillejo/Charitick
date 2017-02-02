$(document).ready(function(){

  $('#btnSubmit').focus();

  $('form').on('submit', function(){
      var username = $('#username').val();
      var password = $('#password').val();
      var password2 = $('#password2').val();
      var hint = $('#hint').val();
      var inf = $('#inf').text();
      var reg = /^(?! )((?!  )(?! $)[a-zA-Z ]){1,100}$/;
      var regusername = /^(?! )((?!  )(?! $)[a-zA-Z0-9 ]){1,100}$/;      
      var regmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      var regphone = /^(?! )((?!  )(?! $)[a-zA-Z0-9-+() ]){1,100}$/;
      var error = false;

      var data = {
        username: username, 
        password: password,
        password2: password2,
        hint: hint
      };

      if(!error){
          $.ajax({
          async:true,
          type: 'POST',
          url: '/signup',
          data: data,
          success: function(data){
            if(data != undefined){
              var str = JSON.stringify(data);
              if(str.substring(1,6) != 'Error'){
                if(inf == '-')
                  $('#btnsubmit').prop('disabled', true);
              }
              alert(data);
            }
          },
          error:function(msg){
            alert(msg);
          }
        });
      }
      return false;
    });

    $('#delaccount').on('click', function(){
       var inf = $('#inf').text();
       if(inf != undefined && inf != '' && inf != '-'){
        if (confirm("Do you really want to delete your account?") == true) {

          var deldata = {
            inf: inf
          };

          $.ajax({
            type: 'DELETE',
            url: '/signup',
            data: deldata,
            success: function(msg){
              if(msg == 'Account deleted.'){
                $('#inf').text('-');
                $('#btnsubmit').prop('disabled', true);
                $('#delaccount').prop('disabled', true);
              }
              alert(msg);
            },
            error:function(msg){
              alert(msg);
            }          
          });
        }
       }
       
       return false;
    });
});

$(document).ajaxStart(function(){
    $("#loading").removeClass('hide');
}).ajaxStop(function(){
    $("#loading").addClass('hide');
});
