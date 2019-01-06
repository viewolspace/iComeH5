var personArray = new Array;
var CurPersonNum = 0;

// animate
var _in = ['bounceIn','bounceInDown','bounceInLeft','bounceInRight','bounceInUp','fadeIn','fadeInDown','fadeInDownBig','fadeInLeft','fadeInLeftBig','fadeInRight','fadeInRightBig','fadeInUp','fadeInUpBig','rotateIn','rotateInDownLeft','rotateInDownRight','rotateInUpLeft','rotateInUpRight','slideInDown','slideInLeft','slideInRight'];
var _out = ['bounceOut','bounceOutDown','bounceOutLeft','bounceOutRight','bounceOutUp','fadeOut','fadeOutDown','fadeOutDownBig','fadeOutLeft','fadeOutLeftBig','fadeOutRight','fadeOutRightBig','fadeOutUp','fadeOutUpBig','rotateOut','rotateOutDownLeft','rotateOutDownRight','rotateOutUpLeft','rotateOutUpRight','slideOutDown','slideOutLeft','slideOutRight'];

// 模拟推送数据
var s = setInterval(function(){
    // get animate
    var rand_in = parseInt(Math.random() * _in.length,10);
    var rand_out = parseInt(Math.random() * _out.length,10);
    if(CurPersonNum >= personArray.length){
        CurPersonNum = 0;
    }
    $('.show_info').show();
    $('.show_info').addClass(_in[rand_in]);
    setTimeout(function(){
        $('.show_info').removeClass(_in[rand_in]);
        // 更改展示的图片
        //var img = document.getElementsByClassName('element')[CurPersonNum].getElementsByTagName('img')[0];
        //img.setAttribute('src','../images/2.png');
        $("#comeUser").attr("src","../images/2.jpg");
        ++CurPersonNum;
        setTimeout(function(){
            $('.show_info').addClass(_out[rand_out]);
            setTimeout(function(){
                $('.show_info').removeClass(_out[rand_out]);
                $('.show_info').hide();
            },1000);
        },1500);
    },1000);
},4500);





// 生成虚拟数据
for(var i=0;i<199;i++){
    personArray.push({
        image: "../images/1.jpg"
    });
}


var table = new Array;
for (var i = 0; i < personArray.length; i++) {
    table[i] = new Object();
    if (i < personArray.length) {
        table[i] = personArray[i];
        table[i].src = personArray[i].thumb_image;
    }
    table[i].p_x = i % 20 + 1;
    table[i].p_y = Math.floor(i / 20) + 1;
}


var camera, scene, renderer;
var controls;

camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.z = 3000;

scene = new THREE.Scene();


var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };





function init() {
    // table
    for ( var i = 0; i < table.length; i ++ ) {

        var element = document.createElement( 'div' );
        element.className = 'element';
        element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

        var img = document.createElement('img');
        img.src = table[ i ].image;
        element.appendChild( img );


        var object = new THREE.CSS3DObject( element );
        object.position.x = Math.random() * 4000 - 2000;
        object.position.y = Math.random() * 4000 - 2000;
        object.position.z = Math.random() * 4000 - 2000;
        scene.add( object );

        objects.push( object );




    }



    //渲染
    renderer = new THREE.CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.domElement.style.position = 'absolute';
    document.getElementById( 'container' ).appendChild( renderer.domElement );

    // 鼠标控制
    controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = 0.5;
    controls.minDistance = 500;
    controls.maxDistance = 6000;
    controls.addEventListener( 'change', render );

    showTable();
    //
    // 自动更换
    var ini = 0;
    setInterval(function(){
        ini = ini >= 3 ? 0 : ini;
        ++ini;
        switch(ini){
            case 1:
                showSphere();
                //transform( targets.sphere, 1000 );
                break;
            case 2:
                //transform( targets.sphere, 1000 );
                showHelix();
                break;
            case 3:
                //transform( targets.sphere, 1000 );
                showGrid();
                break;
        }
    },8000);

    window.addEventListener( 'resize', onWindowResize, false );

}
// 表格需要坐标进行排序的

function showTable(){
    for ( var i = 0, l = table.length; i < l; i ++ ) {
        var object = new THREE.Object3D();
        object.position.x = ( table[ i ].p_x * 140 ) - 1330;
        object.position.y = - ( table[ i ].p_y * 180 ) + 990;

        targets.table.push( object );
    }
         transform( targets.table, 2000 );


}


