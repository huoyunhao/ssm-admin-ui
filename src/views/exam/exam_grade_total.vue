<template>
    <el-container v-loading="loading2"
    element-loading-text="正在汇总分数">
        
        <el-main>
            <el-row>
                <el-col>
                    <el-form :inline="true" :model="formInline" class="demo-form-inline">
                        <el-form-item label="考试科目">
                            <el-select v-model="formInline.subject" placeholder="选择考试科目">
                                <el-option :label="item.examName" :value="item.examId" :key="index" v-for="(item,index) in bindData"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">查询</el-button>
                        </el-form-item>
                        <el-form-item >
                            <el-button @click="exportExcel">导出</el-button>
                        </el-form-item>
                        <el-form-item >
                            <el-button @click="handleScoreCount">成绩汇总</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-table v-loading="loading" id="element-table" :data="tableData" style="width: 100%">
                        <!-- <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" inline class="demo-table-expand">
                                    <el-form-item label="班级">
                                        <span>{{ props.row.classNum }}</span>
                                    </el-form-item>
                                    <el-form-item label="学校">
                                        <span>{{ props.row.companyName }}</span>
                                    </el-form-item>
                                    <el-form-item label="得分">
                                        <span>{{ props.row.score }}</span>
                                    </el-form-item>
                                    
                                    <el-form-item label="考试">
                                        <span>{{ props.row.examNum }}</span>
                                    </el-form-item>
                                </el-form>
                            </template>
                        </el-table-column> -->
                        <el-table-column label="学生考号" prop="stuNum">
                        </el-table-column>
                        <el-table-column label="学生姓名" prop="stuName">
                        </el-table-column>
                        <el-table-column label="班级" prop="className">
                        </el-table-column>
                        <el-table-column label="得分" prop="stuScore">
                        </el-table-column>
                        <el-table-column label="客观题得分" prop="objectiveScore">
                        </el-table-column>
                        <el-table-column label="主观题得分" prop="subjectiveScore">
                        </el-table-column>
                        <el-table-column label="Z得分" prop="zScore">
                        </el-table-column>
                        <el-table-column label="T得分" prop="tScore">
                        </el-table-column>
                        <el-table-column label="班级排名" prop="classRank">
                        </el-table-column>
                        <el-table-column label="年级排名" prop="gradeRank">
                        </el-table-column>
                        <el-table-column label="统考排名" prop="uniformRank">
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
             <el-footer>
                <el-row>
                    <el-col :span="4" :offset="9">
                        <div class="block">
                            <el-pagination
                                layout="prev, pager, next"
                                :total="total"
                                @current-change="handleCurrentChange"
                                :page-size="10">
                            </el-pagination>
                        </div>
                    </el-col>
                </el-row>
             </el-footer>
        </el-main>
    </el-container>
</template>


