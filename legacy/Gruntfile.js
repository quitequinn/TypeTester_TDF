module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

    sass: {
      src: {
        options: {
          lineNumbers: true
        },
        files: {
          "src/css/style.css": "src/sass/style.scss",
        }
      }
    },
    autoprefixer: {
      src: {
        files: {
          'build/css/style.css': 'src/css/style.css'
        }
      }
    },
    copy: {
      main: {
        files: [{
            expand: true,
            cwd: 'src/js/',
            src: ['**/*.js'],
            dest: 'build/js'},
        ]
      }
    },
    notify_hooks: {
      options: {
        enabled: true,
        max_jshint_notifications: 5, // maximum number of notifications from jshint output
        success: true, // whether successful grunt executions should be notified automatically
        duration: 1 // the duration of notification in seconds, for `notify-send only
      }
    },
    watch: {
      sass: {
        files: ["src/sass/**/*.scss"],
        tasks: ["sass"]
      },
      autoprefixer: {
        files: ['src/css/style.css'],
        tasks: ['autoprefixer']
      },
      // uglify: {
      //   files: ['wp-content/themes/SBKH/src/js/*.js'],
      //   tasks: ['uglify']
      // },
      copy:{
        files: ["src/js/**/*.js"],
        tasks: ["copy"]
      }
    }
  });

  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-newer');
  // grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.task.run('notify_hooks');
  grunt.registerTask('default', ['sass', 'autoprefixer', 'copy']);

};