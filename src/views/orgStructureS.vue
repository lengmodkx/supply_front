<template>
  <div class="container" ref="content">
    <div class="content">
      <div class="title">
        <div>组织架构</div>
        <div class="icon-content">
          <div class="r-jump" @click="goMember">
            <img src="../assets/images/systemSet/chengyuang.png" alt />
            <span>成员</span>
          </div>
        </div>
        <div class="line"></div>
      </div>
      <div class="search">
        <Input prefix="ios-search" placeholder="搜索" @on-change="searchDep" />
      </div>
      <div class="orgContent">
        <div class="org-title">
          <div>
            <img src="../icons/img/qiye-apply-01.png" alt />
            <span>{{organizationName}}</span>
          </div>
          <Poptip placement="left" transfer width="280" v-model="depPop">
            <a href="javascript:void(0)">
              <div class="addDep">
                <Icon type="md-add" color="#979797" size="20" />
              </div>
            </a>
            <div slot="title" class="member-title">
              <span>新建部门</span>
              <Icon type="md-close" size="18" class="role-md-close" @click.native="depPop=false" />
            </div>
            <div slot="content">
              <div class="dep-pop">
                <div class="dep-pop-tit">部门名称</div>
                <Input prefix="ios-search" placeholder="部门名称" v-model="branchName" />
                <div class="dep-pop-tit">上级部门</div>
                <Input placeholder="部门名称" v-model="depName" disabled />
              </div>
              <div class="mb10">设置部门负责人</div>
              <Poptip placement="left" transfer width="280" v-model="personPop">
                <a href="javascript:void(0)">
                  <div class="addDep mb10" v-if="!social">
                    <Icon type="md-add" color="#2B85E4" size="20" />
                  </div>
                  <div v-else class="userInfo">
                    <div class="df ac">
                      <img :src="userImg" />
                      <p>{{userName}}</p>
                    </div>
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
                    <Input
                      prefix="ios-search"
                      placeholder="请输入关键字"
                      class="mt10"
                      @on-change="searchOrgProple"
                    />
                    <ul class="people-ul">
                      <RadioGroup v-model="social" @on-change="peopleCheck">
                        <li v-for="(item, index) in allOrgPeople" :key="index">
                          <Radio :label="item.memberId" class="df people-check ac">
                            <div class="df">
                              <img :src="item.image" alt />
                              <p>{{ item.userName }}</p>
                            </div>
                          </Radio>
                        </li>
                      </RadioGroup>
                    </ul>
                  </div>
                </div>
              </Poptip>
              <div class="mb10">部门icon</div>
              <Row class="iconList">
                <Col span="6" v-for="(item,index) in 21" :key="index" class-name="iconCol">
                  <div
                    :class="['iconContent',{checked:nowChecked==index}]"
                    :key="index"
                    @click.stop="changeTag(index)"
                  >
                    <svg-icon :name="'depIcon'+index"></svg-icon>
                  </div>
                </Col>
              </Row>

              <Button
                type="primary"
                long
                class="determine"
                @click="createBranch"
                :disabled="!branchName"
              >确定</Button>
            </div>
          </Poptip>
        </div>
        <Loading v-if="loading"></Loading>

        <div class="org-container">
          <div v-for="(item, index) in departmentTreeNew" :key="index">
            <div class="content-item" @click="drawerValue=true,changePartment(item.id,item.name)">
              <div class="left-item df ac">
                <div class="foldICon">
                  <Icon
                    type="md-arrow-dropright"
                    size="20"
                    color="#979797"
                    v-show="item.isParent"
                    @click.stop="getChilder(item,index)"
                  />
                </div>
                <svg-icon :name="item.icon"></svg-icon>
                <span>{{item.name}}</span>
              </div>
              <div class="right-item">
                <Poptip placement="left" transfer width="280" v-model="item.visible1">
                  <a href="javascript:void(0)">
                    <Tooltip content="编辑" transfer>
                      <Icon
                        type="md-create"
                        size="20"
                        color="#979797"
                        @click="editDep(index,item)"
                      />
                    </Tooltip>
                  </a>
                  <div slot="title" class="member-title">
                    <span>编辑部门</span>
                    <Icon
                      type="md-close"
                      size="18"
                      class="role-md-close"
                      @click.native="mdClose(index)"
                    />
                  </div>
                  <div slot="content">
                    <div class="dep-pop">
                      <div class="dep-pop-tit">部门名称</div>
                      <Input prefix="ios-search" placeholder="部门名称" v-model="branchName" />
                      <div class="dep-pop-tit">上级部门</div>
                      <Input placeholder="部门名称" v-model="depName" disabled />
                    </div>
                    <div class="mb10">设置部门负责人</div>
                    <Poptip placement="left" width="280" v-model="item.visible2">
                      <a href="javascript:void(0)">
                        <div class="addDep mb10" v-if="!social2">
                          <Icon type="md-add" color="#2B85E4" size="20" />
                        </div>
                        <div v-else class="userInfo">
                          <img :src="userImg" />
                          <p>{{userName}}</p>
                        </div>
                      </a>
                      <div slot="title" class="member-title">
                        <span>选择负责人</span>
                        <Icon
                          type="md-close"
                          size="18"
                          class="role-md-close"
                          @click.stop="aditClose(index)"
                        />
                      </div>
                      <div slot="content">
                        <div class="dep-pop">
                          <Input
                            prefix="ios-search"
                            placeholder="请输入关键字"
                            class="mt10"
                            @on-change="searchOrgProple"
                          />
                          <ul class="people-ul">
                            <RadioGroup v-model="social2" @on-change="peopleCheck2">
                              <li v-for="(item, index) in allOrgPeople" :key="index">
                                <Radio :label="item.memberId" class="df people-check ac">
                                  <div class="df">
                                    <img :src="item.image" alt />
                                    <p>{{ item.userName }}</p>
                                  </div>
                                </Radio>
                              </li>
                            </RadioGroup>
                          </ul>
                        </div>
                      </div>
                    </Poptip>
                    <div class="mb10">部门icon</div>
                    <Row class="iconList">
                      <Col span="6" v-for="(item,index) in 21" :key="index" class-name="iconCol">
                        <div
                          :class="['iconContent',{checked:nowChecked==index}]"
                          :key="index"
                          @click.stop="changeTag(index)"
                        >
                          <svg-icon :name="'depIcon'+index"></svg-icon>
                        </div>
                      </Col>
                    </Row>

                    <Button
                      type="primary"
                      long
                      class="determine"
                      @click="changeBranchName(item)"
                      :disabled="!branchName"
                    >保存</Button>
                  </div>
                </Poptip>
                <Poptip placement="left" transfer width="280" v-model="item.visible3">
                  <a href="javascript:void(0)">
                    <Tooltip content="新建子部门" transfer>
                      <Icon
                        type="md-add"
                        size="20"
                        color="#979797"
                        @click="newlyBuild(index,item)"
                      />
                    </Tooltip>
                  </a>
                  <div slot="title" class="member-title">
                    <span>新建子部门</span>
                    <Icon
                      type="md-close"
                      size="18"
                      class="role-md-close"
                      @click.native="mdClose(index)"
                    />
                  </div>
                  <div slot="content">
                    <div class="dep-pop">
                      <div class="dep-pop-tit">部门名称</div>
                      <Input prefix="ios-search" placeholder="部门名称" v-model="branchName" />
                      <div class="dep-pop-tit">上级部门</div>
                      <Input placeholder="部门名称" v-model="item.name" disabled />
                    </div>
                    <div class="mb10">设置部门负责人</div>
                    <Poptip placement="left" width="280" v-model="item.visible4">
                      <a href="javascript:void(0)">
                        <div class="addDep mb10" v-if="!social2">
                          <Icon type="md-add" color="#2B85E4" size="20" />
                        </div>
                        <div v-else class="userInfo">
                          <img :src="userImg" />
                          <p>{{userName}}</p>
                        </div>
                      </a>
                      <div slot="title" class="member-title">
                        <span>选择负责人</span>
                        <Icon
                          type="md-close"
                          size="18"
                          class="role-md-close"
                          @click.stop="aditClose(index)"
                        />
                      </div>
                      <div slot="content">
                        <div class="dep-pop">
                          <Input
                            prefix="ios-search"
                            placeholder="请输入关键字"
                            class="mt10"
                            @on-change="searchOrgProple"
                          />
                          <ul class="people-ul">
                            <RadioGroup v-model="social2" @on-change="peopleCheck2">
                              <li v-for="(item, index) in allOrgPeople" :key="index">
                                <Radio :label="item.memberId" class="df people-check ac">
                                  <div class="df">
                                    <img :src="item.image" alt />
                                    <p>{{ item.userName }}</p>
                                  </div>
                                </Radio>
                              </li>
                            </RadioGroup>
                          </ul>
                        </div>
                      </div>
                    </Poptip>
                    <div class="mb10">部门icon</div>
                    <Row class="iconList">
                      <Col span="6" v-for="(item,index) in 21" :key="index" class-name="iconCol">
                        <div
                          :class="['iconContent',{checked:nowChecked==index}]"
                          :key="index"
                          @click.stop="changeTag(index)"
                        >
                          <svg-icon :name="'depIcon'+index"></svg-icon>
                        </div>
                      </Col>
                    </Row>

                    <Button
                      type="primary"
                      long
                      class="determine"
                      @click="createSub(item)"
                      :disabled="!branchName"
                    >保存</Button>
                  </div>
                </Poptip>

                <Poptip placement="bottom" transfer width="280" v-model="item.visible">
                  <Tooltip content="删除" transfer>
                    <Icon type="ios-trash-outline" size="20" color="#979797" />
                  </Tooltip>
                  <div slot="title" class="member-title">
                    <span>移除部门</span>
                    <Icon
                      type="md-close"
                      size="18"
                      class="role-md-close"
                      @click.native="mdClose(index)"
                    />
                  </div>
                  <div slot="content">
                    <div style="margin-top:10px;margin-bottom:10px">
                      <span>你确定把「{{item.name}}」部门移除吗？移除部门时该部门下的子部门会被同时移除，该部门的成员将会移至未分配部门。</span>
                    </div>
                    <Button type="error" long @click="deleteIt(item)">确定</Button>
                  </div>
                </Poptip>
              </div>
            </div>
            <div v-if="item.childer">
              <div v-for="(v, i) in item.childer" :key="i">
                <div
                  class="content-item-childer content-item"
                  @click="drawerValue=true,changePartment(v.id,v.name)"
                >
                  <div class="left-item df ac">
                    <div class="foldICon">
                      <Icon
                        type="md-arrow-dropright"
                        size="20"
                        color="#979797"
                        v-show="v.isParent"
                        @click="getSonChilder(index,v,i)"
                      />
                    </div>
                    <svg-icon :name="v.icon"></svg-icon>
                    <span>{{v.name}}</span>
                  </div>
                  <div class="right-item">
                    <Poptip placement="left" transfer width="280" v-model="v.visible1">
                      <a href="javascript:void(0)">
                        <Tooltip content="编辑" transfer>
                          <Icon type="md-create" size="20" color="#979797" @click="editDep(i,v)" />
                        </Tooltip>
                      </a>
                      <div slot="title" class="member-title">
                        <span>编辑部门</span>
                        <Icon
                          type="md-close"
                          size="18"
                          class="role-md-close"
                          @click.native="$refs.content.click()"
                        />
                      </div>
                      <div slot="content">
                        <div class="dep-pop">
                          <div class="dep-pop-tit">部门名称</div>
                          <Input prefix="ios-search" placeholder="部门名称" v-model="branchName" />
                          <div class="dep-pop-tit">上级部门</div>
                          <Input placeholder="部门名称" v-model="item.name" disabled />
                        </div>
                        <div class="mb10">设置部门负责人</div>
                        <Poptip placement="left" width="280" v-model="v.visible2">
                          <a href="javascript:void(0)">
                            <div class="addDep mb10" v-if="!social2">
                              <Icon type="md-add" color="#2B85E4" size="20" />
                            </div>
                            <div v-else class="userInfo">
                              <img :src="userImg" />
                              <p>{{userName}}</p>
                            </div>
                          </a>
                          <div slot="title" class="member-title">
                            <span>选择负责人</span>
                            <!-- <Icon type="md-close" size="18" class="role-md-close" @click.stop="aditClose(i)" /> -->
                          </div>
                          <div slot="content">
                            <div class="dep-pop">
                              <Input
                                prefix="ios-search"
                                placeholder="请输入关键字"
                                class="mt10"
                                @on-change="searchOrgProple"
                              />
                              <ul class="people-ul">
                                <RadioGroup v-model="social2" @on-change="peopleCheck2">
                                  <li v-for="(itemp, indexp) in allOrgPeople" :key="indexp">
                                    <Radio :label="itemp.memberId" class="df people-check ac">
                                      <div class="df">
                                        <img :src="itemp.image" alt />
                                        <p>{{ itemp.userName }}</p>
                                      </div>
                                    </Radio>
                                  </li>
                                </RadioGroup>
                              </ul>
                            </div>
                          </div>
                        </Poptip>
                        <div class="mb10">部门icon</div>
                        <Row class="iconList">
                          <Col
                            span="6"
                            v-for="(item,index) in 21"
                            :key="index"
                            class-name="iconCol"
                          >
                            <div
                              :class="['iconContent',{checked:nowChecked==index}]"
                              :key="index"
                              @click.stop="changeTag(index)"
                            >
                              <svg-icon :name="'depIcon'+index"></svg-icon>
                            </div>
                          </Col>
                        </Row>

                        <Button
                          type="primary"
                          long
                          class="determine"
                          @click="changeBranchName(v)"
                          :disabled="!branchName"
                        >保存</Button>
                      </div>
                    </Poptip>
                    <Poptip placement="left" transfer width="280" v-model="v.visible3">
                      <a href="javascript:void(0)">
                        <Tooltip content="新建子部门" transfer>
                          <Icon type="md-add" size="20" color="#979797" @click="newlyBuild(i,v)" />
                        </Tooltip>
                      </a>
                      <div slot="title" class="member-title">
                        <span>新建子部门</span>
                        <Icon
                          type="md-close"
                          size="18"
                          class="role-md-close"
                          @click.native="$refs.content.click()"
                        />
                      </div>
                      <div slot="content">
                        <div class="dep-pop">
                          <div class="dep-pop-tit">部门名称</div>
                          <Input prefix="ios-search" placeholder="部门名称" v-model="branchName" />
                          <div class="dep-pop-tit">上级部门</div>
                          <Input placeholder="部门名称" v-model="v.name" disabled />
                        </div>
                        <div class="mb10">设置部门负责人</div>
                        <Poptip placement="left" width="280" v-model="v.visible4">
                          <a href="javascript:void(0)">
                            <div class="addDep mb10" v-if="!social2">
                              <Icon type="md-add" color="#2B85E4" size="20" />
                            </div>
                            <div v-else class="userInfo">
                              <img :src="userImg" />
                              <p>{{userName}}</p>
                            </div>
                          </a>
                          <div slot="title" class="member-title">
                            <span>选择负责人</span>
                            <!-- <Icon type="md-close" size="18" class="role-md-close" @click.stop="aditClose(i)" /> -->
                          </div>
                          <div slot="content">
                            <div class="dep-pop">
                              <Input
                                prefix="ios-search"
                                placeholder="请输入关键字"
                                class="mt10"
                                @on-change="searchOrgProple"
                              />
                              <ul class="people-ul">
                                <RadioGroup v-model="social2" @on-change="peopleCheck2">
                                  <li v-for="(item, index) in allOrgPeople" :key="index">
                                    <Radio :label="item.memberId" class="df people-check ac">
                                      <div class="df">
                                        <img :src="item.image" alt />
                                        <p>{{ item.userName }}</p>
                                      </div>
                                    </Radio>
                                  </li>
                                </RadioGroup>
                              </ul>
                            </div>
                          </div>
                        </Poptip>
                        <div class="mb10">部门icon</div>
                        <Row class="iconList">
                          <Col
                            span="6"
                            v-for="(item,index) in 21"
                            :key="index"
                            class-name="iconCol"
                          >
                            <div
                              :class="['iconContent',{checked:nowChecked==index}]"
                              :key="index"
                              @click.stop="changeTag(index)"
                            >
                              <svg-icon :name="'depIcon'+index"></svg-icon>
                            </div>
                          </Col>
                        </Row>

                        <Button
                          type="primary"
                          long
                          class="determine"
                          @click="createSub(v)"
                          :disabled="!branchName"
                        >保存</Button>
                      </div>
                    </Poptip>
                    <Poptip placement="bottom" transfer width="280">
                      <Tooltip content="删除" transfer>
                        <Icon type="ios-trash-outline" size="20" color="#979797" />
                      </Tooltip>
                      <div slot="title" class="member-title">
                        <span>移除部门</span>
                        <Icon
                          type="md-close"
                          size="18"
                          class="role-md-close"
                          @click.native="$refs.content.click()"
                        />
                      </div>
                      <div slot="content">
                        <div style="margin-top:10px;margin-bottom:10px">
                          <span>你确定把「{{v.name}}」部门移除吗？移除部门时该部门下的子部门会被同时移除，该部门的成员将会移至未分配部门。</span>
                        </div>
                        <Button type="error" long @click="deleteIt(v)">确定</Button>
                      </div>
                    </Poptip>
                  </div>
                </div>
                <div v-if="v.grandsonChilden">
                  <div
                    v-for="(value, num) in v.grandsonChilden"
                    :key="num"
                    class="content-item item-childer-child"
                    @click="drawerValue=true,changePartment(value.id,value.name)"
                  >
                    <div class="left-item df ac">
                      <div class="foldICon"></div>
                      <svg-icon :name="value.icon"></svg-icon>
                      <span>{{value.name}}</span>
                    </div>
                    <div class="right-item">
                      <Poptip placement="left" transfer width="280" v-model="value.visible1">
                        <a href="javascript:void(0)">
                          <Tooltip content="编辑" transfer>
                            <Icon
                              type="md-create"
                              size="20"
                              color="#979797"
                              @click="editDep(num,value)"
                            />
                          </Tooltip>
                        </a>
                        <div slot="title" class="member-title">
                          <span>编辑部门</span>
                          <Icon
                            type="md-close"
                            size="18"
                            class="role-md-close"
                            @click.native="$refs.content.click()"
                          />
                        </div>
                        <div slot="content">
                          <div class="dep-pop">
                            <div class="dep-pop-tit">部门名称</div>
                            <Input prefix="ios-search" placeholder="部门名称" v-model="branchName" />
                            <div class="dep-pop-tit">上级部门</div>
                            <Input placeholder="部门名称" v-model="v.name" disabled />
                          </div>
                          <div class="mb10">设置部门负责人</div>
                          <Poptip placement="left" width="280" v-model="value.visible2">
                            <a href="javascript:void(0)">
                              <div class="addDep mb10" v-if="!social2">
                                <Icon type="md-add" color="#2B85E4" size="20" />
                              </div>
                              <div v-else class="userInfo">
                                <img :src="userImg" />
                                <p>{{userName}}</p>
                              </div>
                            </a>
                            <div slot="title" class="member-title">
                              <span>选择负责人</span>
                              <!-- <Icon type="md-close" size="18" class="role-md-close"
                              @click.stop="aditCloseGrandson(index,i,num)" />-->
                            </div>
                            <div slot="content">
                              <div class="dep-pop">
                                <Input
                                  prefix="ios-search"
                                  placeholder="请输入关键字"
                                  class="mt10"
                                  @on-change="searchOrgProple"
                                />
                                <ul class="people-ul">
                                  <RadioGroup v-model="social2" @on-change="peopleCheck2">
                                    <li v-for="(itemp, indexp) in allOrgPeople" :key="indexp">
                                      <Radio :label="itemp.memberId" class="df people-check ac">
                                        <div class="df">
                                          <img :src="itemp.image" alt />
                                          <p>{{ itemp.userName }}</p>
                                        </div>
                                      </Radio>
                                    </li>
                                  </RadioGroup>
                                </ul>
                              </div>
                            </div>
                          </Poptip>
                          <div class="mb10">部门icon</div>
                          <Row class="iconList">
                            <Col
                              span="6"
                              v-for="(item,index) in 21"
                              :key="index"
                              class-name="iconCol"
                            >
                              <div
                                :class="['iconContent',{checked:nowChecked==index}]"
                                :key="index"
                                @click.stop="changeTag(index)"
                              >
                                <svg-icon :name="'depIcon'+index"></svg-icon>
                              </div>
                            </Col>
                          </Row>
                          <Button
                            type="primary"
                            long
                            class="determine"
                            @click="changeBranchName(value)"
                            :disabled="!branchName"
                          >保存</Button>
                        </div>
                      </Poptip>
                      <Poptip placement="bottom" transfer width="280">
                        <Tooltip content="删除" transfer>
                          <Icon type="ios-trash-outline" size="20" color="#979797" />
                        </Tooltip>
                        <div slot="title" class="member-title">
                          <span>移除部门</span>
                          <Icon
                            type="md-close"
                            size="18"
                            class="role-md-close"
                            @click.native="$refs.content.click()"
                          />
                        </div>
                        <div slot="content">
                          <div style="margin-top:10px;margin-bottom:10px">
                            <span>你确定把「{{value.name}}」部门移除吗？移除部门时该部门下的子部门会被同时移除，该部门的成员将会移至未分配部门。</span>
                          </div>
                          <Button type="error" long @click="deleteIt(value)">确定</Button>
                        </div>
                      </Poptip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Drawer
      :title="changeName"
      :closable="false"
      v-model="drawerValue"
      width="852"
      class-name="depMembers-content"
      :transfer="false"
    >
      <div class="content">
        <div class="table-title">
          <div>{{changeName}}·{{peopleList.length}}</div>
        </div>
        <div class="table-content">
          <Row class="titleRow" v-if="checkAllGroup.length==0">
            <Col span="9">
              <Checkbox
                :indeterminate="indeterminate"
                :value="checkAll"
                @click.prevent.native="handleCheckAll"
              >&nbsp;&nbsp;姓名</Checkbox>
            </Col>
            <Col span="5">职位</Col>
            <Col span="5">角色</Col>
            <Col span="4">操作</Col>
          </Row>
          <Row class="titleRow" v-else>
            <Col span="24">
              <Checkbox
                :indeterminate="indeterminate"
                :value="checkAll"
                @click.prevent.native="handleCheckAll"
              >
                <span class="mr20">已选择{{checkAllGroup.length}}项</span>
              </Checkbox>

              <!-- <span>
                  <Poptip placement="bottom" transfer width="280" v-model="batchAdd">
                    <a href="javascript:void(0)" class="mr20">添加到</a>
                    <div slot="title" class="member-title">
                      <span>添加至</span>
                      <Icon
                        type="md-close"
                        size="18"
                        class="role-md-close"
                        @click.native="batchAdd=false"
                      />
                    </div>
                    <div slot="content">
                      <div style="margin-top:10px;margin-bottom:10px">
                        <span>
                          添加至
                          <br />
                        </span>
                        <Select v-model="model5">
                          <Option
                            v-for="item in departmentTreeNew"
                            :value="item.partmentId"
                            :key="item.partmentId"
                          >{{ item.partmentName }}</Option>
                        </Select>
                      </div>
                      <Button type="primary" long @click="batchAddDep">确定</Button>
                    </div>
                  </Poptip>
              </span>-->
              <span>
                <Poptip placement="bottom" transfer width="280" v-model="batchRemoval">
                  <a href="javascript:void(0)">移除</a>
                  <div slot="title" class="member-title">
                    <span>移除部门成员</span>
                    <Icon
                      type="md-close"
                      size="18"
                      class="role-md-close"
                      @click.native="batchRemoval=false"
                    />
                  </div>
                  <div slot="content">
                    <div style="margin-top:10px;margin-bottom:10px">
                      <span>你确定把已选中的成员从部门中移除吗？</span>
                    </div>
                    <Button type="error" long @click="removePP()">确定</Button>
                  </div>
                </Poptip>
              </span>
            </Col>
          </Row>
          <div class="scroll-box">
            <Loading v-if="loading2"></Loading>
            <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
              <Row
                type="flex"
                justify="space-between"
                class-name="group-people"
                v-for="(item, index) in peopleList"
                :key="index"
                @click.self.native="showUserInfoModal(item)"
              >
                <Col span="9">
                  <div class="group-people-con">
                    <Checkbox
                      :label="item.organizationMember.memberId"
                      :disabled="item.organizationMember.organizationLable==1"
                    >
                      <img :src="item.organizationMember.userEntity.image" alt />
                    </Checkbox>
                    <div @click="showUserInfoModal(item)" style="width:100%;">
                      <p class="userName">{{ item.organizationMember.userEntity.userName }}</p>
                      <div class="userPhone">{{item.organizationMember.userEntity.accountName}}</div>
                    </div>
                  </div>
                </Col>
                <Col span="5">{{ item.organizationMember.userEntity.job }}</Col>
                <Col span="5">
                  <div
                    v-if="item.organizationMember.memberLabel=='拥有者'"
                  >{{ item.organizationMember.memberLabel }}</div>
                  <div v-else @click="getUserId(item)">
                    <Dropdown @on-click="screenRole" trigger="click">
                      {{ item.organizationMember.memberLabel }}
                      <Icon
                        type="ios-arrow-down"
                        v-if="item.organizationMember.memberLabel!=='拥有者'"
                      />
                      <DropdownMenu slot="list">
                        <DropdownItem
                          v-for="item in roles"
                          :key="item.roleId"
                          :name="item.roleId"
                        >{{item.roleName}}</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </Col>
                <Col span="5" class-name="operation">
                  <Poptip
                    placement="bottom"
                    transfer
                    width="280"
                    v-model="item.organizationMember.userEntity.visible"
                    popper-class="operationBubble"
                  >
                    <a href="javascript:void(0)">
                      <Icon type="ios-more" size="30" color="#BFBFBF" />
                    </a>
                    <div slot="title" class="member-title">
                      <Icon
                        type="ios-arrow-back"
                        size="18"
                        class="role-arrow-back"
                        @click.native="returnBack"
                        v-show="visible || visible2||visible1||visible3"
                      />
                      <span>{{ title }}</span>
                      <Icon
                        type="md-close"
                        size="18"
                        class="role-md-close"
                        @click.native="mdClose(index)"
                      />
                    </div>
                    <div
                      slot="content"
                      v-show="!visible&& !visible2&&!visible1&&!visible3&&!visible4"
                    >
                      <ul class="org-role">
                        <!-- <li
                            @click.stop="visible = true;title = '添加至';memberId=item.organizationMember.memberId"
                          >
                            <span>添加至</span>
                        </li>-->
                        <!-- <li
                            @click="visible1 = true;title = '停用账号';"
                            v-if="item.organizationMember.memberLabel!='拥有者'&&item.organizationMember.memberLock==1"
                          >
                            <span>停用账号</span>
                          </li>
                          <li
                            style="cursor:pointer"
                            @click="visible3 = true;title = '启用账号';"
                            v-if="item.organizationMember.memberLabel!='拥有者'&&item.organizationMember.memberLock!=1"
                          >
                            <span>启用账号</span>
                        </li>-->
                        <!-- <li
                            @click="visible2 = true;title = '移除成员';"
                            v-if="item.organizationMember.memberLabel!='拥有者'"
                          >
                            <span style="color:red">移除成员</span>
                        </li>-->
                        <li @click="visible4 = true;title = '移除部门成员';">
                          <span style="color:red">从部门移除</span>
                        </li>
                      </ul>
                    </div>
                    <!-- <div slot="content" v-show=" visible " style="padding:8px 16px;">
                        <div style="margin-top:10px;margin-bottom:10px">
                          <span>
                            添加至
                            <br />
                          </span>
                          <Select v-model="model4">
                            <Option
                              v-for="item in departmentTreeNew"
                              :value="item.partmentId"
                              :key="item.partmentId"
                            >{{ item.partmentName }}</Option>
                          </Select>
                        </div>
                        <Button type="primary" long @click="addToDep(item,index)">确定</Button>
                    </div>-->
                    <!-- <div slot="content" v-show="visible2" style="padding:8px 16px;">
                        <div style="margin-top:10px;margin-bottom:10px">
                          <span>确认移除企业成员吗？</span>
                        </div>
                        <Button
                          type="error"
                          long
                          @click="remove(item.organizationMember.userEntity.userId,item.organizationMember.memberId)"
                        >确定</Button>
                      </div>
                      <div slot="content" v-show="visible1" style="padding:8px 16px;">
                        <div style="margin-top:10px;margin-bottom:10px">
                          <span>
                            您确定要停用当前帐号吗？
                            <br />
                          </span>
                          <span>
                            • 被停用的帐号将无法访问该企业
                            <br />• 帐号信息仍保留，方便工作交接和管理
                            <br />• 支持帐号恢复
                          </span>
                        </div>
                        <Button
                          type="error"
                          long
                          @click="lock(item.organizationMember.userEntity.userId,0)"
                        >确定</Button>
                      </div>
                      <div slot="content" v-show="visible3" style="padding:8px 16px;">
                        <div style="margin-top:10px;margin-bottom:10px">
                          <span>
                            被启用的帐号将重新加入该企业，您确定要启用吗？
                            <br />
                          </span>
                          <span>该帐号的角色将恢复之前的角色</span>
                        </div>
                        <Button
                          type="primary"
                          long
                          @click="lock(item.organizationMember.userEntity.userId,1)"
                        >确定</Button>
                    </div>-->
                    <div slot="content" v-show="visible4" style="padding:8px 16px;">
                      <div style="margin-top:10px;margin-bottom:10px">
                        <span>你确定把{{ item.organizationMember.userEntity.userName }}从部门移除吗？</span>
                      </div>
                      <Button type="error" long @click="removePartment(item)">确定</Button>
                    </div>
                  </Poptip>
                </Col>
              </Row>
            </CheckboxGroup>
          </div>
        </div>
      </div>
    </Drawer>
  </div>
