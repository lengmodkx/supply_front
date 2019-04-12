<template>
    <Poptip class=""
            placement="bottom"
            transfer
            v-model="visible"
            @on-popper-hide="popHide">
        <Icon class="sanjiao"
              type="ios-arrow-dropdown"
              style="color:gray;"
              size="20"
        ></Icon>
        <div slot="content"
             class="task-menuwrapper-content"
             v-if="initCom">
        </div>

    </Poptip>
</template>

<script>
    export default {
        name: "mineMenu"
    }
</script>

<style scoped>

</style>