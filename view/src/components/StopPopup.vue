<template>
    <div class="stopPopup" v-show="stop.properties.name">
        <div class="stopPopupTitle">{{stop.properties.name}}</div>
        <div class="stopPopupCounter">Start: {{start}}</div>
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
          start: {
              get () {
                  this.start = 0;
                  return getty.jsonGet("/start/" + this.stop.properties.id).then((r) => r.count);
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