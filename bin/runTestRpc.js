#!/usr/bin/env node
'use strict';

const spawn = require('child_process').spawn;

class TestRpc{

  constructor(){

    this.config;
    this.args = [];
  }

  loadConfig(){
    if(!this.config)
      this.config = require('../config/config');

    return this;
  }

  formatArgs(){
    if(!this.config) throw new Error('No config loaded');
    let ret = "";

    Object.keys(this.config.accounts).forEach(key => {
      this.args.push('--account="0x'+this.config.accounts[key].key+', '+this.config.accounts[key].amount+'"');
    });

    return this;
  }

  run(){
    let cmd = "testrpc "+this.args.join(' ');
    console.log('cmd: ', cmd);
    console.log('\n');
    console.log(this.args);
    return spawn("testrpc", [this.args.join(' ')]);
  }
}

const testRpc = new TestRpc()
  .loadConfig()
  .formatArgs()
  .run();

testRpc.stdout.on('data', function(data){
  console.log(data.toString());
});
testRpc.stderr.on('data', function(data){
  console.error(data.toString());
});
testRpc.on('exit', function(code){
  console.log('testrpc exited with code: ' + code.toString());
})