function showSphere(){
    targets.sphere = []

    var vector = new THREE.Vector3();

    var spherical = new THREE.Spherical();

    for ( var i = 0, l = objects.length; i < l; i ++ ) {

        var phi = Math.acos( -1 + ( 2 * i ) / l );
        var theta = Math.sqrt( l * Math.PI ) * phi;

        var object = new THREE.Object3D();

        spherical.set( 800, phi, theta );

        object.position.setFromSpherical( spherical );

        vector.copy( object.position ).multiplyScalar( 2 );

        object.lookAt( vector );

        targets.sphere.push( object );



    }
    transform( targets.sphere, 2000 );
}

    function showHelix(){
        targets.helix = [];
        var vector = new THREE.Vector3();
        var cylindrical = new THREE.Cylindrical();

        for ( var i = 0, l = objects.length; i < l; i ++ ) {

            var theta = i * 0.175 + Math.PI;
            var y = - ( i * 5 ) + 450;

            var object = new THREE.Object3D();

            // 参数一 圈的大小 参数二 左右间距 参数三 上下间距
            cylindrical.set( 900, theta, y );

            object.position.setFromCylindrical( cylindrical );

            vector.x = object.position.x * 2;
            vector.y = object.position.y;
            vector.z = object.position.z * 2;

            object.lookAt( vector );

            targets.helix.push( object );

        }
        transform( targets.helix, 2000 );

    }


function showGrid(){
    targets.grid = [];
    for ( var i = 0; i < objects.length; i ++ ) {

        var object = new THREE.Object3D();

        object.position.x = ( ( i % 5 ) * 400 ) - 800; // 400 图片的左右间距  800 x轴中心店
        object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 300 ) + 500;  // 500 y轴中心店
        object.position.z = ( Math.floor( i / 25 ) ) * 200 - 800;// 300调整 片间距 800z轴中心店

        targets.grid.push( object );

    }
    transform( targets.grid, 2000 );
}

function transform( targets, duration ) {

    TWEEN.removeAll();

    for ( var i = 0; i < objects.length; i ++ ) {

        var object = objects[ i ];
        var target = targets[ i ];

        new TWEEN.Tween( object.position )
            .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();

        new TWEEN.Tween( object.rotation )
            .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();

    }

    new TWEEN.Tween( this )
        .to( {}, duration * 2 )
        .onUpdate( render )
        .start();

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();

}

var requestID;

function animate() {
    if(requestID){
        cancelAnimationFrame(requestID);
    }

    // 让场景通过x轴或者y轴旋转  & z
    // scene.rotation.x += 0.011;
    scene.rotation.y += 0.008;

    requestID = requestAnimationFrame( animate );

    TWEEN.update();

    controls.update();

    // 渲染循环
    render();

}

function animateFast() {
    if(requestID){
        cancelAnimationFrame(requestID);
    }
    // 让场景通过x轴或者y轴旋转  & z
    // scene.rotation.x += 0.011;
    scene.rotation.y += 0.08;

    requestID = requestAnimationFrame( animateFast );

    TWEEN.update();

    controls.update();

    // 渲染循环
    render();

}

function render() {
    renderer.render( scene, camera );

    //render();
}

function openBar() {
    $(".global_toolbar").hasClass("open") || ($(".global_toolbar").addClass("open"),
        $("#shop_cart .lazyload").removeClass("hidden").find("img").trigger("appear"),
        $(".global_toolbar").removeClass("default"),
        $(".toolbar_btn").css({
            top: "50%",
            marginTop: -$(".toolbar_btn").height() / 2
        })),
        $(".global_toolbar").removeClass("opacity"),
        $(".toolbar_btn").removeClass("default")
}

function closeBar() {
    $(".toolbar_btn a").removeClass("current");
    $(".global_toolbar").removeClass("open");
    $(".toolbar_btn").removeClass("default");
}

/**
 * 获取抽奖信息
 */
