<template>
  <div id="app">
    <button type="button" class="filter-button spacing-right" @click="open">
      ☕ Filter
    </button>

    <div class="bank" v-cloak>
      <div>
        <BottomSheet ref="bottomSheet">
          <div class="spacing" style="margin-bottom: 100px">
            <div>
              <span>TOTAL:&nbsp;</span>
              <b class="inline-block ml-4">{{ srajtofla }} </b
              ><span style="font-size: 12px"
                >(odds {{ oddsPercentageAdjustment * 100 }}%)</span
              >
            </div>
            <h4 class="spacing-top">Bet on:</h4>
            <RadioOptions
              class="spacing-top"
              @selected="setBetOn"
              :options="['win', 'draw', 'loss', 'range']"
            />
            <RangeOddsCount
              v-if="betOn.range"
              class="spacing-top"
              @range="setOddsRangeFilter"
              :odds-range-count="oddsRangeCount"
              :odds-count="oddsInsightsCount"
            />
            <div class="spacing-top">
              <h4>Bet:</h4>
              <input
                style="width: 30px; margin-right: 5px"
                type="number"
                v-model="bet"
              /><span>€</span>
            </div>

            <TeamSelector
              class="spacing-top"
              :selected-teams="selectedTeams"
              @update:selectedTeams="setSelectedTeams"
            />
          </div>
        </BottomSheet>
        <span>
          <span>TOTAL:&nbsp;</span>
          <b class="inline-block ml-4">{{ srajtofla }} </b
          ><span style="font-size: 12px"
            >(odds {{ oddsPercentageAdjustment * 100 }}%)</span
          >
        </span>
        <span
          >&nbsp;|&nbsp;
          <template v-if="betOn.win">BET ON WIN</template>
          <template v-else-if="betOn.loss">BET ON LOSS</template>
          <template v-else-if="betOn.draw">BET ON DRAW</template>
          <template v-else>BET ON RANGE</template>
        </span>
      </div>
    </div>

    <div class="tables">
      <div v-for="(teamData, teamName) in teamsDataFiltered" :key="teamName">
        <Table :team-data="teamData" :team-name="teamName" :bet-on="betOn" />
      </div>
    </div>
  </div>
</template>

<script>
import Table from "./components/Table";
import RangeOddsCount from "./components/RangeOddsCount";
import RadioOptions from "./components/RadioOptions";
import TeamSelector from "./components/TeamSelector";
import BottomSheet from "@nclsm/vue-bottom-sheet-vue2";
import teamsData from "./assets/data/teams-2022-2023-data.json";
import { listOfTeams } from "./config";
import odds from "./assets/mixins/odds";

