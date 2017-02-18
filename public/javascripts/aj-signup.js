$(document).ready(function(){

  $('#btnSubmit').focus();

  $('form').on('submit', function(){

      let data = {
        username: $('#username').val(), 
        password: $('#password').val(),
        password2: $('#password2').val(),
        hint: $('#hint').val()
      };

      $.ajax({
        async:true,
        type: 'POST',
        url: '/signup',
        data: data,
        success: function(data){
          if(data != undefined){
            let str = JSON.stringify(data);
            if(str.substring(1,6) != 'Error'){
              if($('#inf').text() == '-')
                $('#btnsubmit').prop('disabled', true);
            }
            alert(data);
          }
        },
        error:function(msg){
          alert(msg);
        }
      });

      return false;
    });

    $('#delaccount').on('click', function(){
       let inf = $('#inf').text();
       if(inf != undefined && inf != '' && inf != '-'){
        if (confirm("Do you really want to delete your account?") == true) {

          let deldata = {
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