</template>


<script>
import Loading from "../components/public/common/Loading.vue";
import {
  initOrgMemberNew,
  searchDepartment,
  createBranchs,
  deleteBranch,
  searchOrgMembers,
  changeBranchNames,
  getDepartmentTree,
  getBranchpeople,
  removeBranchPeople
} from "@/axios/companyApi";
import { userOrgRoles, updateOrgUserRole } from "@/axios/api";
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  components: {
    Loading
  },
  data() {
    return {
      depName: "",
      allOrgPeople: [],
      social: "",
      social2: "",
      personPop: false,
      personPop2: false,
      depPop: false,
      departmentTreeNew: [],
      loading: false,
      branchName: "",
      organizationName: localStorage.organizationName, //当前企业名称
      userName: "",
      userImg: "",
      editIndex: "",
      allOrgPeopleCopy: [],
      depId: "", //编辑部门时拿到部门id
      departmentTreeNewCopy: [],
      nowChecked: 0,
      nowIconName: "depIcon0",
      peopleList: [],
      changeName: "", //选中的部门名字
      checkAllGroup: [],
      indeterminate: true,
      checkAll: false,
      roles: [],
      visible: false,
      visible2: false,
      visible1: false,
      visible3: false,
      visible4: false,
      title: "更多菜单",
      roleMemberId: "",
      batchAdd: false, //批量添加弹窗
      batchRemoval: false, // 批量移除
      drawerValue: false,
      loading2: false,
      partmentId: ""
    };
  },
  computed: {
    ...mapState("app", ["header"])
  },
  mounted() {
    this.depName = localStorage.organizationName;
    this.loading = true;
    this.getList();
    this.visibleChange();
  },
  methods: {
    getList() {
      initOrgMemberNew(localStorage.companyId, 0).then(res => {
        if (res.result == 1) {
          this.allOrgPeople = res.data.members;
          this.allOrgPeopleCopy = res.data.members;
        }
        this.loading = false;
      });
      getDepartmentTree(localStorage.companyId).then(res => {
        res.data.forEach(i => {
          i.visible = false;
          i.visible1 = false;
          i.visible2 = false;
          i.visible3 = false;
        });
        this.departmentTreeNew = res.data;
        this.departmentTreeNewCopy = res.data;
      });
      this.branchName = "";
    },
    // 搜索企业内成员  直接搜索
    searchOrgProple(event) {
      this.loading = true;
      if (event.currentTarget.value != "") {
        searchOrgMembers(
          event.currentTarget.value,
          localStorage.companyId
        ).then(res => {
          if (res.result === 1) {
            this.allOrgPeople = res.data;
          } else {
            this.allOrgPeople.length = 0;
            this.$Message.error("未搜索到成员");
          }
          this.loading = false;
        });
      } else {
        this.allOrgPeople = this.allOrgPeopleCopy;
      }
    },
    searchDep(event) {
      this.loading = true;
      if (event.currentTarget.value != "") {
        searchDepartment(
          event.currentTarget.value,
          localStorage.companyId
        ).then(res => {
          if (res.result === 1) {
            this.departmentTreeNew = res.data;
          } else {
            this.departmentTreeNew.length = 0;
            this.$Message.error("未搜索到部门");
          }
          this.loading = false;
        });
      } else {
        this.getList();
      }
    },
    peopleCheck() {
      this.allOrgPeople.forEach(i => {
        if (i.memberId == this.social) {
          this.userName = i.userName;
          this.userImg = i.image;
        }
      });
      this.personPop = false;
      this.depPop = true;
    },
    peopleCheck2() {
      this.allOrgPeople.forEach(i => {
        if (i.memberId == this.social2) {
          this.userName = i.userName;
          this.userImg = i.image;
        }
      });
      this.aditClose(this.editIndex);
    },
    // 创建部门
    createBranch() {
      this.loading = true;
      let data = {
        partmentName: this.branchName,
        memberId: this.social,
        partmentLogo: this.nowIconName
      };
      createBranchs(localStorage.companyId, data).then(res => {
        if (res.result == 1) {
          this.getList();
        }
        this.depPop = false;
        this.branchName = "";
      });
    },
    createSub(item) {
      this.loading = true;
      let data = {
        partmentName: this.branchName,
        parentId: item.id,
        partmentLogo: this.nowIconName
      };
      createBranchs(localStorage.companyId, data).then(res => {
        if (res.result == 1) {
          this.getList();
        }
        this.branchName = "";
      });
    },
    mdClose(index) {
      this.$set(this.departmentTreeNew[index], "visible", false);
      this.$set(this.departmentTreeNew[index], "visible1", false);
      this.$set(this.departmentTreeNew[index], "visible3", false);
    },
    aditClose(index) {
      this.$set(this.departmentTreeNew[index], "visible2", false);
      this.$set(this.departmentTreeNew[index], "visible4", false);
    },
    aditCloseGrandson(indexOne, indexTwo, indexThree) {
      this.$set(
        this.departmentTreeNew[indexOne].childer[indexTwo].indexThree[
          indexThree
        ],
        "visible2",
        false
      );
    },
    editDep(index, item) {
      this.editIndex = index;
      this.branchName = item.name;
      this.depId = item.id;
      if (item.userEntity) {
        this.social2 = item.userEntity.userId;
        this.userName = item.userEntity.userName;
        this.userImg = item.userEntity.defaultImage;
      }
    },
    // 部门新建子部门
    newlyBuild(index, item) {
      this.editIndex = index;
      this.depId = item.id;
      if (item.userEntity) {
        this.social2 = item.userEntity.userId;
        this.userName = item.userEntity.userName;
        this.userImg = item.userEntity.defaultImage;
      }
    },
    // 删除部门
    deleteIt(item) {
      this.loading = true;
      deleteBranch(item.id).then(res => {
        if (res.result == 1) {
          this.$Message.success("删除成功");
          this.getList();
        }
      });
    },
    // 编辑部门后保存
    changeBranchName(item) {
      // this.isCreateBranch = true;
      let data = {
        partmentName: this.branchName,
        memberId: this.social2,
        partmentLogo: this.nowIconName
      };
      changeBranchNames(item.id, data).then(res => {
        if (res.result == 1) {
          // this.isCreateBranch = false;
          this.$Message.success("修改成功");
          this.getList();
        }
      });
    },
    goMember() {
      this.$router.push("/members");
      this.$store.commit("app/changeHeaderTag", 2);
    },
    // 获取子部门
    getChilder(item, index) {
      if (this.departmentTreeNewCopy[index].childer) {
        // console.log('收起')
        delete this.departmentTreeNewCopy[index].childer;
        this.departmentTreeNew = [];
        this.departmentTreeNew = this.departmentTreeNewCopy;
      } else {
        getDepartmentTree("", item.id).then(res => {
          res.data.forEach(value => {
            value.visible = false; //删除
            value.visible1 = false; //编辑
            value.visible2 = false; //负责人
          });
          this.departmentTreeNewCopy[index].childer = res.data;
          this.departmentTreeNew = [];
          this.departmentTreeNew = this.departmentTreeNewCopy;
        });
      }
    },
    getSonChilder(index, v, i) {
      if (this.departmentTreeNewCopy[index].childer[i].grandsonChilden) {
        // console.log('收起')
        delete this.departmentTreeNewCopy[index].childer[i].grandsonChilden;
        this.departmentTreeNew = [];
        this.departmentTreeNew = this.departmentTreeNewCopy;
      } else {
        getDepartmentTree("", v.id).then(res => {
          res.data.forEach(item => {
            item.visible = false; //删除
            item.visible1 = false; //编辑
            item.visible2 = false; //负责人
          });
          this.departmentTreeNewCopy[index].childer[i].grandsonChilden =
            res.data;
          this.departmentTreeNew = [];
          this.departmentTreeNew = this.departmentTreeNewCopy;
        });
      }
    },
    changeTag(index) {
      this.nowChecked = index;
      this.nowIconName = "depIcon" + index;
    },
    // 获取某个部门下成员
    changePartment(id, name) {
      this.loading2 = true;
      this.changeName = name;
      this.partmentId = id;
      getBranchpeople(id).then(res => {
        if (res.result == 1) {
          this.peopleList = res.data;
          this.loading2 = false;
        }
      });
    },
    getUserId(item) {
      this.roleMemberId = item.memberId;
    },
    //更改部门员工角色
    screenRole(roleId) {
      updateOrgUserRole(roleId, this.roleMemberId, localStorage.companyId).then(
        res => {
          if (res.result == 1) {
            this.$Message.success("设置成功");
            // this.getList();
            this.changePartment(this.partmentId, this.changeName);
          } else {
            this.$Message.success("设置失败");
          }
        }
      );
    },
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        this.peopleList.map(p => {
          this.checkAllGroup.push(p.memberId);
        });
      } else {
        this.checkAllGroup = [];
      }
    },
    checkAllGroupChange(data) {
      if (data.length === this.peopleList.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    visibleChange() {
      userOrgRoles(localStorage.userId, localStorage.companyId).then(res => {
        if (res.result == 1) {
          this.roles = res.data;
        }
      });
    },
    //移除部门成员
    removePartment(item) {
      var data = {
        orgId: localStorage.companyId,
        memberId: item.organizationMember.memberId
      };
      removeBranchPeople(this.partmentId, data).then(res => {
        if (res.result == 1) {
          this.$Message.success("移除成功");
          this.changePartment(res.data.partmentId, res.data.partmentName);
        }
      });
    },
    // 从企业部门移除成员 确定
    removePP() {
      this.loading2 = true;
      var data = {
        orgId: localStorage.companyId,
        memberId: this.checkAllGroup.join(",")
      };
      removeBranchPeople(this.partmentId, data).then(res => {
        if (res.result == 1) {
          this.batchRemoval = false;
          this.$Message.success("移除成功");
          this.close();
          this.changePartment(this.partmentId, this.changeName);
        }
      });
    },
    close() {
      this.checkAllGroup = [];
      // this.model5 = "";
      // this.model4 = "";
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