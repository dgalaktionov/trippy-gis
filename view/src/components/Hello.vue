<template>
    <p id="hello-vue">{{message}}</p>
</template>

<script>
    module.exports = {
        name: "Hello",
        data: function() {
            return {
                message: "Hello Vue!"
            }
        }
    };
</script>
