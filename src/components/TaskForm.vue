<!-- src/components/TaskForm.vue -->
<template>
  <v-form @submit.prevent="submitTask">
    <v-btn color="grey" class="close-icon" text @click="closeDialog"><v-icon>mdi mdi-close-circle</v-icon></v-btn>
    <!-- Hidden ID Field -->
    <input type="hidden" v-if="taskDetails.id" v-model="taskDetails.id" />
    <input type="hidden" v-if="taskDetails.column" v-model="taskDetails.column" />

    <!-- Task Name -->
    <v-text-field
      label="Task Name"
      v-model="taskDetails.taskName"
      outlined
      required
    ></v-text-field>

    <!-- Task Title -->
    <v-text-field
      label="Task Title"
      v-model="taskDetails.taskTitle"
      outlined
      required
    ></v-text-field>

    <!-- Task Date -->
    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="taskDetails.taskDate"
          label="Task Date"
          readonly
          v-bind="attrs"
          v-on="on"
          outlined
          required
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="taskDetails.taskDate"
        @input="menu = false"
      ></v-date-picker>
    </v-menu>

    <!-- Task Priority -->
    <v-select
      v-model="taskDetails.taskPriority"
      :items="['Low', 'Medium', 'High']"
      label="Priority"
      outlined
      required
    ></v-select>

    <div class="d-flex">
      <v-btn type="submit" :class="handleButton ? 'update-task' : 'add-Task'">
        {{ handleButton ? 'Update Task' : 'Add Task' }}
      </v-btn>
      <!-- <v-btn v-if="handleButton" @click="resetForm" type="button" color="grey" class="reset-button">
        Reset
      </v-btn> -->
    </div>
  </v-form>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      default: () => ({
        id: null, // Ensure id is part of the task
        column: '', // Ensure column is part of the task
        taskName: '',
        taskTitle: '',
        taskDate: '',
        taskPriority: 'Medium', // Default priority
      }),
    },
  },
  data() {
    return {
      taskDetails: { ...this.task }, // Initialize with task prop or default empty task
      menu: false,
      handleButton: false,
    };
  },
  created () {
    console.log("handle button", this.handleButton);   
    console.log("this.taskDetails", this.taskDetails);
  Object.keys(this.taskDetails).length === 0 ? this.handleButton = false : this.handleButton = true;
    
    
     
  },
  watch: {
    // Watch for changes in the task prop and update form data accordingly
    task: {
      handler(newTask) {
        this.taskDetails = { ...newTask };
        this.handleButton = true;
        console.log("newTask",newTask);
        
      },
      deep: true,
    },
  },
  methods: {
    submitTask() {
      if (this.handleButton) {
        // Emit the update event if editing a task
        this.$emit('editTask', this.taskDetails);
      } else {
        // Otherwise, emit the add event to create a new task
        this.$emit('submitTask', this.taskDetails);
      }
      this.resetForm(); // Clear the form after submission
      this.$emit("cancelEvent")

    },
    resetForm() {
      // Reset the form back to empty/default values
      this.taskDetails = {
        id: null, // Reset id
        column: '', // Reset column
        taskName: '',
        taskTitle: '',
        taskDate: '',
        taskPriority: 'Medium', // You can set this to default if needed
      };
      this.handleButton = false; // Reset the handle button state
      this.menu = false; // Close date picker if it's open
    },
    
    // Close Dialog
    closeDialog() {
      console.log("cancel");
      this.resetForm();
      this.$emit("cancelEvent")
    },
  },
};
</script>

<style scoped>
.reset-button {
  background-color: red !important;
  color: white !important;
  font-weight: bold !important;
  margin-left: 16px;
}
.add-Task {
  background-color: #14a614 !important;
  color: white !important;
}
.close-icon {
  position: absolute;
    top: 13px;
    right: 0;
}
.update-task {
    background-color: #8487ff !important;
    color: white !important;
    font-weight: 600 !important;

}
</style>
