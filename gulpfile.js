const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
//const rebaseUrls = require('gulp-css-rebase-urls');
const replace = require('gulp-replace');


gulp.task('images-clean-dist', () =>
    gulp.src('./public/dist/images', {read: false})
        .pipe(clean())
);

gulp.task('images', ['images-clean-dist'], () =>
    gulp.src('./src/main/resources/static/images/**/*')
        .pipe(gulp.dest('./public/dist/images'))
);

gulp.task('images:watch', ['images'],  () =>
    gulp.watch('./src/main/resources/static/src/images/**/*', ['images'])
);

gulp.task('sass', () =>
    gulp.src('./src/main/resources/static/styles/default.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        //.pipe(rebaseUrls())
        .pipe(replace('../..', '..'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./public/dist/styles'))
);

gulp.task('sass:watch', ['sass'], () =>
    gulp.watch('./src/main/resources/static/styles/**/*.scss', ['sass'])
);


// common
gulp.task('build', ['sass', 'images']);
gulp.task('default', ['sass:watch', 'images:watch']);