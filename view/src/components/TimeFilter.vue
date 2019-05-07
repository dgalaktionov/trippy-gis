<template>
    <div class="trippy-time-filter">
        <date-time-picker ref="startPicker" v-model="value.startDate" v-bind:min-date="minDate" v-bind:max-date="startMaxDate"
                          url-param="startDate" placeholder="Select a start date"></date-time-picker>
        <date-time-picker ref="endPicker" v-model="value.endDate" v-bind:min-date="endMinDate" v-bind:max-date="maxDate"
                          url-param="endDate" placeholder="Select an end date"></date-time-picker>
    </div>
</template>

<script>
    let DateTimePicker = require("./DateTimePicker.vue").default;

    module.exports = {
        name: "TimeFilter",
        components: {DateTimePicker},
        props: {
            value: {
                type: Object,
                required: true
            },
            minDate: {
                type: Date,
                default: new Date(0)
            },
            maxDate: {
                type: Date,
                default: new Date()
            }
        },
        computed: {
            endMinDate() {
                if (this.value.startDate) {
                    return new Date(Math.max(this.value.startDate, this.minDate));
                } else {
                    return this.minDate;
                }
            },
            startMaxDate() {
                if (this.value.endDate) {
                    return new Date(Math.min(this.value.endDate, this.maxDate));
                } else {
                    return this.maxDate;
                }
            }
        }
    }
</script>

<style scoped>

</style>
