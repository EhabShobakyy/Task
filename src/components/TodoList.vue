<template>
  <div :class="['todo-list', columnStyleClass]">
    <!-- Search Bar -->
    <v-col cols="12">
      <v-text-field
        v-model="search"
        @input="emitSearch"
        append-icon="mdi-magnify"
        label="Search Tasks"
        single-line
        hide-details
        clearable
        class="search"
      ></v-text-field>
    </v-col>

    <div :class="['title', titleStyleClass]">
      {{ formattedTitle }}
    </div>
    
    <slot></slot>
  </div>
</template>


<script>
export default {
  name: 'TodoList',
  props: ['title'],
  data() {
    return {
      search: ''
    };
  },
  computed: {
    columnStyleClass() {
      switch (this.title) {
        case 'todo':
          return 'todo';
        case 'inProgress':
          return 'in-progress';
        case 'inReview':
          return 'in-review';
        case 'done':
          return 'done';
        default:
          return 'default';
      }
    },
    titleStyleClass() {
      return `${this.columnStyleClass}-title`; // Constructs title class name based on column style
    },
    formattedTitle() {
      switch (this.title) {
        case 'todo':
          return 'To Do';
        case 'inProgress':
          return 'In Progress';
        case 'inReview':
          return 'In Review';
        case 'done':
          return 'Done';
        default:
          return this.title;
      }
    }
  },
  methods: {
    emitSearch() {
      this.$emit('search', this.search);
    },
  },
};
</script>


<style scoped lang="scss">
.todo-list {
  padding: 10px 20px;
  margin: 0px 10px;
  border: 1px solid #eee;
  font-family: sans-serif;
  width: 300px;

  &.todo,
  &.in-progress,
  &.in-review,
  &.done,
  &.default {
    background-color: #f6f6f6;
    border-radius: 15px;
    border-width: 3px;
  }
  &.todo {
    border-color: #00b8da;
  }

  &.in-progress {
    border-color: #d3d5d8;
  }

  &.in-review {
    border-color: #ffa904;
  }

  &.done {
    border-color: #56d9a3;
  }

  &.default {
    border-color: #2f9b3370;
  }
}

.todo-title {
  color: #00B8DA;
}
.in-progress-title {
  color: #4d4d4d69;
}
.in-review-title {
  color: #FFA904;
}
.done-title {
  color: #56D9A3;
}
.default-title {
  color: #2f9b3370;
}

.title {
  padding: 10px;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
  text-align: center;
  border-bottom: 1px solid #EEE;
  border-radius: 15px;
}


.search {
  background-color: white !important;
  padding: 10px;
  border-radius: 10px;
}
</style>
