module.exports = (grunt) ->

  require('load-grunt-tasks')(grunt);

  grunt.initConfig

    pkg: grunt.file.readJSON('package.json')

    constants:
      js_files: [
        'build/background.js'
      ]

    clean:
      build: ['build']

    coffee:
      glob_to_multiple:
        expand: true
        cwd:    'coffeescript'
        src:    ['**/*.coffee']
        dest:   'build'
        ext:    '.js'
      options:
        bare: true

    copy:
      main:
        files: [
          src: [
            'bower_components/jquery/jquery.min.js'
            'bower_components/moment/min/moment.min.js'
            'bower_components/underscore/underscore-min.js'
          ]
          dest:   'build/'
          filter: 'isFile'
          expand:  true
          flatten: true
        ]

    concat:
      options:
        separator: ';\n'
      alljs:
        src: [
          'build/jquery.min.js'
          'build/moment.min.js'
          'build/underscore-min.js'
          '<%= constants.js_files %>'
        ]
        dest: 'build/all.js'

    watch:
      coffee:
        files: ['coffeescript/**/*.coffee']
        tasks: ['default']

  grunt.registerTask 'default', ['clean', 'copy', 'coffee', 'concat']
