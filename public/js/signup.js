var id;
var pw;
var match;
var result = id && pw && match



$(function(){
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



        $("#email").blur(function(){
            var user_email = $("#email").val();
            $.ajax({
                type : 'POST',
                url : '/email',
                data : {'email' : user_email}
            }).done(function(결과){
                console.log(결과)
                // $('#submitted').prop("disabled", false);
                $('#email_check').text("")
                id = true;
                console.log("id: ", id)
  
            }).fail(function(결과){
                console.log(결과)
                id = false
                $('#email_check').text("사용중인 아이디 입니다.")
                $('#submitted').prop("disabled", true);
                $('#email_check').css("color","red");
                
            })
        
        })
        
        $('#password').blur(function(){
            var user_password = $("#password").val();
            $.ajax({
                type : 'POST',
                url : '/password',
                data : {'password' : user_password}
            }).done(function(결과){
                console.log(결과)
                // $('#submitted').prop("disabled", false);
                $('#password_check').text("")
                pw = true;
                console.log("pw: ", pw)
  
            }).fail(function(결과){
                console.log(결과)
                pw = false
                $('#password_check').text("8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.")
                $('#submitted').prop("disabled", true);
                $('#password_check').css("color","red");  
            })
        })

        $("#confirm_password").keyup(function(){
            var password =  $("#password").val()
            var confirm_password =  $("#confirm_password").val()
            if(password != "" || confirm_password != ""){
                if(password == confirm_password){
                    $("#pw_match").hide();
                    match = true;
                    console.log("match: ", match)
                    console.log("result: ", id && pw && match)
                }else{
                    match = false;
                    $("#pw_match").show();
                    $("#submitted").prop("disabled", true);
                } 

            }
        
        })
        $("#remember").change(function(){
            var checked = $(this).is(':checked');
            console.log(checked)
            console.log(id && pw && match)
            if(checked && id && pw && match){
                console.log('진입')
                $("#submitted").prop("disabled", false);
            }
            else{
                console.log('불가')
                $(this).prop("checked", false)
                $("#submitted").prop("disabled", true);
            }
        })
        

   }
)





