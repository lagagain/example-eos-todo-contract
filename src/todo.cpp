#include <todo.hpp>

ACTION todo::create(name owner, string task){
  require_auth(owner);

  tasks_table tasks(_self, _self.value);
  auto id = tasks.available_primary_key();

  tasks.emplace(owner, [&](auto& new_task) {
    new_task.id  = id;
    new_task.task = task;
    new_task.owner = owner;
    new_task.status = "TODO";
  });

  eosio::print("task#", id, " created");
}

ACTION todo::update(uint64_t id, string new_status){
  tasks_table tasks(_self, _self.value);

  auto task_lookup = tasks.find(id);

  eosio::check(task_lookup != tasks.end(), "Todo does not exist");
  //eosio::internal_use_do_not_use::eosio_assert(task_lookup != tasks.end(), "Todo does not exist");
  
  name owner = task_lookup->owner;
  require_auth(owner);

  tasks.modify(task_lookup, eosio::same_payer, [&](auto& row) {
    row.status = new_status;
  });

  eosio::print("todo#", id, " marked as complete");
}

ACTION todo::remove(uint64_t id){
  tasks_table tasks(_self, _self.value);

  auto todo_lookup = tasks.find(id);
  tasks.erase(todo_lookup);

  eosio::print("todo#", id, " destroyed");
}

//EOSIO_DISPATCH(todo, (new_task)(update_task)(delete_task))
