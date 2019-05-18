/**
 * 获取个人提问的问题列表
 */
function myQuestion(userId) {
    var url = window.apiUrl + "student/myQuestion?userId=" + userId;
    $.get(url, function (result) {
        var jsonObject = JSON.parse(result);
        if ("0000" == jsonObject.status && jsonObject.result.length>0) {
            //遍历问题列表
            var tbody = "";
            $.each(jsonObject.result, function (n, item) {

                var rows = "";
                rows += "<div class=\"item\">";
                rows += "<div>";
                rows += item.question;
                rows += "</div>";
                rows += "<div class=\"close\">";
                rows += "<img src=\"../images/interactive/icon_close.png\" onclick='delQuestion("+item.id+")'>";
                rows += "</div>";
                rows += "</div>";

                tbody += rows;
            });

            $(".question-list").html(tbody);
        }
    });
}

/**
 * 提交问题
 */
function addQuestion() {
    var url = window.apiUrl + "student/addQuestion";

    if(!$("#question").val()){
        alert("请输入提问内容");
        return;
    }
    if($("#question").val().length > 30){
        alert("提问内容不能大于30个字");
        return;
    }

    $.post(url, {
        "userId": $.cookie('userId'),
        "question": $("#question").val()
    }, function (result) {
        var jsonObject = JSON.parse(result);
        if ("0000" == jsonObject.status) {
            //刷新提问列表
            window.location.reload()
        }
    });
}

/**
 * 删除问题
 */
function delQuestion(id) {
    var url = window.apiUrl + "student/delQuestion?id=" + id;
    $.get(url, function (result) {
        var jsonObject = JSON.parse(result);
        if ("0000" == jsonObject.status) {
            //刷新提问列表
            window.location.reload()
        }
    });
}


$(document).ready(function () {
    var userId = $.cookie('userId');
    //加载提问列表
    myQuestion(userId);

    //提问按钮绑定点击事件
    $("#addQuestionBtn").click(function () {
        addQuestion();
    });
});