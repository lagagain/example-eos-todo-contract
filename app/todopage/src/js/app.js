import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import $ from "jquery";
import 'bootstrap';
//import Vue from 'vue';
//import ScatterJS from '@scatterjs/core';
//import ScatterEOS from '@scatterjs/eosjs';
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
    task_index:0,
    task_show_limit:50,
    task_more: true,
    new_task: "",
  }
});
ScatterJS.plugins( new ScatterEOS() );
const network = ScatterJS.Network.fromJson(config.config.network);
const rpc = new JsonRpc(network.fullhost());
const api = new Api({ rpc, signatureProvider:ScatterJS.scatter.eos, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
const eos = ScatterJS.scatter.eos(network, Api, {rpc});

async function connect(){
  await ScatterJS.connect('todoapp', {network}).then(connected => {
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

function getTasks(){
  // https://eosio.github.io/eosjs/latest/classes/json_rpc.jsonrpc/#get_table_rows
  rpc.get_table_rows({
    code: config.config.dapp,
    lower_bound: app.task_index,
    limit: app.task_show_limit,
    table: 'tasks',
    scope: config.config.dapp,
  }).then(result=>{
    console.group("Tasks");
    console.debug("The Resulte:");
    console.table(result);
    console.debug("tasks:");
    console.table(result.rows);
    app.tasks = result.rows;
    app.task_more = result.more,
    console.groupEnd();
  });
}

// https://eosio.github.io/eosjs/latest/#sending-a-transaction
async function createTask(task_content){
  let account = await ScatterJS.login();
  let permission = account.accounts[0].authority;
  account = account.accounts[0].name;

  let result = await eos.transact({
    actions: [{
      account: config.config.dapp,
      name: 'create',
      authorization: [{
        actor: account,
        permission: permission,
      }],
      data: {
        owner: account,
        task: task_content
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
}

async function deleteTask(task_id){
  let account = await ScatterJS.login();
  let permission = account.accounts[0].authority;
  account = account.accounts[0].name;

  let result = await eos.transact({
    actions: [{
      account: config.config.dapp,
      name: 'remove',
      authorization: [{
        actor: account,
        permission: permission,
      }],
      data: {
        id: task_id,
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
}

async function completeTask(task_id){
  let account = await ScatterJS.login();
  let permission = account.accounts[0].authority;
  account = account.accounts[0].name;


  let result = await eos.transact({
    actions: [{
      account: config.config.dapp,
      name: 'update',
      authorization: [{
        actor: account,
        permission: permission,
      }],
      data: {
        id: task_id,
        new_status: "DONE",
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
}

$('#login').click(login);

$('#connect').click(connect);

$('#logout').click(logout);

$('#refresh').click(getTasks);

$('document').ready((d)=>{
  connect().then(login).then(getTasks);
});

$('.btn_complete').click(async e=>{
  console.group("Complete Task");
  let id = e.target.getAttribute('data-id');
  console.debug("complete task id: #",id);
  await completeTask(id);
  console.groupEnd();

  getTasks();
});

$('.btn_delete').click(async e=>{
  console.group("Delete Task");
  let id = e.target.getAttribute('data-id');
  console.debug("Delete task id: #",id);
  await deleteTask(id);
  console.groupEnd();

  getTasks();
});

$('#btn_create_task').click(async e=>{
  console.group("Create Task");
  let task_content = app.new_task;
  //console.debug("Create task id: #",id);
  await createTask(task_content);
  console.groupEnd();

  getTasks();
});

//console.debug(config);
