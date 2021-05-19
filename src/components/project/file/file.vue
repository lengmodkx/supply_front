<template>
      <div class="box">
          <new-File></new-File>
      </div>
        
</template>
<script>
import newFile from "../newFile/index.vue";

export default {

  components: {
    newFile
  }
};
</script>
<style lang="less" scoped>

.box{
  padding-top:40px;
}

</style>


