<template>
  <div class="wrap-box">
    <Row class-name="page-header">
        <Col span="24">
              <div class="header-title">
                  『 为遇一人而入红尘，人去我亦去，此生不留尘。』 —— 《魔道祖师》 
              </div>
              <div class="header-contant">
                <div class="left-contant">
                    <div>
                        <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" class="avatar"/>
                    </div>
                    <div>
                      <div class="title">下午好，vilson.li，祝你开心每一天！</div>
                      <div class="team">资深架构师|技术部 - 研发部</div>
                    </div>
                </div>
                <div class="right-contant">
                    <div class="contant-item">
                        <div class="title">
                              团队人数
                        </div>
                        <div class="number">
                              10
                        </div>
                    </div>
                    <div class="contant-item">
                        <div class="title">
                              项目总数
                        </div>
                        <div class="number">
                              4
                        </div>
                    </div>
                </div>

              </div>
        </Col>
    </Row>
    <div class="page-wrapper">
        <Row  :gutter="24" >
                <Col span="17">
                    <Card style="width:100%; ">
                        <p slot="title">
                            进行中的项目
                        </p>
                        <a href="#"  class="font-bold" slot="extra" @click.prevent="changeLimit">
                            全部项目
                        </a>
                        <ul class="porject-contant">
                          <li>
                             <div class="title">
                                <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" class="avatar"/>
                                <Icon type="md-star" size="15" ></Icon>
                                <span>Angular</span>
                             </div>
                             <div class="description">
                                  <span>希望是一个好东西，也许是最好的，好东西是不会消亡的</span>
                                   <Progress :percent="25" hide-info />
                             </div>
                             <div class="datetime">
                               <span>vilson</span>
                               <span>12月23日 8:31</span>
                             </div>
                          </li>
                           <li>
                             <div class="title">
                                <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" class="avatar"/>
                                <Icon type="md-star" size="13" ></Icon>
                                <span>Angular</span>
                             </div>
                             <div class="description">
                                  <span>希望是一个好东西，也许是最好的，好东西是不会消亡的</span>
                                   <Progress :percent="25" hide-info />
                             </div>
                             <div class="datetime">
                               <span>vilson</span>
                               <span>12月23日 8:31</span>
                             </div>
                          </li>
                          <li>
                             <div class="title">
                                <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" class="avatar"/>
                                <Icon type="md-star" size="13" ></Icon>
                                <span>Angular</span>
                             </div>
                             <div class="description">
                                  <span>希望是一个好东西，也许是最好的，好东西是不会消亡的</span>
                                   <Progress :percent="25" hide-info />
                             </div>
                             <div class="datetime">
                               <span>vilson</span>
                               <span>12月23日 8:31</span>
                             </div>
                          </li>
                          <li>
                             <div class="title">
                                <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" class="avatar"/>
                                <Icon type="md-star" size="13" ></Icon>
                                <span>Angular</span>
                             </div>
                             <div class="description">
                                  <span>希望是一个好东西，也许是最好的，好东西是不会消亡的</span>
                                   <Progress :percent="25" hide-info />
                             </div>
                             <div class="datetime">
                               <span>vilson</span>
                               <span>12月23日 8:31</span>
                             </div>
                          </li>
                          <li>
                             <div class="title">
                                <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" class="avatar"/>
                                <Icon type="md-star" size="13" ></Icon>
                                <span>Angular</span>
                             </div>
                             <div class="description">
                                  <span>希望是一个好东西，也许是最好的，好东西是不会消亡的</span>
                                   <Progress :percent="25" hide-info />
                             </div>
                             <div class="datetime">
                               <span>vilson</span>
                               <span>12月23日 8:31</span>
                             </div>
                          </li>
                        </ul>
                    </Card>
                     <Card  style="width:100%;margin:1.5em 0">
                        <p slot="title">
                             动态
                        </p>
                        <List class="dynamic-contant">
                            <ListItem>
                                <ListItemMeta
                                 avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" 
                                 title="vilson更新了内容 "
                                 description="7分钟前 - Vue" />
                                 <template slot="action">
                                    <li>
                                        <a href="" class="font-bold">「 2312321 」</a>
                                    </li>
                                </template>
                            </ListItem>
                            <ListItem>
                                <ListItemMeta
                                 avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" 
                                 title="vilson更新了内容 "
                                 description="7分钟前 - Vue" />
                                 <template slot="action">
                                    <li>
                                        <a href="" class="font-bold">「 2312321 」</a>
                                    </li>
                                </template>
                            </ListItem>
                            <ListItem>
                                <ListItemMeta
                                 avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" 
                                 title="vilson更新了内容 "
                                 description="7分钟前 - Vue" />
                                 <template slot="action">
                                    <li>
                                        <a href="" class="font-bold">「 2312321 」</a>
                                    </li>
                                </template>
                            </ListItem>
                            <ListItem>
                                <ListItemMeta
                                 avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" 
                                 title="vilson更新了内容 "
                                 description="7分钟前 - Vue" />
                                 <template slot="action">
                                    <li>
                                        <a href="" class="font-bold">「 2312321 」</a>
                                    </li>
                                </template>
                            </ListItem>
                            <ListItem>
                                <ListItemMeta
                                 avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" 
                                 title="vilson更新了内容 "
                                 description="7分钟前 - Vue" />
                                 <template slot="action">
                                    <li>
                                        <a href="" class="font-bold">「 2312321 」</a>
                                    </li>
                                </template>
                            </ListItem>
                            <ListItem>
                                <ListItemMeta
                                 avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" 
                                 title="vilson更新了内容 "
                                 description="7分钟前 - Vue" />
                                 <template slot="action">
                                    <li>
                                        <a href="" class="font-bold">「 2312321 」</a>
                                    </li>
                                </template>
                            </ListItem>
                            <ListItem>
                                <ListItemMeta
                                 avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" 
                                 title="vilson更新了内容 "
                                 description="7分钟前 - Vue" />
                                 <template slot="action">
                                    <li>
                                        <a href="" class="font-bold">「 2312321 」</a>
                                    </li>
                                </template>
                            </ListItem>
                            <ListItem>
                                <ListItemMeta
                                 avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" 
                                 title="vilson更新了内容 "
                                 description="7分钟前 - Vue" />
                                 <template slot="action">
                                    <li>
                                        <a href="" class="font-bold">「 2312321 」</a>
                                    </li>
                                </template>
                            </ListItem>
                            <ListItem>
                                <ListItemMeta
                                 avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" 
                                 title="vilson更新了内容 "
                                 description="7分钟前 - Vue" />
                                 <template slot="action">
                                    <li>
                                        <a href="" class="font-bold">「 2312321 」</a>
                                    </li>
                                </template>
                            </ListItem>
                            <ListItem>
                                <ListItemMeta
                                 avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" 
                                 title="vilson更新了内容 "
                                 description="7分钟前 - Vue" />
                                 <template slot="action">
                                    <li>
                                        <a href="" class="font-bold">「 2312321 」</a>
                                    </li>
                                </template>
                            </ListItem>
                            <ListItem>
                                <ListItemMeta
                                 avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" 
                                 title="vilson更新了内容 "
                                 description="7分钟前 - Vue" />
                                 <template slot="action">
                                    <li>
                                        <a href="" class="font-bold">「 2312321 」</a>
                                    </li>
                                </template>
                            </ListItem>
                            <ListItem>
                                <ListItemMeta
                                 avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" 
                                 title="vilson更新了内容 "
                                 description="7分钟前 - Vue" />
                                 <template slot="action">
                                    <li>
                                        <a href="" class="font-bold">「 2312321 」</a>
                                    </li>
                                </template>
                            </ListItem>
                            <ListItem>
                                <ListItemMeta
                                 avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" 
                                 title="vilson更新了内容 "
                                 description="7分钟前 - Vue" />
                                 <template slot="action">
                                    <li>
                                        <a href="" class="font-bold">「 2312321 」</a>
                                    </li>
                                </template>
                            </ListItem>
                            <ListItem>
                                <ListItemMeta
                                 avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" 
                                 title="vilson更新了内容 "
                                 description="7分钟前 - Vue" />
                                 <template slot="action">
                                    <li>
                                        <a href="" class="font-bold">「 2312321 」</a>
                                    </li>
                                </template>
                            </ListItem>
                            <ListItem>
                                <ListItemMeta
                                 avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" 
                                 title="vilson更新了内容 "
                                 description="7分钟前 - Vue" />
                                 <template slot="action">
                                    <li>
                                        <a href="" class="font-bold">「 2312321 」</a>
                                    </li>
                                </template>
                            </ListItem>

                        </List>
                    </Card>
                </Col>
              
                <Col span="7">
                     <Card style="width:100%; ">
                          <p slot="title">
                              我的任务 · 201
                          </p>
                          
                              <Select  slot="extra" v-model="classify"  class="selectBox"    style="width:93px; margin-top:-5px;">
                                    <Option v-for="item in classifyList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                              </Select>
                          
                          <div class="task-contant-waper">
                            <Tabs value="name1" >
                                <TabPane label="我执行的" icon="ios-apps-outline " name="name1">
                                  <ul class="task-contant">
                                    <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                     <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                     <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                     <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                     <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                     <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                     <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                     <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li> <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                     <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                  </ul>
                                  <div class="task-page">
                                      <Page :total="100" />
                                  </div>
                                </TabPane>
                                <TabPane label="我参于的" icon="ios-contacts-outline " name="name2">
                                  <ul class="task-contant">
                                    <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                     <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                     <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                     <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                     <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                     <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                     <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                     <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li> <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                     <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                  </ul>
                                  <div class="task-page">
                                      <Page :total="100" />
                                  </div>
                                </TabPane>
                                <TabPane label="我创建的" icon="md-clipboard"  name="name3">
                                  <ul class="task-contant">
                                    <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                     <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                     <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                     <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                     <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                     <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                     <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                     <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li> <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                     <li>
                                       <div>
                                         <div class="level">普通</div>
                                           <Tooltip content="909090" placement="right">
                                             <span>909090</span>
                                          </Tooltip>
                                       </div>
                                       <div>
                                         1111
                                       </div>
                                    </li>
                                  </ul>
                                  <div class="task-page">
                                      <Page :total="100" />
                                  </div>
                                </TabPane>
                            </Tabs>
                          </div>
                     </Card>
                      <Card style="width:100%; margin-top:1.5em">
                          <p slot="title">
                              团队 · 21
                          </p>
                          
                          <ul class="team-contant">
                              <li>
                                  <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" class="avatar"/>
                                  <span>
                                    掌上
                                  </span>
                              </li>
                              <li>
                                  <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" class="avatar"/>
                                  <span>
                                    暴躁
                                  </span>
                              </li>
                              <li>
                                  <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" class="avatar"/>
                                  <span>
                                    译制
                                  </span>
                              </li>
                              <li>
                                  <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" class="avatar"/>
                                  <span>
                                    译制
                                  </span>
                              </li>
                          </ul>
                     </Card>
                </Col>
        </Row>
    </div>

    

    

  </div>
</template>

<script>

import { mapActions, mapState, mapMutations } from "vuex";

export default {
  name: "index",
  components: {
    
  },
  data() {
    return {
         classify:'已完成',
         classifyList:[
                      {name:"未完成"},
                      {name:"已完成"},
                      
                ],
    };
  },
  computed: {
    
  },
  mounted() {
   
  },
  methods: {
   
  },
  watch: {
    $route(to, from) {
    }
  }
};

</script>
<style scoped lang="less">


</style>
