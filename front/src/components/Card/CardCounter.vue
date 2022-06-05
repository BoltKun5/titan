<template>
  <div>
    <div
      class="counter"
      @mouseenter="isHover = true"
      @mouseleave="isHover = false"
    >
      <QuantityChangeButton
        v-if="isHover"
        @addOne="addOne"
        @removeOne="removeOne"
        modification="minus"
      />
      <div class="count_value">{{ count }}</div>
      <QuantityChangeButton
        v-if="isHover"
        @addOne="addOne"
        @removeOne="removeOne"
        modification="plus"
      />
    </div>
  </div>
</template>

<script>
import QuantityChangeButton from "../QuantityChangeButton.vue";
export default {
  components: { QuantityChangeButton },
  data() {
    return {
      isHover: false,
    };
  },
  props: {
    count: {
      type: Number,
    },
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
.counter {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 0 0 10px 10px;
  position: absolute;
  width: 100%;
  bottom: 4px;
  transition: 0.6s;
  height: 50px;

  display: flex;
  justify-content: center;

  &:hover {
    border-radius: 10px;
    height: 100%;
  }
}
.count_value {
  display: flex;
  align-items: center;
}
</style>
