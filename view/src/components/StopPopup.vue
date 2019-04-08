<template>
    <div class="stopPopup" v-show="stop.properties.name">
        <div class="stopPopupTitle">{{stop.properties.name}}</div>
        <div class="stopPopupCounter">Board: {{stats.board}}</div>
        <div class="stopPopupCounter">Switch: {{stats.switch}}</div>
        <div class="stopPopupCounter">Start: {{stats.start}}</div>
        <div class="stopPopupCounter">End: {{stats.end}}</div>
    </div>
</template>

<script>
    let getty = require("../getty");

    module.exports = {
        name: "StopPopup",
        data() {
            return {
                stop: {properties: {id: 0, name: ""}}
            }
        },
        asyncComputed: {
            // TODO show a spinner by default or something
          stats: {
              get () {
                  this.start = 0;
                  return getty.jsonGet("/stop_stats/" + this.stop.properties.id);
              },

              default() {
                  return 0;
              }
          }
        }
    }
</script>

<style scoped>

</style>