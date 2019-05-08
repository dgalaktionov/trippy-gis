<template>
    <div class="stop-popup" v-if="stopX && stopY && stopX.name && stopY.name">
        <div class="stop-popup-title">{{stopX.name}}</div>
        <div class="stop-popup-title">to</div>
        <div class="stop-popup-title">{{stopY.name}}</div>
        <pulse-loader :loading="isLoading" color="#102938" size="12px"></pulse-loader>
        <div class="stop-popup-stats" v-show="!isLoading">
            <div class="stop-popup-counter">{{stats.xy}} trips</div>
        </div>
    </div>
</template>

<script>
    import { PulseLoader } from "vue-spinner/dist/vue-spinner";
    import getty from "../getty";

    export default {
        name: "XYPopup",
        components: {PulseLoader},
        props: {
            stopX: {
                //required: true
            },
            stopY: {
                //required: true
            }
        },
        data() {
            return {
                isLoading: true,
            }
        },
        asyncComputed: {
            stats: {
                get () {
                    if (!this.stopX || this.stopX.id === 0 || !this.stopY || this.stopY.id === 0) {
                        return {};
                    }

                    this.isLoading = true;
                    var startDate = new Date(0);
                    var endDate = new Date(0);

                    if (this.$root.selectedDate.startDate || this.$root.selectedDate.endDate) {
                        startDate = this.$root.selectedDate.startDate || this.$root.minDate;
                        endDate = this.$root.selectedDate.endDate || this.$root.maxDate;
                    }

                    return getty.getXY(this.stopX.id,
                        this.stopY.id,
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
