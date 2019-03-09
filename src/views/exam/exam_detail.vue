<template>
    <div class="content">
        <h2>试卷选择题信息</h2>
        <el-table
      :data="selectData"
      border
      style="width: 100%;margin-bottom:20px">
      <el-table-column
        prop="selectNum"
        label="题号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="selectType"
        label="选择题类型"
        >
      </el-table-column>
      <el-table-column
        prop="selectScore"
        label="选择题分数"
        >
      </el-table-column>
      <el-table-column
        prop="selectAnswer"
        label="正确答案"
       >
      </el-table-column>
    </el-table>
    <h2>试卷块信息</h2>
        <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      style="width: 100%">
      <el-table-column
        prop="cuttingName"
        label="小块名"
        width="180">
      </el-table-column>
    <el-table-column label="阅卷分配老师" align="center">
        <el-table-column
            prop="permUserName"
            label="阅卷老师名"
            align="center">
        </el-table-column>
        <el-table-column
            prop="isTemp"
            label="阅卷老师类型"
            align="center">
        </el-table-column>
        <el-table-column
            prop="permUserAccount"
            label="阅卷老师用户名"
            align="center">
        </el-table-column>
    </el-table-column>
      <el-table-column label="小块给分点" align="center">
        <el-table-column
            prop="PointName"
            label="给分点名"
            align="center">
        </el-table-column>
        <el-table-column
            prop="echoPointScore"
            label="给分点分数"
            align="center">
        </el-table-column>
        
      </el-table-column>
    </el-table>
    </div>
</template>
<script>
import {getInfoOfCutting} from '../../api/api.js'
export default {
    props:{
        examid:{
            type:String,
            default:''
        }
    },
    data(){
        return{
            tableData:[],
            selectData:[],
            currentIndex:0,//每次push 就加一
            mergeArray:[]
        }
    },
    methods:{
        objectSpanMethod({ row, column, rowIndex, columnIndex }){
            let mergeRow=this.getMergeRow(this.mergeArray);
            if (columnIndex === 0){
                for(let item of mergeRow){
                    if(item.start-1==rowIndex){
                        return {
                            rowspan: item.length,
                            colspan: 1
                        }
                    }else if(item.start-1<rowIndex&&rowIndex<item.end){
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    }
                }
            }

        },
        getMergeRow(array){
            let result=[];
            array.forEach(element=>{
                if(element.length>1){
                    result.push(element)
                }else{

                }
            })
            return result;
        },
        dataEtl(data){//把数据转换成想要的格式
            let etlData=[];
            for(let dataItem of data){
                let etlDataItem={};
                let mergeArrayItem={};
                let startIndex=this.currentIndex;
                etlDataItem.cuttingName=dataItem.cuttingName;
                mergeArrayItem.start=startIndex;
                let cnt=startIndex;
                if(dataItem.permUserList&&dataItem.cuttingScorePointList){//如果小块分配了批阅老师以及给分点
                    if(dataItem.permUserList.length>=dataItem.cuttingScorePointList.length){
                        dataItem.permUserList.forEach((element,index) => {
                            let obj=JSON.parse(JSON.stringify(etlDataItem))
                            obj.permUserName=element.userName
                            obj.permUserAccount=element.userAccount
                            obj.isTemp=element.isTemp
                            if(dataItem.cuttingScorePointList.length>index){
                                obj.PointName=dataItem.cuttingScorePointList[index].pointName;
                                obj.echoPointScore=dataItem.cuttingScorePointList[index].echoPointScore;
                            }else{
                                obj.PointName='';
                                obj.echoPointScore='';
                            }
                            etlData.push(obj);
                            this.currentIndex++;
                            cnt++;
                        });
                    }else{
                        dataItem.cuttingScorePointList.forEach((element,index)=>{
                            let obj=JSON.parse(JSON.stringify(etlDataItem))
                            obj.PointName=element.pointName;
                            obj.echoPointScore=element.echoPointScore;
                            if(dataItem.permUserList.length>index){
                                obj.permUserName=dataItem.permUserList[index].userName;
                                obj.permUserAccount=dataItem.permUserList[index].userAccount;
                                obj.isTemp=dataItem.permUserList[index].isTemp
                            }else{
                                obj.permUserName='';
                                obj.permUserAccount='';
                            }
                            etlData.push(obj);
                            this.currentIndex++;
                            cnt++;
                        })
                    }
                    
                }else if(dataItem.cuttingScorePointList){//如果只设置了给分点
                    dataItem.cuttingScorePointList.forEach(element => {
                        etlDataItem.PointName=element.pointName;
                        etlDataItem.echoPointScore=element.echoPointScore;
                        etlDataItem.permUserName='';
                        etlDataItem.permUserAccount='';
                        etlData.push(etlDataItem);
                        this.currentIndex++;
                        cnt++;
                    });
                }else if(dataItem.permUserList){//如果只分配了批阅老师
                    dataItem.permUserList.forEach(element => {
                        etlDataItem.permUserName=element.userName;
                        etlDataItem.permUserAccount=element.userAccount;
                        etlDataItem.PointName='';
                        etlDataItem.echoPointScore='';
                        etlData.push(etlDataItem);
                        this.currentIndex++;
                        cnt++;
                    });
                }else{
                    etlDataItem.permUserName='';
                    etlDataItem.permUserAccount='';
                    etlDataItem.cuttingName='';
                    etlDataItem.echoPointScore='';
                    etlData.push(etlDataItem);
                }
                mergeArrayItem.end=cnt;
                mergeArrayItem.length=mergeArrayItem.end-mergeArrayItem.start;
                mergeArrayItem.start++;
                this.mergeArray.push(mergeArrayItem);
            }
            console.log(this.mergeArray);
            return etlData;
        }
    },
    mounted(){
        console.log(this.examid)
        getInfoOfCutting(this.examid).then(res=>{
            console.log(res.data.cuttingList);
            this.tableData=this.dataEtl(res.data.cuttingList);
            if(res.data.templetSelectList.length){
                this.selectData=res.data.templetSelectList[0].templetSelectList;
            }
            console.log(this.tableData)
        })
    },
    watch:{
        examid(){
            getInfoOfCutting(this.examid).then(res=>{
                console.log(res);
            })
        }
    }
}
</script>
<style>

</style>
