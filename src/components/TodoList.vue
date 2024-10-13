<template>
  <div class="todo-list" :style="columnStyle">
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

    <div class="title">
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
    // Dynamically compute the background color based on the title
    columnStyle() {
      let backgroundColor = '';

      switch (this.title) {
        case 'todo':
          backgroundColor = '#e0f7fa'; 
          break;
        case 'inProgress':
          backgroundColor = '#80808069';
          break;
        case 'inReview':
          backgroundColor = '#fff9c4'; 
          break;
        case 'done':
          backgroundColor = '#c8e6c9'; 
          break;
        default:
          backgroundColor = '#2f9b3370'; 
          break;
      }

      return {
        backgroundColor,
      };
    },
    // Optional: Format the title for display
    formattedTitle() {
      switch(this.title) {
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

<style scoped>
.todo-list {
    padding: 10px 20px ;
    margin: 0px 10px;
    border: 1px solid #EEE;
    font-family: sans-serif;
    width: 300px;
}
.title {
    padding: 10px ;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 10px;
    text-align: center;
    border-bottom: 1px solid #EEE;
}
.search {
  background-color: white !important;
  padding: 10px;
  border-radius: 10px;
}
</style>