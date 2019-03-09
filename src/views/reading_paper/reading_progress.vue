<template>
<div class="echarts">
    <div id="progress_echart"></div>
    <div id="progress_echart2"></div>
    <el-dialog :title="'教师'+teacherName+'的给分折线图'" :visible.sync="dialogTableVisible" @opened="loadLineEchart">
        <div id="echartLine" style="height:400px"></div>
    </el-dialog>
</div>
    
    
</template>

<script>
import echart from 'echarts'
import {get_judgeProgressDetail} from '../../api/api'
import {get_cutreadquality} from '../../api/api'
    export default {
        name: "reading_progress",
        data(){
            return{
                echartDataLineX:[],//折线图x轴坐标集合
                //echartDataLineXObj:[],//折线图x轴坐标对象集合
                echartDataTotal:[],
                echartDataTotalDetail:[],
                echartDataTeacher:[],
                echartDataAvg:[],
                echartDataAvgX:[],
                echartDataAvgY:[],
                echartDataAvgY2:[],
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
                        
                        
                    }
                })
                get_judgeProgressDetail().then(res=>{
                    console.log(res.data.progress);
                    let echartDataAvgY=[];
                    let echartDataAvgX=[];
                    let echartDataAvgY2=[];
                    let echartDataTotalDetail=res.data.progress;
                    echartDataTotalDetail.forEach(element => {
                        echartDataAvgY.push(element.progress);
                        echartDataAvgX.push(element.userAccount);
                        echartDataAvgY2.push(element.judgeNum);
                    });
                    that.echartDataAvgX=echartDataAvgX;
                    that.echartDataAvgY=echartDataAvgY;
                    that.echartDataAvgY2=echartDataAvgY2;
                    that.echartDataTotalDetail=echartDataTotalDetail;
                }).then(res=>{
                    let myChart=echart.init($('#progress_echart')[0]);
                    let mynumChart=echart.init($('#progress_echart2')[0]);
                    let option={
                            color: ['#3398DB'],
                            tooltip: {
                                    trigger: 'item',
                                    formatter: function (param) {
                                        console.log(param)
                                        
                                            return [
                                                param.seriesName+'<hr size=1 style="margin: 3px 0">',
                                                 '教师: ' + param.name + '<br/>',
                                                 '进度: ' + param.value + '<br/>',
                                                 '完成量: ' + that.echartDataTotalDetail[param.dataIndex].judgeNum + '<br/>',
                                                 '总份数: '+ that.echartDataTotalDetail[param.dataIndex].allNum+ '%<br/>',
                                            ].join('');
                                        
                                        
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
                                    name: '教师进度(百分比)',
                                }
                            ],
                            series : [
                                {
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
                    let numoption=JSON.parse(JSON.stringify(option))
                    numoption.yAxis[0].name="教师进度(份数)"
                    numoption.series[0].data=that.echartDataAvgY2;
                    numoption.tooltip={
                                    trigger: 'item',
                                    formatter: function (param) {
                                        console.log(param)
                                        
                                            return [
                                                param.seriesName+'<hr size=1 style="margin: 3px 0">',
                                                 '教师: ' + param.name + '<br/>',
                                                 '进度: ' + param.value + '<br/>',
                                                 '完成量: ' + that.echartDataTotalDetail[param.dataIndex].judgeNum + '<br/>',
                                                 '总份数: '+ that.echartDataTotalDetail[param.dataIndex].allNum+ '%<br/>',
                                            ].join('');
                                        
                                        
                                    }
                                },
                    mynumChart.setOption(numoption)
                    myChart.on('click', function (params) {
                        // 控制台打印数据的名称
                        console.log(params);
                        that.dataIndex=params.dataIndex;
                        //this.echartDataTeacherSerie=this.echartDataTeacher[params.dataIndex];
                        that.dialogTableVisible=true;
                    });
                }).catch()
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
        }
    }
</script>

<style scoped>
#progress_echart{
    height:400px;
}
#progress_echart2{
    height:400px;
}
</style>