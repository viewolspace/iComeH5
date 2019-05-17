
var  timer_s = null;
(function($){
    $.fn.extend({
        RollTitle: function(opt,callback){
            if(!opt) var opt={};
            var _this = this;
            _this.timer = null;
            _this.lineH = _this.find("div:first").height();
            _this.line=opt.line?parseInt(opt.line,15):parseInt(_this.height()/_this.lineH,10);
            _this.speed=opt.speed?parseInt(opt.speed,10):3000, //卷动速度，数值越大，速度越慢（毫秒
            _this.timespan=opt.timespan?parseInt(opt.timespan,13):5000; //滚动的时间间隔（毫秒
            if(_this.line==0) this.line=1;
            _this.upHeight=0-_this.line*_this.lineH;
            _this.scrollUp=function(){
                _this.animate({
                    marginTop:_this.upHeight
                },_this.speed,function(){
                    for(i=1;i<=_this.line;i++){
                        _this.find("div:first").appendTo(_this);
                    }
                    _this.css({marginTop:0});
                });
            }
            _this.hover(function(){
                clearInterval(_this.timer);
            },function(){
                timer_s=setInterval(function(){_this.scrollUp();},_this.timespan);
            }).mouseout();
        }
    })
})(jQuery);





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

            $("#RunTopic").html(tbody);
            $("#RunTopic").RollTitle({line:1,speed:500,timespan:100});

        }
    });
}




$(document).ready(function () {
    queryQuestion();
    $(document).keydown(function(event){
        if(event.keyCode == 83){
            alert("stop");
            if(timer_s!=null){
                $("#RunTopic").hide();
            }
        }
    });
});