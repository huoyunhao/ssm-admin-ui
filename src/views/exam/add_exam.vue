<template>
    <el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit"
             style="margin:20px;width:90%;min-width:600px;" label-position="left">
        <el-form-item label="考试名称">
            <el-input v-model="form.exam_name" class="exam_name"></el-input>
        </el-form-item>
        <el-form-item label="考试类型">
            <span>{{exam_ty}}</span>
            <el-tooltip class="item" effect="dark" content="类型可在右上角切换" placement="right">
                <el-button icon="el-icon-bell" circle size="mini"></el-button>
            </el-tooltip>

        </el-form-item>
        <el-form-item label="入学年份">
            <el-select v-model="form.exam_grade" placeholder="请选择年级"
                       style="margin-right: 20px">
                <el-option v-for="item in this.stu_grade" :value="item.gradeId" :key="item.gradeId"
                           :label="item.gradeName+'('+item.companyName+')'"></el-option>


            </el-select>
        </el-form-item>


        <el-form-item label="考生导入">
            <el-upload
                    class="upload-demo"
                    :action="this.upload_url+'/aies/excel/stuexam'"

                    :on-success="upd2"

                    multiple
                    :limit="10"
                    :on-exceed="handleExceed"
                    :file-list="fileList"
                    :data="upd"
                    :on-remove="delect_file">
                <el-button size="small" type="primary" >点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传xlsx文件</div>
            </el-upload>

        </el-form-item>
        <el-form-item label="考试科目">
            <el-table :data="subjects" highlight-current-row  @selection-change="selsChange"
                      style="width: 100%;">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column type="index" width="60">
                </el-table-column>

                <el-table-column prop="subjectName" label="科目名称" width="100" sortable>
                </el-table-column>
                <el-table-column  label="科目总分" width="100" sortable>
                    <template slot-scope="scope">
                        <el-input   v-model="scope.row.examScore"/>
                    </template>
                </el-table-column>
                <el-table-column  label="考试学生表" width="270" sortable>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.examStuInfo" multiple placeholder="请先导入考生" style="width: 200px">
                            <el-option
                                    v-for="ite in fileList"
                                    :key="ite.url"
                                    :label="ite.name"
                                    :value="ite.url">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column  label="考试开始时间" width="300" sortable>
                    <template slot-scope="scope">
                        <el-date-picker
                                v-model="scope.row.examStartTime"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column  label="考试结束时间" width="300" sortable>
                    <template slot-scope="scope">
                        <el-date-picker
                                v-model="scope.row.examEndTime"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </template>
                </el-table-column>

            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit" :loading="sub_loading">立即创建</el-button>
            <el-button @click.native.prevent>取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {add_exam, view_grade, get_subjects_list,baseUrl } from '../../api/api';

    export default {
        data() {
            return {
                sub_loading:false,

                upd:{
                    userId:"",
                    examId:""
                },
                upload_url:baseUrl(),


                form: {
                    "exam_grade": null,
                    "exam_name": null,
                    "exam_time":null,

                    "subjects": [{

                        "examId": "",
                        "examGrade": "",
                        "examStartTime": "",
                        "examEndTime": "",
                        "examSubjectId": "",
                        "examScore": "",
                        "examStuInfo": []
                    }],

                },

                big_exam_id:"",
                subjects: [],
                stu_forms: [],
                stu_grade: [],




                value: '',

                fileList: [],
                examtime: null,
                exam_ty:"",
                sels:[]
            }
        },
        methods: {
            delect_file(file,fileList){
                let uid = file.uid;
                for(let i in this.fileList){
                    if(this.fileList[i].uid == uid ){
                        this.fileList.splice(i, 1);

                    }
                }
                

            },

            get_grade(){
                return this.form.exam_grade;
            },

            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },

            upd2(response, file, fileList){
                // console.log(response);
                // console.log(file);
                if(response.code == '200'){
                    let para = {
                        name:file.name,
                        url: response.data.map.url
                    }
                    this.fileList.push(para);
                    this.$message({
                        showClose: true,
                        message: '上传成功！',
                        type: 'success'
                    });
                }else{
                    fileList.pop();
                    alert(response.data.map.msg);
                }


            },
            get_uuid(){
                var d = new Date().getTime();
                var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = (d + Math.random()*16)%16 | 0;
                    d = Math.floor(d/16);
                    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
                });
                return uuid;
            },
            onSubmit() {
                this.sub_loading=true;

                    // console.log(this.sels);
                let add_subject = this.sels;

                for( let i in add_subject){
                    // if(add_subject[i].examEndTime == null){
                    //     add_subject[i].examEndTime = "0";
                    //
                    // }
                    // if(add_subject[i].examStartTime == null){
                    //     add_subject[i].examStartTime = "0";
                    //
                    // }
                    delete add_subject[i].remark;
                    delete add_subject[i].subjectName;
                    add_subject[i].examSubjectId = add_subject[i].subjectId;
                    delete add_subject[i].subjectId;
                    add_subject[i].examGrade = this.form.exam_grade;
                    add_subject[i].examId = this.get_uuid();

                }
                // console.log(add_subject.subjectName);

                let para = {
                    "examId": this.big_exam_id,
                    "examName": this.form.exam_name,
                    "examGrade": this.form.exam_grade,
                    "subject": add_subject,
                    "companyId":sessionStorage.getItem("school_id")

                }
                console.log(para);


                add_exam(para).then((res) => {
                    console.log(res);
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                    this.sub_loading =false;
                    this.form ={
                        "exam_grade": null,
                        "exam_name": null,
                        "exam_time":null,

                        "subjects": [{

                            "examId": "",
                            "examGrade": "",
                            "examStartTime": "",
                            "examEndTime": "",
                            "examSubjectId": "",
                            "examScore": "",
                            "examStuInfo": []
                        }],
                    };
                    this.fileList=[];
                    this.$router.push({path: '/exam'});
                });

            },
            add_subject() {

                let para = {
                    "examId": this.get_uuid(),
                    "examGrade": this.form.exam_grade,
                    "examStartTime": "",
                    "examEndTime": "",
                    "examSubjectId": "",
                    "examScore": "",
                    "examStuInfo": []
                };
                this.form.subjects.push(para);

            },
            dec_subject(index) {
                if (this.form.subjects.length != 1) {
                    this.form.subjects.splice(index, 1);
                } else {
                    this.$message({
                        showClose: true,
                        message: '科目数量应该大于1',
                        type: 'error'
                    });

                }


            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            exam_type(){
                if(sessionStorage.getItem("school_parentId_id") == "1000"){
                    this.exam_ty = "市级联考"+""

                }else if(sessionStorage.getItem("school_parentId_id") == "undefined" || sessionStorage.getItem("school_parentId_id") == ""){
                    this.exam_ty = "所有校区联考"
                }else{
                    this.exam_ty = "校级考试"
                }
            }
        },
        mounted() {
            let that = this;

            view_grade(sessionStorage.getItem('school_id')).then(
              (res) => {
                that.stu_grade = res.data.grades;
                console.log(that.stu_grade);

              }
            );
            this.exam_type();

            get_subjects_list().then((res) =>{
                this.subjects = res.data.subject;

            });
            this.big_exam_id=this.get_uuid();
            this.upd.examId = this.big_exam_id;
            this.upd.userId =  JSON.parse(sessionStorage.getItem('user')).userId;
        }
    }

</script>
<style scoped>
    .exam_name {
        width: 600px;
    }


</style>
