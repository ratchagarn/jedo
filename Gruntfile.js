module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * Jedo version <%= pkg.version %>\n' +
            ' * Copyright 2014-Preset <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license %>\n' +
            ' */\n',
    banner_dist: '\n/*!' +
                 '  Underscore.js templates as a standalone implementation.\n' +
                 '  JavaScript micro-templating, similar to John Resig\'s implementation.\n' +
                 '  Underscore templates documentation: http://documentcloud.github.com/underscore/#template\n' +
                 '  Modifyed by marlun78\n' +
                 '*/\n',


    /**
     * ------------------------------------------------------------
     * Clean
     * ------------------------------------------------------------
     */
    

    clean: {
      dist: 'dist'
    },


    /**
     * ------------------------------------------------------------
     * JSHint (http://www.jshint.com/docs/options)
     * ------------------------------------------------------------
     */

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      grunt: 'Gruntfile.js',
      src: 'src/**/*.js'
    },


    /**
     * ------------------------------------------------------------
     * Concat
     * ------------------------------------------------------------
     */

    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      dist: {
        src: ['src/tmpl.js', 'src/jedo.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },


    /**
     * ------------------------------------------------------------
     * Watch
     * ------------------------------------------------------------
     */
    
    watch: {
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src:newer', 'concat']
      }
    },


    /**
     * ------------------------------------------------------------
     * Uglify
     * ------------------------------------------------------------
     */
    

    uglify: {
      options: {
        banner: '<%= banner + banner_dist %>',
        sourceMap: false
      },
      dist: {
        files: {
          'dist/jedo.min.js': ['dist/jedo.js']
        }
      }
    }


  });


  // https://github.com/gruntjs/grunt-contrib-clean
  grunt.loadNpmTasks('grunt-contrib-clean');

  // https://github.com/gruntjs/grunt-contrib-concat
  grunt.loadNpmTasks('grunt-contrib-concat');

  // https://github.com/tschaub/grunt-newer
  grunt.loadNpmTasks('grunt-newer');

  // https://github.com/gruntjs/grunt-contrib-watch
  grunt.loadNpmTasks('grunt-contrib-watch');

  // https://github.com/gruntjs/grunt-contrib-jshint
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // https://github.com/gruntjs/grunt-contrib-uglify
  grunt.loadNpmTasks('grunt-contrib-uglify');



  grunt.registerTask('default', ['jshint']);

  grunt.registerTask('dev', ['default', 'watch']);

  grunt.registerTask('dist', ['clean', 'default', 'concat', 'uglify']);

};