/* eslint-disable no-undef */
const todoList = () => {
    all = []
    const add = (todoItem) => {
      all.push(todoItem)
    }
    const markAsComplete = (index) => {
      all[index].completed = true
    }

    
 
    const overdue = () => {
      // Write the date check condition here and return the array
      // of overdue items accordingly.
      return all.filter(
        (todoitem) => todoitem.dueDate <new Date().toISOString().split("T")[0]
      )
    }
 
    const dueToday = () => {
          // of overdue items accordingly.
      return all.filter(
        (todoitem) => todoitem.dueDate === new Date().toISOString().split("T")[0]
      )
      // Write the date check condition here and return the array
      // of todo items that are due today accordingly.
    }
 
    const dueLater = () => {
          // of overdue items accordingly.
      return all.filter(
        (todoitem) => todoitem.dueDate > new Date().toISOString().split("T")[0]
      )
      // Write the date check condition here and return the array
      // of todo items that are due later accordingly.
    }
 
    const toDisplayableList = (list) => {
        return list.map((todoitem)=> toString(todoitem)).join("\n");
      // Format the To-Do list here, and return the output string
      // as per the format given above.
    }

    //define function for due2day
    due2day = (dueDate) => {
        const today = new Date().toISOString().split("T")[0];
        return (
            dueDate == today
        );
    }


    //convert string
    toString = (all) => {
        const dueDate = due2day(all.dueDate) ?"" :all.dueDate;
        const finish_not = all.completed ? "[x]" : "[ ]";
        return `${finish_not} ${all.title} ${dueDate}`;
    }
 
    return {
      all,
      add,
      markAsComplete,
      overdue,
      dueToday,
      dueLater,
      toDisplayableList
    };
  };
 
  module.exports = todoList;