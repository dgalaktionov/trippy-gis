<template>
    <p>{{message}}</p>
</template>

<script>
    module.exports = {
        name: "hello",
        data: function() {
            return {
                message: "Hello Vue!"
            }
        }
    };
</script>
