<template>
<el-container >
            <el-header><h4>给分点设置</h4></el-header>
            <el-main v-loading="loading">
                <div>
                    <div style="height:50px">
                        <el-steps :active="currentPage" align-center>
                            <el-step v-for="(item,index) in imgList" :data-key="index" :key="index" class="stepitem"></el-step>
                        </el-steps>
                        <!-- <el-button style="margin-top: 12px;" @click="nextStep">下一步</el-button> -->
                    </div>
                    <div class="splitView">
                        <div ref="imgSlot" id="bigDiv" style="width:1156px;height:800px;border:1px solid #ebeef5;margin:0 auto;overflow:hidden"     >
                            <div v-for="(item,index) in imgList" :key="index" class="page_div" >
                                <div class="imgDisplay" v-for="(childitem,childindex) in imgList[index]" :key="childindex" @mousedown="mymousedown">
                                    <img class="img_target">

                                </div>
                            </div>
                            <!-- <div id="imgDiv"  style="width:800px">
                                <img id="sourceImg" :src="'http://10.131.7.138:8080/ssm/'+sourceUrl" style="height:800px" >
                            </div> -->

                        </div>
                        <div class="btn_div">
                            <div class="page_btn">
                                <el-button type="primary" icon="el-icon-arrow-left" circle @click="prev_paper"></el-button>
                                <el-button type="primary" icon="el-icon-arrow-right" circle @click="next_paper"></el-button>
                            </div>

                            <!-- <el-popover placement="top"  width="160" v-model="visible">
                                    <p>你确定提交吗？</p>
                                    <div style="text-align: right; margin: 0">
                                        <el-button size="mini" type="text" @click="dialogCancel">取消</el-button>
                                        <el-button type="primary" size="mini" @click="dialogSubmit">确定</el-button>
                                    </div> -->
                            <el-tooltip class="item" effect="light" content="提交" placement="bottom">
                                        <el-button style="margin: 5px 5px" class="btn_group" type="success" icon="el-icon-check" circle @click="submit"></el-button>

                            </el-tooltip>
                            <!-- </el-popover> -->

                        </div>
                    </div>
                    <div class="itemList">
                        <el-table  :data="tableData" height="800" border style="width: 100%">
                            <el-table-column type="index" align="center" width="50"></el-table-column>
                            <el-table-column align="center" label="名称" width="200">
                                <template slot-scope="scope">
                                  <span @dblclick="editState(scope.row)" v-if="!scope.row.editFlag">{{ scope.row.pointName }}</span>
                                  <span @keydown.13="submitEdit(scope.row)" v-if="scope.row.editFlag" class="cell-edit-input"><el-input v-model="scope.row.pointName" placeholder="请输入名字"></el-input></span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="满分" width="150">
                                <template slot-scope="scope">
                                  <span @dblclick="editScoreState(scope.row)" v-if="!scope.row.editFlagScore">{{ scope.row.echoPointScore }}</span>
                                  <span @keydown.13="submitEdit(scope.row)" v-if="scope.row.editFlagScore" class="cell-edit-input"><el-input v-model="scope.row.echoPointScore" placeholder="请输入名字"></el-input></span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="150">
                                <template slot-scope="scope">
                                    <el-button  type="danger" @click="handleDelete(scope)" size="small" >删除</el-button>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column prop="addres"  label="操作" align="center" width="100">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="handleClick(scope.row)" size="small">编辑</el-button>
                                </template>
                            </el-table-column> -->
                        </el-table>

                    </div>
                    <div style="display:none"><img id="source" :src="base+'/ssm/'+imgList[0]?imgList[0]:'img?path=img'"></div>
                    <el-dialog
                title="设置给分点属性"
                :visible.sync="dialogVisible"
                width="30%">
                    <span>
                        <el-form ref="form" :model="form" label-width="100px">
                            <el-form-item label="名称">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                            <el-form-item label="分数">
                                <el-input v-model="form.score"></el-input>
                            </el-form-item>
                        </el-form>
                    </span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" class="keydownTarget" @click="sureClick">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
        </el-main>
        </el-container>
