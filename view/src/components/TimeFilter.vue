<template>
    <div class="trippy-map-filters">
        <div>
            <datepicker class="trippy-map-filter" placeholder="Select a date" v-model="selectedDate" :typeable="true"
                        :disabled-dates="disabledDates" :open-date="disabledDates.to" :clear-button="true"
                        format="yyyy-MM-dd" :monday-first="true" @selected="onSelectedDate" :use-utc="true"></datepicker>
            <vue-timepicker v-model="selectedTime" :typeable="true" :disabled="!selectedDate"></vue-timepicker>
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
        computed: {
            selectedDate: {
                get() {
                    return this.value;
                },

                set(d) {
                    this.$emit("input", d);
                }
            },
            selectedTime: {
                get() {
                    if (this.selectedDate) {
                        return {
                            HH: this.timePad(this.selectedDate.getUTCHours()),
                            mm: this.timePad(this.selectedDate.getUTCMinutes())
                        };
                    } else {
                        return {HH: "", mm: ""};
                    }
                },
                set (t) {
                    console.log(t);
                    if (this.selectedDate) {
                        this.selectedDate = new Date(this.selectedDate.setUTCHours(t.HH, t.mm));
                        this.onSelectedDate(this.selectedDate);
                    }
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
                    this.$router.push({query: {date: d.toISOString().substring(0, 16)}});
                } else {
                    this.$router.push({});
                }
            },
            timePad(x) {
                if (x < 10) {
                    return "0" + x;
                } else {
                    return x + "";
                }
            }
        },
        mounted() {
            var dateStr = this.$route.query.date;

            if (dateStr) {
                // contains time
                if (dateStr.length >= 16 && dateStr.indexOf(":") >= 0) {
                    dateStr += "Z"; // UTC
                }

                this.selectedDate = new Date(dateStr);
            }
        }
    }
</script>

<style scoped>

</style>
