<template>
    <div class="stop-popup" v-show="stop.name">
        <div class="stop-popup-title">{{stop.name}}</div>
        <pulse-loader :loading="isLoading" color="#102938" size="12px"></pulse-loader>
        <div class="stop-popup-stats" v-show="!isLoading">
            <div class="stop-popup-counter">Board: {{stats.board}}</div>
            <div class="stop-popup-counter">Switch: {{stats.switch}}</div>
            <div class="stop-popup-counter">Start: {{stats.start}}</div>
            <div class="stop-popup-counter">End: {{stats.end}}</div>
        </div>
    </div>
</template>

<script>
    let getty = require("../getty");
    let PulseLoader = require("vue-spinner/dist/vue-spinner.min").PulseLoader;

    module.exports = {
        name: "StopPopup",
        components: {PulseLoader},
        props: {
          stop: {
              required: true
          }
        },
        data() {
            return {
                // stop: {properties: {id: 0, name: ""}},
                isLoading: true,
            }
        },
        methods: {
            secondsFromMinDate(d) {
                if (this.$root.minDate) {
                    return (d.getTime() - this.$root.minDate.getTime())/1000;
                } else {
                    return -1;
                }
            }
        },
        asyncComputed: {
          stats: {
              get () {
                  if (!this.stop || this.stop.id === 0) {
                      return {};
                  }

                  this.isLoading = true;
                  var startDate = new Date(0);
                  var endDate = new Date(0);

                  if (this.$root.selectedDate.startDate || this.$root.selectedDate.endDate) {
                      startDate = this.$root.selectedDate.startDate || this.$root.minDate;
                      endDate = this.$root.selectedDate.endDate || this.$root.maxDate;
                  }

                  return getty.getStopStats(this.stop.id,
                      this.secondsFromMinDate(startDate),
                      this.secondsFromMinDate(endDate)).then(x => {
                          this.isLoading = false;
                          return x;
                  });
              },

              default() {
                  return {};
              }
          }
        }
    }
</script>

<style scoped>
    .stop-popup {
        min-width: 200px;
        max-width: 200px;
    }
</style>
