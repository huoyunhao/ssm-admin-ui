<template>
    <section>
        <!--上工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <!--<el-form-item>-->
                <!--<el-input v-model="filters.name" placeholder="年级信息"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                <!--<el-button type="primary" v-on:click="getGrades">查询</el-button>-->
                <!--</el-form-item>-->
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">注册用户</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>

            <el-table-column prop="userAccount" label="用户账号" width="200" sortable>
            </el-table-column>
            <el-table-column prop="userName" label="用户名" width="200"  sortable>
            </el-table-column>
          <el-table-column prop="userGender" label="性别" width="100"  sortable>
            </el-table-column>
          <el-table-column prop="status" label="状态" width="150"  sortable>
            </el-table-column>
          <el-table-column prop="companyName" label="机构" width="150"  sortable>
            </el-table-column>
          <el-table-column prop="remark" label="备注" width="150"  sortable>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="primary" size="small" @click="display_ass_role(scope.row)" v-if="view_ass">角色分配</el-button>
                    <!--<el-button  type="primary" size="small"  @click="view_menu(scope.row)">分配角色菜单</el-button>-->
                    <!--<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>-->
                </template>
            </el-table-column>
        </el-table>

        <!--下工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="total,  prev, pager, next, jumper" @current-change="handleCurrentChange"
                           :page-size="pageSize" @size-change="handleSizeChange"
                           :total="total" style="float:right;" :current-page="pageNum">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="用户账号">
                    <el-input v-model="editForm.userAccount" auto-complete="off" style="width: 50%"
                              onkeyup="value=value.replace(/[^\w_]/g, '')"></el-input>
                </el-form-item>

                <el-form-item label="用户密码">
                    <el-input v-model="editForm.userPass" auto-complete="off" type="password"
                              style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="确认用户密码">
                    <el-input v-model="editForm.userPrePass" auto-complete="off" type="password"
                              style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称">
                    <el-input v-model="editForm.userName" auto-complete="off" type="text" style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="用户性别">
                    <el-radio-group v-model="editForm.userGender">
                        <el-radio label="男">男</el-radio>
                        <el-radio label="女">女</el-radio>

                    </el-radio-group>
                    <!--<el-input v-model="addForm.userGender" auto-complete="off" type="text"></el-input>-->
                </el-form-item>
                <el-form-item label="所属机构">
                    <el-select v-model="editForm.companyId" placeholder="请选择机构">
                        <el-option
                                v-for="item in companies"
                                :key="item.companyId"
                                :label="item.companyName"
                                :value="item.companyId">
                        </el-option>
                    </el-select>
                    <!--<el-input v-model="addForm.companyId" auto-complete="off" type="text"></el-input>-->
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--分配角色-->
      <el-dialog title="分配角色" :visible.sync="ass_visible" :close-on-click-modal="false">
        <div style="margin-bottom: 20px"><span aria-checked="mixed" class="el-checkbox__input is-checked"><span class="el-checkbox__inner"></span><input type="checkbox" aria-hidden="true" class="el-checkbox__original"></span>
          <span>为当前角色</span></div>
        <el-checkbox-group v-model="tmp_roleId">
          <template v-for="item in roles">
            <el-checkbox :label="item.roleId" border class="checkBox">{{item.roleName+'//'+item.remark}}</el-checkbox>
            <br/>


          </template>


        </el-checkbox-group>


        <div slot="footer" class="dialog-footer">
          <el-button @click.native="ass_visible = false">关闭</el-button>
          <el-button type="primary" @click.native="sub_ass" :loading="editLoading">分配</el-button>

        </div>
      </el-dialog>

        <!--新增界面-->
        <el-dialog title="注册" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
                <el-form-item label="用户账号">
                    <el-input v-model="addForm.userAccount" auto-complete="off" style="width: 50%"
                              onkeyup="value=value.replace(/[^\w_]/g, '')"></el-input>
                </el-form-item>

                <el-form-item label="用户密码">
                    <el-input v-model="addForm.userPass" auto-complete="off" type="password"
                              style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="确认用户密码">
                    <el-input v-model="addForm.userPrePass" auto-complete="off" type="password"
                              style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称">
                    <el-input v-model="addForm.userName" auto-complete="off" type="text" style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="用户性别">
                    <el-radio-group v-model="addForm.userGender">
                        <el-radio label="男">男</el-radio>
                        <el-radio label="女">女</el-radio>

                    </el-radio-group>
                    <!--<el-input v-model="addForm.userGender" auto-complete="off" type="text"></el-input>-->
                </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="addForm.remark" auto-complete="off" type="text" style="width: 50%"></el-input>
              </el-form-item>
                <el-form-item label="所属机构">
                    <el-select v-model="addForm.companyId" placeholder="请选择机构">
                        <el-option
                                v-for="item in companies"
                                :key="item.companyId"
                                :label="item.companyName"
                                :value="item.companyId">
                        </el-option>
                    </el-select>
                    <!--<el-input v-model="addForm.companyId" auto-complete="off" type="text"></el-input>-->
                </el-form-item>
                <el-form-item label="用户角色">
                    <el-select v-model="addForm.roleId" placeholder="请选择角色">
                        <el-option
                                v-for="item in login_roles"
                                :key="item.roleId"
                                :label="item.remark"
                                :value="item.roleId">
                        </el-option>
                    </el-select>
                    <!--<el-input v-model="addForm.roleId" auto-complete="off" type="text"></el-input>-->
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
    import {
        add_user,
        get_all_user,
        ass_user_role,
        get_all_role,
        del_user,
        get_user_role,
        get_login_company,
        get_login_role,
        update_user
    } from '../../../api/api';
    import Template_paper_upload from "../../exam_process/make_paper/template_paper_upload";

    export default {
        components: {Template_paper_upload},
        data() {
            return {

                listLoading: true,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    subjectName: [
                        {required: true, message: '请输入科目名称', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editForm: {
                    "userAccount": "",
                    "userName": "",
                    "userGender": "",
                    "userPass": "",
                    "userPrePass": "",
                    "companyId": ""

                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //新增界面数据
                addForm: {
                    "userAccount": "",
                    "userPass": "",
                    "userPrePass": "",
                    "userName": "",
                    "userGender": "",
                    "companyId": "",
                    "roleId": "",
                    "remark": ""
                },
                roles: [],
                menu_visible: false,
                menus: [],
                all_menu: [],
                props: {
                    value: "menuId",
                    label: "name"
                },
                selectedOptions: [],
                ass_menu: {
                    "roleId": "",
                    "menuId": []

                },


                users: [],

                pageNum: 0,
                pageSize: 0,
                size: 0,
                startRow: 0,
                endRow: 0,
                total: 0,
                pages: 0,
                ass_visible: false,
                ass: {
                    "roleId": "",
                    "userId": ""
                },
                tmp_roleId: [],
                users_roles: [],
                companies: [],
                login_roles: [],
                view_ass: false


            }
        },
        methods: {
            get_all_users(page) {
                get_all_user(page,sessionStorage.getItem('school_id')).then((res) => {
                  console.log(res);
                    this.pageNum = res.data.msg.pageNum;
                    this.pageSize = res.data.msg.pageSize;
                    this.total = res.data.msg.total;
                    this.pages = res.data.msg.pages;
                    this.users = res.data.msg.list;
                    for (let item of this.users) {
                      if (item.status == 0) {
                        item.status = '启用'
                      }
                      else
                        item.status = '未启用'

                    }
                    this.listLoading = false;


                })


            },
            handleCurrentChange(val) {


                this.get_all_users(val);


            },
            handleSizeChange: function (size) {
                this.pageSize = size;
            },
          display_ass_role(row) {
            this.tmp_roleId = [];
            this.roles = [];
            get_user_role(row.userPermId).then((res) => {
              this.users_roles = res.data.msg.roleIds;

              this.roles.push(this.users_roles);

              for(let i in this.users_roles){
                this.tmp_roleId.push(this.users_roles[i].roleId);
              }



            });

            this.ass_visible = true;
            this.ass = {
              "userId": row.userPermId,
              "roleId": "",

            };
            this.get_roles();


          },
            sub_ass() {
                let add_roles = "";
                for (let i in this.tmp_roleId) {
                    add_roles = add_roles + this.tmp_roleId[i] + '_';

                }

                this.ass.roleId = add_roles;
                let para = this.ass;
                this.editLoading = true;
                ass_user_role(para).then((res) => {
                    this.editLoading = false;
                    this.$message({
                        message: '分配成功',
                        type: 'success'
                    });
                    this.ass_visible = false;
                    this.tmp_roleId = [];


                })

            },


            //获取角色
            get_roles() {

                this.listLoading = true;
                NProgress.start();

                get_all_role().then((res) => {
                  console.log(res);
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
                    "userAccount": row.userAccount,
                    "userName": "",
                    "userGender": "",
                    "userPass": "",
                    "userPrePass": "",
                    "companyId": "",
                    "userId": row.userPermId

                };

                // this.editForm = {
                //     "roleName": row.roleName,
                //     "remark": row.remark,
                //     "roleId": row.roleId
                // };
            },
            //显示新增界面
            handleAdd: function () {
              get_all_role().then((res) => {
                console.log(res);

                this.login_roles = res.data.msg;
              });
                this.addFormVisible = true;
                this.addForm = {
                    "userAccount": "",
                    "userPass": "",
                    "userPrePass": "",
                    "userName": "",
                    "userGender": "",
                    "companyId": "",
                    "roleId": ""

                };


            },
            //编辑
            editSubmit: function () {
                if (this.editForm.userPass != this.editForm.userPrePass) {
                    this.$message({
                        message: "两次密码输入不一致！",
                        type: "warning"
                    })
                } else {
                    let userId = this.editForm.userId;
                    delete this.editForm.userId;
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.editLoading = true;

                        delete this.editForm.userPrePass;
                        update_user(userId,this.editForm).then((res) => {
                            this.$message({
                                message:'修改成功',
                                type:'success'
                            })
                            this.editLoading = false;
                            this.editFormVisible = false;
                            this.get_all_users(1);



                        });


                    });


                }


            },
            //新增
            addSubmit: function () {
                if (this.addForm.userPass != this.addForm.userPrePass) {
                    this.$message({
                        message: "两次密码输入不一致！",
                        type: "warning"
                    })
                } else {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.addLoading = true;
                        delete this.addForm.userPrePass;
                        console.log(this.addForm);

                        let para = this.addForm;
                        add_user(para).then((res) => {
                          console.log(res);
                            if (res.code == "200") {
                                this.addLoading = false;

                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                // this.get_roles();
                                // this.get_roles();
                            } else {
                                this.addLoading = false;
                                this.$message({
                                    message: '提交失败',
                                    type: 'warning'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                // this.getSubjects();
                            }
                            this.get_all_users(1);
                        });
                    });

                }


            },
            view_menu(row) {
                get_role_menu(row.roleId).then((res) => {
                    this.menus = res.data.msg;
                    this.menu_visible = true;


                })

            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {


                let para1 = {ids: this.sels.map(item => item.userPermId)};
                let para = "";
                for (let i in this.sels.map(item => item.userPermId)) {
                    para = para + this.sels.map(item => item.userPermId)[i] + '_';

                }


                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();


                    del_user(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.get_all_users(1);
                    });
                }).catch(() => {


                });
            }
        },
        mounted() {
            this.get_all_users(1);
            get_login_company().then((res) => {
                this.companies = res.data.msg;

            });

            if(JSON.parse(sessionStorage.getItem("user")).companyId == "1000"){

                this.view_ass = true;
            }

        },

        // computed: {
        //     inputValue: {
        //         get: function () {
        //             return this.as;
        //         },
        //         set: function (newValue) {
        //             this.inputValue = newValue.replace(/[^\d]/g, '');
        //         }
        //     }
        // }


    }

</script>

<style scoped="scoped">

</style>
