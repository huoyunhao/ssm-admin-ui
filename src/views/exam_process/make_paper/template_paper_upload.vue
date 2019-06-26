<template>
    <el-container id="make_template">


        <el-header>

            <h4>制卡/考试模板上传</h4>
        </el-header>
        <el-main>
            <el-form ref="form" :model="templet_info" label-width="120px">

                <el-form-item label="扫描类型">
                    <el-input v-model="templet_info.scanType"></el-input>
                </el-form-item>
                <el-form-item label="定位方式">
                    <el-input v-model="templet_info.positionType"></el-input>
                </el-form-item>
                <el-form-item label="试卷类型">
                    <el-input v-model="templet_info.paperType"></el-input>
                </el-form-item>
                <el-form-item label="试卷大小">
                    <el-input v-model="templet_info.paperSide"></el-input>
                </el-form-item>
                <el-form-item label="试卷模板图片">
                    <el-upload
                            :action="baseUrl+'/ssm/templetimg'"
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"

                            multiple
                            show-file-list
                            :limit="2"
                            :on-success="finish_upload"
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>

                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="sub_template_info" :loading="sub_loading">提交</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>





        </el-main>



    </el-container>


</template>

<script>
    import {baseUrl,set_template_info,getpaper} from '../../../api/api'
    export default {
        name: "template_paper_upload",
        data() {
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                baseUrl:baseUrl(),
                templet_info:{

                    "examId": "",
                    "scanType": "",
                    "positionType": "",
                    "templetPaper": "",
                    "paperType": "",
                    "paperSide": "A3"

                },
                file_list:[],
                sub_loading:false


            };
        },
        methods: {
            handleRemove(file, fileList) {
                this.file_list = fileList;
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            finish_upload(response, file, fileList){
                this.file_list = fileList;


            },
            sub_template_info(){
                this.$confirm('确认提交吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.templet_info.examId = sessionStorage.getItem('exam_small_id');
                    let path = [];

                    if(this.file_list.length <2){
                        this.$notify({title: '提示',
                            message: '请选择正反共两张图片！' });

                    }else {
                        this.sub_loading = true;
                        path[0]=this.file_list[0].response.data.path;
                        path[1]=this.file_list[1].response.data.path;
                        console.log(path);
                        this.templet_info.templetPaper = path[0];
                        set_template_info(this.templet_info).then((res)=>{


                            this.templet_info.templetPaper = path[1];
                            set_template_info(this.templet_info).then((res)=>{
                                this.$notify({
                                    message: "上传成功！！",

                                });
                                this.sub_loading = false;

                                this.$confirm('本流程已完成, 是否进入下一流程?', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    this.$router.push({path:'/exam_big_cutting'})
                                }).catch(() => {

                                });


                            })


                        })


                    }


                });


            }
        },
        mounted(){
            getpaper(sessionStorage.getItem('exam_small_id')).then((res)=>{
                if(res.code == "200"){
                    this.$confirm('本流程已完成, 是否进入下一流程?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$router.push({path:'/exam_big_cutting'})
                    }).catch(() => {

                    });

                }
            })
        }

    }
</script>

<style scoped>


</style>