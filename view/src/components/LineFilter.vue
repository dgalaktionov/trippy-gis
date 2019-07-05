<template>
    <div class="trippy-search-field">
        <autocomplete v-model="selectedLine" :options="lines" option-key="id" option-label="long_name" :placeholder="placeholder"></autocomplete>
    </div>
</template>

<script>
    import Autocomplete from "vue-single-select";

    export default {
        name: "LineFilter",
        components: {Autocomplete},
        props: {
            lines: {
                type: Array,
                required: true,
                default: []
            },

            value: {},

            placeholder: {
                type: String,
                default: "Any line"
            }
        },

        computed: {
            selectedLine: {
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
