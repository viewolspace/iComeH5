/**
 * Created by lenovo on 2019/1/7.
 */
//判断用户是否签到过

var userId,photoUrl,userName;
var qrMessage = "";  //二维码的内容

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

    var ticket_temp = localStorage.getItem("ticket");

    if(ticket_temp == getUrlParam("ticket")){
        userId =  localStorage.getItem("userId");
        photoUrl = localStorage.getItem("photoUrl");
        userName = localStorage.getItem("userName");
        showUser();
        return;
    }

    $.get(url, function(result){
        var json = eval('(' + result + ')');
        if(json.result){//已经签到的用户
            //TODO 显示用户的信息
            userId = json.result.userId;
            photoUrl = json.result.url;
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
            localStorage.setItem("ticket",ticket);
            localStorage.setItem("name",userId);
            localStorage.setItem("name",photoUrl);
            localStorage.setItem("name",userName);
            showUser();
        }else{//TODO error

        }
    });
}

function showUser(){
    //TODO 显示用户 同时查询是否中奖
    console.log(photoUrl);
    $("#signed").hide();
    $("#userPhoto").attr("src",photoUrl);
    $("#userPhoto").show();


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
                    if(message){
                        singnedUser();
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

$(document).ready(function(){
    signedCheck();
});

