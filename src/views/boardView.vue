<!-- src/views/BoardView.vue -->
<template>
  <div class="app">
    <v-container>
      <v-row>
        <!-- Task Counts Table -->
        <v-col cols="12" md="12">
          <v-expansion-panels>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <v-card-title>
        Task Overview
        <!-- Add Task Button -->
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openDialog" class="add-Task">Add Task</v-btn>
      </v-card-title>
    </v-expansion-panel-header>

    <v-expansion-panel-content>
      <v-data-table
        :headers="headers"
        :items="taskCounts"
        :disable-pagination="true"
        class="elevation-1"
        item-class="stateClass"
        hide-default-footer
      >
        <!-- State Column -->
        <template v-slot:item[`state`]="{ item }">
          <span :class="`state-${item.key}`">{{ item.state }}</span>
        </template>

        <!-- High Priority Column -->
        <template v-slot:item[`high`]="{ item }">
          <span class="priority-high">{{ item.high }}</span>
        </template>

        <!-- Medium Priority Column -->
        <template v-slot:item[`medium`]="{ item }">
          <span class="priority-medium">{{ item.medium }}</span>
        </template>

        <!-- Low Priority Column -->
        <template v-slot:item[`low`]="{ item }">
          <span class="priority-low">{{ item.low }}</span>
        </template>

        <!-- Total Column -->
        <template v-slot:item[`count`]="{ item }">
          {{ item.count }}
        </template>
      </v-data-table>
    </v-expansion-panel-content>
  </v-expansion-panel>
</v-expansion-panels>

        </v-col>

        <!-- Task Columns -->
        <v-col cols="12" class="todo-column">
          <!-- Loop through the task columns dynamically -->
          <div v-for="(tasks, status) in filteredTaskColumns" :key="status">
            <todo-list 
              :title="status" 
              @search="(term) => handleSearch(status, term)"
            >
              <draggable 
                :list="tasks" 
                group="tasks" 
                ghostClass="on-drag" 
                @end="onTaskMove($event, status)"
              >
                <todo-item 
                  v-for="task in tasks" 
                  :key="task.id" 
                  :item="task" 
                  @delete="deleteItem(task, status)" 
                  @edit="editItem(task, status)"
                />
              </draggable>
            </todo-list>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- v-dialog for Task Form -->
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">{{ selectedTask ? 'Edit Task' : 'Add Task' }}</span>
        </v-card-title>
        <v-card-text>
          <TaskForm
            :task="selectedTask"
            @submitTask="handleSubmit"
            @editTask="handleSubmit"
            @cancelEvent ='cancelEvent'
            :key="formRender"
          />
        </v-card-text>
       
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import TaskForm from '../components/TaskForm.vue';
import draggable from 'vuedraggable';
import TodoItem from '../components/TodoItem.vue';
import TodoList from '../components/TodoList.vue';

