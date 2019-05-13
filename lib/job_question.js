/**
 * 获取个人提问的问题列表
 */
function myQuestion(userId) {
    var url = window.apiUrl + "student/myQuestion?userId=" + userId;
    $.get(url, function (result) {
        var jsonObject = JSON.parse(result);
        if ("0000" == jsonObject.status) {
            //遍历问题列表


        }
    });
}

/**
 * 提交问题
 */
function addQuestion() {
    var url = window.apiUrl + "student/addQuestion";

    $.post(url, {
        "userId": $("#userId").val(),
        "question": $("#question").val()
    }, function (result) {
        var jsonObject = JSON.parse(result);
        if ("0000" == jsonObject.status) {
            //刷新提问列表或者走假刷新？


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
            //刷新提问列表或者走假刷新？


        }
    });
}


$(document).ready(function () {
    var userId = "";
    //加载提问列表
    myQuestion(userId);

    //提问按钮绑定点击事件
    $("#addQuestionBtn").click(function () {
        addQuestion();
    });
});