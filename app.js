var browserSync = require('browser-sync');
browserSync({
  server: "app",
  files: ["app/*.html", "app/css/*.css", "app/js/*.js", "app/api/*.json", "app/style/*.css"]
});