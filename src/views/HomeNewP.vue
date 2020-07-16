<template>
   <div class="layout" >
       <div class='layout-left'  :class=" isCollapsed?'big':'small'" >  
           
            <Menu active-name="1-2" :theme="'dark'"  v-if="isCollapsed">
                <Submenu name="1">
                    <template slot="title">
                        <Icon type="ios-analytics" />
                         项目列表
                    </template>                   
                        <MenuItem name="1-1">我的项目</MenuItem>
                        <MenuItem name="1-2">项目分析</MenuItem>
                        <MenuItem name="1-3">我的收藏</MenuItem>
                        <MenuItem name="1-4">已归档项目</MenuItem>
                        <MenuItem name="1-4">回收站</MenuItem>
                        <MenuItem name="1-4">我的组织</MenuItem>      
                </Submenu>
                <Submenu name="2">
                    <template slot="title">
                        <Icon type="ios-filing" />
                       基础设置
                    </template>
                    <MenuItem name="2-1">项目模板</MenuItem>
                </Submenu>
                <Submenu name="4">
                    <template slot="title">
                        <Icon type="ios-cog" />
                       消息提醒
                    </template>
                    <MenuItem name="4-1">站内消息</MenuItem>
                    <MenuItem name="4-2">系统公告</MenuItem>
                    
                </Submenu>
            </Menu>
            <div class="small-Menu" v-else>
                    <ul>
                        <li>
                            <Icon type="ios-analytics" />
                        </li>
                        <li>
                            <Icon type="ios-filing" />
                        </li>
                        <li>
                            <Icon type="ios-cog" />
                        </li>
                    </ul>
            </div>
            

            
 
            <div class="trigger" @click="collapsedSider" >
                <Icon type="ios-arrow-back" />
            </div>   
       </div>
       <div class="layout-right">
            <Tabs value="name1">
                <TabPane label="全部项目" name="name1">
                        <Row  class="ant-list-item">
                                <Col span="14" class="info-title">
                                    <img src="https://i.loli.net/2017/08/21/599a521472424.jpg" alt="">
                                    <div>
                                        <div class="contant" >      
                                            <a href=""> Angular</a>                               
                                            
                                            <div class="level">普通</div>
                                        </div>
                                        <span>
                                            希望是一个好东西，也许是最好的，好东西是不会消亡的
                                        </span>
                                    </div>
                                </Col>
                                <Col span="2" class="info-item" >
                                    <div>创建日期</div>
                                    <span>2018-12-23</span>
                                </Col>
                                <Col span="2" class="info-item">
                                    <div>创建人</div>
                                    <span>vilson</span>
                                </Col>
                                <Col span="3" class="info-item">
                                    <span>进度</span>
                                    <span><Progress :percent="25"  /></span>
                                </Col>
                                <Col span="3" >
                                    <div class="info-icon">
                                        <Tooltip content="添加成员" placement="top">
                                            <Icon type="ios-person-add-outline" size='18' />
                                        </Tooltip>     
                                        <Tooltip content="项目设置" placement="top">
                                            <Icon type="ios-cog" size='18' />
                                        </Tooltip> 
                                        <Tooltip content="收藏" placement="top">
                                            <Icon type="md-star" size='18'  ></Icon>
                                        </Tooltip> 
                                        <Tooltip content="移置回收站" placement="top">
                                            <Icon type="ios-trash-outline" size='18' />
                                        </Tooltip> 
                                    </div>
                                    
                                </Col>
                        </Row>
                         <Row  class="ant-list-item">
                                <Col span="14" class="info-title">
                                    <img src="https://i.loli.net/2017/08/21/599a521472424.jpg" alt="">
                                    <div>
                                        <div class="contant" >      
                                            <a href=""> Angular</a>                               
                                            
                                            <div class="level">普通</div>
                                        </div>
                                        <span>
                                            希望是一个好东西，也许是最好的，好东西是不会消亡的
                                        </span>
                                    </div>
                                </Col>
                                <Col span="2" class="info-item" >
                                    <div>创建日期</div>
                                    <span>2018-12-23</span>
                                </Col>
                                <Col span="2" class="info-item">
                                    <div>创建人</div>
                                    <span>vilson</span>
                                </Col>
                                <Col span="3" class="info-item">
                                    <span>进度</span>
                                    <span><Progress :percent="25"  /></span>
                                </Col>
                                <Col span="3" >
                                    <div class="info-icon">
                                        <Tooltip content="添加成员" placement="top">
                                            <Icon type="ios-person-add-outline" size='18' />
                                        </Tooltip>     
                                        <Tooltip content="项目设置" placement="top">
                                            <Icon type="ios-cog" size='18' />
                                        </Tooltip> 
                                        <Tooltip content="收藏" placement="top">
                                            <Icon type="md-star" size='18'  ></Icon>
                                        </Tooltip> 
                                        <Tooltip content="移置回收站" placement="top">
                                            <Icon type="ios-trash-outline" size='18' />
                                        </Tooltip> 
                                    </div>
                                    
                                </Col>
                        </Row>
                         <Row  class="ant-list-item">
                                <Col span="14" class="info-title">
                                    <img src="https://i.loli.net/2017/08/21/599a521472424.jpg" alt="">
                                    <div>
                                        <div class="contant" >      
                                            <a href=""> Angular</a>                               
                                            
                                            <div class="level">普通</div>
                                        </div>
                                        <span>
                                            希望是一个好东西，也许是最好的，好东西是不会消亡的
                                        </span>
                                    </div>
                                </Col>
                                <Col span="2" class="info-item" >
                                    <div>创建日期</div>
                                    <span>2018-12-23</span>
                                </Col>
                                <Col span="2" class="info-item">
                                    <div>创建人</div>
                                    <span>vilson</span>
                                </Col>
                                <Col span="3" class="info-item">
                                    <span>进度</span>
                                    <span><Progress :percent="25"  /></span>
                                </Col>
                                <Col span="3" >
                                    <div class="info-icon">
                                        <Tooltip content="添加成员" placement="top">
                                            <Icon type="ios-person-add-outline" size='18' />
                                        </Tooltip>     
                                        <Tooltip content="项目设置" placement="top">
                                            <Icon type="ios-cog" size='18' />
                                        </Tooltip> 
                                        <Tooltip content="收藏" placement="top">
                                            <Icon type="md-star" size='18'  ></Icon>
                                        </Tooltip> 
                                        <Tooltip content="移置回收站" placement="top">
                                            <Icon type="ios-trash-outline" size='18' />
                                        </Tooltip> 
                                    </div>
                                    
                                </Col>
                        </Row>
                         <Row  class="ant-list-item">
                                <Col span="14" class="info-title">
                                    <img src="https://i.loli.net/2017/08/21/599a521472424.jpg" alt="">
                                    <div>
                                        <div class="contant" >      
                                            <a href=""> Angular</a>                               
                                            
                                            <div class="level">普通</div>
                                        </div>
                                        <span>
                                            希望是一个好东西，也许是最好的，好东西是不会消亡的
                                        </span>
                                    </div>
                                </Col>
                                <Col span="2" class="info-item" >
                                    <div>创建日期</div>
                                    <span>2018-12-23</span>
                                </Col>
                                <Col span="2" class="info-item">
                                    <div>创建人</div>
                                    <span>vilson</span>
                                </Col>
                                <Col span="3" class="info-item">
                                    <span>进度</span>
                                    <span><Progress :percent="25"  /></span>
                                </Col>
                                <Col span="3" >
                                    <div class="info-icon">
                                        <Tooltip content="添加成员" placement="top">
                                            <Icon type="ios-person-add-outline" size='18' />
                                        </Tooltip>     
                                        <Tooltip content="项目设置" placement="top">
                                            <Icon type="ios-cog" size='18' />
                                        </Tooltip> 
                                        <Tooltip content="收藏" placement="top">
                                            <Icon type="md-star" size='18'  ></Icon>
                                        </Tooltip> 
                                        <Tooltip content="移置回收站" placement="top">
                                            <Icon type="ios-trash-outline" size='18' />
                                        </Tooltip> 
                                    </div>
                                    
                                </Col>
                        </Row>
                         <Row  class="ant-list-item">
                                <Col span="14" class="info-title">
                                    <img src="https://i.loli.net/2017/08/21/599a521472424.jpg" alt="">
                                    <div>
                                        <div class="contant" >      
                                            <a href=""> Angular</a>                               
                                            
                                            <div class="level">普通</div>
                                        </div>
                                        <span>
                                            希望是一个好东西，也许是最好的，好东西是不会消亡的
                                        </span>
                                    </div>
                                </Col>
                                <Col span="2" class="info-item" >
                                    <div>创建日期</div>
                                    <span>2018-12-23</span>
                                </Col>
                                <Col span="2" class="info-item">
                                    <div>创建人</div>
                                    <span>vilson</span>
                                </Col>
                                <Col span="3" class="info-item">
                                    <span>进度</span>
                                    <span><Progress :percent="25"  /></span>
                                </Col>
                                <Col span="3" >
                                    <div class="info-icon">
                                        <Tooltip content="添加成员" placement="top">
                                            <Icon type="ios-person-add-outline" size='18' />
                                        </Tooltip>     
                                        <Tooltip content="项目设置" placement="top">
                                            <Icon type="ios-cog" size='18' />
                                        </Tooltip> 
                                        <Tooltip content="收藏" placement="top">
                                            <Icon type="md-star" size='18'  ></Icon>
                                        </Tooltip> 
                                        <Tooltip content="移置回收站" placement="top">
                                            <Icon type="ios-trash-outline" size='18' />
                                        </Tooltip> 
                                    </div>
                                    
                                </Col>
                        </Row>
                         <Row  class="ant-list-item">
                                <Col span="14" class="info-title">
                                    <img src="https://i.loli.net/2017/08/21/599a521472424.jpg" alt="">
                                    <div>
                                        <div class="contant" >      
                                            <a href=""> Angular</a>                               
                                            
                                            <div class="level">普通</div>
                                        </div>
                                        <span>
                                            希望是一个好东西，也许是最好的，好东西是不会消亡的
                                        </span>
                                    </div>
                                </Col>
                                <Col span="2" class="info-item" >
                                    <div>创建日期</div>
                                    <span>2018-12-23</span>
                                </Col>
                                <Col span="2" class="info-item">
                                    <div>创建人</div>
                                    <span>vilson</span>
                                </Col>
                                <Col span="3" class="info-item">
                                    <span>进度</span>
                                    <span><Progress :percent="25"  /></span>
                                </Col>
                                <Col span="3" >
                                    <div class="info-icon">
                                        <Tooltip content="添加成员" placement="top">
                                            <Icon type="ios-person-add-outline" size='18' />
                                        </Tooltip>     
                                        <Tooltip content="项目设置" placement="top">
                                            <Icon type="ios-cog" size='18' />
                                        </Tooltip> 
                                        <Tooltip content="收藏" placement="top">
                                            <Icon type="md-star" size='18'  ></Icon>
                                        </Tooltip> 
                                        <Tooltip content="移置回收站" placement="top">
                                            <Icon type="ios-trash-outline" size='18' />
                                        </Tooltip> 
                                    </div>
                                    
                                </Col>
                        </Row>
                      
                       
                        
                        
 
                </TabPane>
                <TabPane label="我的收藏" name="name2">我的收藏</TabPane>
                <TabPane label="已归档" name="name3">已归档</TabPane>
                <TabPane label="回收站" name="name4">回收站</TabPane>
            </Tabs>
       </div>
   </div>
