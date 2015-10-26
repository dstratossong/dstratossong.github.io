module.exports = function(grunt) {

  // Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        files: {
          'stylesheets/style.css': 'stylesheets/sass/main.scss'
        }
      }
    },
    watch: {
      css: {
        files: 'stylesheets/sass/*.scss',
        tasks: ['sass']
      }
    }
  });

  // Load
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Register
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('compile', ['sass']);

};
