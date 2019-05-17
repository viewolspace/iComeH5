

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


function queryQuestion() {
    var url = window.apiUrl + "student/questionList?status=1&flag=2";
    $.get(url, function (result) {
        var jsonObject = JSON.parse(result);
        if ("0000" == jsonObject.status && jsonObject.result.length>0) {
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




$(document).ready(function () {
    queryQuestion();

});