var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    vendor = require('gulp-concat-vendor')
    es = require('event-stream'),
    mainBowerFiles = require('main-bower-files')
    order = require('gulp-order');

gulp.task('styles', function() {

  var foundation = sass('bower_components/foundation/scss/*.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(concat('foundation.css'))

  var styles = sass('src/scss/*.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(concat('custom.css'))

  return es.concat(foundation, styles)
    .pipe(order(['foundation.css', 'custom.css']))
    .pipe(concat('styles.css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(notify({ message: 'Styles task complete' }))
});


gulp.task('vendor', function() {

  var xgif = gulp.src(['bower_components/x-gif/dist/x-gif.html', 'bower_components/x-gif/dist/x-gif.angular.js'])
    .pipe(gulp.dest('dist/assets/js'));

  return scripts = gulp.src(mainBowerFiles({ filter: '**/*.js' }))
  .pipe(order([
    '**/jquery.js',
    '**/fastclick.js',
    '**/modernizr.js',
    '**/foundation.js',
    '**/detectizr.js',
    '**/angular.js',
    '**/angular-ui-router.js'
  ])).pipe(concat('vendor.js'))
  //.pipe(uglify())
  .pipe(gulp.dest('dist/assets/js'));  
});

gulp.task('scripts', function() {
  return gulp.src('src/scripts/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('html', function() {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(notify({ message: 'HTML files copied'}))
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    // .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/assets/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/assets/fonts'))
    .pipe(notify({ message: 'Fonts task complete' }));
});

gulp.task('audio', function() {
  return gulp.src('src/audio/**/*')
    .pipe(gulp.dest('dist/audio/'))
    .pipe(notify({ message: 'Audio task complete '}));
});

gulp.task('clean', function() {
    return del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img']);
});

gulp.task('copy', function() {
  gulp.start('images', 'fonts', 'audio');
})

gulp.task('default', ['clean'], function() {
    gulp.start('styles','vendor', 'scripts', 'html', 'copy');
});



gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('src/**/*.scss', ['styles']);

  gulp.watch('src/**/*.html', ['html']);

  // Watch .js files
  gulp.watch('src/scripts/**/*.js', ['scripts', 'vendor']);

  // Watch image files
  gulp.watch('src/images/**/*', ['images']);

  gulp.watch('src/audio/**/*', ['audio']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', livereload.changed);

});