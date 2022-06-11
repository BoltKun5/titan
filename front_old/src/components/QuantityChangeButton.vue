<template>
  <div class="quantity-change-button" @click="clickEvent">
    <div class="change-sign">{{ modification === "plus" ? "+" : "-" }}</div>
  </div>
</template>

<script>
export default {
  props: {
    amount: Number,
    modification: {
      type: String,
      value: "plus" | "minus",
    },
  },
  methods: {
    clickEvent() {
      this.$emit(this.modification === "plus" ? "addOne" : "removeOne");
    },
  },
};
</script>

<style lang="scss" scoped>
.quantity-change-button {
  width: 30px;
  height: 30px;
  display: flex;
  margin: auto 10px;
  background-color: rgb(255, 255, 255);
  border: rgb(59, 0, 0) 2px solid;
  color: darkslategray;
  font-weight: bold;
  justify-content: center;
  border-radius: 1000px;
  align-items: center;
}
.change-sign {
    pointer-events: none;
}
</style>
