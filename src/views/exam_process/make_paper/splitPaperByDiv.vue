<template>

    <el-container>
    <el-header><h4>制卡/考试模板上传</h4></el-header>
    <el-main>
        <el-row>
            <el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16">
                
                <div class="splitView" v-loading="loading">
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <div ref="imgSlot" id="bigDiv" :style="'height:'+scaleHeight+'px;border:1px solid #ebeef5;margin:0 auto;overflow:auto'"  >
                            <div id="canvas" @mouseleave="mymouseleave"  @mouseup="mymouseup" @mousemove="mymousemove" >
                                <div class="page_div" :key="index" :style="index>0?'display:none':''" v-for="(item,index) in imgList"><img class='imgList' :src="base+'/ssm/'+item+''" :style="'height:'+scaleHeight+'px'" ></div>
                            </div>
                            
                            <!-- <div class="page_div" ><img class='imgList' :src="base+'/ssm/'+imgList.length>1?imgList[1]:''" :style="'height:'+scaleHeight+'px'" ></div> -->
                            <!-- <div id="imgDiv"  style="width:800px">
                                <img id="sourceImg" :src="'http://10.131.7.138:8080/ssm/'+sourceUrl" style="height:800px" >
                            </div> -->
                        </div>
                        </el-col>
                    </el-row>
                    <el-row>
                            
                        <el-col :xs="7" :sm="6" :md="5" :lg="4" :xl="3" :offset="10">
                            <el-button type="primary" icon="el-icon-arrow-left" circle @click="prev_paper"></el-button>
                            <el-button type="primary" icon="el-icon-arrow-right" circle @click="next_paper"></el-button>
                        </el-col>
                        <el-col :xs="19" :sm="18" :md="16" :lg="14" :xl="11" >
                                <el-tooltip class="item" effect="light" content="重置" placement="bottom">
                                    <el-button style="margin: 5px 5px" class="btn_group" type="danger" icon="el-icon-delete" circle @click="reset"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="light" content="撤销" placement="bottom">
                                    <el-button style="margin: 5px 5px" class="btn_group" type="danger" icon="el-icon-back" circle @click="cancel"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="light" content="框选联合区" placement="bottom">
                                    <el-button style="margin: 5px 5px" class="btn_group" type="primary" icon="el-icon-edit" circle @click="edit(3)"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="light" content="框选客观题区小块" placement="bottom">
                                    <el-button style="margin: 5px 5px" class="btn_group"  icon="el-icon-edit" circle @click="edit(4)"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="light" content="框选客观题区" placement="bottom">
                                    <el-button style="margin: 5px 5px" class="btn_group" type="info" icon="el-icon-edit" circle @click="edit(2)"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="light" content="框选头部区" placement="bottom">
                                    <el-button style="margin: 5px 5px" class="btn_group" type="warning" icon="el-icon-edit" circle @click="edit(1)"></el-button>
                                </el-tooltip>
                                <!-- <el-popover placement="top"  width="160" v-model="visible">
                                        <p>你确定提交吗？</p>
                                        <div style="text-align: right; margin: 0">
                                            <el-button size="mini" type="text" @click="dialogCancel">取消</el-button>
                                            <el-button type="primary" size="mini" @click="dialogSubmit">确定</el-button>
                                        </div> -->
                                <el-tooltip class="item" effect="light" content="提交" placement="bottom">
                                    <el-button style="margin: 5px 5px" class="btn_group" type="success" icon="el-icon-check" circle @click="submit"></el-button>
                                </el-tooltip>
                                <!-- <el-tooltip class="item" effect="light" content="缩小" placement="bottom">
                                    <el-button style="margin: 5px 5px" class="btn_group" type="primary" icon="el-icon-remove-outline" circle @click="scaleDown"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="light" content="放大" placement="bottom">
                                    <el-button style="margin: 5px 5px" class="btn_group" type="primary" icon="el-icon-circle-plus-outline" circle @click="scaleUp"></el-button>
                                </el-tooltip> -->
                                <!-- </el-popover> -->
                        </el-col>
                    </el-row>
                    <div style="display:none"><img id="source" :src="base+'/ssm/'+imgList[0]"></div>
                </div>
            </el-col>
            <el-col :xs="14" :sm="12" :md="10" :lg="9" :xl="7" offset="1">
                <div class="itemList">
                    <el-table @row-click="rowClick" :data="tableData" height="800" border >
                        <el-table-column type="index" align="center" ></el-table-column>
                        <el-table-column prop="name" align="center" label="区域名称" >
                        </el-table-column>
                        <el-table-column prop="page" align="center" label="操作" >
                            <template slot-scope="scope">
                                <el-button class="edit_btn" type="primary" @click="handleEdit(scope)" size="small">编辑</el-button>
                                <el-button class="exit_btn hidden_btn" type="warning" @click="handleExit(scope)" size="small">退出编辑</el-button>
                                <el-button  type="danger" @click="handleDelete(scope)" size="small" >删除</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="page" align="center" label="页码" >
                            <template slot-scope="scope">
                                <el-input-number style="width:80px" @change="step(scope)" size="small" v-model="scope.row.page"  controls-position="right"  :min="1" :max="10"></el-input-number>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="addres"  label="操作" align="center" width="100">
                            <template slot-scope="scope">
                                <el-button type="text" @click="handleClick(scope.row)" size="small">编辑</el-button>
                            </template>
                        </el-table-column> -->
                    </el-table>
                    <!-- <el-table :data="tableData" height="390" border style="width: 100%;margin-top:20px">
                        <el-table-column type="selection" width="50" align="center">
                        </el-table-column>
                        <el-table-column prop="date" label="题号" align="center" width="50">
                        </el-table-column>
                        <el-table-column prop="name" label="区域名" align="center" width="150">
                        </el-table-column>
                        <el-table-column prop="addres"  label="正" align="center" width="50">
                        </el-table-column>
                        <el-table-column prop="addres"  label="补" align="center" width="50">
                        </el-table-column>
                        <el-table-column prop="addres"  label="审" align="center" width="50">
                        </el-table-column>
                        <el-table-column prop="addres"  label="分数" align="center" width="50">
                        </el-table-column>
                        <el-table-column prop="addres"  label="操作" align="center" width="50">
                            <template slot-scope="scope">
                                <el-button type="text" @click="handleClick(scope.row)" size="small">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table> -->
            </div>
        </el-col>
    </el-row>
    </el-main>
</el-container>

