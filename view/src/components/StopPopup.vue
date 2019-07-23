<template>
    <div class="stop-popup" v-if="stop && stop.name">
        <div class="stop-popup-title">
            {{stop.name}} ({{stop.lines.map(l => l.short_name).join(", ")}})
        </div>
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
    import { PulseLoader } from "vue-spinner/dist/vue-spinner";
    import getty from "../getty";

    export default {
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
                      this.$root.secondsFromMinDate(startDate),
                      this.$root.secondsFromMinDate(endDate)).then(x => {
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
