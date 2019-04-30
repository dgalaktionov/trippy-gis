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
            }
        },
        data() {
            return {
                selectedStop: null
            };
        }
    }
</script>

<style scoped>
    .trippy-search-field {

    }
</style>
