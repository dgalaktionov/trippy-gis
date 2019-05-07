<template>
    <div class="trippy-search-field">
        <autocomplete v-model="selectedStop" :options="stops" option-key="id" option-label="name" :placeholder="placeholder"></autocomplete>
    </div>
</template>

<script>
    import Autocomplete from "vue-single-select";

    export default {
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
