<template>
  <div class="range-odds-count">
    <span>Winning odds </span>
    <range-selector v-model="selectedRange">
      <template v-slot:min-label> min: </template>
      <template v-slot:max-label> max: </template>
    </range-selector>
    <span>
      (count: <b>{{ oddsRangeCount ? oddsRangeCount : "-" }}</b>
      <span v-if="oddsRangeCount && oddsCount" style="font-size: 12px"
        >'out of' {{ oddsCount }}</span
      >)
    </span>
  </div>
</template>

<script>
import RangeSelector from "./RangeSelector";

export default {
  props: {
    oddsCount: {
      type: Number,
      default: null,
    },
    oddsRangeCount: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      selectedRange: {
        min: 0,
        max: 0,
      },
    };
  },
  components: {
    RangeSelector,
  },
  watch: {
    selectedRange: {
      handler() {
        this.$emit("range", this.selectedRange);
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.range-odds-count {
  /* display: inline-block; */
}
</style>

