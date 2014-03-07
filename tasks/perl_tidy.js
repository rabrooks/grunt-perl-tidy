/*
 * grunt-perl-tidy
 * https://github.com/rabrooks/grunt-perl-tidy
 *
 * Copyright (c) 2014 Aaron Brooks
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {


  var path = require('path');
  var exec = require('child_process').exec;

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('perl_tidy', 'Run perl tidy on perl files.', function() {

// Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      cuddleElse: false,
      bracketsLeft: false,
      parensAlign: false, 
      indentation: 4,
      continuation: 2,
      tabs: false,
      formatInPlace: false,

    });

    grunt.verbose.writeflags(options, 'Options');

    this.files.forEach(function(filePair) {
      var isExpandedPair = filePair.orig.expand || false;

      filePair.src.forEach(function(srcFile) {
        try {

          if (grunt.file.isDir(srcFile)) {
            return;
          }

          var regex = new RegExp(escapeRegExp(path.basename(srcFile)) + "$");
          
          var cmd = 'perltidy ';
          
          if (options.formatInPlace === true) {
            cmd += '-b ';
          } 
          if (options.cuddleElse === true) {
            cmd += '-ce ';
          } 
          if (options.bracketsLeft === true) {
            cmd += '-bl ';
          } 
          if (options.tabs === true) {
            cmd += '-et=' + options.indentation + ' ';
          }
          if (options.indentation) {
            cmd += '-i='  + options.indentation + ' ';
          }


          cmd += srcFile;
          if (options.debug === true) {
            grunt.log.writeln(cmd);
          }

          grunt.verbose.writeln('Exec: ' + cmd);

          // Execute command.
          exec(cmd, function( err, stdout, stderr) {
            if (stdout) {
              grunt.log.write(stdout);
            }

            if (err) {
              grunt.fatal(err);
            }
          });

        } catch(err) {
          grunt.log.error(err);
          grunt.fail.warn('Perl Tidy has failed.');
        }
      });
    });

    grunt.log.writeln(' Perltidy has finished.');
  }); // end of rgisterMultiTask


  var escapeRegExp = function(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };

};
