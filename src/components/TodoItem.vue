<template>
  <v-col>
    <v-card class="pa-3 todo-item">
      <v-card-title class="todo-item__title">
        <div class="todo-item__title__name">{{ item.taskName }}</div>
        <div >
          <v-icon @click="$emit('edit')" class="todo-item__title__edit-icon"> mdi mdi-dots-horizontal </v-icon>
        </div>
      
      </v-card-title>
      <v-card-text>
        <div>{{ item.taskTitle }}</div>
        <v-list-item-content>
          <v-list-item-subtitle>
            <div class="todo-item__info">
              <div :class="priorityClass" outlined small>
                {{ item.taskPriority }}
              </div>
              <span class="todo-item__info__date">{{ item.taskDate }}</span>
            </div>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-card-text>
      <div class="todo-item__actions">
        <v-icon @click="$emit('delete')" class="delete-icon">
          mdi mdi-delete-outline
        </v-icon>
      </div>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: "todoItem",
  props: ["item"],
  computed: {
    priorityClass() {
      // Dynamic class based on task priority
      if (this.item.taskPriority === "High") return "high-priority";
      if (this.item.taskPriority === "Low") return "low-priority";
      if (this.item.taskPriority === "Medium") return "medium-priority";
      return "";
    },
  },
  watch: {},
};
</script>

<style scoped lang="scss">
.todo-item {
  border-radius: 10px;
  padding-top: 5px;
  padding-bottom: 5px;

  &__title {
    display: flex;
    justify-content: space-between;
    &__name {
      font-size: 18px !important;
      font-weight: 500;
      color: rgb(106, 105, 105);
      padding-top: 6px !important;
    }
    &__edit-icon {
      color: rgb(140, 140, 140) !important;
     
    }
  }

  &__info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &__date {
      border-radius: 15px;
      background-color: rgb(239, 239, 239) !important;
      color: rgb(140, 140, 140); // Text color inside the chip
      padding: 8px;
      width: 120px;
      display: flex;
      justify-content: center;
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    margin-right: 10px;
    margin-bottom: 5px;
  }

  &:hover {
    cursor: move;
  }


  .high-priority {
    border-radius: 15px;
    background-color: rgb(255, 217, 217) !important;
    color: rgb(225, 6, 6) ; // Text color inside the chip
    font-weight: 550;
    padding: 8px;
    width: 90px;
    display: flex;
    justify-content: center;
    
  }

  .medium-priority {
    border-radius: 15px;
    background-color: #ffe0a7 !important;
    color: #ffa904; // Text color inside the chip
    font-weight: 550;
    padding: 8px;
    width: 90px;
    display: flex;
    justify-content: center;
  }

  .low-priority {
    border-radius: 15px;
    background-color:rgb(226, 226, 226) !important;
    color:rgb(140, 140, 140);; // Text color inside the chip
    font-weight: 550;
    padding: 8px;
    width: 90px;
    display: flex;
    justify-content: center;
  }

  .delete-icon {
    color: rgb(225, 6, 6) !important;
    margin-right: 5px;
  }
}
</style>
