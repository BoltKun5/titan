<template>
  <div class="SearchComponent">
    <input
      class="SearchComponent-SearchBar"
      type="text"
      v-model="filters.name"
      placeholder="Recherche une carte par nom"
      @input="updateNameFilter()"
    />

<!-- TODO: Mettre tout ça dans des components -->

    <div class="SearchComponent-RaritySelectionWrapper">
      <div
        class="SearchComponent-RaritySelection"
        @click="updateRarityFilter('common')"
        :class="filters.rarities.includes('common') ? 'isActivated' : ''"
      >
        <img src="@/assets/icons/common.png" />
      </div>
      <div
        class="SearchComponent-RaritySelection"
        @click="updateRarityFilter('uncommon')"
        :class="filters.rarities.includes('uncommon') ? 'isActivated' : ''"
      >
        <img src="@/assets/icons/uncommon.png" />
      </div>
      <div
        class="SearchComponent-RaritySelection"
        @click="updateRarityFilter('rare')"
        :class="filters.rarities.includes('rare') ? 'isActivated' : ''"
      >
        <img src="@/assets/icons/rare.png" />
      </div>
      <div
        class="SearchComponent-RaritySelection"
        @click="updateRarityFilter('holo')"
        :class="filters.rarities.includes('holo') ? 'isActivated' : ''"
      >
        <img src="@/assets/icons/holo.png" />
      </div>
      <div
        class="SearchComponent-RaritySelection"
        @click="updateRarityFilter('ur')"
        :class="filters.rarities.includes('ur') ? 'isActivated' : ''"
      >
        <img src="@/assets/icons/ur.png" />
      </div>
      <div
        class="SearchComponent-RaritySelection"
        @click="updateRarityFilter('secrete')"
        :class="filters.rarities.includes('secrete') ? 'isActivated' : ''"
      >
        <img src="@/assets/icons/secrete.png" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.filters = {
      rarities: ["common", "uncommon", "rare", "holo", "ur", "secrete"],
      name: "",
    };
  },
  data() {
    return {
      filters: {},
    };
  },
  methods: {
    updateNameFilter() {
      this.$emit("updateFilters", this.filters)
    },
    updateRarityFilter(name) {
      !this.filters.rarities.includes(name)
        ? this.filters.rarities.push(name)
        : this.filters.rarities.splice(this.filters.rarities.indexOf(name), 1);
        this.$emit("updateFilters", this.filters)
    },
  },
};
</script>

<style lang="scss" scoped>
.SearchComponent {
  display: flex;
  align-content: center;
  align-items: center;
  flex-wrap: wrap;

  &-SearchBar {
    width: 240px;
    height: 30px;
    background: rgb(209, 209, 209);
    color: rgb(110, 0, 0);
    border-radius: 15px;
    margin: 10px;
    padding-left: 10px;
    border: 1px solid rgb(110, 0, 0);
  }

  &-RaritySelection {
    height: 25px;
    width: 25px;
    background: rgb(226, 94, 94);
    margin: 8px;
    padding: 10px;
    border-radius: 1000px;

    & > img {
      width: 100%;
      height: 100%;
    }
  }

  &-RaritySelectionWrapper {
    display: flex;
    max-width: 100%;
  }
}
.isActivated {
    background: rgb(255, 0, 0);
}
</style>