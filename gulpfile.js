const gulp = require('gulp')
const plumber = require('gulp-plumber')
const livereload = require('gulp-livereload')
const sass = require('gulp-sass')
const path = require('path')
const replace = require('gulp-replace')
const fs = require('fs')
const rename = require('gulp-rename')

const repoRoot = path.join(__dirname, '/')
const govUkFrontendToolkitRoot = path.join(repoRoot, 'node_modules/govuk_frontend_toolkit/stylesheets')
const govUkElementRoot = path.join(repoRoot, 'node_modules/govuk-elements-sass/public/sass')

const assetsDirectory = './src/main/public'
const stylesheetsDirectory = `${assetsDirectory}/stylesheets`

gulp.task('sass', (done) => {
  gulp.src(stylesheetsDirectory + '/*.scss')
    .pipe(plumber())
    .pipe(sass({
      includePaths: [
        govUkFrontendToolkitRoot,
        govUkElementRoot
      ]
    }))
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest(stylesheetsDirectory))
    .pipe(livereload())
    done()
})

gulp.task('copy-files', (done) => {
  gulp.src([
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/govuk_frontend_toolkit/javascripts/**/*.js',
    './node_modules/govuk_template_jinja/assets/javascripts/**/*.js'
  ])
  .pipe(gulp.dest(`${assetsDirectory}/js/lib/`))

  gulp.src([
    './node_modules/@hmcts/cmc-common-frontend/macros/*.njk'
  ])
  .pipe(gulp.dest(`${assetsDirectory}/macros`))

  gulp.src([
    './node_modules/HTML_CodeSniffer/HTMLCS.js'
  ])
  .pipe(gulp.dest(`${assetsDirectory}/js/lib/htmlcs`))

  gulp.src([
    './node_modules/HTML_CodeSniffer/Standards/**'
  ])
  .pipe(gulp.dest(`${assetsDirectory}/js/lib/htmlcs/Standards`))

  gulp.src([
    './node_modules/HTML_CodeSniffer/Auditor/HTMLCSAuditor.js'
  ])
  .pipe(gulp.dest(`${assetsDirectory}/js/lib/htmlcs/Auditor`))

  gulp.src([
    './node_modules/HTML_CodeSniffer/Auditor/**/*.{css,gif,png}'
  ])
  .pipe(gulp.dest(`${assetsDirectory}/stylesheets/lib/`))

  gulp.src([
    './node_modules/govuk_template_jinja/assets/images/apple-touch-icon.png'
  ])

  .pipe(gulp.dest(`${assetsDirectory}/`))
  gulp.src([
    './node_modules/govuk_frontend_toolkit/images/**/*',
    './node_modules/govuk_template_jinja/assets/images/*.*'
  ])
  .pipe(gulp.dest(`${assetsDirectory}/img/lib/`))

  gulp.src([
    './node_modules/govuk_template_jinja/assets/stylesheets/**/*'
  ])
  .pipe(replace('images/', '/stylesheets/lib/images/', { skipBinary: true }))
  .pipe(gulp.dest(`${assetsDirectory}/stylesheets/lib/`))

  gulp.src('./node_modules/nodelist-foreach-polyfill/index.js')
    .pipe(rename('nodelist-foreach-polyfill.js'))
    .pipe(gulp.dest(`${assetsDirectory}/js/lib/`))

  done()
})

gulp.task('watch', (done) => {
  gulp.watch(stylesheetsDirectory + '/**/*.scss', gulp.series('sass'))
  done()
})

gulp.task('default',
  gulp.series(
    gulp.parallel(
      'sass',
      'copy-files',
    ),
    gulp.parallel(
      'watch'
    )
  )
)
