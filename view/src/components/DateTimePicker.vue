<template>
    <div class="trippy-map-filter">
        <datepicker :placeholder="placeholder" v-model="selectedDate" :typeable="true"
                    :disabled-dates="disabledDates" :open-date="disabledDates.to" :clear-button="true"
                    format="yyyy-MM-dd" :monday-first="true" @selected="onSelectedDate" :use-utc="true"></datepicker>
        <vue-timepicker v-model="selectedTime" :typeable="true" :disabled="!selectedDate"></vue-timepicker>
    </div>
</template>

<script>
    import Datepicker from "vuejs-datepicker";
    import VueTimepicker from "vuejs-timepicker";

    export default {
        name: "DateTimePicker",
        components: {Datepicker, VueTimepicker},
        props: {
            value: {
                required: true
            },

            minDate: {

            },

            maxDate: {

            },

            urlParam: {
                type: String
            },

            placeholder: {
                type: String,
                default: "Select a date"
            }
        },
        computed: {
            selectedDate: {
                get() {
                    return this.value;
                },

                set(d) {
                    this.onSelectedDate(d)
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
                    if (this.selectedDate) {
                        this.onSelectedDate(new Date(this.selectedDate.setUTCHours(t.HH, t.mm)));
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
                this.$emit("input", d);
                let q = JSON.parse(JSON.stringify(this.$route.query || {}));

                if (d && this.urlParam) {
                    q[this.urlParam] = d.toISOString().substring(0, 16);
                } else {
                    delete q[this.urlParam]
                }

                this.$router.push({query: q});
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
            var dateStr = this.$route.query[this.urlParam];

            if (dateStr) {
                if (dateStr.length >= 16 && dateStr.indexOf(":") >= 0) {
                    // contains time
                    dateStr += "Z"; // UTC
                }

                this.selectedDate = new Date(dateStr);
            }
        }
    }
</script>

<style scoped>
    .trippy-map-filter > * {
        display: inline-block;
    }
</style>
