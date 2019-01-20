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

            $("#programme-list").append('<div class="ps">（注:每人最多1票）</div>');
            $.each(voteList, function(i,val){  //遍历节目列表
                var row = '<div class="programme grid text-left">'+
                '<div class="grid-cell">'+
                '<div class="name">'+val.id+'.'+val.name+'</div>'+
                '<div class="grid programme-progress">'+
                '<div class="grid-cell grid">'+
                '<div class="progress-container grid-cell">'+
                '<div class="progress" style="width:20%"></div>'+
                '</div>'+
                '</div>'+
                '<div class="progress-desc">'+ Math.round((val.num/totalVote)*100) +'% ('+val.num+')'+
                '</div>'+
                '</div>'+
                '</div>'+
                '<div class="grid-cell none grid">'+
                '<div class="grid-cell">'+
                '<label class="radio-container">'+
                    '<input ' + (programId == val.id ? 'checked' : '') + ' type="radio" name="voteRadio" value="' + val.id + '">' +
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

// 投票
function vote(id) {
    var url = window.apiUrl + "vote/vote?ticket=" + getUrlParam("ticket")+"&id="+id;
    $.get(url, function(result){
        var json = eval('(' + result + ')');
        if(json.status == '0000'){
            queryVoteList();//投票成功刷新页面
            alert(json.message);
        }
    });
}

$(document).ready(function(){
    queryVoteList();

    $("#btn_vote").click(function(){
        var id = $('input:radio[name="voteRadio"]:checked').val();
        if (id == null) {
            alert("请选择一个喜欢的节目投票");
            return;
        }

        vote(id);
    });
});

