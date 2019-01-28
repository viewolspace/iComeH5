function getUrlParam(name){
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) {
        return unescape(r[2]);
    }
    return null;
}

//查询投票节目
function queryVoteList() {
    var url = window.apiUrl + "vote/list?ticket=" + getUrlParam("ticket");
    $.get(url, function(result){
        var json = eval('(' + result + ')');
        if(json.status == "0000"){
            var voteList = json.list;
            var programId=0;
            var vote = json.vote;

            if(json.detail){
                programId = json.detail.programId;
            }
            var totalVote = 0;
            $.each(voteList, function(i,val){  //计算总票数
                totalVote+=val.num;
            });
            if(totalVote==0){
                totalVote=1;
            }

            $("#programme-list").empty();
            $("#programme-list").append('<div class="ps">（注:每人最多1票）</div>');
            $.each(voteList, function(i,val){  //遍历节目列表
                var row = '<div class="programme grid text-left">'+
                '<div class="grid-cell">'+
                '<div class="name">'+val.id+'.'+val.name+'</div>'+
                '<div class="grid programme-progress">'+
                '<div class="grid-cell grid">'+
                '<div class="progress-container grid-cell">'+
                '<div class="progress" style="width:'+Math.round((val.num/totalVote)*100)+'%"></div>'+
                '</div>'+
                '</div>'+
                '<div class="progress-desc">'+ Math.round((val.num/totalVote)*100) +'% ('+val.num+')'+
                '</div>'+
                '</div>'+
                '</div>'+
                '<div class="grid-cell none grid">'+
                '<div class="grid-cell">'+
                '<label class="radio-container">'+
                    '<input ' + (programId == val.id ? 'checked' : '') + ' '+ (vote == 1 ? '' : 'disabled') +' type="radio" name="voteRadio" value="' + val.id + '">' +
                '<span class="check-mark"></span>'+
                '</label>'+
                '</div>'+
                '</div>'+
                '</div>'
                $("#programme-list").append(row);
            });

            if(vote==1){
                $("#btn_vote").css('display','block');
                $("#btnVoted").css('display','none');
            } else {
                $("#btn_vote").css('display','none');
                $("#btnVoted").css('display','block');
            }

        }
    });
}


function toast(str){
    var toastPos=$("<div></div>");
    toastPos.css({
        "position":"fixed",
        "bottom":"60px",
        "width":"100%",
        "z-index": "1000"
    });
    var toast_div = $("<div></div>");
    var hfontSize = $('html').css("font-size");
    var radius = (4/parseFloat(hfontSize))+"rem";
    var lineHeight = (21/parseFloat(hfontSize))+"rem";
    var padding = (5/parseFloat(hfontSize))+"rem";
    var fontSize = (15/parseFloat(hfontSize))+"rem";
    var shadow1 = (1/parseFloat(hfontSize))+"rem";
    var shadow2 = (2/parseFloat(hfontSize))+"rem";
    var shadow3 = (5/parseFloat(hfontSize))+"rem";
    toast_div.css({
        "display": "-webkit-box",
        "display": "-webkit-flex",
        "display": "flex",
        "flex-wrap": "wrap",/*标准版本项目换行*/
        "-webkit-flex-flow": "row wrap",/*混合版本项目换行*/
        "-webkit-box-pack": "center",
        "box-pack":"center",
        "-webkit-justify-content": "center",/*新版本水平居中*/
        "justify-content": "center",
        "width":"60%",
        "border-radius":radius,
        "line-height":lineHeight,
        "padding":padding,
        "background":"#5A5A5A",
        "z-index": "1000",
        "text-align":"center",
        "color":"#ffffff",
        "font-size":fontSize,
        "margin":"0 auto",
        "box-shadow": "0 0 0 #fff,"+shadow1+" "+shadow2+" "+shadow3+" rgba(69, 69, 69, 0.3),0 0 0 #fff,"+shadow1+" "+shadow2+" "+shadow3+" rgba(69, 69, 69, 0.3)"
    });
    toast_div.html(str);
    $(document.body).append(toastPos);
    toastPos.append(toast_div);
    setTimeout(function(){
        toastPos.remove();
    },3000);
}


// 投票
function vote(id) {
    var url = window.apiUrl + "vote/vote?ticket=" + getUrlParam("ticket")+"&id="+id;
    $.get(url, function(result){
        var json = eval('(' + result + ')');
        if(json.status == '0000'){
            queryVoteList();//投票成功刷新页面
            toast(json.message);
        }
    });
}

$(document).ready(function(){
    queryVoteList();

    $("#btn_vote").click(function(){
        var id = $('input:radio[name="voteRadio"]:checked').val();
        if (id == null) {
            toast("请选择一个喜欢的节目投票");
            return;
        }

        vote(id);
    });
});

