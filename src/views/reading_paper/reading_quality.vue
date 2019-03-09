<template>
    <div id="data_view">
        <div id="echart"></div>
        <div id="dataTable">
            <el-table :data="tableData"
                stripe
                style="width: 100%">
                <el-table-column
                prop="userName"
                label="教师编号"
                width="180">
                </el-table-column>
                <el-table-column
                prop="avg"
                label="平均分">
                </el-table-column>
                <el-table-column
                prop="userReadCutNum"
                label="批阅数">
                </el-table-column>
                    <el-table-column :label="item+'分(%)'" v-for="(item,index) in echartDataLineX" :key="index" :prop="'rate'+index">
                    </el-table-column>
            </el-table>
        </div>
        <el-dialog :title="'教师'+teacherName+'的给分折线图'" :visible.sync="dialogTableVisible" @opened="loadLineEchart">
            <div id="echartLine" style="height:400px"></div>
        </el-dialog>
        
    </div>
</template>

<script>
import echart from 'echarts'
import {get_cutreadquality} from '../../api/api'
    export default {
        name: "reading_quality",
        data(){
            return {
                tableData:[
                    {
                        avg:'',
                        quality:[{
                            'score':2,
                            'rate':0.1
                        }],
                        userName:'',
                        userReadCutNum:0
                    }
                ],
                echartDataLineX:[],//折线图x轴坐标集合
                //echartDataLineXObj:[],//折线图x轴坐标对象集合
                echartDataTotal:[],
                echartDataTotalDetail:[],
                echartDataTeacher:[],
                echartDataAvg:[],
                echartDataAvgX:[],
                echartDataAvgY:[],
                echartDataTeacherSerie:[],
                echartDataTeacherSerieDetail:[],
                teacherName:'',
                cutingName:'',
                dialogTableVisible:false,
                dataIndex:0,
                rowIndex:0
            }
        },
        methods:{
            initTableData(){
            },
            initData(){
                let that=this;
                get_cutreadquality(JSON.parse(sessionStorage.getItem("user")).userId).then(res=>{
                    if(res.code==200){
                       
                        //that.tableData=res.data.tempUserReadQuality;
                        that.echartDataAvg=res.data.tempUserReadQuality;
                        that.cutingName=res.data.cutReadQuality.cutName;
                        for(let item of res.data.cutReadQuality.quality){
                            that.echartDataTotal.push(item.rate*100);
                            that.echartDataTotalDetail.push({
                                total:item.total,
                                allNumber:res.data.cutReadQuality.allNumber,
                                //score:item.score
                            })
                            that.echartDataLineX.push(item.score);
                        }
                        let tempTableData=[];
                        let tempObj={};
                        for(let item of res.data.tempUserReadQuality){
                            let flag=0;
                            tempObj=JSON.parse(JSON.stringify(item))
                            that.echartDataLineX.forEach((element,index)=>{
                                for(let childEle of tempObj.quality){
                                    if(childEle.score==element){
                                        tempObj['rate'+index]=(childEle.rate*100).toString().substring(0,4)
                                        flag=1;
                                        break;
                                    }
                                }
                                // tempObj.quality.forEach((childEle)=>{
                                    
                                // })
                                if(!flag){
                                    tempObj['rate'+index]=0;
                                }
                            })
                            tempTableData.push(tempObj);
                        }
                        that.tableData=tempTableData;
                        for(let item of res.data.tempUserReadQuality){
                            let array=[];
                            let arrayObj=[];
                            let flag=0;
                            array.length=that.echartDataLineX.length;
                            
                            that.echartDataLineX.forEach((element,index) => {
                                for(let childItem of item.quality){
                                    if(element==childItem.score){
                                        array[index]=childItem.rate*100;
                                        arrayObj.push(Number(childItem.total));
                                        flag=1;
                                        break;
                                    }
                                }
                                if(!flag){
                                    arrayObj.push(0);
                                }
                            });
                            that.echartDataTeacher.push(array);
                            that.echartDataTeacherSerieDetail.push({
                                quality:arrayObj,
                                userReadCutNum:item.userReadCutNum
                            })
                        }
                        for(let item of that.echartDataAvg){
                            that.echartDataAvgX.push(item.userName);
                            that.echartDataAvgY.push(Number(item.avg));
                        }
                        
                    }
                }).then(res=>{
                    let myChart=echart.init($('#echart')[0]);
                        let option={
                            color: ['#3398DB'],
                            tooltip : {
                                trigger: 'axis',
                                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                                }
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            xAxis : [
                                {
                                    type : 'category',
                                    data : that.echartDataAvgX,//["test1","test2"],//
                                    axisTick: {
                                        alignWithLabel: true
                                    },
                                    splitLine: {//显示分割线
                                        show: true
                                    }
                                }
                            ],
                            yAxis : [
                                {
                                    type : 'value',
                                    name: '平均分数',
                                }
                            ],
                            series : [
                                {
                                    name:'平均分',
                                    type:'bar',
                                    barWidth: '60%',
                                    data:that.echartDataAvgY,//[20,50],//
                                    markLine: {
                                        data: [
                                            {type: 'average', name: '平均值'}
                                        ]
                                    }
                                }
                            ]
                        }
                        myChart.setOption(option);
                        myChart.on('click', function (params) {
                            // 控制台打印数据的名称
                            console.log(params);
                            that.dataIndex=params.dataIndex;
                            //this.echartDataTeacherSerie=this.echartDataTeacher[params.dataIndex];
                            that.dialogTableVisible=true;
                        });
                })
            },
            loadLineEchart(){
                let myChartLine=echart.init($('#echartLine')[0]);
                let quality=this.echartDataTeacherSerieDetail[this.dataIndex].quality
                this.echartDataTeacherSerie=this.echartDataTeacher[this.dataIndex];
                this.teacherName=this.echartDataAvgX[this.dataIndex]
                let that=this;
                            let option2={
                                color: ['#333333','#3398DB'],
                                tooltip: {
                                    trigger: 'item',
                                    formatter: function (param) {
                                        console.log(param.data)
                                        if(param.seriesName==that.teacherName){
                                            return [
                                                param.seriesName+'<hr size=1 style="margin: 3px 0">',
                                                '分数: ' + that.echartDataLineX[param.dataIndex] + '<br/>',
                                                '该分数人数: ' + quality[param.dataIndex] + '<br/>',
                                                '总人数: ' + that.echartDataTeacherSerieDetail[that.dataIndex].userReadCutNum + '<br/>',
                                                '比例: '+ param.data+ '%<br/>',
                                            ].join('');
                                        }else{
                                            return [
                                                param.seriesName+'<hr size=1 style="margin: 3px 0">',
                                                '分数: ' + that.echartDataLineX[param.dataIndex] + '<br/>',
                                                '该分数人数: ' + that.echartDataTotalDetail[param.dataIndex].total + '<br/>',
                                                '总人数: ' + that.echartDataTotalDetail[0].allNumber + '<br/>',
                                                '比例: '+ param.data+ '%<br/>',
                                            ].join('');
                                        }
                                        
                                    }
                                },
                                legend: {
                                    data:[this.cutingName,this.teacherName]//['total','temp01']
                                },
                                grid: {
                                    left: '3%',
                                    right: '4%',
                                    bottom: '3%',
                                    containLabel: true
                                },
                                toolbox: {
                                    feature: {
                                        saveAsImage: {}
                                    }
                                },
                                xAxis: {
                                    type: 'category',
                                    boundaryGap: false,
                                    data: this.echartDataLineX//[5,7,10,12]
                                },
                                yAxis: {
                                    type: 'value',
                                    axisLabel: { show: true, interval: 'auto', formatter: '{value}%' }, 
                                    show: true 
                                },
                                series: [
                                    {
                                        name:this.cutingName,//'total',//
                                        type:'line',
                                        stack: '总量',
                                        data:this.echartDataTotal//[120, 132, 101, 134, 90, 230, 210],
                                    },
                                    {
                                        name:this.teacherName,//'temp01',//
                                        type:'line',
                                        stack: '教师量',
                                        data:this.echartDataTeacherSerie//[220, 182, 191, 234, 290, 330, 310]
                                    },
                                
                                ]
                            }
                            myChartLine.setOption(option2);
            }
        },
        mounted(){
            this.initData();
            this.initTableData();
        }
    }
</script>

<style scoped>
    #echart{
        height: 400px;
    }
</style>