</template>
<script>
import axios from 'axios'
import {coordinate} from '../../../components/coordinate.js'
import {cutingPic} from '../../../components/cutingPic.js'
import {getpaper,baseUrl,getallcutting,getfragmentimg,getfragmentbyid,putcuttingTotalSorce,postcuttingScorePoint,putcuttingScorePoint,getcuttingScorePoint,delcuttingScorePoint} from '../../../api/api.js'
export default {
    data(){
        return{
            currentPage:0,
            tableData:[],
            visible:false,
            imgList:[],
            templetIdList:[],
            sourceHeight:0,
            dialogVisible:false,
            base:baseUrl(),
            form:{
                name:'',
                score:0
            },
            scoreElement:'',
            positionList:[],//存小块坐标点
            postParams:[],
            putSumScore:[],
            spanElement:'',
            renderFlag:0,//页面渲染是否完成的标记
            treeLengths:0,//记录v-for循环时的长度
            treeLengthMax:0,//imgList最大长度
            loading:true,
            positionOneArray:[],//用来存储cutingpic传的第一个坐标点
            virtualEditState:false,//提交后的状态
            totalPageofsetScore:0
        }
    },
    // props:{
    //     sourceUrl:{
    //         type:String,
    //         default:''
    //     },
    //     sourceHeight:{
    //         type:Number,
    //         default:0
    //     },
    //     imgList:{
    //         type:Array,
    //         default:[]
    //     },
    //     templetId:{
    //         type:String,
    //         default:''
    //     }
    // },
    methods:{
        clickEvent(event){
            console.log(event.target);
        },
        dialogCancel(){
            this.visible=false;
            sessionStorage.getItem('exam_small_id')
        },
        dialogSubmit(){
            this.visible=false;
        },

        editState(row){
            row.editFlag=true;
            console.log(row.editFlag)
        },
        editScoreState(row){
            row.editFlagScore=true;
            console.log(row.editFlag)
        },
        submitEdit(row){
            row.editFlag=false;
            row.editFlagScore=false;
            let rowData={};
            rowData.echoPointScore=row.echoPointScore;
            rowData.pointName=row.pointName;
            rowData.cuttingMergeId=row.cuttingMergeId;
            putcuttingScorePoint(row.pointId,rowData).then(res=>{
              if(res.code==200){
                this.$notify({
                  type:'success',
                  message:'更改成功'
                })
              }
            }).catch(error=>{
              this.$notify({
                type:'error',
                message:error
              })
            })
        },
        handleDelete(scope){


            $('.page_div').eq(this.currentPage).find('.scoreImg').eq(scope.$index).remove();
            $('.page_div').eq(this.currentPage).find('.scoreNumber').eq(scope.$index).remove();
            if(this.postParams[this.currentPage][scope.$index].isEdit){
                delcuttingScorePoint(this.tableData[scope.$index].pointId).then(res=>{
                    if(res.code==200){

                        this.$notify({
                            type:"success",
                            message:"删除成功"
                        })
                    }
                }).catch(e=>{
                    console.log(e)
                    this.$notify({
                            type:"error",
                            message:"删除失败"
                        })
                })
            }
            this.tableData.splice(scope.$index,1);
            this.postParams[this.currentPage].splice(scope.$index,1);
        },
        //前一页
        prev_paper(){
            let that=this;
            let dataLength=this.tableData.length;
                if(this.currentPage){
                    //if(!this.virtualEditState){
                        $('.page_div').eq(that.currentPage).find('.scoreImg_old').remove();
                        $('.page_div').eq(that.currentPage).find('.scoreNumber_old').remove();
                    //}
                    $('.page_div').eq(this.currentPage)[0].style.display="none"
                    this.currentPage--;
                    let img=$('.page_div img')[this.currentPage];
                    this.reshow()

                    // if(!this.virtualEditState){

                    // }else{
                    //     for(let cnt=0;cnt<dataLength;cnt++){
                    //         this.tableData.pop();
                    //     }
                    // }
                    $('.page_div').eq(this.currentPage)[0].style.display="block"
                    // $('.page_div').eq(this.currentPage)[0].style.width=(this.positionList[this.currentPage].cuttingX2-this.positionList[this.currentPage].cuttingX1)*800/sourceHeight+"px"
                    // $('.page_div').eq(this.currentPage)[0].style.height=(this.positionList[this.currentPage].cuttingY2-this.positionList[this.currentPage].cuttingY1)*800/sourceHeight+"px"
                    // $('.page_div .imgList').eq(this.currentPage)[0].style.transform="translateX(-"+this.positionList[this.currentPage].cuttingX1*800/sourceHeight+"px) translateY(-"+this.positionList[this.currentPage].cuttingY1*800/sourceHeight+"px)"
                        // if(that.virtualEditState){
                        //     let target_dom_list=[];
                        //     document.querySelectorAll('.scoreImg').forEach((item)=>{
                        //         if(item.classList.length==1){
                        //             target_dom_list.push(item)
                        //         }
                        //     })
                        //     document.querySelectorAll('.scoreNumber').forEach((item)=>{
                        //         if(item.classList.length==1){
                        //             target_dom_list.push(item)
                        //         }
                        //     })
                        //     target_dom_list.forEach(item=>{
                        //         $(item).remove()
                        //     })
                        // }

                    for(let i=0;i<this.postParams[this.currentPage].length;i++){
                        console.log(!this.postParams[this.currentPage][i].isEdit)
                        if(!this.postParams[this.currentPage][i].isEdit){//如果isEdit不为true则push到tableData中
                            let obj=JSON.parse(JSON.stringify(this.postParams[that.currentPage][i]));
                            obj.editFlag=false;
                            obj.editFlagScore=false;
                            this.tableData.push(obj)
                        }
                    }
                }
                //根据动态加载样式，使其当前页的图片显示，其他页的图片不显示
                // this.sourceUrl=imgList[page]
        },
        next_paper(){
                let that=this;
                let dataLength=this.tableData.length;
                // this.page++
                // this.sourceUrl=imgList[page]
                if(this.currentPage<this.imgList.length-1){

                    $('.page_div').eq(that.currentPage).find('.scoreImg_old').remove();
                    $('.page_div').eq(that.currentPage).find('.scoreNumber_old').remove();
                    $('.page_div').eq(this.currentPage)[0].style.display="none"
                    that.currentPage++;
                    let img=$('.page_div img')[this.currentPage];
                    this.reshow()

                    // if(!this.virtualEditState){

                    // }else{
                    //     for(let cnt=0;cnt<dataLength;cnt++){
                    //         this.tableData.pop();
                    //     }
                    // }



                    $('.page_div').eq(this.currentPage)[0].style.display="block"
                    // $('.page_div').eq(this.currentPage)[0].style.width=(this.positionList[this.currentPage].cuttingX2-this.positionList[this.currentPage].cuttingX1)*800/sourceHeight+"px"
                    // $('.page_div').eq(this.currentPage)[0].style.height=(this.positionList[this.currentPage].cuttingY2-this.positionList[this.currentPage].cuttingY1)*800/sourceHeight+"px"
                    //$('.page_div .imgList').eq(this.currentPage)[0].style.transform="translateX(-"+this.positionList[this.currentPage].cuttingX1*800/sourceHeight+"px) translateY(-"+this.positionList[this.currentPage].cuttingY1*800/sourceHeight+"px)"

                        // if(that.virtualEditState){
                        //     let target_dom_list=[];
                        //     document.querySelectorAll('.scoreImg').forEach((item)=>{
                        //         if(item.classList.length==1){
                        //             target_dom_list.push(item)
                        //         }
                        //     })
                        //     document.querySelectorAll('.scoreNumber').forEach((item)=>{
                        //         if(item.classList.length==1){
                        //             target_dom_list.push(item)
                        //         }
                        //     })
                        //     target_dom_list.forEach(item=>{
                        //         $(item).remove()
                        //     })
                        // }

                    for(let i=0;i<that.postParams[that.currentPage].length;i++){
                        if(!that.postParams[that.currentPage][i].isEdit){
                            let obj=JSON.parse(JSON.stringify(this.postParams[that.currentPage][i]));
                            obj.editFlag=false;
                            obj.editFlagScore=false;
                            this.tableData.push(obj)
                        }
                    }
                }
                console.log(this.postParams)
        },
        //初始化
        get_templet_by_examId(){

            let templetIdList=sessionStorage.getItem('templetIdList').split(',');
            let request=[];
            let requestfragment=[];
            let imgList=[];
            let positionList=[]
            let fragmentIdList=[];
            let length=0;
            let that=this;
            // for(let i=0;i<templetIdList.length;i++){
            //     request.push(getfragmentimg(templetIdList[i]).then(res=>{
            //         for(let j=0;j<res.data.fragments.length;j++){
            //             imgList.push(res.data.fragments[j].fragmentImg)
            //             fragmentIdList.push(res.data.fragments[j].fragmentId)
            //         }
            //     }).catch(res=>{
            //         this.$notify({
            //             type:"error",
            //             message:res.msg
            //         })
            //     }))
            // }
            // axios.all(request).then(res=>{
            //     this.imgList=imgList;
            //     this.fragmentIdList=fragmentIdList;
            //     //this.positionList=positionList;

            // });



            getallcutting(sessionStorage.getItem('exam_small_id')).then((res)=>{
                if(res.code=="200"){
                    let length=res.data.msg.length;
                    let positionTree=res.data.msg;
                    for(let i=0;i<length;i++){
                        imgList.push([])
                        for(let j=0;j<positionTree[i].length;j++){
                            imgList[i].push({
                                position1:{
                                    x1:positionTree[i][j].cuttingX1,
                                    y1:positionTree[i][j].cuttingY1
                                },
                                position2:{
                                    x2:positionTree[i][j].cuttingX2,
                                    y2:positionTree[i][j].cuttingY2
                                },
                                url:'',
                                fragmentId:positionTree[i][j].fragmentId,
                                cutingMergeId:positionTree[i][j].cutingMergeId
                            })
                        }
                    }
                    let cnt=0;//记录长度
                    for(let i=0;i<imgList.length;i++){
                        for(let j=0;j<imgList[i].length;j++){
                            cnt++;
                            requestfragment.push(getfragmentbyid(imgList[i][j].fragmentId).then(res=>{
                                imgList[i][j].url=res.data.fragment.fragmentImg
                            }))
                        }
                    }
                    this.treeLengthMax=cnt;
                    axios.all(requestfragment).then(res=>{
                        that.imgList=imgList;
                        for(let i=0;i<imgList.length;i++){
                            that.postParams.push([])
                        }
                        that.totalPageofsetScore=JSON.parse(JSON.stringify(that.postParams)).length;
                    })
                    console.log(imgList)
                }

            })
        },
        sureClick(){
            this.tableData.push({
                pointName:this.form.name,
                echoPointScore:this.form.score,
                editFlag:false,
                editFlagScore:false
            })
            this.dialogVisible=false;
            this.spanElement.innerText=this.form.score;
            $('.page_div').eq(this.currentPage)[0].appendChild(this.scoreElement);
            $('.page_div').eq(this.currentPage)[0].appendChild(this.spanElement);
            let target=0;
            let that=this;
            let flag=0;
            $.each($('.page_div').eq(this.currentPage).find('.imgDisplay img'),function(index,item){
                let distance=that.getElementTop(item)-that.getElementTop(that.scoreElement);
                if(distance>=0){
                    flag=1;
                    target=index-1;
                    return false;
                }
            })
            if(!flag){
                $('.page_div').eq(this.currentPage).find('.imgDisplay .scoreImg').length>0?target=$('.page_div').eq(0).find('.imgDisplay .img_target').length-1:target=$('.page_div').eq(this.currentPage).find('.imgDisplay img').length-1
            }
            let sx=this.getElementLeft(this.scoreElement)+25-this.getElementLeft($('.page_div').eq(this.currentPage).find('.imgDisplay img').eq(target)[0]);
            let sy=this.getElementTop(this.scoreElement)+25-this.getElementTop($('.page_div').eq(this.currentPage).find('.imgDisplay img').eq(target)[0]);
            let bx=0;
            let by=0;
            $.each($('.img_target'),function(index,item){
                if(item==$('.page_div').eq(that.currentPage).find('.imgDisplay img').eq(target)[0]){
                    bx=that.positionOneArray[index].x1;
                    by=that.positionOneArray[index].y1;
                }
            })

            let imgDomElement=$('.page_div').eq(that.currentPage).find('.imgDisplay img').eq(target)[0];
            let times=imgDomElement.naturalHeight*1.0/imgDomElement.clientHeight*1.0;
            let point={
                sx:Number(sx)*times,
                sy:Number(sy)*times,
                bx:Number(bx),
                by:Number(by)
            }
            let output=coordinate(point);
            console.log(output.x,output.y);
            this.postParams[this.currentPage].push({
                "echoPointScore": this.form.score,
                "pointName": this.form.name,
                "cuttingMergeId": this.getcutingMergeId(),
                "pointX": Number(output.x),
                "pointY": Number(output.y),
                "fragmentId":$('.page_div').eq(this.currentPage).find('.imgDisplay img').eq(target).attr('data-id'),
                "pointType": ""
            })
            console.log(this.postParams[this.currentPage])
            this.form={
                name:'',
                score:0
            }
        },
        getcutingMergeId(){
            let imgList=this.imgList;
            let that=this;
            let cnt=0;
            let id='';
            for(let i=0;i<imgList.length;i++){
                if(i==that.currentPage){
                    id=imgList[i][0].cutingMergeId;
                }
            }
            return id;
        },
        submit(){
            let that=this;
            let request=[];
            console.log(that.postParams)
            this.$confirm('确定提交吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    let flag=1;
                    this.postParams.forEach(element=>{
                        if(element.length<=0){
                            flag=0;
                        }
                    })
                    if(flag){
                        for(let i=that.postParams.length-1;i>=0;i--){
                            let sum=0;
                            let length=that.postParams[i].length;
                            for(let j=0;j<length;j++){
                                sum+=Number(that.postParams[i][j].echoPointScore)
                            }
                            // for(let j=i;j<that.postParams.length;j++){
                            //     if(i!=j&&that.postParams[i].page==that.postParams[j].page){
                            //         sum+=Number(that.postParams[j].echoPointScore)
                            //     }
                            // }
                            if(that.postParams[i][0]){
                                that.putSumScore.push({
                                    "sroce":sum,
                                    "mergeid":that.postParams[i][0].cuttingMergeId
                                })
                            }else{
                                that.postParams.splice(i,1);
                            }
                        }
                        for(let i=0;i<that.putSumScore.length;i++){
                            request.push(putcuttingTotalSorce(that.putSumScore[i].mergeid,that.putSumScore[i].sroce))
                        }
                        for(let i=0;i<that.postParams.length;i++){
                            for(let j=0;j<that.postParams[i].length;j++){
                                if(!that.postParams[i][j].isEdit) {request.push(postcuttingScorePoint(that.postParams[i][j]))}
                                // else{
                                //     delete that.postParams[i][j].isMutil
                                //     delete that.mutilSub[i][j].isEdit
                                //     delete that.mutilSub[i][j].mutilSub
                                //     request.push(putcuttingScorePoint(that.postParams[i][j].pointId,that.postParams[i][j]))
                                //     }
                            }
                        }
                        axios.all(request).then(res=>{
                            this.virtualEditState=true;
                            this.$notify({
                                type: 'success',
                                message: "成功"
                            })
                            setTimeout(()=>{
                                this.$router.push('/ass_marking_paper')
                            },500)
                        }
                        )
                    }else{
                        this.$notify({
                            type:'error',
                            message:'请确认一下是否所有小块都设置了给分点'
                        })
                    }



                }).catch(e=>{
                    console.log(e);
                    // this.$notify({
                    //     type: 'error',
                    //     message: e
                    // });
                })
        },
        mymousedown(e){

            console.log('onmousedown');
            console.log(e);
            try{
                this.dialogVisible=true;
                let score=document.createElement("img");
                let span=document.createElement("span");
                let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                let scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
                span.className="scoreNumber";
                span.style.left=e.pageX-this.getElementLeft($('.splitView')[0])+25+"px";
                span.style.top=e.pageY-this.getElementTop($('.splitView')[0])-20+"px";
                span.style.position="absolute";
                span.style.color="red";
                span.style.fontSize="30px";
                score.className="scoreImg";
                score.style.width="50px";
                score.style.height="50px";
                score.style.left=e.pageX-this.getElementLeft($('.splitView')[0])-25+"px"
                score.style.top =e.pageY-this.getElementTop($('.splitView')[0])-25+"px"
                score.style.position="absolute";
                score.src='./static/img/dui1.png';
                this.scoreElement=score;
                this.spanElement=span;
            }catch(e){
                console.log(e);
            }
        },
        getElementLeft(element){
            let actualLeft=element.offsetLeft;
            let current=element.offsetParent;
            while(current!==null){
                actualLeft+=current.offsetLeft;
                current=current.offsetParent;
            }
            return actualLeft;
        },
        getElementTop(element){
            let actualTop=element.offsetTop;
            let current=element.offsetParent;
            while(current!==null){
                actualTop+=current.offsetTop;
                current=current.offsetParent;
            }
            return actualTop;
        },
        //重现函数
        reshow(){
            let dataLength=this.tableData.length;

            if(!this.postParams[this.currentPage]&&this.currentPage<this.totalPageofsetScore){
                let cnt=this.totalPageofsetScore-this.currentPage
                for(let i=0;i<cnt;i++){
                    this.postParams.push([]);
                }
            }
            let paramsLength=this.postParams[this.currentPage].length;
            let request=[];
            let that=this;
            let imgList=this.imgList;
            for(let cnt=0;cnt<dataLength;cnt++){
                this.tableData.pop();
            }
            for(let i=0;i<imgList.length;i++){
                    if(i==that.currentPage){
                        request.push(getcuttingScorePoint(imgList[i][0].cutingMergeId).then(res=>{
                            let results=res.data.msg;
                            for(let a=paramsLength-1;a>=0;a--){
                                if(!!that.postParams[that.currentPage][a].isEdit) that.postParams[that.currentPage].splice(a,1);
                            }
                            let fragmentList=that.getfragmentList(results);
                            let resultIds=[];
                            results.forEach(item=>{
                                resultIds.push(item.fragmentId)
                            })
                            resultIds=Array.from(new Set(resultIds))
                            for(let j=0;j<resultIds.length;j++){
                                let obj=JSON.parse(JSON.stringify(results[j]));
                                obj.editFlag=false;
                                obj.editFlagScore=false;
                                that.tableData.push(obj);
                                let score=document.createElement("img");
                                let span=document.createElement("span");
                                let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                                let scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
                                
                                span.className="scoreNumber_old scoreNumber";

                                span.style.position="absolute";
                                span.style.color="red";
                                span.style.fontSize="30px";
                                score.className="scoreImg_old scoreImg";
                                score.style.width="50px";
                                score.style.height="50px";

                                score.style.position="absolute";
                                score.src='./static/img/dui1.png';
                                
                                span.innerText=that.tableData[that.tableData.length-1].echoPointScore;
                                for(let k=0;k<fragmentList.length;k++){
                                    if(fragmentList[k].fragmentId==resultIds[j]){
                                        let imgElement=$('.page_div').eq(that.currentPage).find('.imgDisplay').eq(k).find('img')[0];
                                        let clientHeight=imgElement.clientHeight;
                                        span.style.left=Number(results[j].pointX-fragmentList[k].position1.x1)*(clientHeight)/imgElement.naturalHeight+25+"px";
                                        span.style.top=Number(results[j].pointY-fragmentList[k].position1.y1)*(clientHeight)/imgElement.naturalHeight-25+"px";
                                        score.style.left=Number(results[j].pointX-fragmentList[k].position1.x1)*(clientHeight)/imgElement.naturalHeight-25+"px";
                                        score.style.top =Number(results[j].pointY-fragmentList[k].position1.y1)*(clientHeight)/imgElement.naturalHeight-25+"px";
                                        //$('.page_div').eq(that.currentPage)[0].appendChild(score);
                                        //$('.page_div').eq(that.currentPage)[0].appendChild(span);
                                        $('.page_div').eq(that.currentPage).find('.imgDisplay').eq(k)[0].appendChild(score);
                                        $('.page_div').eq(that.currentPage).find('.imgDisplay').eq(k)[0].appendChild(span);
                                    }
                                }
                                console.log(that.tableData);
                                results[j].isEdit=true;
                                that.postParams[that.currentPage].push(results[j]);
                            }
                            console.log(that.postParams[that.currentPage]);
                        }));
                }
            }
            axios.all(request).then(res=>{
                console.log(res)
            });
        },
        getfragmentList(results){
            let imgList=this.imgList;
            let resultList=[];
            let indexList=[];
            imgList.forEach((item,index)=>{
                item.forEach((childItem,childIndex)=>{
                    results.forEach(element=>{
                        if(childItem.fragmentId==element.fragmentId){
                            indexList.push({indexI:index,indexJ:childIndex});
                        }
                    })
                })

            })
            indexList=Array.from(new Set(indexList));
            let fragmentList=[];
            let imgListLen=imgList.length;
            for(let i=0;i<imgListLen;i++){
                for(let j=0;j<imgList[i].length;j++){
                    for(let k=0;k<indexList.length;k++){
                        if(i==indexList[k].indexI&&j==indexList[k].indexJ){
                            fragmentList.push(imgList[i][j]);
                        }
                    }
                }
            }
            let fragmentListLen=fragmentList.length;
            for(let cnt=0;cnt<fragmentListLen;cnt++){
                for(let childCnt=0;childCnt<results.length;childCnt++){
                    if(fragmentList[cnt].cutingMergeId==results[childCnt].cuttingMergeId){
                        resultList.push(fragmentList[cnt]);
                    }
                }
            }
            return Array.from(new Set(resultList));
        },
        duplicateRemoval(array){
            let len=array.length;
            let resultArray=[];
            for(let i=0;i<array.length;i++){
                for(let j=array.length;j>i;j--){
                    if(array[j]==array[i]){
                        array.splice(j,1);
                    }
                }
            }
        },
        nextStep(){
            console.log($(this).data('key'));
            let dataLength=this.tableData.length;
            // $('.scoreImg_old').remove();
            // $('.scoreNumber_old').remove();
            $('.page_div').eq(this.currentPage)[0].style.display="none";
            //that.currentPage=$(this).data('key');
            if(this.currentPage<this.totalPageofsetScore-1){
                this.currentPage++;
            }
            let img=$('.page_div img')[this.currentPage];
            if(!this.virtualEditState){
                $('.scoreImg_old').remove();
                $('.scoreNumber_old').remove();
                this.reshow()
            }else{
                for(let cnt=0;cnt<dataLength;cnt++){
                    this.tableData.pop();
                }
            }
            $('.page_div').eq(this.currentPage)[0].style.display="block"
                    // $('.page_div').eq(this.currentPage)[0].style.width=(this.positionList[this.currentPage].cuttingX2-this.positionList[this.currentPage].cuttingX1)*800/sourceHeight+"px"
                    // $('.page_div').eq(this.currentPage)[0].style.height=(this.positionList[this.currentPage].cuttingY2-this.positionList[this.currentPage].cuttingY1)*800/sourceHeight+"px"
                    // $('.page_div .imgList').eq(this.currentPage)[0].style.transform="translateX(-"+this.positionList[this.currentPage].cuttingX1*800/sourceHeight+"px) translateY(-"+this.positionList[this.currentPage].cuttingY1*800/sourceHeight+"px)"
            for(let i=0;i<this.postParams[this.currentPage].length;i++){
                if(!this.postParams[this.currentPage][i].isEdit){
                    let obj=JSON.parse(JSON.stringify(this.postParams[this.currentPage][i]));
                    obj.editFlag=false;
                    obj.editFlagScore=false;
                    this.tableData.push(obj)
                }
            }
        }
    },

    mounted(){
        let that=this;

        this.get_templet_by_examId();
        document.onkeydown=function(e){
            console.log(e)
            if(e.keyCode==13&&that.dialogVisible){
                that.sureClick();
            }
        }
        // $(document).on('click','.stepitem',function(){

        // })
    },
    updated(){
        if(!this.renderFlag){
            let imgList=this.imgList;
            let cnt=0;
            let that=this;
            let request=[];
            if($(`.img_target`).length==this.treeLengthMax){
                for(let i=0;i<imgList.length;i++){
                        for(let j=0;j<imgList[i].length;j++){
                            request.push(cutingPic(imgList[i][j].url,imgList[i][j].position1,imgList[i][j].position2,$(`.img_target`).eq(cnt)[0]))
                            $(`.img_target`).eq(cnt).attr('data-id',imgList[i][j].fragmentId);
                            $(`.img_target`).eq(cnt)[0].style.maxHeight=800/imgList[i].length+'px';
                            cnt++;
                            this.positionOneArray.push(imgList[i][j].position1);
                        }
                    }
            }
            Promise.all(request).then(res=>{
                this.loading=false;//切图全部完成后取消进度条
            })
            document.querySelectorAll('.page_div').forEach((element,index) => {
                if(index!=0) element.style.display="none"
            });

        }
        this.renderFlag=1;

    },
    watch:{
        renderFlag(newval,oldval){
            let that=this;
            if(newval==1&&oldval!=newval){
                let img=$('.img_target')[0];
                //图片加载完毕后执行回显，并记录其原高
                img.onload = function(){
                    that.reshow();
                }
            }
        }

    }
}
</script>


<style scoped>
body,h1,h2,h3,h4,h5,h6,hr,p,blockquote,dl,dt,dd,ul,ol,li,pre,form,fieldset,legend,input,textarea,th,td{margin:0;}
html{color:#000;overflow-y:scoll;overflow:-moz-scrollbars-vertical}
.splitView{width: 1200px;float: left;position: relative}
.btn_div{width: 1156px;margin: 0 auto;}
.btn_group{float:right}
.itemList{width: 552px;float: left;}
.page_btn{width: 200px;float: left;margin-left: 510px;margin-top: 5px;}
.next{transform:translateX(-800px)}
.last{transform:translateX(800px)}
.click_div{border:2px solid red !important;}
.scoreImg{position:absolute;}
.page_div{margin: 0 auto;height: 800px;}
.scoreNumber{color: red;position: absolute;font-size: 30px;}
.img_target{display: table;margin: 0 auto;max-height: 800px;max-width: 1156px;}
/* .stepitem:hover{cursor: pointer;} */
.splitView /deep/ .imgDisplay{display: table;margin: 0 auto;position: relative;}
</style>


