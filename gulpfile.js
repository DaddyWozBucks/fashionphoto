var gulp = require('gulp');
var bowerSrc = require('gulp-bower-src');
var inject = require('gulp-inject');
var filter = require('gulp-filter');
var gzip = require('gulp-gzip');
var gutil       = require('gulp-util'),
   sass        = require('gulp-sass'),
   rename      = require('gulp-rename')
   csso        = require('gulp-csso'),
   uglify      = require('gulp-uglify'),
   jade        = require('gulp-jade'),
   concat      = require('gulp-concat'),
   livereload  = require('gulp-livereload'), // Livereload plugin needed: https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
   tinylr      = require('tiny-lr'),
   express     = require('express'),
   app         = express(),
   marked      = require('marked'), // For :markdown filter in jade
   path        = require('path'),
   server      = tinylr(),
   es = require('event-stream'),
   series = require('stream-series'),
   mainBowerFiles = require('main-bower-files'),
   angularFilesort = require('gulp-angular-filesort'),
 exists = require('path-exists').sync;
   gulp.task('bowercomp', function() {
       return gulp.src(mainBowerFiles(/* options */), { base: './bower_components' })
           .pipe( gulp.dest('dist/bower_components'))
   });

// --- Basic Tasks ---
gulp.task('css', function() {
 return gulp.src('src/assets/stylesheets/*.scss')
   .pipe(
     sass( {
       includePaths: ['src/assets/stylesheets'],
       errLogToConsole: true
     } ) )
    .pipe(concat('sheets.css'))
    .pipe(rename('sheets.min.css'))
   .pipe( csso() )
   // .pipe(gzip())
   .pipe( gulp.dest('dist/assets/stylesheets/') )
   .pipe( livereload( server ));
});

// gulp.task('bower', function () {
// 	bowerSrc()
// 		.pipe(gulp.dest('dist/bower_components'));
// });
var jsFiles = [
      'src/assets/js/*.js',
      '!./public/js/**/*.js',
      '!./node_modules/**',
      '!./bower_components/**',
      '!./gulpfile.js'
    ]
    jsDest = 'dist/assets/scripts';

gulp.task('js', function() {
    return gulp.src(jsFiles)
        .pipe(concat('scripts.js'))
        // .pipe(gulp.dest(jsDest))
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        // .pipe(gzip())
        .pipe(gulp.dest(jsDest))
         .pipe( livereload( server ));
});

