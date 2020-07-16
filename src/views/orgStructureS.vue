<template>
  <div class="container">
    <div class="content">
      <div class="title">
        <div>组织架构</div>
        <div class="icon-content">
          <div class="r-jump">
            <img src="../assets/images/systemSet/chengyuang.png" alt />
            <span>成员</span>
          </div>
        </div>
        <div class="line"></div>
      </div>
      <div class="search">
        <Input prefix="ios-search" placeholder="搜索" />
      </div>
      <div class="orgContent">
        <div class="org-title">
          <div>
            <img src="../icons/img/qiye-apply-01.png" alt />
            <span>wj的团队</span>
          </div>
          <Poptip placement="bottom" transfer width="280" v-model="depPop">
            <a href="javascript:void(0)">
              <div class="addDep">
                <Icon type="md-add" color="#979797" size="20" />
              </div>
            </a>
            <div slot="title" class="member-title">
              <span>新建部门</span>
              <Icon type="md-close" size="18" class="role-md-close" @click.native="mdClose(index)" />
            </div>
            <div slot="content">
              <div class="dep-pop">
                <div class="dep-pop-tit">部门名称</div>
                <Input prefix="ios-search" placeholder="部门名称" />
                <div class="dep-pop-tit">上级部门</div>
                <Select v-model="model4">
                  <Option
                    v-for="item in cityList"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
              </div>
              <div class="mb10">设置部门负责人</div>
              <Poptip placement="top" transfer width="280" v-model="personPop">
                <a href="javascript:void(0)">
                  <div class="addDep mb10" v-if="!social">
                    <Icon type="md-add" color="#2B85E4" size="20" />
                  </div>
                  <div v-else class="userInfo">
                    <img
                      src="https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/avatar/1594114805738.jpg"
                      alt
                    />
                    <p>wj</p>
                  </div>
                </a>
                <div slot="title" class="member-title">
                  <span>选择负责人</span>
                  <Icon
                    type="md-close"
                    size="18"
                    class="role-md-close"
                    @click.stop="personPop=false;"
                  />
                </div>
                <div slot="content">
                  <div class="dep-pop">
                    <Input prefix="ios-search" placeholder="请输入关键字" class="mt10" />
                    <ul class="people-ul">
                      <RadioGroup v-model="social" @on-change="peopleCheck">
                        <li v-for="(item, index) in allOrgPeople" :key="index">
                          <div>
                            <Radio :label="item.userId" class="df people-check">
                              <div class="df">
                                <img :src="item.image" alt />
                                <p>{{ item.userName }}</p>
                              </div>
                            </Radio>
                          </div>
                        </li>
                      </RadioGroup>
                    </ul>
                  </div>
                </div>
              </Poptip>
              <Button type="primary" long class="determine">确定</Button>
            </div>
          </Poptip>
        </div>
        <div class="org-container">
          <div class="content-item">
            <div class="left-item">
              <img src="../icons/img/bumen-01.png" alt />
              <span>11111</span>
            </div>
            <div class="right-item">
              <Tooltip content="编辑">
                <Icon type="md-create" size='20' color="#979797"/>
              </Tooltip>
              <Tooltip content="新建子部门">
                <Icon type="md-add" size='20' color="#979797"/>
              </Tooltip>
              <Tooltip content="删除">
                <Icon type="ios-trash-outline" size='20' color="#979797"/>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Loading from "../components/public/common/Loading.vue";

export default {
  components: {
    Loading
  },
  data() {
    return {
      cityList: [
        {
          value: "New York",
          label: "New York"
        },
        {
          value: "London",
          label: "London"
        },
        {
          value: "Sydney",
          label: "Sydney"
        },
        {
          value: "Ottawa",
          label: "Ottawa"
        },
        {
          value: "Paris",
          label: "Paris"
        },
        {
          value: "Canberra",
          label: "Canberra"
        }
      ],
      model4: "",
      allOrgPeople: [
        {
          userId: "7da0fd547ec44aaba0fd51f591a0852e",
          image:
            "https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/avatar/1594114805738.jpg",
          phone: "18744401234",
          userName: "wj"
        }
      ],
      social: "",
      personPop: false,
      depPop: false
    };
  },
  computed: {},
  mounted() {},
  methods: {
    peopleCheck() {
      console.log(this.social);
      this.personPop = false;
      this.depPop = true;
    }
  }
};
</script>
<style lang="less" scoped>
@import "../assets/css/managementS";
.line {
  width: 56px !important;
}
</style>