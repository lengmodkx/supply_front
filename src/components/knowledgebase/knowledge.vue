<template>
  <div class="knowledge">
    <header class="knowledge-header">
      <span>知识库</span>
      <div>
        <Button type="primary">创建文件夹</Button>
        <Button type="primary">创建分享</Button>
      </div>
    </header>
    <section class="knowledge-content">
      <div class="knowledge-left">
        <tree :nodes="nodes" @onCreated="onCreated" :setting="setting" @onClick="onClick" ref="ztreeDom" />
      </div>
      <div class="knowledge-right">
        <Table height="400" :columns="columns" :data="data">
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">编辑</Button>
            <Button type="error" size="small" @click="remove(index)">删除</Button>
          </template>
        </Table>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: [],
      nodes: [],
      ztreeObj: null,
      setting: {
        view: {
          showIcon: true,
          selectedMulti: false,
        },
        check: {
          enable: false,
        },
        data: {
          simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "pId",
            rootPId: 0,
          },
        },
        async: {
          //异步设置
          enable: true,
          type: "get",
          url: process.env.VUE_APP_TREE_URL4,
          autoParam: ["id"],
          dataType: "text",
          headers: { "x-auth-token": localStorage.token },
          //异步返回结果集处理(必须返回json数据)
          dataFilter: function(treeId, parentNode, res) {
            console.log(res);
            if (res.result == 1) {
              return res.data;
            }
          },
        },
      },
      columns: [
        {
          title: "名称",
          slot: "name",
        },
        {
          title: "创建人",
          key: "age",
        },
        {
          title: "创建时间",
          key: "address",
        },
        {
          title: "操作",
          slot: "action",
          width: 150,
          align: "center",
        },
      ],
    };
  },
  methods: {
    onCreated() {},
    onClick() {},
  },
};
</script>
<style lang="less" scoped>
@import "./knowledge.less";
</style>