</template>

<script>

import { mapActions, mapState, mapMutations } from "vuex";

export default {

  components: {
    
  },
  data() {
    return {
         spanLeft: 5,
         spanRight: 19,
         isCollapsed: true,
    };
  },
  computed: {
     ...mapState("app", ["header"])
  },
  mounted() {
   
  },
  methods: {

    collapsedSider () {
            this.isCollapsed=!this.isCollapsed;

             this.$store.commit("app/changeHeader", this.isCollapsed);
            
    },
 

    toggleClick () {

            if (this.spanLeft === 5) {
                this.spanLeft = 2;
                this.spanRight = 22;
            } else {
                this.spanLeft = 5;
                this.spanRight = 19;
            }

         }
   
  },
  watch: {
    $route(to, from) {
    }
  }
};

</script>
<style scoped lang="less">

.layout{
        height: calc(100vh - 65px);
        background: #f4f3f4;
        position: relative;
        overflow: hidden;
        display: flex;
    }
    .big{
        width: 240px
    }
    .small{
        width: 80px;
    }
    

    .layout-left{
       height: calc(100vh - 48px);
       background: #515a6e;
       position: relative;
       .menu{
           color: #ffffff;
           li{
               height: 40px;
              line-height: 40px;
              padding:0px 10px;
              cursor: pointer;
              i{
                  padding-right: 10px;
              }
           }
       }
       .trigger{
           cursor: pointer;
           position: absolute;
           bottom: 0;
           z-index: 999999;
           width: 100%;
           height:48px;
           line-height: 48px;
           font-size: 20px;
           text-align: center;
           background: #002140;
           i{
               color: #ffffff;
           }
       }
       .small-Menu{
           width: 80px;
           li{
               color: #fff;
               height: 40px;
               line-height: 40px;
               text-align: center;
               padding: 1em 0;
               i{
                   font-size: 20px;
               }
           }
           li:hover{
               cursor: pointer;
               color: #2d8cf0
               
           }
       }
    }





    .layout-right{
        flex: 1;
        margin: 24px;
        padding: 24px;
        background: #fff;
        overflow-y: auto;
        
        .ant-list-item{
            padding: 1em 0;
            border-bottom: 1px solid #e5e4e5;
            color: #8c8c8c;
            .info-title{
                    display: flex;
                    flex-flow: row nowrap;
                    line-height: 24px;;
                    img{
                        width: 50px;
                        height: 50px;
                        border-radius: 3px;
                        margin-right: 1em;
                    }
                    .contant{
                        display: flex;
                        
                        a{
                            font-weight: bold;
                        }
                        .level{
                            cursor: pointer;
                            height: 22px;
                            line-height: 20px;
                            color: #52c41a;
                            background: #f6ffed;
                            border-color: #b7eb8f;
                            margin-left: 1em;
                            border: 1px solid #aee884;
                            padding: 0 5px;
                            border-radius: 4px;
                        }

                    }
            }
            .info-item{
                display: flex;
                flex-flow: column wrap;
            }
            .info-icon{
                padding-top: 15px;
                i{
                    cursor: pointer;
                    padding:0  0.3em;
                    border-right:1px solid  #e5e4e5;
                }
                i:last-child{
                    
                    border-right:none;
                }
            }
        }
        
    }
   
    

</style>
