<template>
    <el-container id="marking">
        <el-header><h4>阅卷/阅卷任务分配</h4></el-header>
        <el-main>
            <el-col :span="24" class="toolbar" style="padding-bottom: 10px;">
                <el-button @click="ass_marking" type="success" :loading="ass_loading">一键分配</el-button>
                <a :href="dowd_url"  v-show="view_dowd" class="el-button el-button--info">下载表格</a>
            </el-col>
            <el-table
                    :data="cutting_data"
                    style="width: 100%"
                    height="650"
                    v-loading="table_loading">
                <el-table-column
                        label="模块名称"
                        width="180" prop="cuttingName">
                        
                </el-table-column>
                <el-table-column
                        label="模块图片预览"
                        width="180" >
                       <template slot-scope="scope">
                            <el-popover placement="right-start" class="popover" trigger="hover">
                            <el-button slot="reference">预览</el-button>
                            <div class="imgPane" v-loading="loadingList[scope.$index]">
                                <img class="imgItem" v-for="(item,index) in scope.row.imgPaths" :key="index" style="max-height:400px;display:block;">
                            </div>
                        </el-popover>
                       </template>
                </el-table-column>
                
                <el-table-column
                        label="模块总分"
                        width="180" prop="score"></el-table-column>
                <el-table-column
                        label="模块已分配老师数"
                        width="180" prop="finalTeacherNum"></el-table-column>
                <el-table-column
                        label="分配普通阅卷老师"
                        width="180"
                >
                    <template slot-scope="scope">


                        <el-input v-model="ass_data[scope.$index].cutting.judgeTeacherNum" ></el-input>

                    </template>


                </el-table-column>
                <el-table-column
                        label="是否多评"
                        width="180"
                >
                    <template slot-scope="scope">


                        <el-checkbox v-model="ass_data[scope.$index].cutting.isMulit" true-label="30001" false-label="30002">多评</el-checkbox>

                    </template>
                </el-table-column>
                <el-table-column
                        label="分配终审老师"
                        width="180"
                >
                    <template slot-scope="scope">


                        <el-input v-model="ass_data[scope.$index].cutting.finalTeacherNum"></el-input>

                    </template>
                </el-table-column>
                <el-table-column
                        label="批阅阈值"
                        width="180"
                >
                    <template slot-scope="scope">
                        <el-input v-model="ass_data[scope.$index].cutting.fragmentSub"></el-input>




                    </template>
                </el-table-column>
                <el-table-column
                        label="分配块管理员"
                        width="180"
                >
                    <template slot-scope="scope"  >



                        <el-input v-model="ass_data[scope.$index].cutting.finalCuttingNum"></el-input>

                    </template>
                </el-table-column>
                <!--<el-table-column label="操作">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-button-->
                                <!--size="mini"-->
                                <!--@click="handleEdit(scope.$index, scope.row)">分配-->
                        <!--</el-button>-->
                        <!--<el-button-->
                                <!--size="mini"-->
                                <!--type="danger"-->
                                <!--@click="handleDelete(scope.$index, scope.row)">删除-->
                        <!--</el-button>-->
                    <!--</template>-->
                <!--</el-table-column>-->
            </el-table>


        </el-main>
    </el-container>
</template>

