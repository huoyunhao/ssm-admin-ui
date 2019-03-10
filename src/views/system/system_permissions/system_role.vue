<template>
    <section>
        <!--上工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" >
                <!--<el-form-item>-->
                <!--<el-input v-model="filters.name" placeholder="年级信息"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                <!--<el-button type="primary" v-on:click="getGrades">查询</el-button>-->
                <!--</el-form-item>-->
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="roles" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>

            <el-table-column prop="roleName" label="角色名称"  sortable>
            </el-table-column>
            <el-table-column prop="remark" label="角色备注"   sortable>
            </el-table-column>

            <el-table-column label="操作" width="600">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">分配权限</el-button>
                    <el-button  type="primary" size="small"  @click="view_menu(scope.row)">拥有权限</el-button>
                    <!--<el-button  type="primary" size="small"  @click="view_menu(scope.row)">分配角色菜单</el-button>-->
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--下工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <!--<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">-->
            <!--</el-pagination>-->
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px"  ref="editForm">
                <el-form-item label="角色名称">
                    <el-input v-model="editForm.roleName" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="角色编号" prop="remark">
                    <el-input v-model="editForm.remark" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="分配菜单">
                    <!--<el-select v-model="ass_menu.menuId" placeholder="请选择" clearable-->
                               <!--multiple-->
                               <!--&gt;-->

                        <!--<el-option-->
                                <!--v-for="item in all_menu"-->
                                <!--:key="item.menuId"-->
                                <!--:label="item.menuParentId+'/'+item.name"-->
                                <!--:value="item.menuId"-->
                               <!--&gt;-->


                        <!--</el-option>-->




                    <!--</el-select>-->
                    <el-tree
                            :data="cir_menus"
                            show-checkbox


                            :props="defaultProps"
                            ref="edit_tree"
                            node-key="menuId"
                            default-expand-all

                    >
                    </el-tree>
                    <!--check-strictly-->
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--查看子菜单-->
        <el-dialog title="编辑" :visible.sync="menu_visible" :close-on-click-modal="false">
            <!--<el-cascader-->
                    <!--:options="menus"-->
                    <!--v-model="selectedOptions"-->
                    <!--expand-trigger="hover"-->



                    <!--:props="props"-->
            <!--&gt;-->
            <!--</el-cascader>-->
            <el-tree
                    :data="menus"
                    show-checkbox


                    :props="defaultProps"
                    ref="view_tree"
                    node-key="menuId"
                    default-expand-all

            >
            </el-tree>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="menu_visible = false">关闭</el-button>

            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="角色名称" >
                    <el-input v-model="addForm.roleName" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="角色备注">
                    <el-input v-model="addForm.remark" auto-complete="off"></el-input>
                </el-form-item>



            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../../common/js/util'
    import NProgress from 'nprogress'
    import { add_role,get_all_role,update_role ,del_role,get_role_menu,role_add_menu,get_all_menu,get_menu_by_id,get_cir_menu} from '../../../api/api';
    export default {
        data() {
            return {

                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,

                //编辑界面数据
                editForm: {
                    "roleName": "",
                    "remark": ""


                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    "roleName": "",
                    "remark": ""
                },
                roles:[],
                menu_visible:false,
                menus:[],
                all_menu:[],
                props:{
                    value:"menuId",
                    label:"name"
                },
                selectedOptions:[],
                ass_menu:{
                    "roleId": "",
                    "menuId": []

                },
                cir_menus:[],
                defaultProps: {
                    children: 'children',
                    label: 'name',

                },





            }
        },
        methods: {
            get_cir_menu(){
                get_cir_menu().then((res) => {
                    this.cir_menus= res;


                })
            },
            // get_all_menus() {
            //
            //     get_all_menu().then((res) => {
            //         this.all_menu = res.data.msg;
            //         console.log(this.all_menu);
            //         for(let i  in  this.all_menu){
            //             if(this.all_menu[i].menuParentId != undefined && this.all_menu[i].menuParentId != ""){
            //                 get_menu_by_id(this.all_menu[i].menuParentId).then((res) =>{
            //                     let name = "";
            //
            //                     name = res.data.msg.name;
            //                     this.all_menu[i].menuParentId=name;
            //
            //                     this.$set(this.all_menu,i,this.all_menu[i]);
            //
            //
            //                     // return name;
            //
            //                 })
            //
            //
            //
            //
            //             }
            //
            //
            //
            //
            //
            //
            //         }
            //         this.listLoading = false;
            //
            //
            //
            //
            //
            //
            //
            //
            //     })
            //
            // },


            //获取角色
            get_roles() {

                this.listLoading = true;
                NProgress.start();

                get_all_role().then((res) => {
                    // 	this.total = res.data.total;
                    // console.log(res);
                    this.roles = res.data.msg;
                    this.listLoading = false;
                    NProgress.done();
                });
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = row.roleId;
                    del_role(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.get_roles();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;

                this.editForm = {
                    "roleName": row.roleName,
                    "remark": row.remark,
                    "roleId": row.roleId
                };
            },
            //显示新增界面
            handleAdd: function () {

                this.addFormVisible = true;
                this.addForm = {
                    "roleName": "",
                    "remark": "",

                };


            },
            //编辑
            editSubmit: function () {


                this.$confirm('确认提交吗？', '提示', {}).then(() => {

                    let ass_menus = this.$refs.edit_tree.getCheckedKeys().concat(this.$refs.edit_tree.getHalfCheckedKeys());

                    // console.log(this.$refs.edit_tree.getHalfCheckedKeys());
                    // console.log(this.$refs.edit_tree.getCheckedKeys());
                    this.editLoading = true;
                    let menus1 = "";
                    for(let i in ass_menus){
                        menus1 =menus1+`${ass_menus[i]}_`


                    }
                    // console.log(menus1);
                    let para1 = {
                        "roleId": this.editForm.roleId,
                        "menuId": menus1
                    }
                    role_add_menu(para1).then((res)=>{
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });



                    })

                    let para = {
                        "roleName": this.editForm.roleName,
                        "remark": this.editForm.remark

                    };

                    update_role(this.editForm.roleId,para).then((res) => {
                        this.editLoading = false;

                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.$refs['editForm'].resetFields();
                        this.editFormVisible = false;
                        this.get_roles();
                    });
                });


            },
            //新增
            addSubmit: function () {


                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.addLoading = true;

                    let para = this.addForm;

                    add_role(para).then((res) => {
                        if(res.code == "200"){
                            this.addLoading = false;

                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.$refs['addForm'].resetFields();
                            this.addFormVisible = false;
                            this.get_roles();
                            this.get_roles();
                        }else {
                            this.addLoading = false;
                            this.$message({
                                message: '提交失败',
                                type: 'warning'
                            });
                            this.$refs['addForm'].resetFields();
                            this.addFormVisible = false;
                            // this.getSubjects();
                        }


                    });
                });


            },
            //查看角色菜单
            view_menu(row){
                get_role_menu(row.roleId).then((res) =>{
                    this.menus = res.data.msg;
                    this.menu_visible = true;


                })

            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {


                let para1 = { ids: this.sels.map(item => item.subjectId) };

                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();

                    batch_remove_subject(para1).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getSubjects();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {

            this.get_roles();
            this.get_cir_menu();
        }
    }

</script>

<style scoped="scoped">

</style>
