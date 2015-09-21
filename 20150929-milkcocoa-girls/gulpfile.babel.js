import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';

const $ = gulpLoadPlugins();

gulp.task('stylus', () => {
  gulp.src('./*.stylus')
    .pipe($.plumber())
    .pipe($.stylus())
    .pipe($.autoprefixer('last 2 version'))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.reload({stream: true, once: true}))
    ;
});

gulp.task('serve', () => {
  browserSync.init(null, {
    server: {baseDir: './'}
  });
});

gulp.task('reload', () => browserSync.reload());

gulp.task('default', ['serve', 'stylus'], () => {
  gulp.watch('./*.stylus', ['stylus']);
  gulp.watch('index.html', ['reload']);
});
