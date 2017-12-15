"use strict"

var gulp        = require('gulp'),
	browserSync = require('browser-sync'),
	sass        = require('gulp-sass'),
	prefixer	= require('gulp-autoprefixer'),
    notify      = require("gulp-notify"),   
    jade     	= require('gulp-jade'),
    watch       = require('gulp-watch'),
    rimraf		= require('gulp-rimraf'),
    spritesmith = require('gulp.spritesmith'),
    reload		= browserSync.reload,
    page 		= 'index.html';

var path = {
	build: {
		html: 'build/',
		js: {
			common: 'build/js/',
			libs: 'build/libs/'
		},
		css: 'build/css/',
		fonts: 'build/fonts/',
		icons: 'build/img/',
		img: 'build/img/'
	},
	src: {
		jade: ['src/jade/*.jade', '!src/jade/_template.jade', '!src/jade/_config.jade'],
		js: {
			common: 'src/js/**/*',
			libs: 'src/libs/**/*'
		},
		css: 'src/scss/style.scss',
		fonts: 'src/fonts/**/*',
		icons: 'src/icons/*.png',
		img: ['src/img/**/*.png', 'src/img/**/*.jpg', 'src/img/**/*.svg']
	},
	watch: {
		jade: 'src/jade/**/*.jade',
		js: {
			common: 'src/js/**/*.js',
			libs: 'src/libs/**/*'
		},
		css: 'src/scss/*.scss',
		fonts: 'src/fonts/**/*',
		icons: 'src/icons/**/*',
		img: 'src/img/**/*'
	}
};

gulp.task("server", function(){
	browserSync({
		server: {
			baseDir: "./build"
		},
		host: 'localhost',
		port: 3000
	});
});

gulp.task('build:html', function(){
	var YOUR_LOCALS = {};
	gulp.src(path.src.jade)
		.pipe(jade({
			locals: YOUR_LOCALS,
			pretty: true
		}))
		.on("error", notify.onError({
            message: "Ошибка: <%= error.message %>",
            title: "Ошибка запуска"}))
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}))
});

gulp.task('build:js', function(){
	gulp.src(path.src.js.common)
		.pipe(gulp.dest(path.build.js.common))
		.pipe(reload({stream: true}));
})

gulp.task('build:libs' , function(){
	gulp.src(path.src.js.libs)
		.pipe(gulp.dest(path.build.js.libs))
		.pipe(reload({stream: true}));
})

gulp.task('build:css', function(){
	gulp.src(path.src.css)
		.pipe(sass({
			pretty: true
		}))
		.on("error", notify.onError({
        message: "Ошибка: <%= error.message %>",
        title: "Ошибка запуска"}))
		.pipe(prefixer())
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}))
})

gulp.task('build:img', function(){
	gulp.src(path.src.img)
        .on("error", notify.onError({
        message: "Ошибка: <%= error.message %>",
        title: "Ошибка запуска"}))
        .pipe(gulp.dest(path.build.img))
        .on("error", notify.onError({
        message: "Ошибка: <%= error.message %>",
        title: "Ошибка запуска"}))
		.pipe(reload({stream: true}));
})

gulp.task('build:fonts', function(){
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
		.on("error", notify.onError({
        message: "Ошибка: <%= error.message %>",
        title: "Ошибка запуска"}))
		.pipe(reload({stream: true}));
})

gulp.task('build:sprite', function () {
  var spriteData = gulp.src(path.src.icons).pipe(spritesmith({
    imgName: 'icon-set.png',
    cssName: 'icon-set.scss',
    imgPath: '../img/icon-set.png',
    cssVarMap: function (sprite) {
	  sprite.name = 'icon-' + sprite.name;
	}
  }));
  spriteData.img.pipe(gulp.dest(path.build.icons));
  spriteData.css.pipe(gulp.dest('src/scss/'));
});

gulp.task('clean', function(callback){
	return gulp.src(['./build/img/', './build/libs/'], {read:false})
		.pipe(rimraf({force:true}))
})

gulp.task('build', [
	'build:html',
	'build:css',
	'build:js',
	'build:libs',
	'build:sprite',
	'build:img',
	'build:fonts'
])

gulp.task('watch', function(){
	watch([path.watch.jade], function(ev, callback){
		gulp.start('build:html');
	});
	watch([path.watch.js.common], function(ev, callback){
		gulp.start('build:js');
	});
	watch([path.watch.js.libs], function(ev, callback){
		gulp.start('build:libs');
	});
	watch([path.watch.css], function(ev, callback){
		gulp.start('build:css');
	});
	watch([path.watch.fonts], function(ev, callback){
		gulp.start('build:fonts');
	});
	watch([path.watch.icons], function(ev, callback){	
		gulp.start('build:sprite');
	});
	watch([path.watch.img], function(ev, callback){	
		gulp.start('build:img');
	});
})



gulp.task('default', ['clean'], function(){
	gulp.start('build');
	gulp.start('server');
	gulp.start('watch');
});
