import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import $ from "jquery";
import 'bootstrap';
//import Vue from 'vue';
import ScatterJS from '@scatterjs/core';
import ScatterEOS from '@scatterjs/eosjs';
import {JsonRpc, Api} from 'eosjs';

import config from './config.js';
//let config = require("./config.js")

let app = new Vue({
  el:'#todo_app',
  data:{
    tasks:[
      {id:1, task:"Example 1", status:"DONE"},
      {id:2, task:"Example 2", status:"DONE"},
      {id:3, task:"Example 3", status:"DONE"},
    ],
    account:"",
  }
});
ScatterJS.plugins( new ScatterEOS() );
const network = ScatterJS.Network.fromJson(config.config.network);
const rpc = new JsonRpc(network.fullhost());
const api = new Api({ rpc, signatureProvider:ScatterJS.scatter.eos});

function connect(){
  ScatterJS.connect('todoapp', {network}).then(connected => {
    if(!connected)
      return false;
  });
}

function login(){
  let login = ScatterJS.login();
  login.then((success)=>{
    console.log("Login Success");
    app.account = success.accounts[0];
  },(fail)=>{
    console.log("Login Fail");
  });
}

function logout(){
  ScatterJS.logout().then((e)=>{
    console.log("Logout");
    app.account="";
  });
}

$('#login').click(login);

$('#connect').click(connect);

$('#logout').click(logout);


//console.debug(config);