gulp.task('devjs', function() {
    return gulp.src(jsFiles)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDest))
        // .pipe(rename('scripts.min.js'))
        // .pipe(uglify())
        // .pipe(gulp.dest(jsDest))
         .pipe( livereload( server ));
});
gulp.task('build', function(){

})
// gulp.task('js', function() {
//  return gulp.src('src/assets/js/*.js')
//    .pipe( gulp.dest('dist/assets/scripts/'))
//    .pipe( livereload( server ));
// });
var dist = {
  all: ['dist/**/*'],
  css: 'dist/assets/css/',
  js: 'dist/assets/bower/',
  vendor: 'dist/vendor/'
}
gulp.task('bower2', function() {
  var srcs = [
        'bower_components/angular/angular.js',
      'dist/bower_components/angular-ui-router/release/angular-ui-router.min.js',
      'bower_components/angular-animate/angular-animate.min.js',
      'dist/bower_components/angular-ui-router.stateHelper/statehelper.min.js',
      'dist/bower_components/angular-resource/angular-resource.min.js',

      'dist/bower_components/re-tree/re-tree.js',
      'dist/bower_components/jquery/dist/jquery.min.js',
      'dist/bower_components/angular-sanitize/angular-sanitize.min.js',
      'dist/bower_components/angular-cookies/angular-cookies.min.js',
      'bower_components/json-formatter/dist/json-formatter.min.js',


      'dist/bower_components/moment/moment.js',
      'bower_components/angular-aria/angular-aria.min.js',
      'bower_components/angular-messages/angular-messages.min.js',
      'dist/bower_components/ngtouch/src/ngTouch.js',
      'dist/bower_components/angular-touch/angular-touch.min.js',
      'dist/bower_components/firebase/firebase.js',

      'dist/bower_components/scroll-trigger/dist/scroll-trigger.js',
      'dist/bower_components/angular-translate/angular-translate.min.js',
      'dist/bower_components/angular-translate-handler-log/angular-translate-handler-log.min.js',
      'dist/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
      'dist/bower_components/angular-translate-loader-partial/angular-translate-loader-partial.min.js',




      'dist/bower_components/ngSanitize/index.js',
      'dist/bower_components/angular-simple-logger/dist/angular-simple-logger.js',
      'dist/bower_components/lodash/lodash.min.js',
      // 'dist/bower_components/markerclustererplus/src/markerclusterer.js',
      // 'dist/bower_components/google-maps-utility-library-v3-markerwithlabel/dist/markerwithlabel.js',
      // 'dist/bower_components/google-maps-utility-library-v3-infobox/dist/infobox.js',
      // 'dist/bower_components/google-maps-utility-library-v3-keydragzoom/dist/keydragzoom.js',
      // 'dist/bower_components/js-rich-marker/src/richmarker.js',
      'dist/bower_components/moment-timezone/builds/moment-timezone-with-data-2010-2020.js',


      'dist/bower_components/waypoints/waypoints.js',
      'dist/bower_components/SHA-1/sha1.js',

      'dist/bower_components/ng-idle/angular-idle.js',

      'bower_components/angular-material/angular-material.min.js',
      'dist/bower_components/angularfire/dist/angularfire.min.js'

    ]
  return gulp.src(srcs)
    .pipe(concat('bower.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dist.js))
    // .pipe(jsFilter.restore())

    .pipe(gulp.dest(dist.vendor))
})
gulp.task('bower', function() {
 return gulp.src(mainBowerFiles(), { base: './bower_components' })
        // .pipe(concat('bowercc.js'))
        // .pipe( gulp.dest('dist/bower_components/'))
        // .pipe(rename('bowercc.min.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('dist/bower_components/'))
         .pipe( livereload( server ));;
});
gulp.task('images', function() {
 return gulp.src('src/assets/images/*.*')
   .pipe( gulp.dest('dist/assets/images/'))

});
gulp.task('fonts', function() {
 return gulp.src('src/assets/fonts/*.*')
   .pipe( gulp.dest('dist/assets/fonts/'))

});
gulp.task('translations', function() {
 return gulp.src('src/assets/translations/*.*')
   .pipe( gulp.dest('dist/assets/translations/'))

});
gulp.task('ng-cart', function() {
 return gulp.src('bower_components/ngCart/template')
   .pipe( gulp.dest('dist/templates/'))

});
// gulp.task('data', function() {
// return gulp.src('src/assets/data/*.*')
//   .pipe( gulp.dest('dist/assets/data/'))

// });

gulp.task('index', function() {
 return gulp.src('./index.jade')
   .pipe(jade({
     pretty: true
   }))
   .pipe(gulp.dest('dist/'))
   .pipe( livereload( server ));
});
gulp.task('templates', function() {
 return gulp.src('src/templates/**/*.jade')
   .pipe(jade({
     pretty: true
   }))
   .pipe(gulp.dest('dist/templates'))
   .pipe( livereload( server ));
});
gulp.task('zatemplates', function() {
 return gulp.src('src/templates/za/**/*.jade')
   .pipe(jade({
     pretty: true
   }))
   .pipe(gulp.dest('dist/templates/za'))
   .pipe( livereload( server ));
});
gulp.task('bowersrc', function () {
	bowerSrc()
		.pipe(gulp.dest('dist/'));
});
// gulp.task('injectBower', function () {
//   var target = gulp.src('./dist/index.html');
//
//   // It's not necessary to read the files (will speed up things), we're only after their paths:
//   var sources = gulp.src(mainBowerFiles(/* options */), { base: './bower_components' });
//
//   return target.pipe(inject(sources))
//     .pipe(gulp.dest('./dist'));
// })
gulp.task('inject', function () {
  // var target = gulp.src('./dist/index.html');
  // var bower = , )
  // // It's not necessary to read the files (will speed up things), we're only after their paths:
  // var sources = gulp.src(['./src/**/*.js', (mainBowerFiles(/* options */)], {read: false}, { base: './bower_components' });
  //, { base: './bower_components' }
  // return target.pipe(inject(sources))
  //   .pipe(gulp.dest('./dist'));
   // var bowerStream = gulp.src(mainBowerFiles(),{ base: './bower_components' })
  var bowerStream = gulp.src(['./dist/lib/*.gz'], {read: false})

    // .pipe(concat('bowercc.js'))
    .pipe(gulp.dest('./lib'));

  // Concatenate AND minify app sources './dist/assets/stylesheets/*.css',
  var cssStream = gulp.src([ './dist/assets/stylesheets/*.min.css'], {read: false})
    .pipe(gulp.dest('./assets/stylesheets'));

  var jsStream = gulp.src(['./dist/assets/scripts/*.js']).pipe(angularFilesort())
    // .pipe(concat('app.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('./assets/scripts'));

  var appStream = es.merge(jsStream, cssStream);

  gulp.src('./dist/index.html')
    .pipe(inject(series(bowerStream, appStream)))
    .pipe(gulp.dest('./dist'));
})


gulp.task('express', function() {
 app.use(express.static(path.resolve('./dist')));
 app.listen(1337);
 gutil.log('Listening on port: 1337');
});



gulp.task('watch', function () {
 server.listen(35729, function (err) {
   if (err) {
     return console.log(err);
   }

   gulp.watch('src/assets/stylesheets/*.scss',['css']);

   gulp.watch('src/assets/js/*.js',['devjs', 'js']);

    gulp.watch('src/assets/translations/*.json',['translations']);

   gulp.watch('src/assets/images/*.*',['images']);

   gulp.watch('src/templates/**/*.jade',['templates']);
    gulp.watch('src/templates/za/**/*.jade',['zatemplates']);

   gulp.watch('index.jade',['index', 'inject']);

 });
});
gulp.task( 'copy-bower-dep', function() {

  // Replace files by their minified version when possible
  var bowerWithMin = mainBowerFiles().map( function(path, index, arr) {
    var newPath = path.replace(/.([^.]+)$/g, '.min.$1');
    return exists( newPath ) ? newPath : path;
  });

  // Copy them to another directory
  gulp.src( bowerWithMin ).pipe(gzip()).pipe( gulp.dest( './dist/lib' ));
});
gulp.task('build', ['js','css','templates', 'fonts','images', 'bower', 'index','inject']);

gulp.task('deploy', ['build'], () => {
  // create a new publisher
  const publisher = $.awspublish.create({
    key: "AKIAIUWUZNFM44IATSWQ",
    region: "eu-west-1",
    secret: "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",

    bucket: 'test.tktr.es'
  });

  // define custom headers
  const headers = {
    'Cache-Control': 'max-age=315360000, no-transform, public'
  };

  return gulp.src('./dist/**/*.*')
    .pipe(publisher.publish(headers))
    .pipe(publisher.sync())
    .pipe(publisher.cache())
    .pipe($.awspublish.reporter());
});
// Default Task
gulp.task('dev', ['devjs',  'css', 'translations', 'templates', 'fonts','images','express','watch']);
