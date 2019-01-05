/**
 工作流程
 **/
var gulp = require('gulp');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-clean-css');
var rev = require('gulp-rev');
var del = require('del');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var rename = require("gulp-rename");
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var es = require('event-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var babelify = require('babelify');
var watchify = require('watchify');
var gutil = require('gulp-util');
var glob = require('glob');

var paths = {
    scripts: ['lib/*.js', '!lib/config.js'],
    css: ['style/*'],
    font:['font/*'],
    json:['json/*'],
    audio:['audio/*'],
    html_1: ['./*.html'],
    html_2: ['./html/**/*.html'],
    images: ['images/*','!images/*.gif'],
    gifImages:['images/*.gif']
};


//1.清理
gulp.task('clean-dist',function(){
    del(['dist']);
});


/****************** lib ***************************************/
//2.js压缩
gulp.task('minify-lib', function () {
    gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify().on("error",function(e){
            console.log(e)
        }))
        .pipe(gulp.dest('dist/lib'));
});

/****************** lib ***************************************/

//3.压缩css脚本文件
gulp.task('minify-css', function () {
    gulp.src(paths.css)
        .pipe(minifyCss())
        .pipe(gulp.dest('dist/style'));
});
//4：压缩图片
gulp.task('minify-image', function () {
    gulp.src(paths.images)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/images'));
});

//4：压缩图片
gulp.task('copy-gif', function () {
    gulp.src(paths.gifImages)
        .pipe(gulp.dest('dist/images'));
});

//5.合并js 拷贝html
gulp.task('usemin',function() {
    gulp.src(paths.html_1)
        .pipe(usemin({
            js: [babel({
                presets: ['es2015']
            }),  uglify().on("error",function(e){
                console.log(e)
            }), rev() ] //uglify 压缩  rev 产生随机数
        }))
        .pipe(gulp.dest('dist/'));

    gulp.src(paths.html_2)
        .pipe(usemin({
            js: [babel({
                presets: ['es2015']
            }), uglify().on("error",function(e){
                console.log(e)
            }), rev() ] //uglify 压缩  rev 产生随机数
        }))
        .pipe(gulp.dest('dist/html/'));
});


gulp.task('usemin-r',['copy-test-config','usemin']);
//6.拷贝min.js
gulp.task('copy-minjs', function () {
    gulp.src(['app/cssStyle.js']).pipe(gulp.dest('dist/lib/'));
    gulp.src(['app/jquery.mobile-1.4.5.min.js']).pipe(gulp.dest('dist/lib/'));
});

//7.发布测试环境
gulp.task('copy-test', function () {
    gulp.src('config/config_test.js')
        .pipe(rename({
            basename: 'config'
        }))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify().on("error",function(e){
            console.log(e)
        }))
        .pipe(gulp.dest('dist/lib'))
});
//8.发布生产环境
gulp.task('copy-pro', function () {
    gulp.src('config/config_pro.js')
        .pipe(rename({
            basename: 'config'
        }))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify().on("error",function(e){
            console.log(e)
        }))
        .pipe(gulp.dest('dist/lib'))
});

//拷贝文件
gulp.task('copy-font', function () {
    gulp.src(['font/*'])
        .pipe(gulp.dest('dist/font/'));
});


/**
 * 源代码
 */
gulp.task('browserify', function(done) {
    glob('./app/main-**.js', function(err, files) {
        if(err) done(err);

        var tasks = files.map(function(entry) {
            return browserify({ entries: [entry] })
                .transform(babelify.configure({
                    presets: ["es2015"]
                }))
                .bundle()
                .pipe(source(entry))
                // rename them to have "bundle as postfix"
                .pipe(buffer())
                .pipe(rename(function (path) {
                    path.dirname = "/";
                    path.basename += "-bundle";
                }))
                .pipe(sourcemaps.init({loadMaps: true}))
                .pipe(uglify().on("error",function(e){
                    console.log(e)
                }))
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest('./dist/lib'));
        });
        es.merge(tasks).on('end', done);
    })
});

//完整构建流程
gulp.task('build-dev', ['minify-lib', 'minify-css', 'minify-image','usemin','copy-minjs','copy-test','copy-gif','browserify','copy-font']);
gulp.task('build-pro', ['minify-lib', 'minify-css', 'minify-image','usemin','copy-minjs','copy-pro','copy-gif','browserify','copy-font']);


//开发中使用
gulp.task('watch', function(done) {

    glob('./app/main-**.js', function(err, files) {
        if(err) done(err);

        var tasks = files.map(function(entry) {
            var b = browserify({ entries: [entry] })
                .transform(babelify.configure({
                    presets: ["es2015"]
                }))
                .plugin(watchify);

            var bundle = function(){
                var start = Date.now();
                return b.bundle()
                    .pipe(source(entry))
                    // rename them to have "bundle as postfix"
                    .pipe(buffer())
                    .pipe(rename(function (path) {
                        path.dirname = "/";
                        path.basename += "-bundle";
                    }))
                    .pipe(sourcemaps.init({loadMaps: true}))
                    .pipe(uglify().on("error",function(e){
                        console.log(e)
                    }))
                    .pipe(sourcemaps.write('./'))
                    .pipe(gulp.dest('./lib'))
                    .on('error', function (err) {
                        gutil.log(gutil.colors.red(err.toString()));
                    })
                    .on('end', function () {
                        gutil.log(gutil.colors.green('Finished rebundling in', (Date.now() - start) + 'ms.'));
                    })
            };
            b.on('update', bundle);
            return bundle();
        });
        es.merge(tasks).on('end', done);
    })
});