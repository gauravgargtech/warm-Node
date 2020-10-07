module.exports = function (grunt) {
  grunt.initConfig({
    // define source files and their destinations
    uglify: {
      files: {
        src: "public/js/*.js", // source files mask
        dest: "public/jsm/", // destination folder
        expand: true, // allow dynamic building
        flatten: true, // remove all unnecessary nesting
        ext: ".min.js", // replace .js to .min.js
      },
    },
    cssmin: {
      minify: {
        files: [{
          expand: true,
          cwd: 'public/css/',
          src: ['*.css', '!*.min.css'],
          dest: 'public/cssm/',
          ext: '.css'
        }, {
          expand: true,
          cwd: 'public/css/',
          src: ['*.min.css'],
          dest: 'public/cssm/',
          ext: '.min.css'
        }]
      }
    },
    watch: {
      js: { files: "js/*.js", tasks: ["uglify"] },
      css: { files: "css/*.css", tasks: ["cssmin"] },
    },
  });

  // load plugins
  grunt.loadNpmTasks("grunt-contrib-watch");
  //grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-cssmin");

  // register at least this one task
  grunt.registerTask("default", ["cssmin"]);
};
