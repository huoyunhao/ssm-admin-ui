<template>
    <section >
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <!--<el-form-item>-->
                <!--<el-input v-model="filters.name" placeholder="考试名称"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                <!--<el-button type="primary" v-on:click="getUsers">查询</el-button>-->
                <!--</el-form-item>-->
                <el-form-item>
                <el-button type="primary" @click="$router.push({path:'/add_exam'})">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="exam_lists" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="createTime" label="考试创建时间" width="220" sortable>
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px;font-weight: 600">{{ scope.row.createTime.substr(0,10) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="examName" label="考试名称" width="220" sortable>
            </el-table-column>
            <el-table-column prop="companyName" label="考试学生范围" width="180" sortable>
            </el-table-column>

            <el-table-column prop="examScore" label="考试总分" width="120" sortable>
            </el-table-column>
            <el-table-column prop="examSum" label="参考人数" width="120" sortable>
            </el-table-column>
            <el-table-column prop="examGradeName.gradeName" label="入学年份" width="100" sortable>
            </el-table-column>
            <!--<el-table-column prop="companName" label="识别类型" width="120" sortable>-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="companName" label="定位方式" width="120" sortable>-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="addr" label="地址" min-width="180" sortable>-->
            <!--</el-table-column>-->
            <el-table-column label="操作" width="550">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="info" plain @click="handleView(scope.$index, scope.row)">查看详情</el-button>
                    <el-button size="small" type="success" @click="handleSubject(scope.$index, scope.row)">考试流程</el-button>
                    <el-button size="small" @click="handleScoreCount(scope.$index, scope.row)">成绩分析</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20"
                           :total="total"
                           style="float:right;">
            </el-pagination>
        </el-col>
        <!--模板制作-->
        <el-dialog title="模板制作" :visible.sync="dialogTemplateVisible" :close-on-click-modal="false" width="100%" >





        </el-dialog>




        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit"
                     style="margin:20px;width:90%;min-width:600px;" label-position="left">
                <el-form-item label="考试名称">
                    <el-input v-model="form.examName" class="exam_name"></el-input>
                </el-form-item>
                <el-form-item label="入学年份">
                    <el-select v-model="form.examGradeId" placeholder="请选择年级"
                               style="margin-right: 20px">
                        <el-option v-for="item in this.stu_grade" :value="item.gradeId" :key="item.gradeId"
                                   :label="item.gradeName+'('+item.companyName+')'"></el-option>


                    </el-select>
                </el-form-item>
                <el-form-item label="添加科目">
                    <el-button type="success" size="mini" @click="subjectFormVisible = true">添加考试科目</el-button>
                </el-form-item>


                <el-form-item label="考试科目">


                    <el-form :inline="true" class="demo-form-inline" v-for="item in this.form.subject"
                             :key="item.examId" :model="item"
                             style="margin-bottom: 10px;border-bottom: 1px solid;padding-bottom: 10px;">
                        <el-form-item label="科目名称">
                            <el-select placeholder="选择科目名称" style="width: 150px" v-model="item.examSubjectId">
                                <el-option :label="ite.subjectName" :value="ite.subjectId" v-for="ite in subjects"
                                           :key="ite.subjectId"></el-option>

                            </el-select>
                        </el-form-item>
                        <el-form-item label="科目总分">
                            <el-input placeholder="总分" style="width: 90px" v-model="item.examScore"></el-input>
                        </el-form-item>

                        <el-form-item label="考试开始时间">

                            <el-date-picker
                                    v-model="item.examStartTime"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="考试结束时间">

                            <el-date-picker
                                    v-model="item.examEndTime"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>

                    </el-form>

                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
            <el-dialog title="科目" :visible.sync="subjectFormVisible"  width="80%"  append-to-body>
                <add_subject :exam_id="exam_id">

                </add_subject>
            </el-dialog>
        </el-dialog>
