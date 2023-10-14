const odds = {
  data() {
    return {
      oddsRangeFilter: {}
    };
  },
  methods: {
    setOddsRangeFilter(payload) {
      this.oddsRangeFilter = payload;
    },
    // Function to calculate the mean of the array
    calculateMean(arr) {
      const sum = arr.reduce((acc, val) => acc + val, 0);
      return sum / arr.length;
    },

    // Function to calculate the median of the array
    calculateMedian(arr) {
      const sortedArr = arr.slice().sort((a, b) => a - b);
      const middle = Math.floor(sortedArr.length / 2);
      if (sortedArr.length % 2 === 0) {
        return (sortedArr[middle - 1] + sortedArr[middle]) / 2;
      } else {
        return sortedArr[middle];
      }
    },

    // Function to calculate the mode of the array
    calculateMode(arr) {
      const countMap = new Map();
      let maxCount = 0;
      let modes = [];

      for (const value of arr) {
        const count = (countMap.get(value) || 0) + 1;
        countMap.set(value, count);
        if (count > maxCount) {
          maxCount = count;
          modes = [value];
        } else if (count === maxCount) {
          modes.push(value);
        }
      }

      return modes;
    },
    countOddsInRange(arr, minRange, maxRange) {
      const filteredOdds = arr.filter(
        (odds) => odds >= minRange && odds <= maxRange
      );
      const count = filteredOdds.length;
      return count;
    }
  },
  computed: {
    oddsInsightsCount() {
      this.$nextTick(() => {
        return this.oddsInsights.count;
      });
    },
    oddsInsights() {
      return {
        count: this.insights.hasOwnProperty("converting-odds")
          ? this.insights["converting-odds"].length
          : null,
        mean: this.calculateMean(this.insights["converting-odds"]),
        median: this.calculateMedian(this.insights["converting-odds"]),
        mode: this.calculateMode(this.insights["converting-odds"])
      };
    },
    oddsOutliers() {
      // Detect outliers (values significantly different from the mean)
      return this.insights["converting-odds"].filter(
        (odds) =>
          Math.abs(odds - this.oddsInsights.mean) > 2 * this.oddsInsights.median
      );
    },
    oddsRangeCount() {
      if (
        this.oddsRangeFilter.hasOwnProperty("min") &&
        this.oddsRangeFilter.hasOwnProperty("max")
      ) {
        return this.countOddsInRange(
          this.insights["converting-odds"],
          this.oddsRangeFilter.min,
          this.oddsRangeFilter.max
        );
      }
      return undefined;
    }
  }
};

export default odds;
