<template>
    <el-row class="container">
        <el-col :span="24" class="header">
            <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
                {{collapsed?'':sysName}}
            </el-col>
            <el-col :span="2">
                <div class="tools" @click.prevent="collapse">
                    <i class="fa fa-align-justify"></i>
                </div>
            </el-col>
            <el-col :span="12" class="userinfo">
                <el-form label-width="80px" :inline="true" style="line-height: 100%;">


                    <el-form-item style="margin-top: 10px;">
                        <el-select v-model="school_id" :placeholder="now_school_name"
                                   @change="select_school"
                                   style="width: 201px;margin-right: 20px"
                                   filterable
                        >
                            <el-option v-for="item in this.companys" :value="item.companyId" :key="item.companyId"
                                       :label="item.companyName"></el-option>

                        </el-select>
                        <span>{{sysUserName}}</span>
                    </el-form-item>
                    <el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner">
						<img src="../../static/img/head.jpg"/> </span>
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

            <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
                <!--导航菜单-->

                <transition name="fade1" mode="out-in" >
                    <el-menu :class="collapsed?'menu-collapsed':'menu-expanded'" :default-active="$route.path"
                             class=""
                             @open="handleopen" @close="handleclose" @select="handleselect" unique-opened router
                             v-show="!collapsed" ref="menu1">
                        <template v-for="(item,index) in menus" >
                            <el-submenu :index="index+''" v-if="item.component != 'leaf'" :key="index">
                                <template slot="title">
                                    <i :class="item.iconCls"></i>{{item.name}}
                                </template>
                                <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path"
                                              v-if="!child.hidden">{{child.name}}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-if="item.component == 'leaf'" :index="item.path"
                                          :key="index">
                                <i :class="item.iconCls"></i>{{item.name}}
                            </el-menu-item>
                        </template>
                    </el-menu>
                </transition>


                <!--导航菜单-折叠后-->
                <ul class="el-menu  collapsed" v-show="collapsed" ref="menuCollapsed">
                    <li v-for="(item,index) in menus"  class="el-submenu item"
                        :key="index">
                        <template v-if="item.component != 'leaf'">
                            <div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)"
                                 @mouseout="showMenu(index,false)">
                                <i :class="item.iconCls"></i>
                            </div>
                            <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)"
                                @mouseout="showMenu(index,false)">
                                <li v-for="child in item.children" v-if="!child.hidden" :key="child.path"
                                    class="el-menu-item" style="padding-left: 40px;"
                                    :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">
                                    {{child.name}}
                                </li>
                            </ul>
                        </template>
                        <template v-else>
                            <div class="el-submenu">
                                <div class="el-submenu__title el-menu-item"
                                     style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;width: 60px"
                                     :class="$route.path==item.path?'is-active':''"
                                     @click="$router.push(item.path)"
                                     v-on:mouseover.prevent="leaf_show(item.name,item.iconCls)"
                                     @mouseout.prevent="leaf_close(item.iconCls)"
                                     ref="leaf1"


                                >
                                    <i :class="item.iconCls"></i>
                                    <!--{{item.children[0].name}}-->
                                </div>
                            </div>
                        </template>

                    </li>
                </ul>


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
                    <el-col :span="24" class="content-wrapper" id="view_content">
                        <transition name="fade2" mode="out-in">
                            <router-view v-if="display_view"></router-view>
                        </transition>
                    </el-col>
                </div>
            </section>
        </el-col>
    </el-row>
</template>

<script>
    import {companys,get_menu,get_company} from '../api/api';


    export default {
        data() {
            return {
                sysName: 'AI阅卷管理系统',
                collapsed: false,
                sysUserName: '',
                sysUserAvatar: '',
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                companys: [],
                school_id: '',
                now_school_name: '请选择学校',
                menus:[],
                display_view:true,
                user:{}
            }
        },
        methods: {
            onSubmit() {
                console.log('submit!');
            },
            handleopen() {
                //console.log('handleopen');
            },
            handleclose() {
                //console.log('handleclose');
            },
            handleselect: function (a, b) {
            },
            //退出登录
            logout: function () {
                var _this = this;
                this.$confirm('确认退出吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    sessionStorage.removeItem('user');
                    _this.$router.push('/login');
                }).catch(() => {

                });


            },
            //折叠导航栏
            collapse: function () {

                if(this.collapsed == true){
                    this.$refs.menu1.$el.style.width = '230px'
                    // console.log(this.$refs.menu1)


                }
                this.collapsed = !this.collapsed;
            },
            showMenu(i, status) {
                this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
            },

            leaf_show(name,ico){
                console.log(1);
                console.log(this.$refs.leaf1);
                this.$refs.leaf1[0].innerHTML = `<i class="${ico}"></i>`+name;
                this.$refs.leaf1[0].style.zIndex = '1000';


            },
            leaf_close(ico){
                this.$refs.leaf1[0].innerHTML = `<i class="${ico}"></i>`;
                this.$refs.leaf1[0].style.zIndex = '';
                this.$refs.leaf1[0].style.width = '60px';

            },


            select_school() {
                this.$message({
                    showClose: true,
                    message: '学校切换成功！',
                    type: 'success'
                });

                for(let i in this.companys){
                    if(this.school_id == this.companys[i].companyId){
                        sessionStorage.setItem('school_parentId_id', this.companys[i].parentId);
                    }

                }
                sessionStorage.setItem('school_id', this.school_id);
                //局部刷新路由
                this.display_view = false;
                setTimeout(()=>{
                    this.display_view = true
                },1)
                // this.display_view = true;



            },
            mod_menu(){
                get_menu().then((res)=>{
                    this.menus = res.data.msg;


                })
            }
        },
        mounted() {
            var user = sessionStorage.getItem('user');
            if (user) {
                user = JSON.parse(user);
                this.sysUserName = user.userName || '';
                this.sysUserAvatar = user.avatar || '';
            }



            this.school_id = sessionStorage.getItem('school_id');

            let that = this;

            get_company().then((res) => {


                that.companys = res.data.msg;

                if (this.school_id) {
                    for (let i = 0; i < that.companys.length; i++) {
                        if (that.companys[i].companyId == this.school_id) {
                            that.now_school_name = that.companys[i].companyName;
                            break;
                        }
                    }
                }
                for(let i in this.companys){
                    console.log(1);
                    if(this.school_id == this.companys[i].companyId){

                        sessionStorage.setItem('school_parentId_id', this.companys[i].parentId);
                    }

                }

            });

            this.mod_menu();

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
                //width:230px;
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
                width: 230px;
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
                width: 230px ;
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
    #view_content{
        overflow-x: hidden;
    }

    .fade1-enter-active {
    transition: all .9s ease;
    }
    .fade1-leave-active {
    transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .fade1-enter
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(-230px);
    opacity:0;
    }
    .fade1-leave-to{
        transform: translateX(-230px);
        opacity: 0;
        width: 60px;

    }

    .fade2-leave-active,
    .fade2-enter-active {
        transition: all .3s;
    }
    .fade2-enter {
        opacity: 0;
        transform: translateX(-30px);
    }
    .fade2-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }
</style>
