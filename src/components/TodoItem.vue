<template>
  <v-col>
    <v-card class="pa-3 todo-item">
      <v-card-title>{{ item.taskName }}</v-card-title>
      <v-card-text>
        <v-list-item-content>
          <v-list-item-title>{{ item.taskTitle }}</v-list-item-title>
          <v-list-item-subtitle>
            <span style="font-weight: 600;">Priority:</span>
            <span :class="priorityClass" style="font-weight: bold;">
              {{ item.taskPriority }}
            </span>
            | Due: {{ item.taskDate }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-card-text>
      <v-list-item-action>
        <div>
          <v-icon @click="$emit('delete')" class="delete-icon">
            mdi-delete
          </v-icon>

          <v-icon @click="$emit('edit')" class="edit-icon">
            mdi-pencil
          </v-icon>
        </div>
      </v-list-item-action>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: 'todoItem',
  props: ['item'],
  computed: {
    priorityClass() {
      // Dynamic class based on task priority
      if (this.item.taskPriority === 'High') return 'high-priority';
      if (this.item.taskPriority === 'Low') return 'low-priority';
      if (this.item.taskPriority === 'Medium') return 'medium-priority';
      return '';
    },
  },
  watch: {
  }
};
</script>

<style scoped>
/* Add the color styling based on the task priority */
.high-priority {
  color: red;
}

.low-priority {
  color: #14a614;
}

.medium-priority {
  color: orange;
}

.todo-item:hover {
  cursor: move;
}

.delete-icon {
  color: red !important;
  margin-right: 8px;
}

.edit-icon {
  color: green !important;
}
</style>
