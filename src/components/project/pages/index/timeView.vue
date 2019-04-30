<template>
    <div style="width: 100%">
        <gantt></gantt>
    </div>
</template>

<script>
    import gantt from './gantt/GanttIndex'
    export default {
        name: "timeView",
        components: {gantt}
    }
</script>

<style scoped>

</style>