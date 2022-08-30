// var 변수 = '손흥민'
// function 해체분석기(문자들, 변수들){
//     console.log(문자들[1] + 변수들)
// }



// 해체분석기`안녕하 ${변수} 세요 `


var pants = 0;
var socks = 100;

//`바지${pants} 양말${socks}
function 해체분석기(문자들, 변수0, 변수1){
    if (변수0 == 0){
        console.log(`${문자들[0]}은 다팔렸고 ${문자들[1]}은 ${변수1}`)
    }else{
        console.log(문자들[0]+변수0+문자들[1]+변수1)
    }
    
    
}

해체분석기`바지${pants}양말${socks}`