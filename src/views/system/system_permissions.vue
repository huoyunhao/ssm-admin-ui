<template>
    <section>
        <!--上工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">

                <el-form-item>
                    <el-button type="primary" @click="open_menu">菜单管理</el-button>
                </el-form-item>
                <span>菜单预览</span>
                <el-cascader
                        :options="system_menus"
                        v-model="selectedOptions"
                        expand-trigger="hover"


                        :props="props"
                >
                </el-cascader>

                <el-form-item>
                    <el-button type="success" ref="date_search">角色管理</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="warning">用户管理</el-button>
                </el-form-item>

            </el-form>
        </el-col>
        <el-col :span="24" class="toolbar" style="">
            <span>菜单预览</span>
            <el-cascader
                    :options="system_menus"
                    v-model="selectedOptions"
                    expand-trigger="hover"


                    :props="props"
            >
            </el-cascader>




        </el-col>


        <!--列表-->
        <!--<el-table :data="menus" highlight-current-row v-loading="listLoading" @selection-change="selsChange"-->
                  <!--style="width: 100%;">-->


        <!--</el-table>-->

        <!--下工具条-->
        <el-col :span="24" class="toolbar">
            <!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->

        </el-col>
        <el-dialog title="菜单管理" :visible.sync="display_menu" :close-on-click-modal="false">
            <el-form :model="menuForm" label-width="80px"  ref="menuForm">
                <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="menuForm.menuName" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="菜单url">
                    <el-input v-model="menuForm.menuUrl" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="菜单备注">
                    <el-input v-model="menuForm.menuRemark" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="上级菜单">
                    <el-input v-model="menuForm.menuParentId" auto-complete="off"></el-input>
                </el-form-item>



            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="display_menu = false">取消</el-button>
                <el-button type="primary" @click.native="add_menu" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>


    </section>
</template>



<script>
    // import util from '../../common/js/util'
    // import NProgress from 'nprogress'
    // import {get_cir_menu,add_system_menu} from '../../api/api';
    // import {js_date} from '../../components/js_date/js_date'


    export default {
        data() {
            return {

                listLoading: false,
                sels: [],//列表选中列

                display_menu:false,
                display_user:false,
                display_role:false,
                addLoading : false,



                menus: [
                    {
                        "menuId": "0c7f2b3dea1e441da420c8b4b7d161d1",
                        "menuName": "系统管理",
                        "menuUrl": "",
                        "menuRemark": "2",
                        "menuParentId": "",

                    },
                    {
                        "menuId": "0c7f2b3dea1e441da420c8b4b7d161d1",
                        "menuName": "角色管理",
                        "menuUrl": "",
                        "menuRemark": "2",
                        "menuParentId": "0c7f2b3dea1e441da420c8b4b7d161d1",

                    },


                ],
                system_menus: [
                    {
                        "menuId": "0c7f2b3dea1e441da420c8b4b7d161d1",
                        "menuName": "系统管理",
                        "menuUrl": "",
                        "menuRemark": "2",
                        "menuParentId": "",
                        "children": [

                            {
                                "menuId": "af4b52968dde4695b244deb7571f1a8b",
                                "menuName": "菜单管理",
                                "menuUrl": "",
                                "menuRemark": "2",
                                "menuParentId": "0c7f2b3dea1e441da420c8b4b7d161d1",
                                "children": [
                                    {
                                        "menuId": "ewd",
                                        "menuName": "ff",
                                        "menuUrl": "ff",
                                        "menuRemark": "f",
                                        "menuParentId": "af4b52968dde4695b244deb7571f1a8b",
                                        "children": [ ]
                                    }
                                ]
                            },
                            {
                                "menuId": "af4b52968dde4695b244deb7571f1a8b",
                                "menuName": "菜单管理",
                                "menuUrl": "",
                                "menuRemark": "2",
                                "menuParentId": "0c7f2b3dea1e441da420c8b4b7d161d1",
                                "children": [
                                    {
                                        "menuId": "ewd",
                                        "menuName": "ff",
                                        "menuUrl": "ff",
                                        "menuRemark": "f",
                                        "menuParentId": "af4b52968dde4695b244deb7571f1a8b",
                                        "children": [ ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                props:{
                    value:'menuId',
                    label:'menuName'

                },
                selectedOptions:[],
                menuForm:{
                    "menuName": "",
                    "menuUrl": "",
                    "menuRemark": "",
                    "menuParentId": ""


                },




            }
        },
        methods: {
            get_menus_cir() {

                get_menu().then((res) => {
                    this.system_menus = res;


                })

            },
            add_menu(){
                this.addLoading = true;
                add_system_menu(this.menuForm).then((res) =>{
                    this.addLoading = false;
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.menuForm = {
                        "menuName": "",
                        "menuUrl": "",
                        "menuRemark": "",
                        "menuParentId": ""

                    };
                    this.get_menus_cir();
                    this.display_menu=false;


                })
            },
            open_menu(){
                this.display_menu = true;
                this.menuForm = {
                    "menuName": "",
                    "menuUrl": "",
                    "menuRemark": "",
                    "menuParentId": ""

                }
            }


        },
        watch: {},
        mounted() {
            this.get_menus_cir();


        },
        components:{
            // select,

        }
    }

</script>

<style scoped="scoped">

</style>