</template>
<script>
import axios from 'axios'
import {pushselectblockp,pushfragmentp,pushpaperheaderp,getpaper,getpaperhead,getfragment,getselectblock,edittemppaperhead,edittemselectblock,edittemfragment,delselect,delfragmen,delpaperhead,baseUrl,pushselectsubregion,delselectsub,edittemselectsubblock,getselectsubblock} from '../../../api/api.js'
export default {
    data(){
        return{
            num:0,
            base:baseUrl(),
            page:0,//记录大框页码
            wId:'w',
            index : 0,
            startX : 0,
            startY : 0,
	        flag : false,//画框的标记，为true时鼠标移动才能画框
            retcLeft : "0px",
            retcTop : "0px",
            retcHeight : "0px",
            retcWidth : "0px",
            position:[],
            type:0,
            tableData:[],
            visible:false,
            imgList:[],
            templetIdList:[],
            sourceHeight:0,//图片原高
            scaleHeight:0,
            minHeight:800,
            isEdit:false,//记录是否是编辑状态
            currentPage:0,//记录图片翻页功能当前页
            isShowList:[],
            showIndex:0,
            baseUrl:baseUrl(),
            loading:true,
            selectBlockId:'',
            selectBlockIdTemlet:''//小块应放到哪个模板上
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
        dialogCancel(){
            this.visible=false;
        },
        dialogSubmit(){
            this.visible=false;
            
        },
        scaleUp(){
            this.scaleHeight*=1.05;
            document.querySelectorAll('.retc').forEach(item=>{
                item.style.top=item.offsetTop*1.05+"px";
                item.style.left=item.offsetLeft*1.05+"px";
                item.style.height=item.clientHeight*1.05+"px";
                item.style.width=item.clientWidth*1.05+"px";
            })
        },
        scaleDown(){
            if(this.scaleHeight>this.minHeight){
                this.scaleHeight/=1.05;
                document.querySelectorAll('.retc').forEach(item=>{
                    item.style.top=item.offsetTop/1.05+"px";
                    item.style.left=item.offsetLeft/1.05+"px";
                    item.style.height=item.clientHeight/1.05+"px";
                    item.style.width=item.clientWidth/1.05+"px";
                })
            }
            
        },
        rowClick(row, event, column){
            //$('.retc')[0].style="2px solid blue"
            $('.retc').removeClass('click_div')
            console.log(row)
            $('#'+row.id).addClass('click_div')

        },
        //前一页
        prev_paper(){
                if(this.currentPage){
                    $('.page_div').eq(this.currentPage)[0].style.display="none"
                    this.currentPage--;
                    $('.page_div').eq(this.currentPage)[0].style.display="block"
                }
                //根据动态加载样式，使其当前页的图片显示，其他页的图片不显示
                // this.sourceUrl=imgList[page]
                
            
            
        },
        next_paper(){
                let that=this;
                // this.page++
                // this.sourceUrl=imgList[page]

                if(this.currentPage<this.imgList.length-1){
                    $('.page_div').eq(this.currentPage)[0].style.display="none"
                    that.currentPage++;
                    $('.page_div').eq(this.currentPage)[0].style.display="block"

                }
            
        },
        handleEdit(scope){

            $('#'+scope.row.id).append(`<div class="resizeL"></div>
            <div class="resizeT"></div>
            <div class="resizeR"></div>
            <div class="resizeB"></div>
            <div class="resizeLT"></div>
            <div class="resizeRT"></div>
            <div class="resizeRB"></div>
            <div class="resizeLB"></div>
            <div class="drag_content"></div>`)
            $('.edit_btn').eq(scope.$index).removeClass("show_btn")
            $('.edit_btn').eq(scope.$index).addClass("hidden_btn")
            $('.exit_btn').eq(scope.$index).removeClass("hidden_btn")
            $('.exit_btn').eq(scope.$index).addClass("show_btn")
            // this.showIndex=scope.$index;
            // this.isShowList[this.showIndex]=!this.isShowList[this.showIndex]
            $('#canvas')[0].onmousedown=null;//取消画框
            let oDrag=$('#'+scope.row.id)[0];
            let resizeB=$('.resizeB')[0];
            let resizeR=$('.resizeR')[0];
            let resizeT=$('.resizeT')[0];
            let resizeL=$('.resizeL')[0];
            let resizeRB=$('.resizeRB')[0];
            let resizeRT=$('.resizeRT')[0];
            let resizeLT=$('.resizeLT')[0];
            let resizeLB=$('.resizeLB')[0];
            this.drag(oDrag,scope.$index)
            //四边变大
            this.resize(oDrag,resizeB,false,false,false,true,scope.$index);
            this.resize(oDrag,resizeR,false,false,true,false,scope.$index);
            this.resize(oDrag,resizeT,false,true,false,true,scope.$index);
            this.resize(oDrag,resizeL,true,false,true,false,scope.$index);

            //四角变大
            this.resize(oDrag,resizeRB,false,false,true,true,scope.$index);
            this.resize(oDrag,resizeRT,false,true,true,true,scope.$index);
            this.resize(oDrag,resizeLT,true,true,true,true,scope.$index);
            this.resize(oDrag,resizeLB,true,false,true,true,scope.$index);
        },
        handleExit(scope){
            $('.exit_btn').eq(scope.$index).removeClass("show_btn")
            $('.exit_btn').eq(scope.$index).addClass("hidden_btn")
            $('.edit_btn').eq(scope.$index).removeClass("hidden_btn")
            $('.edit_btn').eq(scope.$index).addClass("show_btn")
            //清除拖动
            $('#'+scope.row.id).find('.drag_content')[0].onmousedown=null;
            //清空可拖动div
            $('#'+scope.row.id).html('');
            //清除鼠标事件
            document.onmousemove=null;
            
        },
        handleDelete(scope){
            let type=this.position[scope.$index].type;
            if(this.isEdit){
               this.deleteBlock(scope.$index)
            }
            this.tableData.splice(scope.$index,1)
            this.position.splice(scope.$index,1)
            $('#'+scope.row.id).remove()
        },
        deleteBlock(index){
            console.log(this.position)
            let type=this.position[index].type;
            console.log(type);
            console.log(this.position[index].method);
            if(this.isEdit&&!this.position[index].method){
                if(type==3){
                    delfragmen(this.position[index].fragmentId).then(res=>{
                        console.log(res)
                        this.$notify({
                            type: 'success',
                            title: '删除成功'
                        })
                    }
                    ).catch(e=>{
                        console.log(e)
                        this.$notify({
                            type: 'error',
                            title: '删除错误'
                        })
                        })
                }else if(type==2){
                    delselect(this.position[index].selectBlockId).then(res=>{
                        console.log(res)
                        this.$notify({
                            type: 'success',
                            title: '删除成功'
                        })
                    }   
                    ).catch(e=>{
                        console.log(e)
                        this.$notify({
                            type: 'error',
                            title: '删除错误'
                        })
                        })
                }else if(type==1){
                    delpaperhead(this.position[index].paparHeaderId).then(res=>{
                        console.log(res)
                        this.$notify({
                            type: 'success',
                            title: '删除成功'
                        })
                    }
                    ).catch(e=>{
                        console.log(e)
                        this.$notify({
                            type: 'error',
                            title: '删除错误'
                        })
                        })
                }else if(type==4){
                    delselectsub(this.position[index].templetSelectSubRegionId).then(res=>{
                        this.$notify({
                            type: 'success',
                            title: '删除成功'
                        })
                    }).catch(e=>{
                        console.log(e)
                        this.$notify({
                            type: 'error',
                            title: '删除错误'
                        })
                    })
                }
                
            }
        },
        reset(){

            $('.mydiv').remove();
            $('.retc').remove();
            let length=this.position.length;
            let request=[];
            for(let i=0;i<length;i++){
                request.push(this.deleteBlock(i))
            }
            axios.all(request)
            for(let i=0;i<length;i++){
                
                this.position.pop()
                this.tableData.pop()
                //this.isShowList.pop()//isShowList无用
            }
            
            $('#canvas').onmousedown=null;
        },
        //编辑移动div框函数
        drag(oDrag,index){
            let that=this;
            let disX=0;
            let disY=0;
            let positionx1='';
            let positiony1='';
            let positionx2='';
            let positiony2='';
            let sourceHeight=this.sourceHeight;
            if(this.position[index].type==3){
                positionx1='fragmentPointX1';
                positiony1='fragmentPointY1';
                positionx2='fragmentPointX2';
                positiony2='fragmentPointY2';
            }else{
                positionx1='x1';
                positiony1='y1';
                positionx2='x2';
                positiony2='y2';
            }
            $(oDrag).find('.drag_content')[0].onmousedown=function(e){
                
                e=e||event;
                e.preventDefault();
                disX=e.clientX-that.getElementLeft(oDrag);
                disY=e.clientY-that.getElementTop(oDrag);
                document.onmousemove=function(e){

                    e=e||event;
                    let Left=e.clientX-disX;
                    let Top=e.clientY-disY;
                    let minleft=that.getElementLeft($('#canvas')[0]);
                    let mintop=that.getElementTop($('#canvas')[0]);
                    // let maxleft=document.documentElement.offsetWidth-oDrag.offsetWidth;
                    // let maxtop=document.documentElement.clientHeight-oDrag.offsetHeight;
                    let maxleft=minleft+$('#canvas .page_div').eq(that.currentPage).find('.imgList')[0].clientWidth-oDrag.clientWidth;
                    let maxtop=mintop+$('#canvas')[0].clientHeight-oDrag.clientHeight;
                    if (Left<minleft) {
                        Left=minleft;
                    }else if (Left>maxleft) {
                        Left=maxleft;
                    };
                    if (Top<mintop) {
                        Top=mintop;
                    }else if (Top>maxtop) {
                        Top=maxtop;
                    };
                    oDrag.style.left=Left+'px';
                    oDrag.style.top=Top+'px';
                    that.position[index][positionx1]=Left-minleft<0?0:Left-minleft;//存在为负数的情况，所以要判断一下，并且要放大为原比例
                    that.position[index][positionx1]*=sourceHeight/this.scaleHeight
                    that.position[index][positionx2]=Number(that.position[index][positionx1])+oDrag.clientWidth*sourceHeight/this.scaleHeight;
                    that.position[index][positiony1]=Top-mintop<0?0:Top-mintop;
                    that.position[index][positiony1]*=sourceHeight/this.scaleHeight
                    that.position[index][positiony2]=Number(that.position[index][positiony1])+oDrag.clientHeight*sourceHeight/this.scaleHeight;
                    console.log(that.position[index])
                };
                document.onmouseup=function(){
                    document.onmousemove=null;
                    document.onmouseup=null;
                };
            };
            
        },
        //改变大小函数
        resize(oparent,handle,isleft,istop,lookx,looky,index){
            let sourceHeight=this.sourceHeight;
            console.log(sourceHeight)
            let dragMinWidth=50;
            let dragMinHeight=50;
            let disX=0;
            let disY=0;
            let that=this;
            let positionx1='';
            let positiony1='';
            let positionx2='';
            let positiony2='';
            if(this.position[index].type==3){
                positionx1='fragmentPointX1';
                positiony1='fragmentPointY1';
                positionx2='fragmentPointX2';
                positiony2='fragmentPointY2';
            }else{
                positionx1='x1';
                positiony1='y1';
                positionx2='x2';
                positiony2='y2';
            }
            handle.onmousedown=function(e){
                e=e||event;
                e.preventDefault();
                disX=e.clientX-this.offsetLeft;//x坐标原点
                disY=e.clientY-this.offsetTop;//y坐标原点
                let minClientX=that.getElementLeft($('#canvas')[0]);
                let minClientY=that.getElementTop($('#bigcanvasDiv')[0]);
                let maxClientX=minClientX+$('#canvas .page_div').eq(that.currentPage).find('.imgList')[0].clientWidth;//x最大边界
                let maxClientY=minClientY+$('#canvas')[0].clientHeight;//y最大边界
                let iparenttop=oparent.offsetTop;
                let iparentleft=oparent.offsetLeft;
                let iparentwidth=oparent.offsetWidth;
                let iparentheight=oparent.offsetHeight; 

                document.onmousemove=function(e){
                    if(e.clientX<maxClientX&&e.clientY<maxClientY&&e.clientX>minClientX&&e.clientY>minClientY){
                    e=e||event;
                    let iL=e.clientX-disX;//X方向偏离坐标原点的距离
                    let iT=e.clientY-disY;//y方向偏离坐标原点的距离
                    // let maxw=document.documentElement.clientWidth-oparent.offsetLeft-2;
                    // let maxh=document.documentElement.clientHeight-oparent.offsetTop-2;
                    let maxw=$(oparent).prevAll('.imgList')[0].clientWidth;
                    let maxh=$(oparent).prevAll('.imgList')[0].clientHeight;
                    
                    let iw= isleft?iparentwidth-iL:handle.offsetWidth+iL;
                    let ih = istop ? iparentheight - iT : handle.offsetHeight + iT;
                    if (isleft) {
                        oparent.style.left=iparentleft+iL+'px';
                        that.position[index][positionx1]=iparentleft+iL-minClientX<0?0:iparentleft+iL-minClientX;
                        that.position[index][positionx1]*=sourceHeight/this.scaleHeight
                    }
                    if (istop) {
                        oparent.style.top=iparenttop+iT+'px';
                        that.position[index][positiony1]=iparenttop+iT-minClientY<0?0:iparenttop+iT-minClientY
                        that.position[index][positiony1]*=sourceHeight/this.scaleHeight
                    }
                    if (iw<dragMinWidth) {
                        iw=dragMinWidth
                    }else if (iw>maxw) {
                        iw=maxw;
                    }
                    if (lookx) {
                        oparent.style.width=iw+'px';
                    }
                    if (ih<dragMinHeight) {
                        ih=dragMinHeight;
                    }else if (ih>maxh) {
                        ih=maxh;
                    }
                    if (looky) {
                        oparent.style.height=ih+'px';
                    }
                    if ((isleft && iw==dragMinWidth)||(istop && ih==dragMinHeight)) {
                        document.onmousemove=null;
                    };
                    console.log(iw);
                    console.log(ih);
                    that.position[index][positionx2]=Number(that.position[index][positionx1])+iw*sourceHeight/this.scaleHeight;
                    that.position[index][positiony2]=Number(that.position[index][positiony1])+ih*sourceHeight/this.scaleHeight;
                    console.log(that.position[index])
                    return false;
                    }
                    
                };
                document.onmouseup=function(){
                    document.onmousemove=null;
                    document.onmouseup=null;
                };
            };
        },
        //撤销按钮，退回到前一个状态
        cancel(){
            let length=this.position.length;
            let type;
            length>0?type=this.position[length-1].type:"";
            if(this.isEdit){
                this.deleteBlock(length-1)
            }
            if(type==1){
                length=$('.page_div').eq(this.currentPage).find('.headRetcColor').length
                $('.page_div').eq(this.currentPage).find('.headRetcColor').eq(length-1).remove();
            }else if(type==2){
                length=$('.page_div').eq(this.currentPage).find('.selectRetcColor').length
                $('.page_div').eq(this.currentPage).find('.selectRetcColor').eq(length-1).remove();
            }else if(type==3){
                length=$('.page_div').eq(this.currentPage).find('.retcColor').length
                $('.page_div').eq(this.currentPage).find('.retcColor').eq(length-1).remove();
            }else{
                length=$('.page_div').eq(this.currentPage).find('.selectSubRetcColor').length
                $('.page_div').eq(this.currentPage).find('.selectSubRetcColor').eq(length-1).remove();
            }
            $('.mydiv').eq(length-1).remove();
            
            this.position.pop()   
            this.tableData.pop()
        },
        edit(type){
            this.type=type;
            $('#canvas')[0].onmousedown=this.mymousedown;
        },
        step(scope){
            if(this.position[scope.$index].type==3) this.position[scope.$index].fragementPage=scope.row.page;
        },
        //初始化
        get_templet_by_examId(){
            
            getpaper(sessionStorage.getItem('exam_small_id')).then((res) =>{
                let arrayLength=res.data.templets.length;
                let templets=res.data.templets;
                let paperUrls=[];
                let templetIdList=[];
                if(arrayLength){
                    for(let i=0;i<arrayLength;i++){
                        paperUrls.push(templets[i].templetPaper);
                        templetIdList.push(templets[i].templetId);
                    }
                }
                // console.log(res.data.templets[0]);
                // console.log(templetId)
                this.imgList=paperUrls;
                this.templetIdList=templetIdList
                
                sessionStorage.setItem('templetIdList',this.templetIdList);

            })

        },
        submit(){

            this.$confirm('确定提交吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //isEdit是否是编辑状态
                    let requestSubSelect=[];
                    if(this.isEdit){
                        let that=this;
                        let request=[];
                        let paparHeaderId;
                        let selectBlockId;
                        let fragmentId;
                        let templetId;
                        for(let i=0;i<that.position.length;i++){

                            switch(that.position[i].type){
                                case 1:
                                    paparHeaderId=that.position[i].paparHeaderId
                                    templetId=that.position[i].templetId
                                    delete that.position[i].type
                                    delete that.position[i].paparHeaderId
                                    console.log(that.position[i])
                                    if(!that.position[i].method){
                                        delete that.position[i].templetId
                                        request.push(edittemppaperhead(paparHeaderId,that.position[i]).then().catch(e=>{
                                            this.$notify({
                                                type: 'error',
                                                title: e
                                            })
                                        }))
                                    }else if(that.position[i].method=="POST"){
                                        delete that.position[i].method
                                        request.push(pushpaperheaderp(that.position[i]).then().catch(e=>{
                                            this.$notify({
                                                type: 'error',
                                                title: e
                                            })
                                        }))
                                    }
                                    
                                    break;
                                case 2:
                                    selectBlockId=that.position[i].selectBlockId
                                    templetId=that.position[i].templetId
                                    delete that.position[i].type
                                    delete that.position[i].selectBlockId
                                    console.log(that.position[i])
                                    if(!that.position[i].method){
                                        delete that.position[i].templetId
                                        request.push(edittemselectblock(selectBlockId,that.position[i]).then().catch(e=>{
                                            this.$notify({
                                                type: 'error',
                                                title: e
                                            })
                                        }))
                                    }else if(that.position[i].method=="POST"){
                                        delete that.position[i].method
                                        that.selectBlockId==''?that.selectBlockId=that.guid():''
                                        that.position[i].selectBlockId=that.selectBlockId
                                        request.push(pushselectblockp(that.position[i]).then().catch(e=>{
                                            this.$notify({
                                                type: 'error',
                                                title: e
                                            })
                                        }))
                                    }
                                    break;
                                case 3:
                                    fragmentId=that.position[i].fragmentId
                                    templetId=that.position[i].templetId
                                    
                                    delete that.position[i].type
                                    delete that.position[i].fragmentId
                                    console.log(that.position[i])
                                    if(!that.position[i].method){
                                        delete that.position[i].templetId
                                        request.push(edittemfragment(fragmentId,that.position[i]).then().catch(e=>{
                                            this.$notify({
                                                type: 'error',
                                                title: e
                                            })
                                        }))
                                    }else if(that.position[i].method=="POST"){
                                        delete that.position[i].method
                                        request.push(pushfragmentp(that.position[i]).then().catch(e=>{
                                            this.$notify({
                                                type: 'error',
                                                title: e
                                            })
                                        }))
                                    }
                                    break;
                                case 4:
                                    selectBlockId=that.position[i].selectBlockId
                                    templetId=that.position[i].templetId
                                    delete that.position[i].type
                                    delete that.position[i].selectBlockId
                                    let type=that.position[i].typeData;
                                    delete that.position[i].typeData;
                                    that.position[i].type=type;
                                    console.log(that.position[i])
                                    delete that.position[i].templetId
                                    if(!that.position[i].method){
                                        
                                        request.push(edittemselectsubblock(that.position[i]).then().catch(e=>{
                                            this.$notify({
                                                type: 'error',
                                                title: e
                                            })
                                        }))
                                    }else if(that.position[i].method=="POST"){
                                        delete that.position[i].method
                                        that.selectBlockId==''?that.selectBlockId=that.guid():''
                                        that.position[i].selectBlockId=that.selectBlockId
                                        that.position[i].startNum=Number(that.position[i].startNum)
                                        that.position[i].endNum=Number(that.position[i].endNum)
                                        requestSubSelect.push(that.position[i])
                                        
                                    }
                                    break;
                            }
                        }
                        request.push(pushselectsubregion(requestSubSelect).then().catch(e=>{
                            this.$notify({
                                                type: 'error',
                                                title: e
                                            })
                        }))
                        axios.all(request).then((res)=>{
                            let flag=1;
                            res.forEach(item=>{
                                item.code!=200?flag=0:""
                            })
                            if(flag){
                                this.$notify({
                                    type: 'success',
                                    title: '提交成功'
                                });
                                this.$router.push('/exam_cutting_makesure');
                            }
                        })
                    }else {
                        let that=this;
                        //let params=[];
                        let request=[];
                        // for(let i=0;i<that.position.length;i++){
                        //     params.push({})
                        // }
                        for(let i=0;i<that.position.length;i++){
                            console.log(that.position[i].type)
                            switch(that.position[i].type){
                                case 1:
                                    delete that.position[i].type;
                                    delete that.position[i].method;
                                    //params[i]=that.position[i];
                                    request.push(pushpaperheaderp(that.position[i]).catch(e=>{
                                        this.$notify({
                                                type: 'error',
                                                title: e
                                            })
                                    }))
                                    // pushpaperheaderp(that.position[i]).then((res)=>{
                                    //     console.log(res);
                                    // })
                                    break;
                                case 2:
                                    delete that.position[i].type;
                                    delete that.position[i].method;
                                    that.selectBlockId==''?that.selectBlockId=that.guid():''
                                    that.position[i].selectBlockId=that.selectBlockId
                                    request.push(pushselectblockp(that.position[i]).catch(e=>{
                                        this.$notify({
                                                type: 'error',
                                                title: e
                                            })
                                    }))
                                    // pushselectblockp(that.position[i]).then((res)=>{
                                    //     console.log(res);
                                    // })
                                    break;
                                case 3:
                                    delete that.position[i].type;
                                    delete that.position[i].method;
                                    request.push(pushfragmentp(that.position[i]).catch(e=>{
                                        this.$notify({
                                                type: 'error',
                                                title: e
                                            })
                                    }))
                                    // pushfragmentp(that.position[i]).then((res)=>{
                                    //     console.log(res);
                                    // })
                                    break;
                                case 4:
                                    delete that.position[i].type;
                                    delete that.position[i].method;
                                    let type=that.position[i].typeData;
                                    delete that.position[i].typeData;
                                    delete that.position[i].templetId
                                    that.position[i].type=type;
                                    that.selectBlockId==''?that.selectBlockId=that.guid():''
                                    that.position[i].selectBlockId=that.selectBlockId
                                    that.position[i].startNum=Number(that.position[i].startNum)
                                    that.position[i].endNum=Number(that.position[i].endNum)
                                    requestSubSelect.push(that.position[i])
                                    
                                    break;
                            }
                        }
                        request.push(pushselectsubregion(requestSubSelect).catch(e=>{
                            this.$notify({
                                                type: 'error',
                                                title: e
                                            })
                        }))
                        axios.all(request).then((res)=>{
                            let flag=1;
                            res.forEach(item=>{
                                item.code!=200?flag=0:""
                            })
                            if(flag){
                                this.$notify({
                                    type: 'success',
                                    title: '提交成功'
                                });
                                this.$router.push('/exam_cutting_makesure');
                            }
                        })
                        this.$emit('submitPosition',this.position);
                        console.log("submit");
                    }
                    
                    

                }).catch((e) => {
                    console.log(e)
                    
                });
             
           
        },
        mymousedown(e){
            this.flag = true;
            let that=this;
            console.log('onmousedown');
            console.log(e);
            try{
                this.index++;
                let wId=this.wId;
                let index=this.index;
                let sourceHeight=this.sourceHeight;
                let evt = e;
                let scrollTop = (document.body.scrollTop || document.documentElement.scrollTop)
                let scrollLeft = (document.body.scrollLeft || document.documentElement.scrollLeft)
                let offsetLeft=this.getElementLeft($('#canvas')[0])
                let offsetTop=this.getElementTop($('#canvas')[0])
                console.log('offsetLeft:'+offsetLeft)
                console.log('offsetTop:'+offsetTop)
                console.log('pageX:'+e.pageX)
                console.log('pageY:'+e.pageY)
                let x=e.pageX-offsetLeft;
                let y=e.pageY-offsetTop;
                this.startX = evt.clientX + scrollLeft-offsetLeft;
                this.startY = evt.clientY + scrollTop-offsetTop;
                let div = document.createElement("div");
                div.id = wId + index;
                div.className = "mydiv";
                div.style.left = this.startX + "px";
                div.style.top = this.startY + "px";
                $('#canvas')[0].appendChild(div);
                console.log(x*sourceHeight/this.scaleHeight,y*sourceHeight/this.scaleHeight)
                switch(this.type){
                    case 1:
                        this.position.push({
                            templetId:this.templetIdList[this.currentPage],
                            type:this.type,
                            x1:x*sourceHeight/this.scaleHeight,
                            y1:y*sourceHeight/this.scaleHeight,
                            x2:'',
                            y2:'',
                        })
                        break;
                    case 2:
                        this.position.push({
                            templetId:this.templetIdList[this.currentPage],
                            type:this.type,
                            x1:x*sourceHeight/this.scaleHeight,
                            y1:y*sourceHeight/this.scaleHeight,
                            x2:'',
                            y2:'',
                        })
                        break;
                    case 3:
                        this.position.push({
                            templetId:this.templetIdList[this.currentPage],
                            type:this.type,
                            fragmentPointX1:x*sourceHeight/this.scaleHeight,
                            fragmentPointY1:y*sourceHeight/this.scaleHeight,
                            fragmentPointX2:'',
                            fragmentPointY2:'',
                            fragementPage:0
                        })
                        break;
                    case 4:
                        this.position.push({
                            templetId:this.templetIdList[this.currentPage],
                            type:this.type,
                            x1:x*sourceHeight/this.scaleHeight,
                            y1:y*sourceHeight/this.scaleHeight,
                            x2:'',
                            y2:'',
                            startNum:0,
                            endNum:0,
                            selectBlockId: that.selectBlockId,
                        })
                        break;
                }
                
            }catch(e){
                console.log(e);
            }
        },
        guid(){
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            }).replace(/-/g,'');
        },
        mymouseup(e){
            console.log('onmouseup')
            if(this.flag){
                try{
                    let wId=this.wId;
                    let index=this.index;
                    let sourceHeight=this.sourceHeight;
                    let retcWidth=this.retcWidth;
                    let retcHeight=this.retcHeight;
                    let div = document.createElement("div");
                    let offsetLeft=this.getElementLeft($('#canvas')[0])
                    let offsetTop=this.getElementTop($('#canvas')[0])
                    let x=e.pageX-offsetLeft;
                    let y=e.pageY-offsetTop;
                    let retcLeft=this.retcLeft;
                    let retcTop=this.retcTop;
                    let that=this;
                    $('#canvas')[0].removeChild(this.$(wId + index));
                    div.id=wId + index;
                    div.className = "retc";
                    div.style.left = retcLeft;
                    div.style.top = retcTop;
                    div.style.width = retcWidth;
                    div.style.height = retcHeight;
                    $('.page_div').eq(this.currentPage)[0].appendChild(div);
                    console.log(x*sourceHeight/this.scaleHeight,y*sourceHeight/this.scaleHeight)
                    
                    switch(this.position[this.position.length-1].type){
                        case 1:
                            this.tableData.push({
                                'id':wId + index,
                                'name':'头部区',
                                'page':this.page++
                            })
                            //method用来判断调更新接口还是添加接口
                            
                            this.position[this.position.length-1].method="POST";
                            
                            this.position[this.position.length-1].x2=x*sourceHeight/this.scaleHeight
                            this.position[this.position.length-1].y2=y*sourceHeight/this.scaleHeight
                            this.fixPosition(this.position[this.position.length-1])
                            div.className = "headRetcColor retc";
                            this.$alert(`<div>
                                            <span><h4>填涂类型</h4></span>
                                            <span>
                                                <input type="radio" name="paparHeaderTypa" value="60001" > 铅笔填涂
                                                <input type="radio" name="paparHeaderTypa" value="60002" > 条形码
                                            </span><br>
                                            <span><h4>考号类型</h4></span>
                                            <span>
                                                <input type="radio" name="fillType" value="61001" > 0开始
                                                <input type="radio" name="fillType" value="61002" > 1开始
                                            </span>
                                        </div>`,'头部类型',{dangerouslyUseHTMLString: true}).then(()=>{
                                            
                                            document.querySelectorAll('input[name="paparHeaderTypa"]').forEach(item=>{
                                                if(item.checked) that.position[this.position.length-1].paparHeaderTypa=item.value;
                                            })
                                            document.querySelectorAll('input[name="fillType"]').forEach(item=>{
                                                if(item.checked) that.position[this.position.length-1].fillType=item.value;
                                            })
                                            console.log(that.position[this.position.length-1])
                                        }).catch()
                            
                            //this.isShowList.push(true)
                            break;
                        case 2:
                            this.tableData.push({
                                'id':wId + index,
                                'name':'客观题区',
                                'page':this.page++
                            })
                            //method用来判断调更新接口还是添加接口
                            
                            this.position[this.position.length-1].method="POST";
                            
                            this.position[this.position.length-1].x2=x*sourceHeight/this.scaleHeight
                            this.position[this.position.length-1].y2=y*sourceHeight/this.scaleHeight
                            this.fixPosition(this.position[this.position.length-1])
                            div.className = "selectRetcColor retc";
                            
                            //this.isShowList.push(true)
                            break;
                        case 3:
                            this.tableData.push({
                                'id':wId + index,
                                'name':'联合区'+this.page,
                                'page':this.page++
                            })
                            //method用来判断调更新接口还是添加接口
                           
                            this.position[this.position.length-1].method="POST";
                            
                            this.position[this.position.length-1].fragmentPointX2=x*sourceHeight/this.scaleHeight
                            this.position[this.position.length-1].fragmentPointY2=y*sourceHeight/this.scaleHeight
                            this.position[this.position.length-1].fragementPage=this.page;
                            this.fixPosition(this.position[this.position.length-1])
                            div.className = "retcColor retc";
                            //this.isShowList.push(true)
                            break;
                        case 4:
                            this.tableData.push({
                                'id':wId + index,
                                'name':'客观题区小块',
                                'page':this.page
                            })
                            //method用来判断调更新接口还是添加接口
                            
                            this.position[this.position.length-1].method="POST";
                            
                            this.position[this.position.length-1].x2=x*sourceHeight/this.scaleHeight
                            this.position[this.position.length-1].y2=y*sourceHeight/this.scaleHeight
                            this.fixPosition(this.position[this.position.length-1])
                            div.className = "selectSubRetcColor retc";
                            this.$alert(`<div>
                                            <span><h4>横竖类型</h4></span>
                                            <span>
                                                <input type="radio" name="paparselectType" value="40003" > 横
                                                <input type="radio" name="paparselectType" value="40004" > 竖
                                            </span><br>
                                            <span><h4>题号范围(起始题号-结束题号)</h4></span>
                                            <span>
                                                <input type="text" name="paparselectlimstart" placeholder="起始题号" >- 
                                                <input type="text" name="paparselectlimend" placeholder="结束题号" > 
                                            </span>
                                            <span><h4>单选多选</h4></span>
                                            <span>
                                                <input type="radio" name="paparselectTypeRemark" value="40002" > 单选
                                                <input type="radio" name="paparselectTypeRemark" value="40001" > 多选 
                                            </span>
                                        </div>`,'头部类型',{dangerouslyUseHTMLString: true}).then(()=>{
                                            
                                            document.querySelectorAll('input[name="paparselectType"]').forEach(item=>{
                                                if(item.checked) that.position[this.position.length-1].typeData=item.value;
                                            })
                                            document.querySelectorAll('input[name="paparselectTypeRemark"]').forEach(item=>{
                                                if(item.checked) that.position[this.position.length-1].remark=item.value;
                                            })
                                            that.position[this.position.length-1].startNum=document.querySelector('input[name="paparselectlimstart"]').value;
                                            that.position[this.position.length-1].endNum=document.querySelector('input[name="paparselectlimend"]').value;
                                            console.log(that.position[this.position.length-1])
                                        }).catch()
                            
                            break;
                            
                    }
                    // if(this.position[this.position.length-1].type==1){
                    //     this.tableData.push({
                    //     'name':'学号区',
                    //     'page':this.page++
                    //     })
                    // }
                    
                    console.log(this.position)
                }catch(e){
                    console.log(e)
                }
            }
            this.flag = false;
        },
        mymousemove(e){
            let flag=this.flag;
            if(flag){
                try{
                    let evt =  e;
                    let wId=this.wId;
                    let index=this.index;
                    let startX=this.startX;
                    let startY=this.startY;
                    let sourceHeight=this.sourceHeight;
                    let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                    let scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
                    let offsetLeft=this.getElementLeft($('#canvas')[0])
                    let offsetTop=this.getElementTop($('#canvas')[0])
                    this.retcLeft = (startX - (evt.clientX-offsetLeft) - scrollLeft > 0 ? evt.clientX-offsetLeft + scrollLeft : startX) + "px";
                    this.retcTop = (startY - (evt.clientY-offsetTop)- scrollTop > 0 ? evt.clientY-offsetTop+ scrollTop : startY) + "px"; 
                    if(evt.pageX-offsetLeft<$('#canvas').find('img').eq(this.currentPage)[0].clientWidth){//小于图片宽度时
                        this.retcWidth = Math.abs(startX - (evt.clientX-offsetLeft) - scrollLeft) + "px";
                    }
                    if(evt.pageY-offsetTop<this.scaleHeight){//小于图片高度时
                        this.retcHeight = Math.abs(startY - (evt.clientY-offsetTop) - scrollTop) + "px";
                    }
                    this.$(wId + index).style.left = this.retcLeft;
                    this.$(wId + index).style.top = this.retcTop;
                    this.$(wId + index).style.width = this.retcWidth;
                    this.$(wId + index).style.height = this.retcHeight;
                
                }catch(e){
                    //alert(e);
                    console.log(e)
                }	
		    }
        },
        mymouseleave(e){
            console.log('leave')
        },
        //根据传过来的点计算出左上角和右下角的坐标位置
        fixPosition(position){
            console.log(position)
            if(position.type==3){
                if(position.fragmentPointX1>position.fragmentPointX2){
                    let x=position.fragmentPointX1;
                    position.fragmentPointX1=position.fragmentPointX2;
                    position.fragmentPointX2=x;
                }
                if(position.fragmentPointY1>position.fragmentPointY2){
                    let y=position.fragmentPointY1;
                    position.fragmentPointY1=position.fragmentPointY2;
                    position.fragmentPointY2=y;
                }
            }else{
                if(position.x1>position.x2){
                    let x=position.x1;
                    position.x1=position.x2;
                    position.x2=x;
                }
                if(position.y1>position.y2){
                    let y=position.y1;
                    position.y1=position.y2;
                    position.y2=y;
                }
            }
            
            console.log(position)
        },
        $(id){
            return document.getElementById(id);
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
        offset(element) {
            let offest = {
                top: 0,
                left: 0
            };
            let _position;
            getOffset(element, true);
            return offest;
            // 递归获取 offset, 可以考虑使用 getBoundingClientRect
            function getOffset(node, init) {
                // 非Element 终止递归
                if (node.nodeType !== 1) {
                    return;
                }
                _position = window.getComputedStyle(node)['position'];
            
                // position=static: 继续递归父节点
                if (typeof(init) === 'undefined' && _position === 'static') {
                    getOffset(node.parentNode);
                    return;
                }
                offest.top = node.offsetTop + offest.top - node.scrollTop;
                offest.left = node.offsetLeft + offest.left - node.scrollLeft;
            
                // position = fixed: 获取值后退出递归
                if (_position === 'fixed') {
                    return;
                }
            
                getOffset(node.parentNode);
            }
        },
        //重现函数
        reshow(){
            let that=this;
            for(let j=0;j<this.templetIdList.length;j++){
                getpaperhead(sessionStorage.getItem('templetIdList').split(',')[j]).then(res=>{
                if(res.code==200){
                    let position=res.data.templetPaperHeaders[0];
                    let leftParent=this.getElementLeft($('#canvas')[0]);
                    let topParent=this.getElementTop($('#canvas')[0]);
                    position.type=1
                    let div = document.createElement("div");
                    let sourceHeight=this.sourceHeight;
                    let retcLeft=position.x1*this.scaleHeight/sourceHeight;
                    let retcTop=position.y1*this.scaleHeight/sourceHeight;
                    let retcWidth=(position.x2-position.x1)*this.scaleHeight/sourceHeight;
                    let retcHeight=(position.y2-position.y1)*this.scaleHeight/sourceHeight;
                    div.id=this.wId+this.index;
                    div.className = "retc headRetcColor";
                    div.style.left = (retcLeft).toString()+"px";
                    div.style.top = (retcTop).toString()+"px";
                    div.style.width = retcWidth.toString()+"px";
                    div.style.height = retcHeight.toString()+"px";
                    $('.page_div').eq(j)[0].appendChild(div);
                    delete position.paparHeaderTypa
                    delete position.stuNumberLength
                    delete position.isVertical
                    delete position.fillType
                    
                    this.position.push(position)
                    this.tableData.push({
                        'id':this.wId+this.index++,
                        'name':"头部区",
                        'page':0
                    })
                    //this.isShowList.push(true)
                    that.isEdit=true;

                }
                })
                getselectblock(sessionStorage.getItem('templetIdList').split(',')[j]).then(res=>{
                    if(res.code==200){
                        let position=res.data.templetSelects[0];
                        let leftParent=this.getElementLeft($('#canvas')[0]);
                        let topParent=this.getElementTop($('#canvas')[0]);
                        position.type=2
                        let div = document.createElement("div");
                        let sourceHeight=this.sourceHeight;
                        let retcLeft=position.x1*this.scaleHeight/sourceHeight;
                        let retcTop=position.y1*this.scaleHeight/sourceHeight;
                        let retcWidth=(position.x2-position.x1)*this.scaleHeight/sourceHeight;
                        let retcHeight=(position.y2-position.y1)*this.scaleHeight/sourceHeight;
                        console.log(position)
                        console.log(retcLeft,retcTop,retcWidth,retcHeight)
                        div.id=this.wId+this.index;
                        div.className = "retc selectRetcColor";
                        div.style.left = (retcLeft).toString()+"px";
                        div.style.top = (retcTop).toString()+"px";
                        div.style.width = retcWidth.toString()+"px";
                        div.style.height = retcHeight.toString()+"px";
                        $('.page_div').eq(j)[0].appendChild(div);
                        delete position.selectBlockTotalScore
                        delete position.templetSelectList
                        delete position.selectBlockTotalNum
                        this.selectBlockId=position.selectBlockId;
                        this.selectBlockIdTemlet=sessionStorage.getItem('templetIdList').split(',')[j];
                        this.position.push(position)
                        this.tableData.push({
                            'id':this.wId+this.index++,
                            'name':"客观题区",
                            'page':0
                        })
                        //this.isShowList.push(true)
                        that.isEdit=true;
                    }
                }).then(()=>{
                    if(this.selectBlockId){
                        getselectsubblock(this.selectBlockId).then(res=>{
                            if(res.code==200&&this.selectBlockIdTemlet==sessionStorage.getItem('templetIdList').split(',')[j]){
                                let position=res.data.subRegion;
                                let leftParent=this.getElementLeft($('#canvas')[0]);
                                let topParent=this.getElementTop($('#canvas')[0]);
                                let sourceHeight=this.sourceHeight;
                                position.forEach((item,index)=>{
                                    let div = document.createElement("div");
                                    let retcLeft=item.x1*this.scaleHeight/sourceHeight;
                                    let retcTop=item.y1*this.scaleHeight/sourceHeight;
                                    let retcWidth=(item.x2-item.x1)*this.scaleHeight/sourceHeight;
                                    let retcHeight=(item.y2-item.y1)*this.scaleHeight/sourceHeight;
                                    console.log(item)
                                    console.log(retcLeft,retcTop,retcWidth,retcHeight)
                                    div.id=this.wId+this.index;
                                    div.className = "retc selectSubRetcColor";
                                    div.style.left = (retcLeft).toString()+"px";
                                    div.style.top = (retcTop).toString()+"px";
                                    div.style.width = retcWidth.toString()+"px";
                                    div.style.height = retcHeight.toString()+"px";
                                    $('.page_div').eq(j)[0].appendChild(div);
                                    delete item.selectBlockTotalScore
                                    delete item.templetSelectList
                                    delete item.selectBlockTotalNum
                                    item.type=4;
                                    this.position.push(item)
                                    this.tableData.push({
                                        'id':this.wId+this.index++,
                                        'name':"客观题小块区",
                                        'page':0
                                    })
                                    //this.isShowList.push(true)
                                    that.isEdit=true;
                                })
                            }
                        })
                    }
                    
                })
                getfragment(sessionStorage.getItem('templetIdList').split(',')[j]).then(res=>{
                    if(res.code==200){
                        let positions=res.data.fragments;
                        console.log(positions)
                        let leftParent=this.getElementLeft($('#canvas')[0]);
                        let topParent=this.getElementTop($('#canvas')[0]);
                        for(let i=0;i<positions.length;i++){
                            positions[i].type=3;
                            let div = document.createElement("div");
                            let sourceHeight=this.sourceHeight;
                            let retcLeft=positions[i].fragmentPointX1*this.scaleHeight/sourceHeight;
                            let retcTop=positions[i].fragmentPointY1*this.scaleHeight/sourceHeight;
                            let retcWidth=(positions[i].fragmentPointX2-positions[i].fragmentPointX1)*this.scaleHeight/sourceHeight;
                            let retcHeight=(positions[i].fragmentPointY2-positions[i].fragmentPointY1)*this.scaleHeight/sourceHeight;
                            div.id=this.wId+this.index;
                            div.className = "retc retcColor";
                            div.style.left = (retcLeft).toString()+"px";
                            div.style.top = (retcTop).toString()+"px";
                            div.style.width = retcWidth.toString()+"px";
                            div.style.height = retcHeight.toString()+"px";
                            $('.page_div').eq(j)[0].appendChild(div);
                            delete positions[i].fragmentScore
                            delete positions[i].createTime
                            this.position.push(positions[i])
                            this.tableData.push({
                                'id':this.wId+this.index++,
                                'name':"联合区"+i,
                                'page':positions[i].fragementPage
                            })
                            //this.isShowList.push(true)
                        }
                        that.isEdit=true;//进入编辑模式
                    }
                })
            }
            
            // if(flag==1){
            //     return ture;
            // }else{
            //     return false;
            // }
            
        },
    },
    mounted(){
        let that=this;
        let img=$('#source')[0];
        //图片加载完毕后执行回显，并记录其原高
        img.onload =function(){
            that.sourceHeight=img.height;
            that.reshow();
            that.loading = false;


        }

        this.get_templet_by_examId();
        
        
        
    },
    watch:{
        imgList(oldval,newval){
            let that=this;
            for(let i=0;i<that.imgList.length;i++){
                //console.log(that.$refs)
                this.scaleHeight=this.minHeight;
                // if(i==0){
                //     $(that.$refs.imgSlot).append(`<div class="page_div"><img class='imgList' src="${this.base}/ssm/${this.imgList[i]}" style="height:${this.scaleHeight}px  " ><div>`)
                // }else{
                //     $(that.$refs.imgSlot).append(`<div class="page_div" style="display:none"><img class='imgList' src="${this.base}/ssm/${this.imgList[i]}" style="height:${this.scaleHeight}px;" ><div>`)
                // }
                
            }
            document.getElementsByTagName('img').onmousedown = function(ev){
                var ev=ev||window.event;
                ev.preventDefault();
            };
            document.ondragstart=function() {return false;}
        }
    }
}
</script>


