// src/store/index.js
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tasks: {
      todo: [],
      inProgress: [],
      inReview: [],
      done: [],
    },
  },
  mutations: {
    // Add a new task
    addTask(state, task) {
      const newTask = {
        ...task,
        id: task.id || Date.now(), // Ensure each task has a unique ID
      };
      state.tasks.todo.push(newTask);
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    },

    // Delete a task from the specified column
    deleteTask(state, { task, column }) {
      state.tasks[column] = state.tasks[column].filter((t) => t.id !== task.id);
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    },

    // Load tasks from localStorage
    loadTasks(state) {
      const tasksFromStorage = JSON.parse(localStorage.getItem("tasks")) || {
        todo: [],
        inProgress: [],
        inReview: [],
        done: [],
      };
      state.tasks = tasksFromStorage;
    },

    // Update a task's details
    updateItem(state, updatedTask) {
      const { id, column } = updatedTask;
      // Find the task in its current column
      let currentColumn = null;
      for (const [col, tasks] of Object.entries(state.tasks)) {
        if (tasks.find((t) => t.id === id)) {
          currentColumn = col;
          break;
        }
      }

      if (currentColumn) {
        // Remove the task from its current column
        state.tasks[currentColumn] = state.tasks[currentColumn].filter(
          (t) => t.id !== id
        );
      }

      // Add the task to the new column
      state.tasks[column].push(updatedTask);
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    },

    // Move Task Between Columns
    moveTask(state) {
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    },
  },
  actions: {
    addTask({ commit }, task) {
      commit("addTask", task);
    },
    updateItem({ commit }, payload) {
      commit("updateItem", payload);
    },
    deleteTask({ commit }, payload) {
      commit("deleteTask", payload);
    },
    loadTasks({ commit }) {
      commit("loadTasks");
    },
    moveTask({ commit }, payload) {
      commit("moveTask", payload);
    },
  },
});
