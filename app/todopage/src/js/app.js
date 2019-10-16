import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import $ from "jquery";
import 'bootstrap';
//import Vue from 'vue';

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


//console.debug(config);
