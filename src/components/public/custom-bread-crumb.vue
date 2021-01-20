<template>
  <div class="custom-bread-crumb">
    <Breadcrumb :style="{fontSize: `${fontSize}px`}">
      <BreadcrumbItem :to="{ path: '/org/'+ companyId }">首页</BreadcrumbItem>
      <BreadcrumbItem v-if="this.$route.meta.name">{{ this.$route.meta.name }}</BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>
<script>
  export default {
    name: 'customBreadCrumb',
    props: {
      fontSize: {
        type: Number,
        default: 14
      },
    },
    data() {
      return {
        companyId: localStorage.companyId
      }
    },
  }
</script>

<style lang="less" scoped>
  .custom-bread-crumb {
    display: inline-block;
    vertical-align: top;
  }
</style>