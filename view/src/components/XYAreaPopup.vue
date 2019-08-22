<template>
    <div class="stop-popup" v-if="startStops && endStops">
        <div class="stop-popup-title">Number of trips: </div>
        <pulse-loader :loading="isLoading" color="#102938" size="12px"></pulse-loader>
        <div class="stop-popup-stats" v-show="!isLoading">
            <div class="stop-popup-counter">{{stats.xy}}</div>
        </div>
    </div>
</template>

<script>
    import { PulseLoader } from "vue-spinner/dist/vue-spinner";
    import getty from "../getty";

    export default {
        name: "XYAreaPopup",
        components: {PulseLoader},
        data() {
            return {
                isLoading: true,
                startStops: [],
                endStops: []
            }
        },
        asyncComputed: {
            stats: {
                get () {
                    if (!this.startStops || this.startStops.length === 0 || !this.endStops || this.endStops.length === 0) {
                        return {};
                    }

                    this.isLoading = true;
                    var startDate = new Date(0);
                    var endDate = new Date(0);

                    if (this.$root.selectedDate.startDate || this.$root.selectedDate.endDate) {
                        startDate = this.$root.selectedDate.startDate || this.$root.minDate;
                        endDate = this.$root.selectedDate.endDate || this.$root.maxDate;
                    }

                    return getty.getXYArea(this.startStops,
                        this.endStops,
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
