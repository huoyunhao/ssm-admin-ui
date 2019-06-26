<template>
    <el-container id="student_paper_upload">
        <el-header><h4>扫描/答题卡扫描</h4></el-header>
        <el-main>
            <el-form  label-width="130px" style="width: 60%">
                <el-form-item label="上传试卷">
                    <el-upload
                            class="upload-demo"
                            :action="this.upload_url+'/ssm/paper'"



                            multiple
                            :limit="10000"
                            :auto-upload="false"


                            ref="uploads"


                            :data="up_form"
                            :show-file-list="true"

                    >
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>

                        <div slot="tip" class="el-upload__tip">只能上传jpg文件</div>
                    </el-upload>


                </el-form-item>
                <el-form-item label="试卷处理进度" v-loading="progress">
                    <el-progress :percentage="percentage*100"></el-progress>
                    <span>总试卷数：{{this.allStudentNum}}</span>
                    <span>未扫描试卷数：{{this.noScanNum}}</span>
                    <span>已扫描试卷数：{{this.scanNum}}</span>
                    <span>异常试卷数：{{this.exceptionNum}}</span>
                </el-form-item>
                <el-form-item label="处理异常试卷">
                    <el-button type="info" @click="get_unknown_student_info">查看未扫描试卷</el-button>
                    <el-button type="danger">查看异常试卷</el-button>

                </el-form-item>


                <!--<el-form-item>-->
                    <!--<el-button type="primary">立即创建</el-button>-->
                    <!--<el-button>取消</el-button>-->
                <!--</el-form-item>-->
            </el-form>


        </el-main>
        <el-dialog title="未扫描学生信息 " :visible.sync="unknown_dialogTableVisible" width="100%">
            <el-table :data="unknown_student_info" height="350" v-loading="table_loading">
                <el-table-column property="stuNum" label="学籍号" width="200"></el-table-column>
                <el-table-column property="examNum" label="考号" width="200"></el-table-column>
                <el-table-column property="stuName" label="姓名"></el-table-column>
                <el-table-column property="companyName" label="学校"></el-table-column>
                <el-table-column property="companyNum" label="学校代码"></el-table-column>
                <el-table-column property="classNum" label="班级号" width="150"></el-table-column>
                <el-table-column property="examPointName" label="考点"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <!--<el-button @click="unknown_dialogTableVisible = false">取 消</el-button>-->
                <el-button type="primary" @click="unknown_dialogTableVisible = false">关闭</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
    import {get_unknown_paper, get_proportion,baseUrl,get_all_papers} from '../../../api/api'

    export default {
        name: "student_paper_upload",
        data() {
            return {
                unknown_student_info: [],
                "noScanNum": "",
                "allStudentNum": "",
                "scanNum": "",
                exceptionNum:"",
                percentage:0,
                intervalid1:0,
                intervalid2:0,
                progress:true,


                unknown_dialogTableVisible: false,
                table_loading:false,
                up_form:{
                    examId:sessionStorage.getItem('exam_small_id')
                },
                //分批上传
                upload_url:"",
                files:[],
                items: 2, //起始上传文件数
                i: 0, //起始位置
                //请求间隔时间
                time: 2000,
                //每次增加次数
                add_items:2

            }


        },
        methods: {
            get_unknown_student_info() {
                this.unknown_dialogTableVisible = true;
                this.table_loading = true;
                get_unknown_paper(sessionStorage.getItem('exam_small_id')).then((res) => {
                    this.unknown_student_info = res.data.students;
                    this.table_loading = false;


                })


            },
            get_info(){
                get_proportion(sessionStorage.getItem('exam_small_id')).then((res) =>{
                    get_all_papers(sessionStorage.getItem("exam_small_id")).then((res) =>{

                        this.allStudentNum = res.data.allStuNum;


                    })
                    this.noScanNum = res.data.proportion.noScanNum;
                    // this.allStudentNum = res.data.proportion.allStudentNum;
                    this.scanNum = this.allStudentNum-this.noScanNum;
                    this.exceptionNum = res.data.proportion.exceptionNum;
                    this.percentage = parseInt(this.scanNum)/parseInt(this.allStudentNum);
                    this.percentage = this.twoFloat(this.percentage);
                    this.progress = false;






                })

            },
            upload_file(item){
                console.log(item);


            },
            twoFloat(number){
                var number1=number.toString().split(".");
                if(number1.length==1){
                    number=number.toString()+".00";
                    return number;
                }
                if(number1.length>1){
                    if(number1[1].length<2){
                        number=number.toString()+"0";
                    }
                    if(number1[1].length>2){
                        number=number1[0]+"."+number1[1].substring(2,0);
                    }
                    return number;
                }
            },


            submitUpload() {
                this.files = this.$refs.uploads.uploadFiles;
                this.$refs.uploads.uploadFiles = [];


                this.intervalid2 = setInterval(this.contr_subfile, this.time);
            },

            contr_subfile(){
                this.$refs.uploads.uploadFiles = [];

                 // this.items = 3;
                 // this.i = 0;
                let state = this.items;
                if(this.i == this.files.length){
                    clearInterval(this.intervalid2);
                }else {
                    for( this.i ;this.i<this.files.length; this.i= this.i+1){

                        if( this.i == this.items){
                            break;
                        }

                        this.$refs.uploads.uploadFiles.push(this.files[this.i]);



                    }
                    this.items=this.items + this.add_items;


                    this.$refs.uploads.submit();


                    return 0;






                }








            }


        },
        mounted(){
            this.upload_url = baseUrl();

            this.get_info();

            this.intervalid1 = setInterval(this.get_info, 5000);




        },
        created(){
            this.progress = true;
            // this.intervalid1 = setInterval(this.get_info, 9000);


        },
        beforeUpdate(){
            // this.intervalid1 = setInterval(this.get_info, 3000);


        },
        beforeDestroy(){
            // console.log(this.intervalid1);
            clearInterval(this.intervalid1);

        }
    }
</script>

<style scoped>


</style>