export default {
  name: "App",
  components: {
    Table,
    RangeOddsCount,
    RadioOptions,
    BottomSheet,
    TeamSelector,
  },
  mixins: [odds],
  data: function () {
    return {
      initMoney: 1,
      oddsPercentageAdjustment: 0.9,
      moneyPerMatch: 3,
      bank: 0,
      bet: 0,
      srajtofla: 0,
      insights: {},
      betOn: {
        win: true,
        loss: false,
        draw: false,
        range: false,
      },
      selectedTeams: listOfTeams,
    };
  },
  created() {
    this.bet = this.initMoney;
  },
  computed: {
    teamsDataMapped() {
      let newData = {};
      this.bank = 0;
      for (let i = 0; i < this.selectedTeams.length; i++) {
        newData[this.selectedTeams[i]] = teamsData[this.selectedTeams[i]].map(
          (match) => {
            const lowerOdds1 =
              Math.round(match["1"] * this.oddsPercentageAdjustment * 100) /
              100;
            const lowerOddsX =
              Math.round(match["x"] * this.oddsPercentageAdjustment * 100) /
              100;
            const lowerOdds2 =
              Math.round(match["2"] * this.oddsPercentageAdjustment * 100) /
              100;

            if (!this.insights["converting-odds"]) {
              this.insights["converting-odds"] = [];
            }

            if (this.betOn.win) {
              if (match.home) {
                if (!match["1-bool"]) {
                  this.bank -= this.bet;
                } else {
                  this.bank += this.bet * lowerOdds1;

                  this.insights["converting-odds"].push(lowerOdds1);
                }
              } else {
                if (!match["2-bool"]) {
                  this.bank -= this.bet;
                } else {
                  this.bank += this.bet * lowerOdds2;
                  this.insights["converting-odds"].push(lowerOdds2);
                }
              }
            } else if (this.betOn.loss) {
              if (match.home) {
                if (!match["2-bool"]) {
                  this.bank -= this.bet;
                } else {
                  this.bank += this.bet * lowerOdds2;
                  this.insights["converting-odds"].push(lowerOdds2);
                }
              } else {
                if (!match["1-bool"]) {
                  this.bank -= this.bet;
                } else {
                  this.bank += this.bet * lowerOdds1;
                  this.insights["converting-odds"].push(lowerOdds1);
                }
              }
            } else if (this.betOn.draw) {
              if (!match["x-bool"]) {
                this.bank -= this.bet;
              } else {
                this.bank += this.bet * lowerOddsX;
                this.insights["converting-odds"].push(lowerOddsX);
              }
            }

            return {
              ...match,
              1: lowerOdds1,
              2: lowerOdds2,
              bet: this.bet,
              bank: Math.round(this.bank * 100) / 100,
            };
          }
        );
      }
      this.srajtofla = Math.round(this.bank * 100) / 100 + " EUR";
      this.insights["converting-odds"].sort();
      return newData;
    },
    teamsDataFiltered() {
      // Create a new object to store filtered data
      const filteredData = {};

      for (const [teamName, teamData] of Object.entries(this.teamsDataMapped)) {
        if (
          this.selectedTeams.length === 0 ||
          this.selectedTeams.includes(teamName)
        ) {
          // Filter and add data for the selected team
          const filteredTeamData = teamData.filter((item) => {
            // if (this.selectedProperties.length === 0) return true;
            // if (this.selectedProperties.includes('1')) {
            //   const val1 = parseFloat(item['1']);
            //   if (val1 < this.minValue || val1 > 1.7) return false;
            // }
            // if (this.selectedProperties.includes('2')) {
            //   const val2 = parseFloat(item['2']);
            //   if (val2 < this.minValue || val2 > 1.7) return false;
            // }
            return true;
          });

          if (filteredTeamData.length > 0) {
            filteredData[teamName] = filteredTeamData;
          }
        }
      }

      return filteredData;
    },
    // insights() {

    // },
  },
  methods: {
    open() {
      this.$refs.bottomSheet.open();
    },
    close() {
      this.$refs.bottomSheet.close();
    },
    computeBet(odd, debt) {
      return debt / (odd - 1);
    },
    setBetOn(type) {
      this.betOn = {
        win: false,
        draw: false,
        loss: false,
        range: false,
      };
      if (type === "win") {
        this.betOn.win = true;
      } else if (type === "loss") {
        this.betOn.loss = true;
      } else if (type === "draw") {
        this.betOn.draw = true;
      } else if (type === "range") {
        this.betOn.range = true;
      }
      // trigger main computed teamsDataMapped
      this.bank = 0;
    },

    setInsight(key, value) {
      this.insights[key] = value;
    },
    setSelectedTeams(newSelectedTeams) {
      this.selectedTeams = newSelectedTeams;
    },
  },
};
</script>

<style>
body {
  background-color: rgba(128, 128, 128, 0.06);
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}
body,
p,
h1,
h2,
h3,
h4,
h5 {
  margin: 0;
}
v-cloak {
  display: none;
}

#app {
  display: flex;
  justify-content: center;
}

/* .teams-wrapper {
  flex-direction: column;
  align-items: flex-start;
} */
.tables {
  padding-top: 40px;
  font-size: 14px;
}
.bank {
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 0;
  padding: 5px;
  width: 100%;
  background: white;
  text-align: left;
  box-shadow: 0 3px 8px rgba(128, 128, 128, 0.11);
}
.spacing {
  margin: 12px;
}
.spacing-top {
  margin-top: 12px;
}
.spacing-left {
  margin-left: 12px;
}
.spacing-right {
  margin-right: 12px;
}
.filter-button {
  position: fixed;
  bottom: 20px;
  left: 16px;
  background-color: white;
  color: black;
  border: 1px solid gray;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
}
</style>
