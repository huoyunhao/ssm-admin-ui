<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" >
                <el-form-item>
                    <el-input v-model="fiterStudents" placeholder="请输入学生姓名"></el-input>
                </el-form-item>
                <!--<el-form-item>-->
                    <!--<el-button type="primary" v-on:click="ser">查询</el-button>-->
                <!--</el-form-item>-->
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="handeleSel">按条件筛选</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="students" highlight-current-row
                  v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="stuNumber" label="学号" width="220" sortable>
            </el-table-column>
            <el-table-column prop="stuEnrolmentNumber" label="学籍号" width="220" sortable>
            </el-table-column>
            <el-table-column prop="stuName" label="学生姓名" width="100" sortable>
            </el-table-column>
            <el-table-column prop="stuGender" label="学生性别" width="100" sortable>
            </el-table-column>
            <el-table-column prop="className" label="所属班级" width="100" sortable>
            </el-table-column>
            <el-table-column prop="gradeName" label="所属年级" width="100" sortable>
            </el-table-column>
            <!--<el-table-column prop="companyName" label="所属学校" width="120"  sortable>-->
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
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pagesize" @size-change="handleSizeChange"
                           :total="total" style="float:right;" :current-page="currentPage" >
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px"  ref="editForm">
                <el-form-item label="姓名" >
                    <el-input v-model="editForm.stuName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别" >
                    <el-radio v-model="editForm.stuGender" label="男">男</el-radio>
                    <el-radio v-model="editForm.stuGender" label="女">女</el-radio>
                </el-form-item>
                <el-form-item label="学号">
                    <el-input v-model="editForm.stuNumber" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="学籍号">
                    <el-input v-model="editForm.stuEnrolmentNumber" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="所属年级">
                    <el-select v-model="editForm.gradeId" placeholder="请选择年级"
                               style="width: 201px;margin-right: 20px" @change="e_get_class_by_grade">
                        <el-option v-for="item in this.stu_grade" :value="item.gradeId" :key="item.gradeId"
                                   :label="item.gradeName" ></el-option>


                    </el-select>
                </el-form-item>
                <el-form-item label="所属班级">
                    <el-select v-model="editForm.classId" placeholder="请选择">
                        <el-option
                                v-for="item in stu_class"
                                :key="item.classId"
                                :label="item.className "
                                :value="item.classId">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px"  ref="addForm">
                <el-form-item label="姓名" >
                    <el-input v-model="addForm.stuName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别" >
                    <el-radio v-model="addForm.stuGender" label="男">男</el-radio>
                    <el-radio v-model="addForm.stuGender" label="女">女</el-radio>
                </el-form-item>
                <el-form-item label="学号">
                    <el-input v-model="addForm.stuNumber" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="学籍号">
                    <el-input v-model="addForm.stuEnrolmentNumber" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="所属年级">
                    <el-select v-model="addForm.gradeId" placeholder="请选择年级"
                               style="width: 201px;margin-right: 20px" @change="a_get_class_by_grade">
                        <el-option v-for="item in this.stu_grade" :value="item.gradeId" :key="item.gradeId"
                                   :label="item.gradeName" ></el-option>


                    </el-select>
                </el-form-item>
                <el-form-item label="所属班级">
                    <el-select v-model="addForm.classId" placeholder="请选择">
                        <el-option
                                v-for="item in stu_class"
                                :key="item.classId"
                                :label="item.className "
                                :value="item.classId">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--筛选页面-->
        <el-dialog title="筛选" :visible.sync="sel_visible" :close-on-click-modal="false">
            <el-form :model="sel_form" label-width="80px">


                <el-form-item label="年级">
                    <el-select v-model="sel_form.gradeId" placeholder="请选择年级"
                               style="width: 201px;margin-right: 20px" @change="get_class_by_grade">
                        <el-option v-for="item in this.stu_grade" :value="item.gradeId" :key="item.gradeId"
                                   :label="item.gradeName"></el-option>


                    </el-select>
                </el-form-item>

                <el-form-item label="班级">

                    <el-select v-model="sel_form.classId" placeholder="请选择">
                        <el-option
                                v-for="item in stu_class"
                                :key="item.classId"
                                :label="item.className "
                                :value="item.classId">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="sel_visible = false">取消</el-button>
                <el-button type="primary" @click.native="getStudents_by_grade" :loading="addLoading">提交</el-button>
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
    import {
        update_student,
        get_students_by_grade,
        get_students_by_class,
        get_students_by_school,
        add_student,
        dec_student,

        view_grade,
        get_classes_list,

        ser_classes_by_grade,
        del_students,
        ser_student_by_name
    } from '../../api/api';

    export default {
        data() {
            return {


                set_school_view: false,
                stu_class: [],
                stu_grade: [],
                currentPage: 1,
                pagesize: 10,
                // stu_company: '',
                // id: '',
                // user_company: '',
                // user_grade: '',
                // filters: {
                //     stu_number: "1",
                //     name: ''
                // },
                // filterTableDataEnd: [],
                // users:
                //     [
                //         {
                //             name: '测试',
                //             number: '2018'
                //
                //
                //         }
                //     ],
                total: 36,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                // editFormRules: {
                //     name: [
                //         {required: true, message: '请输入姓名', trigger: 'blur'}
                //     ]
                // },
                //编辑界面数据
                editForm: {},

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //新增界面数据
                addForm: {
                    "stuId": "",
                    "classId": "",
                    "gradeId": "",
                    "stuNumber": "",
                    "stuName": "",
                    "stuGender": "",
                    "stuEnrolmentNumber": "",
                    "remark": ""
                },
                sel_form: {
                    classId: '',
                    gradeId: ''

                },
                sel_visible: false,
                students: [],
                allStudents:[],
                fiterStudents:''


            }
        },


        methods: {
            handleSizeChange: function (size) {
                this.pagesize = size;
            },
            // doFilter(){
            //   if (this.filters.name== "") {
            //     this.$message.warning("查询条件不能为空！");
            //     return;
            //   }
            //   //this.tableDataEnd = []
            //   //每次手动将数据置空,因为会出现多次点击搜索情况
            //   this.filterTableDataEnd=[]
            //   this.users.forEach((value, index) => {
            //     if(value.name){
            //       if(value.name.indexOf(this.filters.name)>=0){
            //         this.filterTableDataEnd.push(value)
            //       }
            //     }
            //   });
            // },
            //修正在选择年级条件下班级信息
            get_class_by_grade: function () {
                this.sel_form.classId = null;
                ser_classes_by_grade(this.sel_form.gradeId).then( (res) =>{
                    this.stu_class=res.data.classes;
                })

            },
            a_get_class_by_grade: function () {
                this.addForm.classId = null;
                ser_classes_by_grade(this.addForm.gradeId).then( (res) =>{
                    this.stu_class=res.data.classes;
                })

            },
            e_get_class_by_grade: function () {
                this.editForm.classId = null;
                ser_classes_by_grade(this.editForm.gradeId).then( (res) =>{
                    this.stu_class=res.data.classes;
                })

            },

            //性别显示转换
            // ser: function () {
            //     let para = {
            //         "number": this.filters.stu_number
            //     };
            //     console.log(this.filters.stu_number);
            //     ser_student_bynumber(para).then(
            //         (res) => {
            //             this.users = res.data;
            //         }
            //     )
            // },
            // formatSex: function (row, column) {
            //     return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
            // },
            handleCurrentChange(val) {
                let temp = this.allStudents;

                this.currentPage = val;
                this.students = temp.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize)
                // this.getUsers();
            },
            //获取用户列表
            getStudents_by_grade() {
                this.sel_visible=false;

                this.listLoading = true;
                NProgress.start();
                get_students_by_grade(this.sel_form.gradeId).then((res) => {
                    // 	this.total = res.data.total;
                    console.log(res);
                    this.students = res.data.classes.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize);
                    this.total = this.students.length;
                    this.listLoading = false;
                    NProgress.done();
                });
            },
            getStudents_by_school() {

                this.listLoading = true;
                NProgress.start();
                get_students_by_school(sessionStorage.getItem('school_id')).then((res) => {
                    // 	this.total = res.data.total;
                    if(res.code=='200'){
                        console.log(res);
                        this.allStudents = res.data.students;
                        this.total = res.data.students.length;
                        this.students = res.data.students.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize);

                        console.log(this.students.length);

                    }else {
                        this.$message({
                            message:res.data.msg,
                            type:'warning'
                        })

                    }
                    this.listLoading = false;
                    NProgress.done();

                });
            },
            getStudents_by_class() {

                this.listLoading = true;
                NProgress.start();
                get_students_by_class(this.sel_form.classId).then((res) => {
                    // 	this.total = res.data.total;
                    console.log(res);
                    this.students = res.data.classes;
                    this.total = this.students.length;
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

                    let para = row.stuId;
                    dec_student(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getStudents_by_school();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
                console.log(this.editForm);


            },
            //显示新增界面
            handleAdd: function () {

                this.addFormVisible = true;

                this.addForm = {
                    "stuId": "",
                    "classId": "",
                    "gradeId": "",
                    "stuNumber": "",
                    "stuName": "",
                    "stuGender": "",
                    "stuEnrolmentNumber": "",
                    "remark": ""
                };
            },
            handeleSel: function () {
                this.sel_visible = true;
            },
            //编辑
            editSubmit: function () {


                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = {
                                "stuId": this.editForm.stuId,
                                "classId": this.editForm.classId,
                                "gradeId": this.editForm.gradeId,
                                "stuNumber": this.editForm.stuNumber,
                                "stuName": this.editForm.stuName,
                                "stuGender": this.editForm.stuGender,
                                "stuEnrolmentNumber": this.editForm.stuEnrolmentNumber,
                                "remark": this.editForm.remark
                            }
                            // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            update_student(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getStudents_by_school();
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
                    add_student(para).then((res) => {
                        if (res.code == "200") {
                            this.addLoading = false;
                            //NProgress.done();
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.$refs['addForm'].resetFields();
                            this.addFormVisible = false;
                            this.getStudents_by_school();
                        } else {
                            this.addLoading = false;
                            this.$message({
                                message: '提交失败',
                                type: 'warning'
                            });
                            this.$refs['addForm'].resetFields();
                            this.addFormVisible = false;
                            this.getStudents_by_school();
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
                var ids = this.sels.map(item => item.stuId);
                let para = {
                    "ids": ids
                }
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();

                    del_students(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getStudents_by_school();
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
            view_grade(sessionStorage.getItem('school_id')).then(
                (res) => {
                    this.stu_grade = res.data.grades;

                }
            );
            let para = sessionStorage.getItem('school_id');
            // this.listLoading = true;

            get_classes_list(para).then((res) => {
                // 	this.total = res.data.total;
                console.log(res);
                this.stu_class = res.data.classes;

            });
            if (sessionStorage.getItem('school_id') == undefined) {
                this.set_school_view = true;
            }

            this.getStudents_by_school();

        },
        beforeCreate() {

        },
        created() {

            this.$nextTick(function () {


            })

        },
        watch:{
            fiterStudents:function (val,oldval) {
                let para = {
                    "key":val
                }
                if(val == ""){
                    this.getStudents_by_school();
                }else{
                    ser_student_by_name(para).then((res) => {
                        if(res.code == "400" ){
                            this.students = null;
                        }else{
                            this.students = res.data.students;
                        }



                    })

                }




            }
        }
    }

</script>

<style scoped>

</style>
