<template>
    <div class="stop-popup" v-show="stop.properties.name">
        <div class="stop-popup-title">{{stop.properties.name}}</div>
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
              required: true,
              type: Object,
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
                  if (this.stop.properties.id === 0) {
                      return {};
                  }

                  this.isLoading = true;
                  var startDate = new Date(0);
                  var endDate = new Date(0);

                  if (this.$root.startDate || this.$root.endDate) {
                      startDate = this.$root.startDate || this.$root.minDate;
                      endDate = this.$root.endDate || this.$root.maxDate;
                  }

                  return getty.getStopStats(this.stop.properties.id,
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
