<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="schfilter" placeholder="年级信息"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getGrades">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="grades" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <!--<el-table-column prop="id" label="id" width="220" sortable>-->
            <!--</el-table-column>-->
            <el-table-column prop="gradeName" label="年级" width="100" sortable>
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="100" sortable>
            </el-table-column>
            <el-table-column prop="companyName" label="所属学校" width="100" sortable>

            </el-table-column>



            <!--<el-table-column prop="grade_name" label="所属年级" width="100"  sortable>-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="school_name" label="所属学校" width="120"  sortable>-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="age" label="年龄" width="100" sortable>-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="birth" label="生日" width="120" sortable>-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="addr" label="地址" min-width="180" sortable>-->
            <!--</el-table-column>-->
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px"  ref="editForm">
                <el-form-item label="年级" prop="name">
                    <el-input v-model="editForm.gradeName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="name">
                    <el-input v-model="editForm.remark" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="所属学校">
                    <el-select v-model="editForm.companyId" placeholder="请选择学校"
                               style="width: 201px;margin-right: 20px">
                        <el-option v-for="item in this.companys" :value="item.companyId" :key="item.companyId"
                                   :label="item.companyName"></el-option>

                    </el-select>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading" id="test">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px"  ref="addForm">
                <el-form-item label="年级名称" prop="name">
                    <el-input v-model="addForm.gradeName" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="所属学校">
                    <el-select v-model="addForm.companyId" placeholder="请选择学校"
                               style="width: 201px;margin-right: 20px">
                        <el-option v-for="item in companys" :value="item.companyId" :key="item.companyId"
                                   :label="item.companyName"></el-option>

                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="name">
                    <el-input v-model="addForm.remark" auto-complete="off"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>


        <el-dialog title="选择学校" :visible.sync="set_school_view" :close-on-click-modal="false">
            <span><i class="el-icon-warning"></i>请先在页面<span style="color: red">右上角</span>选择学校！</span>
            <div slot="footer" class="dialog-footer">

                <el-button type="primary" @click.native="set_school" :loading="addLoading">知道了</el-button>
            </div>
        </el-dialog>


    </section>
</template>

<script>
    import util from '../../common/js/util'
    import NProgress from 'nprogress'
    import {view_grade, add_grade, dec_grade, companys, update_grade,batch_remove_grade,get_company} from '../../api/api';

    export default {
        data() {
            return {
                grade_name: '',
                grade_companyId: '',
                filters: {
                    name: ''
                },
                grades:
                    [

                    ],
                total: 0,
                page: 1,
                listLoading: true,
                sels: [],//列表选中列
                companyId: '',
                //学校列表
                companys: [],
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editForm: {
                    "gradeId": "",
                    "companyId": "",
                    "gradeName": "",
                    "remark": ""
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
                    "gradeId": "",
                    "companyId": "",
                    "gradeName": "",
                    "remark": ""
                },


                school_ids: '',
                school_id: '',
                set_school_view: false,

                schfilter:''

            }
        },
        methods: {
            //性别显示转换
            formatSex: function (row, column) {
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getGrades();
            },
            //获取年级列表
            getGrades() {
                let id = sessionStorage.getItem('school_id');
                this.listLoading = true;
                NProgress.start();
                view_grade(id).then((res) => {
                    // 	this.total = res.data.total;
                    console.log(res);
                    this.grades = res.data.grades;
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
                    NProgress.start();
                    let para =  row.gradeId;
                    console.log(para);
                    dec_grade(para).then((res) => {
                        this.listLoading = false;
                        NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getGrades();
                    });
                }).catch(() => {


                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = row;
                console.log(row);
            },
            //显示新增界面
            handleAdd: function () {
                // console.log('123');
                this.addFormVisible = true;

                this.addForm = {
                    "gradeId": "",
                    "companyId": "",
                    "gradeName": "",
                    "remark": ""
                };
            },
            //编辑
            editSubmit: function () {


                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.editLoading = true;
                    //NProgress.start();
                    let para = {
                        "gradeId": this.editForm.gradeId,
                        "companyId": this.editForm.companyId,
                        "gradeName": this.editForm.gradeName,
                        "remark": this.editForm.remark
                    }
                    // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                    update_grade(para).then((res) => {
                        this.editLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        this.$refs['editForm'].resetFields();
                        this.editFormVisible = false;
                        this.getGrades();
                    });
                });


            },
            //新增
            addSubmit: function () {


                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.addLoading = true;
                    //NProgress.start();
                    let para = this.addForm;
                    // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                    add_grade(para).then((res) => {
                        this.addLoading = false;
                        if (res.code == "200") {

                            //NProgress.done();
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.$refs['addForm'].resetFields();
                            this.addFormVisible = false;
                            this.getGrades();
                        } else {
                            this.$message({
                                message: '提交失败',
                                type: 'warning'
                            });
                            this.$refs['addForm'].resetFields();
                            this.addFormVisible = false;
                            this.getGrades();
                        }
                        console.log(res);

                    });
                });


            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.gradeId);
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {ids: ids};
                    batch_remove_grade(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getGrades();
                    });
                }).catch(() => {

                });
            },

            set_school: function () {

                this.set_school_view = false;
                this.addLoading = false;
                this.$router.push({path: '/main'});


            }

        },
        mounted() {

            // view_grade().then(
            //   (res) =>{
            //     this.stu_grade=res.data;
            //
            //   }
            // );
            let that = this;
            console.log(document.querySelector("#test"));
            get_company().then((res) => {
                that.companys = res.data.msg;
                // console.log(res.data.company);
                console.log(that.companys);

            })
            if (sessionStorage.getItem('school_id') == undefined) {
                that.set_school_view = true;
            }
            this.getGrades();
        },
        watch: {
            // schfilter: function(val, oldVal){
            //     this. grades = this. grades.filter( item => (~item.name.indexOf(val)));
            // }
        },
    }

</script>

<style scoped="scoped">

</style>