<!--查看详情-->
        <el-dialog title="查看详情" :visible.sync="viewFormVisible" :close-on-click-modal="false">
            <el-form ref="form" :model="form" label-width="90px"
                     style="margin:20px;width:90%;min-width:600px;" label-position="left">
                <el-form-item label="考试名称：">
                    {{form.examName}}

                </el-form-item>
                <el-form-item label="入学年份：">
                    {{form.examGradeName.gradeName}}

                </el-form-item>


                <el-form-item label="考试科目：">


                    <el-form :inline="true" class="demo-form-inline" v-for="item in this.form.subject"
                             :key="item.examId" :model="item"
                             style="margin-bottom: 10px;border-bottom: 1px solid;padding-bottom: 10px;">
                        <el-form-item label="科目名称:">
                            {{item.subjectName}}

                        </el-form-item><br />
                        <el-form-item label="科目总分:">
                            {{item.examScore}}

                        </el-form-item><br />

                        <el-form-item label="考试开始时间:">
                            {{item.examStartTime}}


                        </el-form-item><br />
                        <el-form-item label="考试结束时间:">
                            {{item.examEndTime}}


                        </el-form-item><br />
                        <el-form-item label="阅卷状态控制">
                            
                                    <el-switch :data-examid="item.examId"
                                v-model="item.status"
                                active-value="on"
                                inactive-value="off"
                                @change="statusChange(item.examId)">
                                </el-switch>
                            
                           
                        </el-form-item><br />
                        <el-form-item label="考试阅卷状态:">
                            {{item.status=='on'?'开启':'关闭'}}
                        </el-form-item><br />
                        <el-form-item label="试卷详情信息:">
                            <template>
                                <el-button style="width:135px" @click="detailShow" :data-examid="item.examId">查看</el-button>
                            </template>
                        </el-form-item><br />
                        
                    </el-form>

                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="viewFormVisible = false">关闭</el-button>

            </div>
        </el-dialog>


        <!--任务分配界面-->
        <el-dialog title="科目" :visible.sync="subjectVisible" :close-on-click-modal="false" width="30%">
            <el-form>
                <el-form-item label="科目名称">
                    <el-select placeholder="选择科目名称" style="width: 300px" v-model="select_exam_subject">
                        <el-option :label="ite.examName" :value="ite.examId" v-for="ite in exam_subjects"
                                   :key="ite.examId"></el-option>

                    </el-select>
                </el-form-item>



            </el-form>




            <div slot="footer" class="dialog-footer">

                <el-button type="primary"  @click.native="go_to_process">确定</el-button>
            </div>

        </el-dialog>
        <!--分配详情界面-->
        <el-dialog title="详情" :visible.sync="detailFormVisible"  width="80%">
            <exam-detail :examid="exam_id">

            </exam-detail>
        </el-dialog>

    </section>
</template>

