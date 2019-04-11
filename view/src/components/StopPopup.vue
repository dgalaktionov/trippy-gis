<template>
    <div class="stopPopup" v-show="stop.properties.name">
        <div class="stopPopupTitle">{{stop.properties.name}}</div>
        <pulse-loader :loading="isLoading" color="#102938" size="12px"></pulse-loader>
        <div class="stopPopupStats" v-show="!isLoading">
            <div class="stopPopupCounter">Board: {{stats.board}}</div>
            <div class="stopPopupCounter">Switch: {{stats.switch}}</div>
            <div class="stopPopupCounter">Start: {{stats.start}}</div>
            <div class="stopPopupCounter">End: {{stats.end}}</div>
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