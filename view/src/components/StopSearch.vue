<template>
    <div class="trippy-search-field">
        <autocomplete v-model="selectedStop" :options="stops" option-key="id" option-label="name" :placeholder="placeholder"></autocomplete>
    </div>
</template>

<script>
    let Autocomplete = require("vue-single-select").default;

    module.exports = {
        name: "StopSearch",
        components: {Autocomplete},
        props: {
            stops: {
                type: Array,
                required: true,
                default: []
            },

            value: {},

            placeholder: {
                type: String,
                default: "Find stop by name..."
            }
        },

        computed: {
            selectedStop: {
                get() {
                    return this.value;
                },

                set(s) {
                    this.$emit("input", s);
                }
            }
        }
    }
</script>

<style scoped>
    .trippy-search-field {

    }
</style>
