<template>
    <div class="trippy-map-filters">
        <div>
            <datepicker class="trippy-map-filter" placeholder="Select a date" v-model="selectedDate" :typeable="true"
                        :disabled-dates="disabledDates" :open-date="disabledDates.to" :clear-button="true"
                        format="yyyy-MM-dd" :monday-first="true" @selected="onSelectedDate"></datepicker>
            <vue-timepicker v-model="selectedTime" :typeable="true"></vue-timepicker>
        </div>

        <div>
            More selectors
        </div>
    </div>
</template>

<script>
    let Datepicker = require("vuejs-datepicker");
    let VueTimepicker = require("vuejs-timepicker");

    module.exports = {
        name: "TimeFilter",
        components: {Datepicker, VueTimepicker},
        props: {
            value: {
                required: true
            },

            minDate: {

            },

            maxDate: {

            }
        },
        data() {
            return {
                selectedTime: {
                    HH: "08",
                    mm: "00"
                }
            }
        },
        computed: {
            selectedDate: {
                get() {
                    return this.value;
                },

                set(d) {
                    this.$emit('input', d);
                }
            },
            disabledDates: {
                get() {
                    return  {
                        to: this.minDate,
                        from: this.maxDate,
                    }
                }
            }
        },
        methods: {
            onSelectedDate(d) {
                if (d) {
                    this.$router.push({query: {date: d.toISOString().substring(0, 10)}});
                } else {
                    this.$router.push({});
                }
            }
        },
        mounted() {
            let dateStr = this.$route.query.date;

            if (dateStr) {
                this.selectedDate = new Date(dateStr);
            }
        }
    }
</script>

<style scoped>

</style>
