<template>
  <div class="single-card">
    <img
      :src="'https://www.pokecardex.com/assets/images/sets/FST/' + img + '.jpg'"
    />
    <CardCounter @addOne="addOne" @removeOne="removeOne" :count="count" />
  </div>
</template>

<script>
import CardCounter from "./CardCounter";
export default {
  props: {
    img: {
      type: Number,
    },
    count: {
      type: Number,
    },
  },
  components: {
    CardCounter,
  },
  methods: {
    addOne() {
      this.$emit("addOne");
    },
    removeOne() {
      this.$emit("removeOne");
    },
  },
};
</script>

<style lang="scss" scoped>
.single-card {
  margin: 10px;
  position: relative;
}
img {
  border-radius: 10px;
  width: 200px;
}
</style>
