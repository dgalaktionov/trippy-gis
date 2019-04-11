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
        data() {
            return {
                stop: {properties: {id: 0, name: ""}},
                isLoading: true,
            }
        },
        asyncComputed: {
          stats: {
              get () {
                  this.isLoading = true;

                  return getty.jsonGet("/stop_stats/" + this.stop.properties.id).then(x => {
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

</style>