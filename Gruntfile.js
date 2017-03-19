const fs = require('fs'),
  childProcess = require('child_process'),
  stream = require('stream');

module.exports = function(grunt) {

    grunt.registerTask('testrpc', function() {

        const done = this.async(),
          accounts = grunt.file.readJSON('./config/params.json').accounts,
          args = ['-b','1'];

        Object.keys(accounts).forEach(key => {
          args.push('--account', '0x'+accounts[key].key+','+accounts[key].amount);
        });

        const testrpc = child = childProcess.spawn('testrpc', args, {
            stdio: 'inherit', //[null, process.stdout, process.stderr]
          });
    });
};