<script>
import {exam_scores,count_exam_score,exam_subject_list_by_id} from '../../api/api'
import axios from 'axios'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
    export default {
        data() {
            return {
                tableData: [ ],
                data:[],
                formInline: {
                    
                    subject: ''
                },
                bindData:[],
                page:0,
                total:0,
                loading:true,
                loading2:false
            }
            
        },
        methods: {
            getData(){
                //获取考试列表，选取考试以及科目再查询成绩
                exam_scores(this.formInline.subject).then(res=>{
                    console.log(res.data['msg']);
                    this.data=res.data['msg'];
                    let data=JSON.parse(JSON.stringify(this.data));
                    this.tableData=data.splice(this.page*10,10);
                    this.total=parseInt(this.data.length/10)*10;
                    this.loading=false;
                })
            },
            handleCurrentChange(val){
                console.log(val);
                this.page=val;
                let data=JSON.parse(JSON.stringify(this.data));
                this.tableData=data.splice(this.page*10,10);
            },
            onSubmit(){
                this.loading=true;
                exam_scores(this.formInline.subject).then(res=>{
                    console.log(res);
                    this.data=res.data['msg'];
                    this.loading=false;
                })
            },
            //成绩汇总
            handleScoreCount(){
               let examIdList=[];
               let request=[];
               let examId=sessionStorage.getItem('examId');
               this.loading2=true;
                exam_subject_list_by_id(examId).then((res)=>{
                    if(res.code==200){
                        let exam_subjects = res.data.exams;
                        exam_subjects.forEach(item=>{
                            examIdList.push(item.examId)
                        })
                    }else{
                        this.$message(res.data.msg)
                    }
                }).then(()=>{
                    examIdList.forEach(item=>{
                        request.push(count_exam_score(item).then(res=>{
                            console.log(res.msg);
                            if(res.data.msg){
                                this.$message(res.data.msg)
                            }else{
                                this.$message(res.msg)
                            }
                        }))
                    })
                    axios.all(request).then(()=>{
                        this.loading2=false;
                        this.getData();
                    }).catch(()=>{
                        this.loading2=false;
                    })
                })
            },
            changeData(s) {

                //如果存在ArrayBuffer对象(es6) 最好采用该对象
                if (typeof ArrayBuffer !== 'undefined') {
                    
                    //1、创建一个字节长度为s.length的内存区域
                    var buf = new ArrayBuffer(s.length);
                    
                    //2、创建一个指向buf的Unit8视图，开始于字节0，直到缓冲区的末尾
                    var view = new Uint8Array(buf);
                    
                    //3、返回指定位置的字符的Unicode编码
                    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                    return buf;

                } else {
                    var buf = new Array(s.length);
                    for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                }
            },
            exportExcel () { 
                //1、XLSX.utils.json_to_sheet(data) 接收一个对象数组并返回一个基于对象关键字自动生成的“标题”的工作表，默认的列顺序由使用Object.keys的字段的第一次出现确定
                //2、将数据放入对象workBook的Sheets中等待输出
                let workBook = {
                    SheetNames: ['Sheet1'],
                    Sheets: {},
                    Props: {}
                };
                let wopts = {
                    bookType: 'xlsx',
                    bookSST: false, 
                    type: 'binary'
                };
                let that=this;
                const tHeader = ['学生考号', '学生姓名', '班级','得分','客观题得分','主观题得分','Z得分','T得分','班级排名','年级排名','统考排名']; //对应表格输出的title
        　　　　 const filterVal = ['stuNum', 'stuName', 'className','stuScore','objectiveScore','subjectiveScore','zScore','tScore','classRank','gradeRank','uniformRank']; // 对应表格输出的数据
        　　　　 const list = this.data;
        　　　　 let data = this.formatJson(filterVal, list);
                data.forEach(item=>{
                    item.forEach((field,index)=>{
                        item[tHeader[index]]=field;
                        delete item[index];
                    })
                })
                workBook.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(data)
                
                //3、XLSX.write() 开始编写Excel表格
                //4、changeData() 将数据处理成需要输出的格式
                saveAs(new Blob([that.changeData(XLSX.write(workBook, wopts))], {type: 'application/octet-stream'}),'export.xlsx')
            
            },
            
    　　　　formatJson(filterVal, jsonData) {
    　　　　　　return jsonData.map(v => filterVal.map(j => v[j]))
    　　　　}

        },
        mounted() {
            let examId=sessionStorage.getItem('examId');
            let examIdList=[];
            let bindData;
            exam_subject_list_by_id(examId).then((res)=>{
                    if(res.code==200){
                        let exam_subjects = res.data.exams;
                        exam_subjects.forEach(item=>{
                            examIdList.push(item.examId)
                        })
                        bindData=exam_subjects;
                        this.bindData=bindData;
                    }else{
                        this.$message(res.data.msg)
                    }
                }).then(res=>{
                    this.formInline.subject=bindData[0].examId;
                    this.getData();
                })
            
        },
        watch: {
           
        },
    }

</script>

<style scoped="scoped">
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>

