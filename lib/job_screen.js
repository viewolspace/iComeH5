

var $question_container = $('.question-container')
var current_offset = 0
var animate_id = 0

function animate () {
    animate_id = requestAnimationFrame(next)
}



function next () {
    current_offset -= 5
    var $first_dom = $question_container.find('.item:first-child')
    var first = $first_dom.height() + 20
    if (Math.abs(current_offset) > first) {
        current_offset += first
        $question_container.append($first_dom.clone())
        $first_dom.remove()
    }
    $question_container.css('transform', 'translateY(' + current_offset + 'px)')
    animate()
}

var questionList = null;

function queryQuestion() {
    var url = window.apiUrl + "student/questionList?status=1&flag=2";
    $.get(url, function (result) {
        var jsonObject = JSON.parse(result);
        if ("0000" == jsonObject.status && jsonObject.result.length>0) {
            questionList = jsonObject.result;
            //遍历问题列表
            var tbody = "";
            $.each(jsonObject.result, function (n, item) {
                var rows = "";
                rows += "<div class=\"item\">";
                rows += "<div class=\"row align-items-center\">";
                rows += "<div class=\"col-auto avatar pr-0\"><img src=\""+item.pic+"\" ></div>";
                rows += "<div class=\"col name\">"+item.userName+"</div>";
                rows += "</div>";
                rows += "<div class=\"question\">"+item.question+"</div>";
                rows += "</div>";

                tbody += rows;
            });

            $("#RunTopic").html(tbody);
            animate();
        }
    });
}

$(document).keydown(function(event){

    if(event.keyCode == 83){
        cancelAnimationFrame(animate_id);
        var len = questionList.length;
        var num= randomNum(0,len-1);

        var item = questionList[num]
        var rows = "";
        rows += "<div class=\"item\">";
        rows += "<div class=\"row align-items-center\">";
        rows += "<div class=\"col-auto avatar pr-0\"><img src=\""+item.pic+"\" ></div>";
        rows += "<div class=\"col name\">"+item.userName+"</div>";
        rows += "</div>";
        rows += "<div class=\"question\">"+item.question+"</div>";
        rows += "</div>";
        $("#questionOne").html(rows);
        answerQuestion(item["id"]);
        $('.modal').show()
    }
});



function answerQuestion(id) {
    var url = window.apiUrl + "student/answerQuestion?status=2&id=" + id;
    $.get(url, function (result) {
        var jsonObject = JSON.parse(result);

    });
}


function randomNum(minNum,maxNum){
    switch(arguments.length){
        case 1:
            return parseInt(Math.random()*minNum+1,10);
            break;
        case 2:
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
            break;
        default:
            return 0;
            break;
    }
}


$(document).ready(function () {
    queryQuestion();

});