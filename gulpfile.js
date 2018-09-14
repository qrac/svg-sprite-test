//----------------------------------------------------
// gulp: Setting
//----------------------------------------------------

const gulp = require("gulp")
const notify = require("gulp-notify")
const plumber = require("gulp-plumber")
const browserSync = require("browser-sync")
const svgSprite = require("gulp-svg-sprite")

// BrowserSync Options
const browserSyncOption = {
  server: {
    baseDir: "docs"
  },
  startPath: "./index.html",
  open: false,
  notify: false
}

//----------------------------------------------------
// gulp: Task
//----------------------------------------------------

// SVG Sprite Icon
gulp.task("sprite", function() {
  return gulp
    .src("src/icon/*.svg")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            dest: "./",
            sprite: "sprite.svg"
          }
        },
        shape: {
          transform: [
            {
              svgo: {
                plugins: [
                  { removeTitle: true },
                  { removeStyleElement: true },
                  { removeAttrs: { attrs: "fill" } }
                ]
              }
            }
          ]
        },
        svg: {
          xmlDeclaration: true,
          doctypeDeclaration: true
        }
      })
    )
    .pipe(gulp.dest("docs"))
})

// Browser Sync
gulp.task("browser-sync", function(done) {
  browserSync.init(browserSyncOption)
  done()
})

gulp.task("reload", function(done) {
  browserSync.reload()
  done()
})

// Watch
gulp.task("watch", () => {
  gulp.watch("docs/*", gulp.series("reload"))
  gulp.watch("src/icon/*.svg", gulp.series("sprite"))
})

gulp.task("default", gulp.parallel("browser-sync", "watch"))

//----------------------------------------------------
// gulp: Build
//----------------------------------------------------

gulp.task("build", gulp.parallel(gulp.series("sprite")))
