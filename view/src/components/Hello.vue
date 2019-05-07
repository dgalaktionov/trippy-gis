<template>
    <p id="hello-vue">{{message}}</p>
</template>

<script>
    export default {
        name: "Hello",
        data: function() {
            return {
                message: "Hello Vue!"
            }
        }
    };
</script>
