<template>
    <div class="trippy-search-field">
        <input type="text" placeholder="Find stop by name...">
        <autocomplete v-model="fruit" :options="['apple', 'banana']"></autocomplete>
    </div>
</template>

<script>
    let Autocomplete = require("vue-single-select/dist/VueSingleSelect.vue");

    export default {
        name: "StopSearch",
        components: {Autocomplete}
    }
</script>

<style scoped>
    .trippy-search-field {

    }
</style>
