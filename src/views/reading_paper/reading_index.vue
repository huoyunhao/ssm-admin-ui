<template>
    <el-row class="container">
        <el-col :span="24" class="header">
            <el-col :span="10" class="logo">
                阅卷系统
            </el-col>
            <el-col :span="12" class="userinfo">
                <el-form label-width="80px" :inline="true" style="line-height: 100%;">
                    <el-form-item style="margin-top: 10px;">
                        {{userName}}
                    </el-form-item>
                    <el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner">
						<img src="../../../static/img/head.jpg"/></span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>我的消息</el-dropdown-item>
                            <el-dropdown-item>设置</el-dropdown-item>
                            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form>
            </el-col>
        </el-col>
        <el-col :span="24" class="main">
            <aside>
                <!--导航菜单-折叠后-->
                <!--<div class="el-submenu__title" style="padding-left: 20px;"><i data-v-fae5bece="" class="fa fa-file-text"></i>考试管理
                  <i class="el-submenu__icon-arrow el-icon-arrow-down"></i></div>-->

                <el-menu 
                         :default-active="$route.path"
                        class="el-menu-vertical-demo" router unique-opened>

                    <template v-for="(item,index) in menus" >
                            <el-submenu :index="index+''" v-if="item.component != 'leaf'" :key="item.path" >
                                <template slot="title">
                                    <i :class="item.iconCls"></i>{{item.name}}
                                </template>
                                <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path"
                                              v-if="!child.hidden">{{child.name}}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-if="item.component == 'leaf'" :index="item.path"
                                          :key="item.path">
                                <i :class="item.iconCls"></i>{{item.name}}
                            </el-menu-item>
                    </template>


                    <!-- <el-menu-item v-for="(item,index) in menus" :key="index" :index="item.path"  @click="rightSelect = true">
                        <i :class="item.iconCls"></i>
                        <span slot="title">{{item.name}}</span>
                    </el-menu-item> -->
                    <!-- <el-menu-item index="2" @click="checkStadio">
                        <i class="el-icon-setting"></i>
                        <span slot="title">查看评阅标准</span>
                    </el-menu-item> -->
                </el-menu>  
            </aside>
            <section class="content-container">
                <div class="grid-content bg-purple-light">
                    <el-col :span="24" class="breadcrumb-container">
                        <strong class="title">{{$route.name}}</strong>
                        <el-breadcrumb separator="/" class="breadcrumb-inner">
                            <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                                {{ item.name }}
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                    <el-col :span="24" class="content-wrapper">
                        <transition name="fade" mode="out-in">
                            <router-view v-if="display_view"></router-view>
                        </transition>
                    </el-col>
                </div>
            </section>
        </el-col>
    </el-row>
</template>

<script>
    import {get_reading_progress,get_menu } from '../../api/api'


    export default {
        name: "reading_index",
        data() {
            return {
                // 右边显示什么
                rightSelect: true,
                //haveCheckData: false,
                progress:{},
                userName:"",
                menus:[],
                display_view:true,
            }
        },
        methods: {
           
            checkStadio() {
                this.rightSelect = false
                // 获取查看评阅标准
            },
            // 进入评阅
            
            logout() {
                this.$router.push("/login")
            }
        },
        mounted() {
            this.userName = JSON.parse(sessionStorage.getItem("user")).userName;
            //this.get_progress();
            //  获取正常阅卷内容
            get_menu().then(res=>{
                this.menus=res.data.msg
                if(this.menus[0].children.length==1){
                    this.$router.push('/reading_paper_process')
                }
                
            })
        }
    }
</script>

<style scoped lang="less">
    /*@import '../scss_vars';*/

    .container {
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 100%;
        .header {
            height: 60px;
            line-height: 60px;
            background: #20a0ff;
            color: #fff;
            .userinfo {
                text-align: right;
                padding-right: 35px;
                float: right;
                .userinfo-inner {
                    cursor: pointer;
                    color: #fff;
                    img {
                        width: 40px;
                        height: 40px;
                        border-radius: 20px;
                        margin: 10px 0px 10px 10px;
                        float: right;
                    }
                }
            }
            .logo {
                width: 230px;
                height: 60px;
                font-size: 22px;
                padding-left: 20px;
                padding-right: 20px;
                border-color: rgba(238, 241, 146, 0.3);
                border-right-width: 1px;
                border-right-style: solid;
                img {
                    width: 40px;
                    float: left;
                    margin: 10px 10px 10px 18px;
                }
                .txt {
                    color: #fff;
                }
            }
            .logo-width {
                width: 230px !important;
            }
            .logo-collapse-width {
                width: 60px
            }
            .tools {
                padding: 0px 23px;
                width: 14px;
                height: 60px;
                line-height: 60px;
                cursor: pointer;
            }
        }
        .main {
            display: flex; // background: #324057;
            position: absolute;
            top: 60px;
            bottom: 0px;
            overflow: hidden;
            aside {
                flex: 0 0 230px;
                width: 230px; // position: absolute;
                // top: 0px;
                // bottom: 0px;
                .el-menu {
                    height: 100%;
                }
                .collapsed {
                    width: 60px;
                    .item {
                        position: relative;
                    }
                    .submenu {
                        position: absolute;
                        top: 0px;
                        left: 60px;
                        z-index: 99999;
                        height: auto;
                        display: none;
                    }
                }
            }
            .menu-collapsed {
                flex: 0 0 60px;
                width: 60px;
            }
            .menu-expanded {
                flex: 0 0 230px;
                width: 230px;
            }
            .content-container {
                // background: #f1f2f7;
                flex: 1; // position: absolute;
                // right: 0px;
                // top: 0px;
                // bottom: 0px;
                // left: 230px;
                overflow-y: scroll;
                padding: 20px;
                .breadcrumb-container {
                    //margin-bottom: 15px;
                    .title {
                        width: 200px;
                        float: left;
                        color: #475669;
                    }
                    .breadcrumb-inner {
                        float: right;
                    }
                }
                .content-wrapper {
                    background-color: #fff;
                    box-sizing: border-box;
                }
            }
        }
    }

    .fade1-enter-active {
        transition: all .4s ease;
    }

    .fade1-leave-active {
        transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .fade1-enter
        /* .slide-fade-leave-active for below version 2.1.8 */
    {
        transform: translateX(-230px);
        opacity: 0;
    }

    .fade1-leave-to {
        transform: translateX(-230px);
        opacity: 0;
        width: 60px;

    }

    .normal-item {
        text-align: center;
        border-bottom: 1px solid #d9d9d9;
        padding-bottom: 30px;
        color: #606266;
        & > * {
            display: inline-block;
        }
        .normal-item-title {
            display: block;
            text-align: center;
            width: 100%;
            margin-bottom: 20px;
            -webkit-transform: translateX(-20px);
            -moz-transform: translateX(-20px);
            -ms-transform: translateX(-20px);
            -o-transform: translateX(-20px);
            transform: translateX(-20px);
            font-size: 18px;
        }
        button:nth-of-type(1) {
            float: left;
            font-size: 16px;
            width: 50px;
            height: 50px;
        }
        button:nth-of-type(2) {
            float: right;
        }
        & > div {
            width: 60%;

        }
    }

    .not-have-paper {
        font-size: 20px;
        text-align: center;
        height: 60px;
        line-height: 60px;
        color: #303133;
    }
</style>