window.getLuckInfo = function(luckLevel, form){
    var apiUrl = window.apiUrl +   "luck/queryLuckInfo?luckLevel=" + luckLevel;
    $.get(apiUrl, function(result){
        var luckObj = JSON.parse(result);

        form.val('luckSetForm', {
            "rewardNum": luckObj.result.rewardNum,
            "rewardName": luckObj.result.prize,
            "joinNum": luckObj.result.joinNum
        })

        //同步刷新右侧悬浮框的中奖名单
        queryLuckList(luckLevel);
    });
}

/**
 * 抽奖
 */
window.luckDraw = function(luckLevel, rewardNum, joinNum){
    $("#resultData").empty();//抽奖前，先清空中奖名单

    var luckDrawUrl = window.apiUrl +   "luck/luckDraw";
    $.post(luckDrawUrl, {
        "luckId": luckLevel,
        "rewardNum": rewardNum,
        "joinNum": joinNum
    }, function(result){
        var luckList = JSON.parse(result).result;

        setTimeout(function(){
            endLuck();//取消加速
            showLuck(luckLevel, rewardNum, luckList);//展示中奖人员
        }, 7000);
    });
}

window.endLuck=function () {
    animate();
}

//弹窗展示中奖人信息
window.showLuck = function (luckLevel, rewardNum, luckList) {
    $("#luckDiv").empty();//每次重新渲染中奖名单前，先清空旧数据
    $.each(luckList, function(i,val){  //遍历二维数组
        $("#luckDiv").append('<div class="single"><div class="headpic" ><img src="'+val.url+'" id="luckUserImg" /></div><div class="name">'+val.userName+'</div></div>');
    })
    $("#luckDiv").show();
    $("#luckDiv").css('width',(rewardNum*100)+'px');

    setTimeout(function(){
        hideLuck(luckLevel);//将中奖人头像飞入中奖名单
    }, 3000);
}

window.hideLuck = function (luckLevel) {
    var offset = $("#resultData").offset();

    var img = $("#luckUserImg").attr('src');
    var imgX = $("#luckDiv").offset().top;
    var imgY = $("#luckDiv").offset().left;

    var flyer = $('<img class="u-flyer flyerImg" src="'+img+'">');
    flyer.fly({
        start: {
            left: imgY,
            top: imgX
        },
        end: {
            left: offset.left+10,
            top: offset.top+10,
            width: 0,
            height: 0
        },
        onEnd: function(){
            $("#luckDiv").hide();
            this.destory();
            //同步刷新右侧悬浮框的中奖名单
            queryLuckList(luckLevel);
        }
    });



}

/**
 * 查询中奖名单
 */
window.queryLuckList = function(luckLevel){
    var listByLevelUrl = window.apiUrl +   "winner/listByLevel?luckLevel=" + luckLevel;
    $.get(listByLevelUrl, function(result){
        var luckList = JSON.parse(result).result;

        $("#resultData").empty();//每次重新渲染中奖名单前，先清空旧数据
        $.each(luckList, function(i,val){  //遍历二维数组
            $("#resultData").append('<div class="container"><img src="'+val.url+'" class="icon" alt=""><span class="username">'+val.userName+'</span></div>');
        })
    });
}

$(document).ready(function(){

    init();
    animate();


    $("#fast").click(function(){
        animateFast();


    });

    $("#reset").click(function(){
        animate();


    });

    $("#luckBtn").click(function(){
        $('.type-left').toggleClass('showListType');
        $(".global_toolbar").hasClass("open") ? closeBar() : openBar();
    });
    $('.type-left ul li').click(function(){
        $(this).addClass('active').siblings('li').removeClass('active')
    })

    layui.use(['form'], function(){
        var form = layui.form
            ,layer = layui.layer;

        //初始化奖项
        var rewardLevel = $("#rewardLevel").val();
        getLuckInfo(rewardLevel, form);

        form.on('select(rewardLevel)', function(data){
            var rewardLevel = data.value;
            getLuckInfo(rewardLevel, form);
        })

        //监听提交
        form.on('submit(demo1)', function(data){
            startLuck();//动画加速

            var rewardLevel = data.field.rewardLevel;
            var rewardNum = data.field.rewardNum;
            var joinNum = data.field.joinNum;

            //抽奖，返回获奖名单
            luckDraw(rewardLevel, rewardNum, joinNum);

            return false;
        });

        window.startLuck=function () {
            animateFast();
        }

    });
});