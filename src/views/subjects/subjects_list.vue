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
        <el-table :data="subject" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>

            <el-table-column prop="subjectName" label="科目名称" width="100"  sortable>
            </el-table-column>
            <el-table-column prop="remark" label="科目备注" width="100"  sortable>
            </el-table-column>

            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="科目名称" prop="subjectName">
                    <el-input v-model="editForm.subjectName" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="科目编号" prop="remark">
                    <el-input v-model="editForm.remark" auto-complete="off"></el-input>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="科目名称" prop="subjectName">
                    <el-input v-model="addForm.subjectName" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="科目备注">
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
    import util from '../../common/js/util'
    import NProgress from 'nprogress'
    import {  get_subjects_list,edit_subject,add_subject,dec_subject,batch_remove_subject} from '../../api/api';
    export default {
        data() {
            return {

                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    subjectName: [
                        { required: true, message: '请输入科目名称', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    "subjectName": "",
                        "remark": "",
                    subject_id:""

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
                    "subjectName": "",
                    "remark": ""
                },


                //科目列表
                subject: [
                    // {
                    //     "subjectId": "3e519ebdd9ad4e119daa5d20afa87d27",
                    //     "subjectName": "物理",
                    //     "remark": "备注，可选"
                    // },

                ]

            }
        },
        methods: {


            //获取科目列表
            getSubjects() {

                this.listLoading = true;
                NProgress.start();

                get_subjects_list().then((res) => {
                    // 	this.total = res.data.total;
                    // console.log(res);
                    this.subject = res.data.subject;
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
                    let para = row.subjectId;
                    dec_subject(para).then((res) => {
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
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;

                this.editForm = {
                    "subjectName": row.subjectName,
                    "remark": row.remark,
                    "subject_id":row.subjectId
                };
            },
            //显示新增界面
            handleAdd: function () {

                this.addFormVisible = true;
                this.addForm = {
                    "subjectName": "",
                    "remark": ""
                };


            },
            //编辑
            editSubmit: function () {


                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.editLoading = true;

                    let para = {
                        "subjectName": this.editForm.subjectName,
                        "remark": this.editForm.remark
                    }

                    edit_subject(para,this.editForm.subject_id).then((res) => {
                        this.editLoading = false;

                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.$refs['editForm'].resetFields();
                        this.editFormVisible = false;
                        this.getSubjects();
                    });
                });


            },
            //新增
            addSubmit: function () {


                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.addLoading = true;

                    let para = this.addForm;

                    add_subject(para).then((res) => {
                        if(res.code == "200"){
                            this.addLoading = false;

                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.$refs['addForm'].resetFields();
                            this.addFormVisible = false;
                            this.getSubjects();
                        }else {
                            this.$message({
                                message: '提交失败',
                                type: 'warning'
                            });
                            this.$refs['addForm'].resetFields();
                            this.addFormVisible = false;
                            this.getSubjects();
                        }


                    });
                });


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
            this.getSubjects();

            // view_grade().then(
            //   (res) =>{
            //     this.stu_grade=res.data;
            //
            //   }
            // );
            // get_company().then((res)=>{
            //   this.companys=res.data;
            //
            // })
            // this.getGrades();
        }
    }

</script>

<style scoped="scoped">

</style>
