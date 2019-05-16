function http_request(  url , data , callback){
    var header = {
            "userId": getParamer('uid'),
            "sessionId": getParamer('sessionId')
        };

    $.ajax({
        type: "GET",
        data: data,
        contentType: "application/json",
        url: url,
        beforeSend: function (xhr) {
            if(header){
                for(name in header){
                    xhr.setRequestHeader(name, header[name]);
                }
            }
        },
        success: function (data) {  
            callback(data)
            // return re
        },
    });
}

function http_request2(  url , data , header , callback){
    $.ajax({
        type: "GET",
        data: data,
        contentType: "application/json",
        url: url,
        beforeSend: function (xhr) {
            if(header){
                for(name in header){
                    xhr.setRequestHeader(name, header[name]);
                }
            }
        },
        success: function (data) {  
            callback(data)
            // return re
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {　
            // alert(XMLHttpRequest.status);
            // alert(XMLHttpRequest.readyState);
            // alert(textStatus);
        }
    });
}

function http_request_post(  url , data , callback){
    var header = {
            "userId": getParamer('uid'),
            "sessionId": getParamer('sessionId')
        };

    $.ajax({
        type: "POST",
        data: data,
        contentType: "application/x-www-form-urlencoded",
        url: url,
        beforeSend: function (xhr) {
            if(header){
                for(name in header){
                    xhr.setRequestHeader(name, header[name]);
                }
            }
        },
        success: function (data) {  
            callback(data)
            // return re
        },
    });

}


//解析url参数 start
function getParamer(paramer){
    var url=window.location.href.split("?")[1];           
    if(url.indexOf("&")>0){                              
        urlParamArry=url.split("&");                        
        for(var i=0; i<urlParamArry.length; i++){
            var paramerName=urlParamArry[i].split("=");  
            if(paramer==paramerName[0]){                 
                return paramerName[1];                     
            }
        }
    }else{                                               
        var paramerValue=url.split("=")[1];
        return paramerValue;
    }
}


//获取手机短信倒计时
function setIntervalFun(){
    var time = 60;
    var loadwait = setInterval(function () {
        time--;
        if(time<=1){
            clearInterval(loadwait);
            $(".phonecodebutton").attr("onclick","getImgCode()");
            $(".phonecodebutton").html("再次发送")
        }else{
            $(".phonecodebutton").attr("onclick","");
            $(".phonecodebutton").html(time+"s")
        }
    },1000)
}