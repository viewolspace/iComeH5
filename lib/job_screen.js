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

            $(".question-list").html(tbody);
        }
    });
}

$(document).ready(function () {
    queryQuestion();

});