/**
 * 登记学生信息
 */
function addUser() {
    var url = window.apiUrl + "student/addUser";

    var data = {
        "userName": $("#userName").val(),
        "phone": $("#phone").val(),
        "school": $("#school").val(),
        "position": $("#position").val(),
        "pic": $("#pic").val(),
        "openId": $.cookie('openId'),
        "rand": $("#rand").val()
    };

    $.post(url, data, function (result) {
        var jsonObject = JSON.parse(result);
        if("0000" == jsonObject.status){
            //登记成功刷新首页
            $("#regDiv").hide();
            window.location.reload();
        }
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
    var code = getParamer("code");  //微信授权code

    if($.cookie('openId')){
        getUser();
    } else {
        var url = "http://www.view-ol.com/viewol_web/wx/getOpenId?jscode=" + code;
        $.get(url, function (result) {
            var wxObj = JSON.parse(result);
            if(wxObj.status == "0000"){
                $.cookie('openId', wxObj.openid);
                $.cookie('pic', wxObj.pic);
                getUser();
            } else {
                alert("微信授权失败");
            }
        });
    }



}

function getUser(){
    var url = window.apiUrl + "student/getUser?openId=" + $.cookie('openId');
    $.get(url, function (result) {
        var stuObj = JSON.parse(result);
        if (stuObj.status == "0000" && stuObj.result) {
            //首页显示已登记信息
            $("#regDiv").hide();
            $('#headPic').attr("src", stuObj.result.pic);
            $("#dis_userName").html( stuObj.result.userName );
            $("#dis_school").html( stuObj.result.school );
            $("#dis_position").html( stuObj.result.position );
            $("#dis_phone").html( stuObj.result.phone );

            $.cookie('userId', stuObj.result.id);
        } else {
            $("#regDiv").show();

            //显示登记弹出层，并设置头像
            var pic = $.cookie('pic');//微信头像，登记时提交到后台
            $("#pic").val(pic);//隐藏域
            $("#showHead").attr("src", pic);
        }
    });
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