export default {
  name: 'BoardView',
  components: {
    TaskForm,
    draggable,
    TodoList,
    TodoItem
  },
  computed: {
    ...mapState(['tasks']),

    // Compute filtered task columns based on search terms
    filteredTaskColumns() {
      const filtered = {};
      for (const [status, tasks] of Object.entries(this.taskColumns)) {
        const searchTerm = this.searchTerms[status].toLowerCase();
        if (searchTerm) {
          filtered[status] = tasks.filter(task => 
            task.taskName.toLowerCase().includes(searchTerm) ||
            task.taskTitle.toLowerCase().includes(searchTerm)
          );
        } else {
          filtered[status] = tasks;
        }
      }
      return filtered;
    },

    taskColumns() {
      return {
        "todo": this.tasks.todo,
        "inProgress": this.tasks.inProgress,
        "inReview": this.tasks.inReview,
        "done": this.tasks.done
      };
    },

    // New computed property for task counts with priorities
    taskCounts() {
      const states = ['todo', 'inProgress', 'inReview', 'done'];
      return states.map(state => {
        const tasks = this.tasks[state];
        const high = tasks.filter(task => task.taskPriority === 'High').length;
        const medium = tasks.filter(task => task.taskPriority === 'Medium').length;
        const low = tasks.filter(task => task.taskPriority === 'Low').length;
        const total = tasks.length;
        return {
          state: this.getStateName(state),
          high,
          medium,
          low,
          count: total,
          key: state
        };
      });
    },
  },
  data() {
    return {
      selectedTask: null, // Initialize as null to indicate no task is selected for editing
      selectedColumn: '', // Initialize selectedColumn
      dialog: false, // Controls the visibility of the dialog
      formRender: 1, // Used to force re-render TaskForm
      // Initialize search terms for each column
      searchTerms: {
        todo: '',
        inProgress: '',
        inReview: '',
        done: ''
      },
      // Table headers
      headers: [
        { text: 'State', value: 'state' },
        { text: 'High', value: 'high' },
        { text: 'Medium', value: 'medium' },
        { text: 'Low', value: 'low' },
        { text: 'Total', value: 'count' },
      ],
    }
  },
  methods: {
    ...mapActions(['addTask', 'updateItem', 'deleteTask', 'loadTasks','moveTask']),

    // Method to assign classes based on task state
    stateClass(item) {
      return `state-${item.key}`;
    },

    // Helper to convert state keys to display names
    getStateName(stateKey) {
      const mapping = {
        todo: 'To Do',
        inProgress: 'In Progress',
        inReview: 'In Review',
        done: 'Done'
      };
      return mapping[stateKey] || stateKey;
    },

    // Delete Task
    deleteItem(task, column) {
      this.deleteTask({ task, column });
    },

    // Edit Task
    editItem(task, column) {    
      console.log("Editing task:", task);
      this.selectedTask = { ...task }; // Keep task details
      this.selectedColumn = column;    // Set the selected column
      this.dialog = true;              // Open dialog for editing
    },

    // Handle Submit from TaskForm
    handleSubmit(taskDetails) {
      if (this.selectedTask) {
        // Editing an existing task
        this.editTask(taskDetails);
        this.selectedTask = null;
        this.formRender++;
      } else {
        // Adding a new task
        this.addTask({ ...taskDetails, column: 'todo' });
        this.selectedTask = null;
      }
      // Removed this.closeDialog(); to keep the dialog open
    },

    // Update Task
    editTask(updatedTask) {
      console.log("Updating task:", updatedTask);
      // Use selectedColumn instead of selectedTask.column
      this.updateItem({
        ...updatedTask,
        column: this.selectedColumn // Ensure correct column is used
      });
      console.log("Task updated successfully.");
      // Removed this.closeDialog(); to keep the dialog open
    },

    // Open Dialog for Adding Task
    openDialog() {
      this.selectedTask = null; // Clear any selected task
      this.selectedColumn = ''; // Clear selectedColumn 
      this.dialog = true;
    },
    cancelEvent() {
       this.selectedTask = null; // Clear any selected task
      this.selectedColumn = ''; // Clear selectedColumn 
      this.dialog = false;
      this.formRender++;
    },

    // Handle task movement between columns
    onTaskMove() {
      // Handle the task movement logic here if needed
      this.moveTask();
    },

    // Handle search input from TodoList components
    handleSearch(status, term) {
      this.$set(this.searchTerms, status, term);
    },
  },
  mounted() {
    this.loadTasks();
  },
};
</script>

<style scoped>
.app {
  display: flex;
  justify-content: space-between;
  font-family: sans-serif;
  margin: 10px 0px;
  gap: 20px;
}

.todo-column {
  display: flex;
  justify-content: space-between;
  flex: 1;
}

.on-drag {
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.todo-list {
  min-height: 200px;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* State Row Colors */
.state-todo {
  background-color: #e0f7fa; 
}

.state-inProgress {
  background-color: #80808069;
}

.state-inReview {
  background-color: #fff9c4; 
}

.state-done {
  background-color: #c8e6c9; 
}

.state-todo, .state-inProgress, .state-inReview, .state-done {
  font-weight: bold;
}

/* Priority Cell Colors */
.priority-high {
  background-color: #ffcccc; /* Light red */
  color: #b71c1c; /* Dark red */
  padding: 4px 8px;
  border-radius: 4px;
}

.priority-medium {
  background-color: #fff9c4; /* Light yellow */
  color: #f57f17; /* Dark yellow */
  padding: 4px 8px;
  border-radius: 4px;
}

.priority-low {
  background-color: #c8e6c9; /* Light green */
  color: #1b5e20; /* Dark green */
  padding: 4px 8px;
  border-radius: 4px;
}
.add-Task {
  background-color: #14a614 !important;
  color: white !important;
}
</style>