<script>
    import util from '../../common/js/util'
    import axios from 'axios'
    //import NProgress from 'nprogress'
    import {js_date} from "../../components/js_date/js_date";
    import {exam_list, view_grade, get_subjects_list, edit_exam, dec_exam,get_task,get_tmp_user,get_scores,exam_subject_list_by_id,get_exam_status,open_exam,close_exam,count_exam_score} from '../../api/api';
    import examDetail from './exam_detail';
    import add_subject from '../../components/exam/add_subject'
    export default {
        components:{
            examDetail,
            add_subject
        },
        data() {
            return {
                subjectFormVisible:false,
                upd: {
                    userId: "",
                    examId: ""
                },

                big_exam_id: "",
                subjects: [],
                stu_forms: [],
                stu_grade: [],
                loading2:false,

                options: [{
                    value: '选项1',
                    label: '类型1'
                }, {
                    value: '选项2',
                    label: '类型2'
                }, {
                    value: '选项3',
                    label: '类型3'
                }],
                value: '',

                fileList: [],


                exam_list: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                viewFormVisible:false,
                detailFormVisible:false,
                editLoading: false,
                editFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },


                //编辑界面数据
                form: {
                    "exam_grade": null,
                    "exam_name": null,
                    "exam_time": null,
                    examGradeName:{

                      gradeName:''

                    },


                    "subject": [{

                        "examId": "",
                        "examGrade": "",
                        "examStartTime": "",
                        "examEndTime": "",
                        "examSubjectId": "",
                        "examScore": "",
                        "examStuInfo": ['']
                    }],

                },


                //编辑界面数据
                editForm: {
                    id: 0,
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
                },

                addFormVisible: false,//新增界面是否显示

                addFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //新增界面数据
                addForm: {
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
                },

                exam_lists: [],



                taskLoading: false,
                subjectVisible:false,
                taskForm:{},
                fragments:[ {
                    "fragmentId": "12f00e33de5f4c5f8a875b6422ed2565",
                    "fragmentScore": 60,
                    "fragmentName":"语文作文",
                    "templetId": "12f00e33de5f4c5f8a875b641ded2565",
                    "fragmentPointUpLeft": "232",
                    "fragmentPointUpRight": "433",
                    "fragmentPointDownLeft": "233",
                    "fragmentPointDownRight": "222",
                    "createTime": 1535289551000,
                    "fragmentSub": 5,
                    "isMulit": "true",
                    "url":"http://120.79.250.60:8080/test/IMG_0002.jpg",
                    "all_task":'30',
                    "y_task":'10'
                }],
                tmp_user:{
                    "fragmentId": "12f00e33de5f4c5f8a875b6422ed2565",
                    "num": "10",
                    "type": "0"
                },
                tmp_url:'',
                displayurl: 'display:none;',
                scores:[],
                dialogTableVisible:false,



                //模板制作数据
                dialogTemplateVisible:false,
                point1:{},
                point2:{},

                exam_subjects:[],
                select_exam_subject:"",

                //传递给子组件的examid
                exam_id:''




            }
        },
        methods: {
            detailShow(event){
                this.editFormVisible=false;//编辑界面是否显示
                this.viewFormVisible=false;
                this.detailFormVisible=true;
                if(event.target.tagName!="BUTTON"){
                    this.exam_id=$(event.target).parent('button').attr('data-examid');
                }else{
                    this.exam_id=event.target.attributes['data-examid'].nodeValue;
                }
            },
            statusChange(id){
                setTimeout(() => {
                    if($.trim($('.el-switch').parents('.el-form-item').eq(0).nextAll('.el-form-item').eq(0).find('.el-form-item__content').text())=='开启'){
                        open_exam(id).then(res=>{
                            if(res.code==200){
                                this.$message({
                                    type:'success',
                                    message:"阅卷开启"
                                })
                            }else{
                                this.$message({
                                    type:'error',
                                    message:res.data.msg
                                })
                            }
                        });
                    }else{
                        close_exam(id).then(res=>{
                            if(res.code==200){
                                this.$message({
                                    type:'success',
                                    message:"阅卷关闭"
                                })
                            }else{
                                this.$message({
                                    type:'error',
                                    message:res.data.msg
                                })
                            }
                        });
                    }
                }, 500);
                
            },
            upd2(response, file, fileList) {
                // console.log(response);
                // console.log(file);
                if (response.code == '200') {
                    let para = {
                        name: file.name,
                        url: response.data.map.url
                    }
                    this.fileList.push(para);
                    this.$message({
                        showClose: true,
                        message: '上传成功！',
                        type: 'success'
                    });
                } else {
                    alert(response.data.map.msg);
                }


            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            get_uuid() {
                var d = new Date().getTime();
                var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
                return uuid;
            },


            //性别显示转换
            formatSex: function (row, column) {
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getUsers();
            },
            //获取考试列表
            get_exam_list() {


                this.listLoading = true;
                // //NProgress.start();
                exam_list(sessionStorage.getItem("school_id")).then((res) => {
                    this.listLoading = false;

                    this.exam_lists = res.data.exams;
                    console.log(res.data.exams);

                    for (let i in this.exam_lists) {
                        // console(1);
                        // console.log(i);
                        this.exam_lists[i].createTime = js_date(this.exam_lists[i].createTime);
                        this.$set(this.exam_lists, i, this.exam_lists[i]);

                    }


                });
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = row.examId;
                    dec_exam(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.get_exam_list();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                console.log(row);
                this.form = row;
                this.upd.userId = JSON.parse(sessionStorage.getItem('user')).userId;
                this.upd.examId = row.examId;
            },
            //显示查看页面
            handleView: function (index, row) {
                let request=[];
                // console.log(row);
                row.subject.forEach((element,index) => {
                    request.push(get_exam_status(element.examId).then(res=>{
                        if(res.code==200){
                            let obj=JSON.parse(JSON.stringify(row));
                            // if(res.data.status=='on'){
                            //     obj.subject[index].status=true;
                            // }else{
                            //     obj.subject[index].status=false;
                            // }
                            obj.subject[index].status=res.data.status;
                            this.form = obj;
                        }
                    }))
                });
                axios.all(request).then(res=>{
                    this.viewFormVisible = true;
                })
                
                
                // this.upd.userId = JSON.parse(sessionStorage.getItem('user')).userId;
                // this.upd.examId = row.examId;
            },

            //显示新增界面
            handleAdd: function () {
                console.log('123');
                this.addFormVisible = true;

                this.addForm = {
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
                };
            },
            //显示大考下的科目
            handleSubject:function(index, row){

                exam_subject_list_by_id(row.examId).then((res)=>{
                    this.exam_subjects = res.data.exams;
                    this.subjectVisible = true ;
                    this.select_exam_subject = "";



                })

            },
            //成绩汇总
            handleScoreCount(index, row){
               this.loading2=true;
               sessionStorage.setItem('examId',row.examId);
               this.$router.push('/exam_grade_total');
                // exam_subject_list_by_id(row.examId).then((res)=>{
                //     if(res.code==200){
                //         let exam_subjects = res.data.exams;
                //         sessionStorage.setItem('big_exam',JSON.stringify(exam_subjects));
                //         exam_subjects.forEach(item=>{
                //             examIdList.push(item.examId)
                //         })
                //     }else{
                //         this.$message(res.data.msg)
                //     }
                // }).then(()=>{
                //     examIdList.forEach(item=>{
                //         request.push(count_exam_score(item).then(res=>{
                //             console.log(res.msg);
                //             if(res.data.msg){
                //                 this.$message(res.data.msg)
                //             }else{
                //                 this.$message(res.msg)
                //             }
                //         }))
                //     })
                //     axios.all(request).then(()=>{
                //         this.loading2=false;
                //         this.$router.push('/exam_grade_total');
                //     }).catch(()=>{
                //         this.loading2=false;
                //     })
                // })
                
            },
            go_to_process(){
                if(this.select_exam_subject == ""){
                    this.$confirm('请选择科目', '提示', {});

                }else {
                    console.log(this.select_exam_subject)
                    sessionStorage.setItem('exam_small_id',this.select_exam_subject);

                    this.$router.push({ path:'/template_upload'});


                }



            },
            //编辑
            editSubmit: function () {


                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.editLoading = true;
                    //NProgress.start();
                    let subject1 = [];
                    for (let i = 0; i < this.form.subject.length; i++) {
                        subject1[i] = {
                            "examId": this.form.subject[i].examId,
                            "examGrade": this.form.subject[i].examGrade,
                            "examStartTime": this.form.subject[i].examStartTime,
                            "examEndTime": this.form.subject[i].examEndTime,
                            "examSubjectId": this.form.subject[i].examSubjectId,
                            "examScore": this.form.subject[i].examScore,
                            "examStuInfo": this.form.subject[i].examStuInfo

                        }


                    }
                    let para = {
                        "examId": this.form.examId,
                        "examName": this.form.examName,
                        "examGrade": this.form.examGradeId,
                        "subject": subject1

                    };
                    console.log(para);

                    edit_exam(para).then((res) => {

                        //NProgress.done();
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        // this.$refs['editForm'].resetFields();
                        this.editFormVisible = false;
                        this.editLoading = false;
                        this.get_exam_list();
                    });
                });


            },

            selsChange: function (sels) {


                this.sels = sels;
                console.log(this.sels.map(item => item.name));
            },
            //批量删除
            batchRemove: function () {
                this.$message.error('暂未开启考试批量删除权限！');
                // var ids = this.sels.map(item => item.id).toString();
                // this.$confirm('确认删除选中记录吗？', '提示', {
                //     type: 'warning'
                // }).then(() => {
                //     this.listLoading = true;
                //     //NProgress.start();
                //     let para = {ids: ids};
                //     batchRemoveUser(para).then((res) => {
                //         this.listLoading = false;
                //         //NProgress.done();
                //         this.$message({
                //             message: '删除成功',
                //             type: 'warning'
                //         });
                //         this.getUsers();
                //     });
                // }).catch(() => {
                //
                // });
            },
            add_subject() {

                let para = {
                    "examId": this.get_uuid(),
                    "examGrade": this.form.examGradeId,
                    "examStartTime": "",
                    "examEndTime": "",
                    "examSubjectId": "",
                    "examScore": "",
                    "examStuInfo": []
                };
                this.form.subject.push(para);

            },
            dec_subject(index) {
                if (this.form.subject.length != 1) {
                    this.form.subject.splice(index, 1);
                } else {
                    this.$message({
                        showClose: true,
                        message: '科目数量应该大于1',
                        type: 'error'
                    });

                }


            },


            display_img:function (row) {
                let url=row.url;
                this.$alert('<img src="'+url+'" width="400px" />', '模块预览', {
                    dangerouslyUseHTMLString: true
                });

            },
            get_tmp_user(row){
                this.tmp_user.fragmentId=row.fragmentId;
                get_tmp_user(this.tmp_user).then((res) =>{
                    this.displayurl='display:inline;';
                    console.log(res);
                    // window.location.href="http://47.94.146.246"+res.data.url;
                    // window.open ("http://47.94.146.246"+res.data.url, "newwindow", "height=100, width=400, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")
                    // window.open("http://47.94.146.246"+res.data.url);
                    this.tmp_url = "http://120.79.250.60/ssm"+res.data.url;

                })

            },
            display_scores(){
                this.dialogTableVisible = true;
                this.listLoading = true;
                get_scores().then((res)=>{
                    this.listLoading =false;
                    this.scores=res.data.cutting;

                })

            }
        },
        mounted() {
            let that = this;
            $(document).on('.el-switch','click',function(){
                $(this).attr('data-examid');
                
            })
            view_grade(sessionStorage.getItem('school_id')).then(
                (res) => {
                    that.stu_grade = res.data.grades;
                    console.log(that.stu_grade);

                }
            );

            get_subjects_list().then((res) => {
                this.subjects = res.data.subject;

            });
            this.get_exam_list();
        }
    }

</script>

<style scoped>
.examOn{
    color: #67C23A;
}
.examOff{
    color: brown;
}
</style>
