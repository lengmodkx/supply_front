<template>
  <div class="container">
    <div class="content">
      <div class="title">
        <div>基础信息</div>
        <div class="line"></div>
      </div>
      <div class="content-item">
        <div class="item-left">企业头像</div>
        <img src alt class="headPortrait" />
        <Button type="primary" ghost>更换头像</Button>
      </div>
      <div class="content-item">
        <div class="item-left">企业名称</div>
        <div class="input-container">
          <Input size="large" placeholder="企业名称" />
        </div>
      </div>
      <div class="content-item">
        <div class="item-left">企业简介</div>
        <div class="input-container">
          <Input
            size="large"
            placeholder="企业简介"
            type="textarea"
            :autosize="{minRows: 3,maxRows: 5}"
          />
        </div>
      </div>
      <div class="btn-container">
        <Button type="primary" class="determine-btn" size="large">确定</Button>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <div>付费信息</div>
        <div class="line"></div>
      </div>
      <div class="content-item">
        <div class="item-left">版本信息</div>
        <div>专业版</div>
      </div>
      <div class="content-item">
        <div class="item-left">企业I D</div>
        <div>3dncre4354nvnfk45n443n</div>
      </div>
      <div class="content-item">
        <div class="item-left">成员数量</div>
        <div>1位成员使用名额，共10个名额</div>
      </div>
      <div class="content-item">
        <div class="item-left">创建时间</div>
        <div>2019年1月12日</div>
      </div>
      <div class="content-item">
        <div class="item-left">到期时间</div>
        <div>随10人以下企业长期免费</div>
      </div>
      <div class="content-item">
        <div class="item-left">企业状态</div>
        <div>正常使用</div>
      </div>
      <div class="btn-container">
        <Button type="primary" ghost>试用旗舰版</Button>
        <Button type="primary" ghost>立即购买</Button>
        <Button type="primary" ghost>查看订单</Button>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <div>更多操作</div>
        <div class="line"></div>
      </div>
      <div class="content-item">
        <div class="item-left">企业头像</div>
        <img src alt class="headPortrait" />
        <Button type="primary" ghost>移交</Button>
      </div>
      <div class="content-item">
        <div class="item-left">删除企业</div>
        <div class="input-container">
          <div>一旦你删除了企业，企业内所有项目、部门、成员，项目中所有内容以及所关联的所思文档都将会被永久删除。这是一个不可恢复的操作，请谨慎对待！</div>
        </div>
      </div>
      <div class="btn-container">
        <Button type="error" ghost>删除企业</Button>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped  >
@import "../assets/css/information";
</style>