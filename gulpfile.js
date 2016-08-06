'use strict';

const gulp = require('gulp');
const del = require('del');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const cleancss = require('gulp-cleancss');
const sourcemaps = require('gulp-sourcemaps');
const pug = require('gulp-pug');
const uglify = require('gulp-uglify');
const ghPages = require('gulp-gh-pages');
const gulpIf = require('gulp-if');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const jpegoptim = require('imagemin-jpegoptim');
const spritesmith = require('gulp.spritesmith');
const newer = require('gulp-newer');
const notify = require('gulp-notify');
const browserSync = require('browser-sync').create();
const serve = require('browser-sync');
const reload = browserSync.reload;

// Paths
var path = {
  build: {
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/img/',
    fonts: 'build/fonts/',
    sprites: 'src/img/',
    spritesCss: 'src/css/partials/'
  },
  src: {
    html: './src/html/*.pug',
    js: 'src/js/*.js',
    css: './src/css/*.scss',
    img: 'src/img/*.*',
    fonts: 'src/fonts/**/*.*',
    sprites: 'src/img/sprite-png/*.png'
  },
  watch: {
    html: 'src/html/**/*.pug',
    js: 'src/js/**/*.js',
    css: 'src/css/**/*.scss',
    img: 'src/img/*.*',
    fonts: 'src/fonts/**/*.*',
    sprites: 'src/img/sprite-png/*.png'
  },
  clean: './build'
};


// Compilation pug
gulp.task('pug', function() {
  gulp.src(path.src.html)
    .pipe(plumber())
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(path.build.html))
    .pipe(browserSync.reload({stream: true}));
})

// Compilation sass
gulp.task('sass', function () {
  gulp.src(path.src.css)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: ['last 3 version']}),
      mqpacker
    ]))
    .pipe(cleancss())
    .pipe(sourcemaps.write())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.reload({stream: true}));
});

// Compilation js
gulp.task('js', function() {
  gulp.src(path.src.js)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.reload({stream: true}));
});

// Optimization images
gulp.task('img', function () {
  gulp.src(path.src.img)
    .pipe(newer(path.build.img))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant(),jpegoptim({max: 95})],
      interlaced: true
    }))
    .pipe(gulp.dest(path.build.img))
    .pipe(browserSync.reload({stream: true}));
});

// Creation sprites
gulp.task('sprites', function () {
  var spriteData =
    gulp.src(path.src.sprites) //выберем откуда брать изображения для объединения в спрайт
      .pipe(spritesmith({
        imgName: 'sprite.png', //имя спрайтового изображения
        cssName: '_sprite.scss', //имя стиля где храним позиции изображений в спрайте
        imgPath: '../img/sprite.png', //путь где лежит спрайт
        cssFormat: 'scss', //формат в котором обрабатываем позиции
        cssVarMap: function(sprite) {
          sprite.name = 's-' + sprite.name //имя каждого спрайта будет состоять из имени файла и конструкции 's-' в начале имени
        }
      }));
  spriteData.img.pipe(gulp.dest(path.build.sprites)); // путь, куда сохраняем картинку
  spriteData.css.pipe(gulp.dest(path.build.spritesCss)); // путь, куда сохраняем стили
});


// Copying fonts
gulp.task('fonts', function() {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
});

// Overall build
gulp.task('build', [
  'pug',
  'sass',
  'js',
  // 'sprites',    
  'img',
  'fonts'
]);

// Overall watch
gulp.task('watch', function(){
  gulp.watch([path.watch.html], function(event, cb) {
    gulp.start('pug');
  });
  gulp.watch([path.watch.css], function(event, cb) {
    gulp.start('sass');
  });
  gulp.watch([path.watch.js], function(event, cb) {
    gulp.start('js');
  });
  gulp.watch([path.watch.img], function(event, cb) {
    gulp.start('img');
  });
  // gulp.watch([path.watch.sprites], function(event, cb) {
  //   gulp.start('sprites');
  // });
  gulp.watch([path.watch.fonts], function(event, cb) {
    gulp.start('fonts');
  });
});

// Clean
gulp.task('clean', function () {
  del(path.clean);
});

// Deploy on github.io
gulp.task('deploy', function() {
  gulp.src('path.build')
//  gulp.src('./build/**/*')
    .pipe(ghPages());
});


//Server config
var config = {
  server: {
    baseDir: "./build"
  },
//  tunnel: true,
  host: 'localhost',
  port: 9000
};
// Browser sync
gulp.task('serve', function() {
  serve(config);
});


gulp.task('default', ['clean', 'build', 'serve', 'watch']);




// // запуск браузерсинка + компилятора sass
// gulp.task('serve', ['sass'], function(){
//   browserSync.init({
//     server: "./src"
//     });
//   //следим за файлами, выполняем задачу sass
//   gulp.watch('src/sass/**/*.sass', ['sass']);
//   gulp.watch('src/js/**/*.js').on('change', browserSync.reload);
//   gulp.watch('src/*.html').on('change', browserSync.reload);
// });