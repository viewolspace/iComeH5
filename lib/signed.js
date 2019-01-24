/**
 * Created by lenovo on 2019/1/7.
 */
//判断用户是否签到过

var userId,photoUrl,userName;
var qrMessage = "20190129";  //二维码的内容

function getUrlParam(name){
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');

    var r = window.location.search.substr(1).match(reg);

    if (r !== null) {
        return unescape(r[2]);
    }
    return null;
}

function signedCheck(){
    var url = window.apiUrl + "user/userDetail?ticket=" + getUrlParam("ticket");
    //TODO 测试注释
    //var ticket_temp = localStorage.getItem("ticket");
    //
    //if(ticket_temp == getUrlParam("ticket")){
    //    userId =  localStorage.getItem("userId");
    //    photoUrl = localStorage.getItem("photoUrl");
    //    userName = localStorage.getItem("userName");
    //    showUser();
    //    return;
    //}

    $.get(url, function(result){
        var json = eval('(' + result + ')');
        if(json.result){//已经签到的用户
            //TODO 显示用户的信息
            userId = json.result.userId;
            photoUrl = json.result.url + "&a=.jpg";
            userName = json.result.userName;
            showUser();
        }else{//还没有签到
            signedBind();
        }
    });
}

function singnedUser(){
    var url = window.apiUrl + "user/signed?ticket=" + getUrlParam("ticket");
    $.get(url, function(result){
        var json = eval('(' + result + ')');
        if(json.result){//签到成功
            //TODO 显示用户的信息
            userId = json.result.userId;
            photoUrl = json.result.url + "&a=.jpg";
            userName = json.result.userName;
            localStorage.setItem("ticket",getUrlParam("ticket"));
            localStorage.setItem("userId",userId);
            localStorage.setItem("photoUrl",photoUrl);
            localStorage.setItem("userName",userName);
            showUser();
        }else{//TODO error

        }
    });
}

function showUser(){
    //isWinners();
    console.log(photoUrl);
    $("#signed").hide();
    $("#userPhoto").attr("src",photoUrl);
    $("#userName").html(userName);
    $("#user").show();


}

function signedBind(){
    iCom.config({
        appId:"app_10000061",
        nonceStr:"onboxs",
        timestamp:new Date().getTime() + '',
        signature:'sianature',
        jsApiList:[
            "device.scanQRCode"
        ]
    });

    iCom.ready(function(){
        $("#signed").click(function(){

            iCom.device.scanQRCode({
                success:function(data){
                    //TODO 二维码数据正确 允许用户签到

                    var message = data.qrcode;
                    console.log(message);
                    if(message==qrMessage){
                        singnedUser();
                    }else{
                        alert("无效的二维码");
                    }
                },
                fail:function(error){
                    alert(JSON.stringify(error));
                }
            });
        });
    });

    iCom.error(function (error) {
        alert(JSON.stringify(error));
    });
}

function isWinners(){
    //var url = window.apiUrl + "winner/isWinner?userId=" + userId ;
    //$.get(url, function(result){
    //    var json = eval('(' + result + ')');
    //    if(json.result){//中奖
    //        $("#winners").html("<div class=\"awards\">恭喜您中得"+ json.result.levelName +"</div>");
    //        $("#winners").show();
    //        window.scrollTo(0, document.documentElement.clientHeight);
    //    }else{//还没有中奖 继续查询
    //        window.setTimeout("isWinners()",10000);
    //    }
    //});
}

$(document).ready(function(){

    $("#div_zhibo").click(function(){
        window.location.href = "http://peixun.enn.cn/front/showLiveList";
    });

    $("#div_info").click(function(){
        window.location.href = "info.html";
    });

    $("#div_vote").click(function(){
        window.location.href = "vote.html?ticket=" + getUrlParam("ticket");
    });

    signedCheck();

});