<script>
    import {get_all_cutting,ass_marking,dowd_marking,getfragmentbyid,baseUrl} from '../../../api/api'
    import {cutingPic} from '../../../components/cutingPic.js'
    import { Loading } from 'element-ui';
    import axios from 'axios'
    export default {
        name: "ass_marking_task",
        data() {
            return {
                cutting_data: [],
                checked: false,
                table_loading: true,
                loading:true,
                ass_loading:false,
                ass_data:
                    [
                        {"cutting":{
                            "isMulit":'30002',
                            "fragmentSub":'',
                            "finalTeacherNum":'',
                            "finalCuttingNum":'',
                            "judgeTeacherNum":'',
                            "cutingMergeId":''
                        }}

                    ],
                view_dowd:false,
                dowd_url:'',
                base:baseUrl(),
                renderImgFlag:0,
                renderCnt:0,//记录v-for渲染挂载img标签的次数
                loadingList:[],
            }


        },
        methods: {
            get_cutting() {
                let that=this;
                get_all_cutting(sessionStorage.getItem('exam_small_id')).then((res) => {
                    let request=[];
                    let temp = res.data.msg;
                    console.log(temp)
                    for (let i in temp) {
                        for (let s in temp[i]) {
                            if (s == 0) {
                                this.cutting_data.push(temp[i][s]);
                                this.loadingList.push(true);
                            }
                            request.push(getfragmentbyid(temp[i][s].fragmentId).then(res=>{
                                if(!temp[i][0].imgPaths){
                                        temp[i][0].imgPaths=[];
                                    }
                                if (s == 0) {
                                    temp[i][s].imgPaths.push(res.data.fragment.fragmentImg);
                                    temp[i][0].loading=true;
                                    // that.cutting_data.push(temp[i][s]);
                                }else{
                                    temp[i][0].imgPaths.push(res.data.fragment.fragmentImg);
                                }
                                if(!temp[i][0].cuttings){
                                    temp[i][0].cuttings=[];
                                }
                                temp[i][0].cuttings.push(
                                        {
                                            cuttingX1:temp[i][s].cuttingX1,
                                            cuttingX2:temp[i][s].cuttingX2,
                                            cuttingY1:temp[i][s].cuttingY1,
                                            cuttingY2:temp[i][s].cuttingY2,
                                })
                            }))

                        }


                    }
                    this.table_loading = false;
                    // console.log(this.cutting_data);
                    axios.all(request).then(res=>{
                        this.ass_data.pop();
                        this.build_ass_data();
                        // console.log(this.cutting_data);

                        this.renderImgFlag=1;
                        this.$nextTick(function(){
                            // console.log($('.imgItem'));

                            this.renderImg();
                        })
                    })
                    console.log(this.cutting_data);


                })
                

            },
            renderImg(){
                let cnt=this.renderCnt;
                this.cutting_data.forEach((item,ind)=>{
                    let request=[];
                    item.imgPaths.forEach((childItem,index) => {
                        let position1={
                            x1:item.cuttings[index].cuttingX1,
                            y1:item.cuttings[index].cuttingY1
                        }
                        let position2={
                            x2:item.cuttings[index].cuttingX2,
                            y2:item.cuttings[index].cuttingY2
                        }
                        let element=$('.imgItem').eq(cnt)[0];
                        //let loadingInstance = Loading.service({ fullscreen: false });
                        request.push(cutingPic(childItem,position1,position2,element).then(res=>{
                            element.style.height=800/item.imgPaths.length+"px"
                            // that.loading=false;
                            // that.loadingList[ind]=false;
                            //this.$set(this.loadingList,ind,false);
                            //loadingInstance.close();
                        }));
                        cnt++;
                    });
                    axios.all(request).then(()=>{
                        this.$set(this.loadingList,ind,false);
                    })
                    // for(let childItem of item.imgPaths){
                        
                    // }
                })
                this.renderCnt=cnt;
            },
            build_ass_data(){


                for( let i in this.cutting_data){
                    console.log(this.cutting_data);
                    let para = {

                        "cutting":{
                            "isMulit":this.cutting_data[i].isMulit,
                            "fragmentSub":this.cutting_data[i].fragmentSub,
                            "finalTeacherNum":this.cutting_data[i].finalTeacherNum,
                            "finalCuttingNum":this.cutting_data[i].finalCuttingNum,
                            "judgeTeacherNum":this.cutting_data[i].judgeTeacherNum,
                            "cutingMergeId":this.cutting_data[i].cutingMergeId
                        }



                    }
                    this.ass_data.push(para);





                }
                console.log(this.ass_data);




            },
            ass_marking(){
                this.ass_loading = true;
                ass_marking(this.ass_data).then((res) =>{
                    if( res.code=="200"){
                        dowd_marking(sessionStorage.getItem('exam_small_id')).then((res) =>{

                            // console.log(res);
                            this.dowd_url = baseUrl()+'/ssm/downloadexcel/'+res.data.msg;
                            this.view_dowd = true;

                        })
                        this.$notify({
                            message: '分配成功',
                            type: 'success'
                        });


                    }else {
                        this.$notify({
                            message: '分配失败',
                            type: 'warning'
                        });


                    }
                    this.ass_loading = false;


                })

            }


        },
        // created:{
        //
        // },
        mounted() {
            this.get_cutting();
            
        },
        updated(){
            
                
            
        }

    }
</script>

<style scoped>
.imgPane{max-height: 800px;}
</style>