<style lang="less" scoped>
body,h1,h2,h3,h4,h5,h6,hr,p,blockquote,dl,dt,dd,ul,ol,li,pre,form,fieldset,legend,input,textarea,th,td{margin:0;padding:0}
.splitView{
    width: 1200px;float: left;
    
}
.splitView /deep/ .mydiv{position:absolute; border:1px dashed blue; width:0px; height:0px;left:0px; top:0px; overflow:hidden;}
.splitView /deep/ .retc{position:absolute;  overflow:hidden; }
.splitView /deep/ .retcColor{border:2px solid blue;}
.splitView /deep/ .headRetcColor{border: 2px solid #E6A23C}
.splitView /deep/ .selectRetcColor{border: 2px solid #005d61}
.splitView /deep/ .selectSubRetcColor{border:2px solid #00a6ae};
.splitView /deep/ .click_div{border:2px solid red !important;}
.btn_div{width: 1156px;margin: 0 auto;}
.btn_group{float:right}
// .itemList{width: 552px;float: left;}
.page_btn{width: 200px;float: left;margin-left: 510px;margin-top: 5px;}
.next{transform:translateX(-800px)}
.last{transform:translateX(800px)}

.splitView /deep/ .resizeB{width: 100%;height: 10px;position: absolute;bottom: 0;cursor: n-resize;Transform:translateY(-50%)}//该元素50%宽度
.splitView /deep/ .resizeL{width: 10px;height: 100%;position: absolute;left: 0;top: 0;cursor: w-resize;Transform:translateX(-50%)}//该元素50%宽度
        .splitView /deep/ .resizeT{
                width: 100%;
                height: 5%;
                position: absolute;
                top: 0;
                z-index: 2;
                cursor: n-resize;
                Transform:translateY(-50%)//该元素50%高度
            }
        .splitView /deep/ .resizeR{
                width: 5%;
                height: 100%;
                position: absolute;
                right: 0;
                top: 0;
                z-index: 2;
                cursor: w-resize;
                Transform:translateX(-50%)//该元素50%宽度
            }
        .splitView /deep/ .resizeLT{
                width: 5%;
                height: 5%;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 2;
                cursor: nw-resize;
            }
        .splitView /deep/ .resizeLB{
                width: 5%;
                height: 5%;
                position: absolute;
                bottom: 0;
                left: 0;
                z-index: 2;
                cursor: ne-resize;
            }
        .splitView /deep/ .resizeRT{
                width: 5%;
                height: 5%;
                position: absolute;
                top: 0;
                right: 0;
                z-index: 2;
                cursor: ne-resize;
            }
        .splitView /deep/ .resizeRB{
                width: 5%;
                height: 5%;
                position: absolute;
                bottom: 0;
                right: 0;
                z-index: 2;
                cursor: nw-resize;
            }
        .splitView /deep/ .drag_content{
                height: 90%;
                width: 90%;
                position: absolute;
                top: 5%;
                left: 5%;
                cursor:move;
                z-index: 1;
            }
            .hidden_btn{display: none}
            .show_btn{display:inline-block}

</style>


