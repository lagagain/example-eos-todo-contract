import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import $ from "jquery";
import 'bootstrap';
//import Vue from 'vue';
// import ScatterJS from '@scatterjs/core';
// import ScatterEOS from '@scatterjs/eosjs';

import config from './config.js';
//let config = require("./config.js")

let app = new Vue({
  el:'#todo_app',
  data:{
    tasks:[
      {id:1, task:"Example 1", status:"DONE"},
      {id:2, task:"Example 2", status:"DONE"},
      {id:3, task:"Example 3", status:"DONE"},
    ]
  }
});

ScatterJS.plugins( new ScatterEOS() );
const network = ScatterJS.Network.fromJson(config.config.network);


function connect(){
  ScatterJS.connect('todoapp', {network}).then(connected => {
    if(!connected)
      return false;
  });
}


function login(){
  if(! ScatterJS.login){
      ScatterJS.login({accounts:[network]}).then(()=>{console.log("Login");});
  }
}

$('#login').click((e)=>{
  login();
});

$('#connect').click((e)=>{
  connect();
});



//console.debug(config);
