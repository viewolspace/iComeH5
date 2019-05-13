/**
 * 获取微信的openId
 */
function getOpenId(code) {
    var url = "http://www.view-ol.com/viewol_web/wx/getOpenId?jscode=" + code;
    $.get(url, function (result) {
        var jsonObject = eval('(' + result + ')');
        return jsonObject;
    });
}

/**
 * 登记学生信息
 */
function addUser() {
    var url = window.apiUrl + "student/addUser";

    $.post(url, {
        "userName": $("#userName").val(),
        "phone": $("#phone").val(),
        "school": $("#school").val(),
        "position": $("#position").val(),
        "pic": $("#pic").val(),
        "openId": $("#openId").val(),
        "rand": $("#rand").val()
    }, function (result) {
        var jsonObject = JSON.parse(result);
        if("0000" == jsonObject.status){
            //登记成功刷新首页
        }
    });

    $.post(url, function (result) {
        var jsonObject = eval('(' + result + ')');
        return jsonObject;
    });
}

/**
 * 查询学生登记信息
 */
function getUser(openId) {
    var url = window.apiUrl + "student/getUser?openId=" + openId;
    $.get(url, function (result) {
        var jsonObject = eval('(' + result + ')');
        return jsonObject;
    });
}

/**
 * 发送手机验证码（登记时调用）
 */
function sendSms(phone) {
    var url = window.apiUrl + "student/getPhoneRand?phone=" + phone;
    $.get(url, function (result) {
        var json = eval('(' + result + ')');
        if (json.status == "0000") {
            alert("发送短信成功");
        }
    });
}

/**
 * 首页初始化
 */
function init() {
    var code = "";  //微信授权code
    var wxObj = getOpenId(code);

    var stuObj = getUser(jsonObject.openid);
    if (stuObj.status == "0000") {
        //首页显示已登记信息

    } else {
        //显示登记弹出层，并设置头像

    }
}

$(document).ready(function () {
    init();

    //发送短信按钮绑定点击事件
    $("#sendSmsBtn").click(function () {
        var phone = $("#phone").val();
        sendSms(phone);
    });

    //登记按钮绑定点击事件
    $("#addUserBtn").click(function () {
        addUser();
    });
});