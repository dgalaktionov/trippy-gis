<template>
    <div class="trippy-search-field">
        <autocomplete v-model="selectedStop" :options="stops" option-key="id" option-label="name" placeholder="Find stop by name..."></autocomplete>
    </div>
</template>

<script>
    let Autocomplete = require("vue-single-select/dist/VueSingleSelect.vue");

    export default {
        name: "StopSearch",
        components: {Autocomplete},
        props: {
            stops: {
                type: Array,
                required: true,
                default: []
            },

            value: {}
        },

        computed: {
            selectedStop: {
                get() {
                    return this.value;
                },

                set(s) {
                    if (s) {
                        this.$emit("input", s);
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .trippy-search-field {

    }
</style>
