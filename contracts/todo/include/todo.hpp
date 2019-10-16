#include <eosio/eosio.hpp>

using namespace std;
using namespace eosio;

CONTRACT todo : public contract {
  public:
    using contract::contract;

/*
    ACTION create_list(name owner, string list_name);
    ACTION rename_list(name owner, uint64_t id, string new_name);
    ACTION delete_list(name owner, uint64_t id);

    ACTION new_task(uint64_t list_id, string tast_content);
    ACTION update_task(uint64_t list_id, string task_id, string new_status);
    ACTION delete_task(uint64_t , string task_id, string new_status);
*/

    ACTION create(name owner, string task);
    ACTION update(uint64_t id, string new_status);
    ACTION remove(uint64_t id);

  private:
    TABLE task {
      uint64_t id;
      name owner;
      string task;
      string status;
      auto primary_key() const { return id; }
    };
    typedef multi_index<"tasks"_n, task> tasks_table;
};
