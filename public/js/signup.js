$(function(){
        $('#pw_check').hide();
        // $("#pw_length").hide();
        // $('#pw_blank').hide();
        // $('#pw_mix').hide();
        // $('#password').keyup(function(){
        //     var pw = $('#password').val()
        //     // div pw_regexp
        //     var num = pw.search(/[0-9]/g);
        //     var eng = pw.search(/[a-z]/ig);
        //     var spe = pw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
        //     if(pw.length < 8 || pw.length > 20){
        //         //alert("8자리 ~ 20자리 이내로 입력해주세요.");
        //         $("#pw_length").show();
        //         $("#submitted").prop("disabled", true);
        //         return false
        //     }
        //     else if(pw.search(/\s/) != -1){
        //         //alert("비밀번호는 공백 없이 입력해주세요.");
        //         $("#pw_blank").show();
        //         $("#submitted").prop("disabled", true);
        //         return false
        //     }
        //     else if(num < 0 || eng < 0 || spe < 0 ){
        //         //alert("영문,숫자,특수문자를 혼합하여 입력해주세요.");
        //         $("#pw_mix").show();
        //         $("#submitted").prop("disabled", true);
        //         return false
        //     }
        //     else {
        //         console.log("통과"); 
        //         $("#pw_length").hide();
        //         $('#pw_blank').hide();
        //         $('#pw_mix').hide();
        //         $("#submitted").prop("disabled", false);
        //         return true
        //     }
        // })
        $("#confirm_password").keyup(function(){
            var password =  $("#password").val()
            var confirm_password =  $("#confirm_password").val()
            if(password != "" || confirm_password != ""){
                if(password == confirm_password){
                    $("#pw_check").hide();
                    $("#submitted").prop("disabled", false);
                }else{
                    $("#pw_check").show();
                    $("#submitted").prop("disabled", true);
                } 

            }
        
        })
        $("#email").blur(function(){

            var user_email = $("#email").val();
            $.ajax({
                type : 'POST',
                url : '/email',
                data : {'email' : user_email}
            }).done(function(결과){
                console.log(결과)
                $('#submitted').prop("disabled", false);
                $('#email_check').text("")
               
                
        
            }).fail(function(결과){
                console.log(결과)
                $('#email_check').text("사용중인 아이디 입니다.")
                $('#submitted').prop("disabled", true);
                $('#email_check').css("color","red");
                
            })
        
        })
        
        $('#password').blur(function(){
            console.log('keyup')
        })

   }
)





