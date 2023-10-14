<template>
  <div>
    <table class="bg-cyan-200">
      <tr>
        <th>#</th>
        <th>match</th>
        <th>1</th>
        <th>x</th>
        <th>2</th>
        <th>bet</th>
        <th>bank</th>
      </tr>

      <tr
        v-for="(match, index) in teamData"
        :key="index + teamName + '-' + match.match"
      >
        <td>{{ teamName.slice(0, 4) }}-{{ index + 1 }}</td>
        <td>{{ match.match }}</td>
        <td
          :class="{
            win: match['1-bool'],
            'bet-event':
              (betOn.win && match.home) || (betOn.loss && !match.home),
          }"
        >
          {{ match["1"] }}
        </td>
        <td
          :class="{
            win: match['x-bool'],
            'bet-event': betOn.draw,
          }"
        >
          {{ match["x"] }}
        </td>
        <td
          :class="{
            win: match['2-bool'],
            'bet-event':
              (betOn.win && !match.home) || (betOn.loss && match.home),
          }"
        >
          {{ match["2"] }}
        </td>
        <td>{{ match.bet }}</td>
        <td>{{ match.bank }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "Table",
  props: {
    teamData: {
      type: Array,
      default: () => [],
    },
    teamName: {
      type: String,
      required: true,
    },
    betOn: {
      type: Object,
      default: () => {},
    },
  },
  // data() {
  //   return {
  //     betInput: this.bet,
  //   };
  // },
  // watch: {
  //   betInput() {
  //     this.$emit('bet-input', this.betInput);
  //   },
  // },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.win {
  background: lightyellow;
}
.bet-event {
  border: 1px dashed lighten(gray, 10%);
}
.win.bet-event {
  background: lawngreen;
}
tr:nth-child(odd) {
  background-color: rgba(black, 0.06);
}
</style>
