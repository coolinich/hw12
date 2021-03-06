var gulp = require('gulp'),
    rename = require('gulp-rename'),
    minifycss = require('gulp-cssmin'),
    tinypng = require('gulp-tinypng');
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del'),
    spritesmith = require('gulp.spritesmith'),
    merge = require('merge-stream'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel'),
    minifyjs = require('gulp-js-minify'),
    browserSync = require('browser-sync');


function defaultTask(done) {
    gulp.parallel('watch');
    done();
}    

gulp.task('css', function(){
    return gulp.src("src/css/**/*.css")
    .pipe(autoprefixer({
        browsers: ['cover 99.5%', 'iOS 7']
    }))
    .pipe(gulp.dest("app/css/"))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('cssmin', function(){
    return gulp.src([
        "app/css/**/*.css",
        "!app/css/style.min.css"

    ])
    .pipe(concat("styles.css"))
    .pipe(minifycss())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('app/css/'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('tinypng', function(){
    return gulp.src(["src/img/*.png", "src/img/*.jpg"])
    .pipe(tinypng("sJsbrFotLaTukWnLmbFWP2Ztandg8nzA"))
    .pipe(gulp.dest('app/img'));
});

gulp.task('browser-sync', function(){
   browserSync({
       server: {
           baseDir: 'app'
       },
       notify: false
   }); 
});

gulp.task('sprite', function() {
    var spriteData = gulp.src('src/sprite/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css',
            imgPath: '../img/sprite.png'
        }));

    var imgStream = spriteData.img
        .pipe(gulp.dest('app/img/'));
        
    var cssStream = spriteData.css
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('app/css/'));
    return merge(imgStream, cssStream);        
}); 


gulp.task('js', function(){
    return gulp.src('app/js/main/**/*.js')
        .pipe(babel({
            presets: ["env"]
        }))
        .pipe(concat('scripts.js'))
        // .pipe(minifyjs())
        // .pipe(rename('scripts.min.js'))
        .pipe(gulp.dest('app/js'));
});


gulp.task('watch', gulp.series('css', 'cssmin', 'sprite', 'browser-sync', () => {
    gulp.watch('src/css/**/*.css', gulp.series('css'));
    gulp.watch('app/css/style.css', gulp.series('cssmin'));
    gulp.watch('src/sprite/*.png', gulp.series('sprite'));
}));


gulp.task('clean', function(){
    del.sync('app/css');
    del.sync('app/js');
    del.sync('app/img');
})

//here in list of all tasks for PRD build 
gulp.task('build', gulp.series('css', 'cssmin', 'tinypng', 'js', (done) => {
        gulp.src('src/*.html')
        .pipe(gulp.dest('app/'));
        done(); 
}));

exports.default = defaultTask;