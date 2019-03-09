<template>
        <el-container >
            <el-header><h4>批阅块设置</h4></el-header>
            <el-main v-loading="loading">
                <el-row>
                    <el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16">
                        <div class="splitView">
                    <div  id="bigDiv" style="width:1156px;height:800px;border:1px solid #ebeef5;margin:0 auto;overflow:hidden"  >
                        <div :class="index==0?'imgshow':'imghide'" class="page_img"  v-for="(item,index) in imgList" :key="index">
                            <img :src="base+'/aies/img?path='+item" style="margin: 0 auto;display: block;height:800px" class="imgChild" crossOrigin="Anonymous" >
                        </div>
                    <div class="previewSlot">
                        <div class="move_div"></div>
                    </div>
                        <!-- <div id="imgDiv"  style="width:800px">
                            <img id="sourceImg" :src="'http://10.131.7.138:8080/aies/'+sourceUrl" style="height:800px" >
                        </div> -->

                    </div>
                    <div class="btn_div">
                        <div class="page_btn">
                            <el-button type="primary" icon="el-icon-arrow-left" circle @click="prev_paper"></el-button>
                            <el-button type="primary" icon="el-icon-arrow-right" circle @click="next_paper"></el-button>
                        </div>
                    </div>
                </div>
                    </el-col>
                <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                    <div class="itemList">
                    <el-table highlight-current-row @row-click="rowClick" :sortable="true"  :data="tableData" height="398" border style="width: 100%">
                        <el-table-column type="index" align="center" width="50"></el-table-column>
                        <el-table-column prop="name" align="center" label="区域名称" width="300">
                        </el-table-column>
                        <el-table-column prop="page" align="center" label="操作" width="200">
                            <template slot-scope="scope">
                                <el-button class="edit_btn" :disabled="btn_visible[scope.$index]" type="primary" @click="handleSplit(scope)" size="small">拆分</el-button>
                                <el-button class="edit_btn" :disabled="btn_visible[scope.$index]" @click="handleDefault(scope)" size="small">不拆分</el-button>
                                <!-- <el-button class="exit_btn hidden_btn" type="warning" @click="handleExit(scope)" size="small">退出编辑</el-button>
                                <el-button type="danger" @click="handleDelete(scope)" size="small" >删除</el-button> -->
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="page" align="center" label="页码" width="100">
                            <template slot-scope="scope">
                                <el-input-number style="width:80px" @change="step(scope)" size="small" v-model="scope.row.page"  controls-position="right"  :min="1" :max="10"></el-input-number>
                            </template>
                        </el-table-column> -->
                        <!-- <el-table-column prop="addres"  label="操作" align="center" width="100">
                            <template slot-scope="scope">
                                <el-button type="text" @click="handleClick(scope.row)" size="small">编辑</el-button>
                            </template>
                        </el-table-column> -->
                    </el-table>
                    <el-table highlight-current-row :data="childModelData" @row-click="previewImg" height="398" border style="width: 100%;top:5px" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="50" align="center">
                        </el-table-column>

                        <el-table-column label="区域名" align="center" width="300">
                            <template slot-scope="scope">
                              <span @dblclick="editState(scope.row)" v-if="!scope.row.editFlag">{{ scope.row.cuttingName }}</span>
                              <span @keydown.13="submitEdit(scope.row)" v-if="scope.row.editFlag" class="cell-edit-input"><el-input v-model="scope.row.cuttingName" placeholder="请输入内容"></el-input></span>
                              <!-- <span v-if="!scope.row.editFlag" style="margin-left:10px;" class="cell-icon"  @click="handleEdit(scope.row)">  <i class="el-icon-edit"></i> </span>

      <span v-if="scope.row.editFlag"  style="margin-left:10px;"  class="cell-icon"  @click="handleSave(scope.row)">  <i class="el-icon-document"></i> </span> -->
                            </template>
                        </el-table-column>

                        <el-table-column  label="操作" align="center" width="200">
                            <template slot-scope="scope">
                                <el-button  type="danger" @click="handleDelete(scope)" size="small" >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button style="margin: 10px 0px 0 5px;float: left;" size="small" @click="handleMerge">合并</el-button>
                </div>
                </el-col>

                <div style="display:none"><img id="source" :src="base+'/aies/'+imgList[0]"></div>

                    <el-dialog width="80%" title="拆分扫描块" :visible.sync="dialogTableVisible"  @opened="dialogOpened" @close="dialogClose">
                    <!-- <img :src="base+'/aies/'+sourceUrl" style="height:800px" > -->
                    <div class="imgSlot" @mouseleave="mymouseleave"  ><div :class="index==0?'imgshow':'imghide'" class="page_div"  v-for="(item,index) in imgList" :key="index"><img  style="height:800px;margin:0 auto" :src="base+'/aies/img?path='+item" class="imgList" ></div></div>
                    <span slot="footer" class="dialog-footer">
                        <el-tooltip class="item" effect="light" content="提交" placement="bottom">
                            <el-button style="margin: 5px 5px"  type="success" icon="el-icon-check" circle @click="submit"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" content="框选分区" placement="bottom">
                            <el-button style="margin: 5px 5px"  type="primary" icon="el-icon-edit" circle @click="edit"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" content="撤销" placement="bottom">
                            <el-button style="margin: 5px 5px"  type="danger" icon="el-icon-back" circle @click="cancel"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" content="重置" placement="bottom">
                            <el-button style="margin: 5px 5px"  type="danger" icon="el-icon-delete" circle @click="reset"></el-button>
                        </el-tooltip>
                    </span>

                </el-dialog>
                </el-row>
            </el-main>
        </el-container>

</template>
<script>
import axios from 'axios'
// import Cropper from 'cropperjs'
import {getpaper,getpaperhead,getfragment,edittemfragment,baseUrl,getfragmentimg,pushcutting,mergeCutting,delcutting,getallcutting,getfragmentbyid,putcutting} from '../../../api/api.js'
export default {
    data(){
        return{
            num:0,
            page:0,//记录大框页码
            wId:'w',
            index : 0,
            editIndex:0,//记录正在编辑的项的索引
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
            childModelData:[],//一维数组
            childModelIndex:0,//拆分后小块的index
            childTempData:[],//临时存放数据，提交时再push到childModelData中
            mergeCuttings:[],
            visible:false,
            imgList:['img?path=img'],
            templetIdList:[],
            fragmentIdList:[],
            sourceHeight:0,
            isEdit:false,//记录是否是编辑状态
            currentPage:0,//记录图片翻页功能当前页
            isShowList:[],
            showIndex:0,
            base:'',
            childModelList:[],//二维数组
            multipleSelection:[],
            dialogTableVisible:false,
            localcutting:[],//存储post成功后返回的切块属性，每个大块又为一个数组
            mergeItems:0,
            btn_visible:[],
            imgLoadSuccessCnt:[],//记录已经加载成功的图片数
            loading:true,
            dialogLoading:false,//模态框的进度条
            imgCnt:0,//记录大块加载完成的次数
            imgTotal:0,//记录大块总共应该加载的次数
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
        dialogOpened(){
            let that=this;
            if(this.imgCnt<(this.imgTotal-1)){
                let options={
                    target:$('.el-dialog__wrapper')[0],
                    text:'拼命加载中'
                }
                // this.dialogLoading=this.$loading(options)
                //this.dialogLoading=true;
            }
            $.each($('.imgList'),function(index,item){
                item.onload=function(){
                    that.imgCnt++;
                    if(that.imgCnt>=that.imgTotal-1){
                        that.dialogLoading.close();
                    }
                }
            });
        },
        handleSelectionChange(val){
            console.log(val);
            this.multipleSelection = val;
        },
        rowClick(row, event, column){
            //$('.retc')[0].style="2px solid blue"
            // $('.retc').removeClass('click_div')
            // $('#'+row.id).addClass('click_div')
            console.log(row);
            this.currentPage=row.index;
            $('.move_div')[0].style.transform="";
            $.each($('.page_img'),function(index,item){
                item.style.display="none"
            })
            $('.page_img').eq(this.currentPage)[0].style.display="block";
            $('.el-table').eq(1).find('.current-row').removeClass('current-row');
        },
        handleDefault(scope){
            //this.btn_visible[scope.$index]=true;
            let that=this;
            let image = $('.page_img .imgChild').eq(scope.row.index)[0];
            let parentDiv=document.createElement("div");
            let div=document.createElement("div");
            let height=$('.page_img').eq(scope.row.index).find('img')[0].naturalHeight;
            let width=$('.page_img').eq(scope.row.index).find('img')[0].naturalWidth;
            let rowdata={};
            let item={};
            rowdata.cuttingX1=0;
            rowdata.cuttingY1=0;
            rowdata.cuttingX2=width;
            rowdata.cuttingY2=height;
            rowdata.cuttingName=scope.row.name;
            rowdata.fragmentId=scope.row.fragmentId;
            parentDiv.className="parent_preview";
            parentDiv.style.height="800px";
            div.className="preview-800";
            div.style.overflow="hidden";
            div.style.margin="0 auto";
            div.style.width=(rowdata.cuttingX2-rowdata.cuttingX1)*800/image.naturalHeight+"px";
            div.style.height=(rowdata.cuttingY2-rowdata.cuttingY1)*800/image.naturalHeight+"px";
            let img=document.createElement("img");
            img.src=image.src;
            img.style.height="800px";
            div.appendChild(img);
            $('.move_div')[0].appendChild(parentDiv);
            parentDiv.appendChild(div);
            pushcutting(rowdata).then(res=>{
              if(res.code=="200"){
                item=JSON.parse(JSON.stringify(res.data.msg[0]));
                if(that.childModelData.length){
                    item.childModelIndex=that.childModelData[that.childModelData.length-1].childModelIndex+1;
                }else{
                    item.childModelIndex=0;
                }

                item.editFlag=false;
                that.childModelData.push(item);
              }else{
                this.$notify({
                  type:'error',
                  message:'添加小块失败'
                })
              }
            }).catch(error=>{
              console.log(error)
                this.$notify({
                  type:'error',
                  message:error.response.data.data.msg
                })
            })

        },
        previewImg(row,event, column){
            $('.el-table').eq(0).find('.current-row').removeClass('current-row');
            console.log(this.childModelData)
            console.log(row);
            $.each($('.page_img'),function(index,item){
                item.style.display="none"
            })
            // $.each($('.preview-800'),function(index,item){
            //     item.style.display="none"
            // })
            //$('.preview-800').eq(row.childModelIndex)[0].style.display="block";

            //$('.preview-800 img').eq(row.childModelIndex)[0].style.transform="translateX(-"+row.cuttingX1+"px) translateY(-"+row.cuttingY1+"px)"
            if(!row.childModelIndex){
                $('.move_div')[0].style.transform="translateY(0px)"
            }else{
                $('.move_div')[0].style.transform="translateY(-"+row.childModelIndex*800+"px)"
            }

            // let image = $(document.getElementsByClassName('page_img')).find('img')[0];

            // $image.cropper({
            //     preview: ".previewSlot",
            //     data:{
            //         x: row.cuttingX1,
            //         y: row.cuttingY1,
            //         width: row.cuttingX2-row.cuttingX1,
            //         height: row.cuttingY2-row.cuttingY1
            //     }
            // })


            // image.cropper({
            //     preview: ".preview-800",
            //     data:{
            //         x: row.cuttingX1,
            //         y: row.cuttingY1,
            //         width: row.cuttingX2-row.cuttingX1,
            //         height: row.cuttingY2-row.cuttingY1
            //     },
            //     maxHeight: 800,
            //     build: function(e) {
            //         },
            // })

        },
        editState(row){
            row.editFlag=true;
            console.log(row.editFlag)
        },
        submitEdit(row){
            row.editFlag=false;
            let rowData={};
            rowData.fragmentId=row.fragmentId;
            rowData.cuttingX1=row.cuttingX1;
            rowData.cuttingX2=row.cuttingX2;
            rowData.cuttingY1=row.cuttingY1;
            rowData.cuttingY2=row.cuttingY2;
            rowData.cuttingName=row.cuttingName;
            putcutting(row.cutingMergeId,rowData).then(res=>{
              if(res.code==200){
                this.$notify({
                  type:'success',
                  message:'更名成功'
                })
              }
            }).catch(error=>{
              this.$notify({
                type:'error',
                message:error
              })
            })
        },
        //前一页
        prev_paper(){
                if(this.currentPage){
                    $('.page_img').eq(this.currentPage)[0].style.display="none"
                    this.currentPage--;
                    $('.page_img').eq(this.currentPage)[0].style.display="block"
                }
                //根据动态加载样式，使其当前页的图片显示，其他页的图片不显示
                // this.sourceUrl=imgList[page]
        },
        next_paper(){
                let that=this;
                // this.page++
                // this.sourceUrl=imgList[page]
                if(this.currentPage<this.imgList.length-1){
                    $('.page_img').eq(this.currentPage)[0].style.display="none";
                    that.currentPage++;
                    $('.page_img').eq(this.currentPage)[0].style.display="block";//page_img是预览框中的图片
                }
        },
        handleMerge(){
          if(this.multipleSelection.length>0){

            let that=this;
            let selectItem=JSON.parse(JSON.stringify(this.multipleSelection));
            let min=selectItem[0].childModelIndex;
            let minIndex=0;
            let delParentDiv=[];
            for(let i=0;i<selectItem.length;i++){
              if(min>selectItem[i].childModelIndex){
                min=selectItem[i].childModelIndex;
                minIndex=i;
              }
            }
            let mergeItem=selectItem[minIndex];
            console.log(mergeItem);
              mergeItem.mergeItems=[];
              for(let cnt=0;cnt<selectItem.length;cnt++){
                if(cnt!=minIndex){mergeItem.mergeItems.push(selectItem[cnt])}
                if(cnt!=minIndex){
                  // let parentdiv=$('.parent_preview').eq(mergeItem.childModelIndex+i+1);
                  let parentdiv=$('.parent_preview').eq(selectItem[cnt].childModelIndex);
                  $('.parent_preview').eq(mergeItem.childModelIndex)[0].appendChild(parentdiv.find('.preview-800')[0]);
                  delParentDiv.push(parentdiv);
                  that.resizeImg($('.parent_preview').eq(mergeItem.childModelIndex));
                }
              }
              delParentDiv.forEach(item=>{
                item.remove();
              })

              // $.each($('.parent_preview').eq(mergeItem.childModelIndex).find('.preview-800'),function(index,item){
              //     let imgHeight=$(item).find('img')[0].clientHeight
              //     let divHeight=$(item).find('img')[0].clientHeight
              //     $(item).find('img')[0].style.height=800.0/selectItem.length+"px";
              //     $(item).find('img')[0].style.width=$(item).find('img')[0].clientWidth*($(item).find('img')[0].clientHeight/imgHeight)+"px";
              //     item.style.height=800.0/selectItem.length+"px";
              //     item.style.width=item.clientWidth*item.clientHeight/divHeight+"px";
              // })

              let length=this.childModelData.length
              for(let i=0;i<length;i++){
                this.$set(this.childModelData[i],"childModelIndex",i);
              }
              // for(let i=mergeItem.childModelIndex+selectItem.length;i<length;i++){
              //     this.childModelData[i].childModelIndex-=selectItem.length-1;
              // }
              // that.childModelData.splice(selectItem[minIndex].childModelIndex,selectItem.length-1)
              for(let c=length-1;c>=0;c--){
                for(let j=0;j<selectItem.length;j++){
                  if(selectItem[j].childModelIndex==c&&j!=minIndex){//childModelIndex是从1开始计数的
                    that.childModelData.splice(c,1);
                  }
                }
              }
              for(let i=0;i<that.childModelData.length;i++){
                that.childModelData[i].childModelIndex=i;
              }
              //this.childModelData[mergeItem.childModelIndex].childModelIndex=mergeItem.childModelIndex
              $('.move_div')[0].style.transform="";
              for(let j=0;j<mergeItem.mergeItems.length;j++){
                delete mergeItem.mergeItems[j].childModelIndex
                delete mergeItem.mergeItems[j].editFlag
                delete mergeItem.mergeItems[j].id
                delete mergeItem.mergeItems[j].parentId
                delete mergeItem.mergeItems[j].mergeItems
                this.mergeCuttings.push(mergeItem.mergeItems[j])
              }
            delete mergeItem.mergeItems
            delete mergeItem.editFlag
            delete mergeItem.childModelIndex
            delete mergeItem.id
            delete mergeItem.parentId
            this.mergeCuttings.push(mergeItem)
            // mergeItem.childModelIndex=startIndex;
            this.mergeItems=this.multipleSelection.length;
            this.mergeCuttings.forEach(element=>{
                element.cuttingName=this.mergeCuttings[0].cuttingName;
            })
            mergeCutting(this.mergeCuttings).then(res=>{
                this.mergeCuttings=[];//清空
                if(res.code==200){
                    this.$notify({
                        type:"success",
                        message:"合并成功"
                    })
                    that.childModelData[that.multipleSelection[0].childModelIndex].cutingMergeId=res.data.msg[0].cutingMergeId
                }
            }).catch(e=>{
                console.log(e)
            })
            }else{
              this.$notify({
                type:"warning",
                message:"没有勾选要合并的试卷块"
              })
            }
        },
        resizeImg(parentDiv){
          let items=parentDiv.find('.preview-800').length;
          for(let i=0;i<items;i++){
              let times=(800/items)/parentDiv.find('.preview-800').eq(i)[0].style.height.replace(/(px)/g,"");//截图框div应缩小倍数
            if(items>1&&times<1){//如果times大于一则不进行缩放，保持原图比例
                let percent=parentDiv.find('.preview-800').eq(i)[0].style.height.replace(/(px)/g,"")/parentDiv.find('.preview-800 img').eq(i)[0].style.height.replace(/(px)/g,"");
                parentDiv.find('.preview-800').eq(i)[0].style.width=parentDiv.find('.preview-800').eq(i)[0].style.width.replace(/(px)/g,"")*times+"px";
                parentDiv.find('.preview-800').eq(i)[0].style.height=800/items+"px";
                let transform=parentDiv.find('.preview-800 img').eq(i)[0].style.transform;
                if(transform){
                    let patt=/\(([^)]*)\).*\(([^)]*)\)/;
                    let transformX=Number(patt.exec(transform)[1].replace(/(px)/,""));
                    let transformY=Number(patt.exec(transform)[2].replace(/(px)/,""));
                    transformX*=times;
                    transformY*=times;
                    parentDiv.find('.preview-800 img').eq(i)[0].style.transform='translateX('+transformX+'px) translateY('+transformY+'px)'
                }
                let imgHeight=parentDiv.find('.preview-800 img').eq(i)[0].style.height.replace(/(px)/g,"")*times+"px"
                parentDiv.find('.preview-800 img').eq(i)[0].style.height=imgHeight;
            }
          }
        },
        handleSplit(scope){
            let row=scope.row;
            let that=this;
            this.currentPage=scope.row.index;
            this.dialogTableVisible=true;

            this.$nextTick(()=>{
                that.editIndex=Number(row.index);
                that.rowIndex=scope.$index;

                $.each($('.page_div'),function(index,item){
                    $(item).addClass('imghide');
                    $(item).removeClass('imgshow');
                })
                $('.page_div').eq(that.currentPage).removeClass('imghide')//page_div是模态框中的图片
                $('.page_div').eq(that.currentPage).addClass('imgshow')//触发handleSplit的同时还会触发rowClick,在rowClick中currentPage已经变为row.index
                if(that.localcutting[that.editIndex].length>0){
                    that.isEdit=true;
                }
            })
        },
        // reshow(){
        //     if($('.retc').length>0){
        //         let positions=this.childModelList[this.editIndex]
        //     console.log($('.imgSlot')[0])
        //     let leftParent=this.getElementLeft($('.imgSlot')[0]);
        //     let topParent=this.getElementTop($('.imgSlot')[0]);
        //     for(let i=0;i<positions.length;i++){
        //         let div = document.createElement("div");
        //         let sourceHeight=this.sourceHeight;
        //         let retcLeft=positions[i].cuttingX1*800/sourceHeight;
        //         let retcTop=positions[i].cuttingY1*800/sourceHeight;
        //         let retcWidth=(positions[i].cuttingX2-positions[i].cuttingX1)*800/sourceHeight;
        //         let retcHeight=(positions[i].cuttingY2-positions[i].cuttingY1)*800/sourceHeight;
        //         div.id=this.wId+this.index;
        //         div.className = "retc";
        //         div.style.left = (retcLeft+leftParent).toString()+"px";
        //         div.style.top = (retcTop+topParent).toString()+"px";
        //         div.style.width = retcWidth.toString()+"px";
        //         div.style.height = retcHeight.toString()+"px";
        //         $('.page_div').eq(this.editIndex)[0].appendChild(div);
        //     }
        //     }
        // },
        handleDelete(scope){
            console.log(scope.row);
            let that=this;
            delcutting(scope.row.cutingMergeId).then(res=>{
                if(res.code==200){
                    this.$notify({
                        type:"success",
                        message:"删除成功"
                    })

                    for(let i=that.childModelData.length-1;i>scope.$index;i--){
                        that.childModelData[i].childModelIndex--;
                    }
                    this.childModelData.splice(scope.$index,1);
                    $('.move_div .parent_preview').eq(scope.$index).remove();
                }
            })
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
        reset(){
            $('.mydiv').remove();
            $('.retc').remove();
            let cnt=this.childTempData.length;
            for(let i=0;i<cnt;i++){
                this.childModelList[this.editIndex].pop();
            }
            $('.imgSlot')[0].onmousedown=null;
        },


        //撤销按钮，退回到前一个状态
        cancel(){
            let length=this.position.length;


            $('.mydiv').eq(length-1).remove();
            $('.retc').eq(length-1).remove();
            this.childModelList[this.editIndex].pop();
            //this.childModelList[this.editIndex].pop()
            //this.childModelData.pop()
            //this.isShowList.pop()
        },
        edit(){
            $('.imgSlot')[0].onmousedown=this.mymousedown;
            document.onmousemove=this.mymousemove;
            document.onmouseup=this.mymouseup;
        },
        step(scope){
            if(this.position[scope.$index].type==3) this.position[scope.$index].fragementPage=scope.row.page;
        },
        //初始化
        get_templet_by_examId(){
            let templetIdList=sessionStorage.getItem('templetIdList').split(',');
            let request=[];
            let imgList=[];
            let fragmentIdList=[];
            let that=this;
            for(let i=0;i<templetIdList.length;i++){
                request.push(getfragmentimg(templetIdList[i]).then(res=>{
                    console.log(res.data.fragments)
                    for(let j=0;j<res.data.fragments.length;j++){
                        imgList.push(res.data.fragments[j].fragmentImg)
                        fragmentIdList.push(res.data.fragments[j].fragmentId)
                    }

                }).catch(res=>{
                    this.$notify({
                        type:"error",
                        message:res.message
                    })
                }))
            }
            axios.all(request).then(res=>{
                let that=this;
                this.imgList=imgList;
                this.fragmentIdList=fragmentIdList;
                this.templetIdList=templetIdList;
                this.imgTotal=imgList.length;
                //排序函数

                this.$nextTick(function(){
                    $.each($('.imgChild'),function(index,item){
                        item.onload=function(){
                            that.imgCnt++;
                            if(that.imgCnt==that.imgTotal){
                                that.loading=false;
                                that.imgCnt=0;
                            }
                        }
                    })
                })

            });

        },
        submit(){
            this.$confirm('确定提交吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //isEdit是否是编辑状态
                    if(this.isEdit){
                        let that=this;
                        let request=[];
                        let paparHeaderId;
                        let selectBlockId;
                        let fragmentId;
                        let templetId;
                        for(let i=0;i<that.childModelList[that.editIndex].length;i++){
                            that.childModelList[that.editIndex][i]
                                    fragmentId=that.position[i].fragmentId
                                    templetId=that.position[i].templetId
                                    delete that.position[i].type
                                    delete that.position[i].fragmentId
                                    console.log(that.position[i])
                                    if(!that.position[i].method){
                                        delete that.position[i].templetId
                                        request.push(edittemfragment(fragmentId,that.position[i]).then().catch(e=>{console.log(e)}))
                                    }else if(that.position[i].method=="POST"){
                                        delete that.position[i].method
                                        request.push(pushfragmentp(that.position[i]).then().catch(e=>{console.log(e)}))
                                    }
                                    break;

                        }
                        axios.all(request).then(()=>{
                            that.dialogTableVisible=false;
                        })
                    }else {
                        let that=this;
                        //let params=[];
                        let request=[];
                        for(let i=0;i<that.childModelList[that.editIndex].length;i++){
                            console.log(that.childModelList[that.editIndex])
                            // delete that.childModelList[that.editIndex][i].type;
                            // delete that.position[i].method;
                            that.childModelList[that.editIndex][i].cuttingName=that.childTempData[i].name;
                            request.push(pushcutting(that.childModelList[that.editIndex][i]).then(res=>{
                                if(res.code==200){
                                    //that.localcutting[that.editIndex].push(res.data.msg[0])
                                    that.btn_visible[that.rowIndex]=true;
                                    let obj=res.data.msg[0];
                                    obj.editFlag=false;
                                    obj.id=that.childTempData[0].id;
                                    obj.parentId=that.childTempData[0].parentId
                                    obj.childModelIndex=$('.move_div .parent_preview').length;
                                    let image = $('.page_img .imgChild').eq(obj.parentId)[0]
                                    let div = document.createElement("div");
                                    let parentDiv=document.createElement("div");

                                    parentDiv.className="parent_preview";
                                    parentDiv.style.height="800px";
                                    div.className="preview-800";
                                    div.style.width=(obj.cuttingX2-obj.cuttingX1)*800/image.naturalHeight+"px";
                                    div.style.height=(obj.cuttingY2-obj.cuttingY1)*800/image.naturalHeight+"px";
                                    div.style.overflow="hidden";
                                    div.style.margin="0 auto";
                                    //div.style.display="none";
                                    $('.move_div')[0].appendChild(parentDiv)
                                    $('.move_div .parent_preview').eq($('.move_div .parent_preview').length-1)[0].appendChild(div)
                                    that.childModelData.push(obj);
                                    let img=document.createElement("img");
                                    img.src=image.src;
                                    img.style.height="800px";
                                    img.style.transform="translateX(-"+obj.cuttingX1*800/image.naturalHeight+"px) translateY(-"+obj.cuttingY1*800/image.naturalHeight+"px)";
                                    div.appendChild(img)
                                    // this.cropper = new Cropper(image,{
                                    //     preview: ".preview-800",
                                    //     data:{
                                    //         x: obj.cuttingX1,
                                    //         y: obj.cuttingY1,
                                    //         width: obj.cuttingX2-obj.cuttingX1,
                                    //         height: obj.cuttingY2-obj.cuttingY1
                                    //     },
                                    //     ready: function (e) {
                                    //         $('.cropper-container').prev('img').removeClass("cropper-hidden")
                                    //         $('.cropper-container').hide()
                                    //     },
                                    // })
                                    that.childTempData.pop();
                                }

                            }))
                        }

                        axios.all(request).then(res=>{
                            that.$notify({
                                type: 'success',
                                message: '提交成功'
                            });
                            that.dialogTableVisible=false;
                        })

                        console.log("submit");
                    }
                }).catch((e) => {
                    console.log(e)
                    
                });
        },
        mymousedown(e){
            this.flag = true;
            console.log('onmousedown');
            console.log(e);
            try{
                this.index++;
                let currentPage=this.currentPage
                let wId=this.wId;
                let index=this.index;
                let sourceHeight=$('.imgSlot .imgshow img')[0].naturalHeight;
                let evt = e;
                let scrollTop = document.getElementsByClassName('el-dialog__wrapper')[0].scrollTop;
                let scrollLeft = document.getElementsByClassName('el-dialog__wrapper')[0].scrollLeft;//el-dialog__wrapper 蒙层在这相当于document

                let offsetLeft=this.getElementLeft($('.imgSlot')[0])//imgSlot相当于模态框内容部分的宽高
                let offsetTop=this.getElementTop($('.imgSlot')[0])
                let minLeft=this.getElementLeft($('.imgList')[currentPage])-offsetLeft;//mingLeft是指div框相对于.imgSlot的最小left,imgList是图片类名，指当前图片的左边距减去模态框内容部分的左边距
                let minTop=this.getElementTop($('.imgList')[currentPage])-offsetTop;
                let maxLeft=minLeft+$('.imgList')[currentPage].clientWidth;
                let maxTop=minTop+$('.imgList')[currentPage].clientHeight;
                console.log("minLeft"+minLeft)
                console.log("minTop"+minTop)
                console.log("maxLeft"+maxLeft)

                //this.startX = evt.pageX + scrollLeft-(offsetLeft+ (document.body.scrollLeft || document.documentElement.scrollLeft));
                this.startX=minLeft;
                this.startY = evt.clientY + scrollTop-offsetTop;
                //模态框激活后pageY等于document.body.scrollTop加上clientY
                //evt.clientY + scrollTop等于鼠标距离document顶部的值
                //offsetTop+(document.body.scrollTop || document.documentElement.scrollTop)是两个滚轮的和，模态框的scroll和document的scroll之和
                console.log("scrollLeft:"+scrollLeft)
                console.log("scrollTop:"+scrollTop)
                console.log("startX"+this.startX)
                console.log("startY"+this.startY)


                let x=this.startX;
                let y=this.startY;
                if(y>minTop&&y<maxTop){
                    let div = document.createElement("div");
                    div.id = wId + index;
                    div.className = "mydiv";
                    div.style.left = this.startX + "px";
                    div.style.top = this.startY + "px";
                    div.style.width=$('.imgList')[currentPage].clientWidth+"px"
                    $('.imgSlot')[0].appendChild(div);
                    x=x-$('.imgSlot .imgshow img')[0].offsetLeft;
                    y=y-$('.imgSlot .imgshow img')[0].offsetTop;
                    this.childModelList[this.editIndex].push({
                            fragmentId:this.fragmentIdList[this.editIndex],
                            cuttingX1:x*sourceHeight/800,
                            cuttingY1:y*sourceHeight/800,
                            cuttingX2:'',
                            cuttingY2:'',
                            cuttingName:'',
                        })
                }
                console.log(x*sourceHeight/800,y*sourceHeight/800)

            }catch(e){
                console.log(e);
            }
        },
        dialogClose(){

        },
        mymouseup(e){
            console.log('onmouseup')
            if(this.flag){
                try{
                    let wId=this.wId;
                    let index=this.index;
                    let sourceHeight=$('.imgSlot .imgshow img')[0].naturalHeight;
                    let retcWidth=this.retcWidth;
                    let retcHeight=this.retcHeight;
                    let scrollTop = document.getElementsByClassName('el-dialog__wrapper')[0].scrollTop;
                    let scrollLeft = document.getElementsByClassName('el-dialog__wrapper')[0].scrollLeft;
                    let div = document.createElement("div");
                    let offsetLeft=this.getElementLeft($('.imgSlot')[0]);
                    let offsetTop=this.getElementTop($('.imgSlot')[0]);
                    let x=retcWidth.replace(/px/g,'');
                    let y=e.pageY+scrollTop-(offsetTop+ (document.body.scrollTop || document.documentElement.scrollTop))-$('.imgSlot .imgshow img')[0].offsetTop;
                    let retcLeft=this.retcLeft;
                    let retcTop=this.retcTop;
                    let arrayLength=this.childModelList[this.editIndex].length;
                    $('.imgSlot')[0].removeChild(this.$(wId + index));
                    div.id=wId + index;
                    div.className = "retc";
                    div.style.left = retcLeft;
                    div.style.top = retcTop;
                    div.style.width = retcWidth;
                    div.style.height = retcHeight;
                    $('.page_div').eq(this.currentPage)[0].appendChild(div);
                    console.log(x*sourceHeight/800,y*sourceHeight/800)
                    this.childTempData.push({
                        'parentId':this.editIndex,
                        'id':wId + index,
                        'name':'切块区'+this.page,
                        'page':this.page++,
                        'editFlag':false,
                        'cuttingX1':this.childModelList[this.editIndex][arrayLength-1].cuttingX1,
                        'cuttingY1':this.childModelList[this.editIndex][arrayLength-1].cuttingY1,
                        'cuttingX2':x,
                        'cuttingY2':y,
                    })
                    //method用来判断调更新接口还是添加接口

                    //this.position[this.position.length-1].method="POST";

                    this.childModelList[this.editIndex][arrayLength-1].cuttingX2=x*sourceHeight/800
                    this.childModelList[this.editIndex][arrayLength-1].cuttingY2=y*sourceHeight/800
                    this.fixPosition(this.childModelList[this.editIndex][arrayLength-1])
                    this.fixPosition(this.childTempData[this.childTempData.length-1])
                    console.log(this.childModelList[this.editIndex][arrayLength-1])
                    //this.isShowList.push(true)


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
                    let currentPage=this.currentPage;
                    let wId=this.wId;
                    let index=this.index;
                    let startX=this.startX;
                    let startY=this.startY;
                    let sourceHeight=this.sourceHeight;
                    let scrollTop = document.getElementsByClassName('el-dialog__wrapper')[0].scrollTop ;
                    let scrollLeft = document.getElementsByClassName('el-dialog__wrapper')[0].scrollLeft+(document.body.scrollLeft|| document.documentElement.scrollLeft) ;
                    let offsetLeft=this.getElementLeft($('.imgSlot')[0])
                    let offsetTop=this.getElementTop($('.imgSlot')[0])
                    let minClientX=this.getElementLeft($('.imgList')[currentPage])
                    let minClientY=this.getElementTop($('.imgList')[currentPage])
                    let maxClientX=minClientX+$('.imgList')[currentPage].clientWidth;
                    let maxClientY=minClientY+$('.imgList')[currentPage].clientHeight;
                    // console.log("minClientX"+minClientX)
                    // console.log("maxClientX"+maxClientX)
                    if(evt.clientY+ scrollTop<maxClientY){
                        this.retcLeft = (startX - evt.pageX - scrollLeft > 0 ? evt.pageX + scrollLeft : startX) + "px";
                        this.retcTop = (startY - (evt.clientY + scrollTop-offsetTop )  > 0 ? evt.clientY + scrollTop-offsetTop  : startY) + "px";
                    }
                    console.log(evt.clientY+ scrollTop-offsetTop)
                    console.log(maxClientY)
                    if(startY - evt.pageY < 0){
                        startY;
                    }
                    // if(evt.pageX+scrollLeft-(offsetLeft+ (document.body.scrollLeft || document.documentElement.scrollLeft))>minClientX&&evt.pageX+scrollLeft<maxClientX){
                    //     this.retcWidth = maxClientY;
                    // }
                    this.retcWidth = $('.imgList')[currentPage].clientWidth+"px";
                    if(evt.pageY+scrollTop-(offsetTop+ (document.body.scrollTop || document.documentElement.scrollTop))<maxClientY&&evt.pageY+scrollTop>minClientY&&evt.clientY+ scrollTop<maxClientY){
                        this.retcHeight = Math.abs(startY + offsetTop - evt.pageY +(document.body.scrollTop|| document.documentElement.scrollTop)- scrollTop) + "px";
                    }
                    console.log("id:"+wId + index)
                    if(Number(this.retcTop.replace(/px/g,''))>0&&evt.clientY+ scrollTop<maxClientY){
                        this.$(wId + index).style.left = this.retcLeft;
                        this.$(wId + index).style.top = this.retcTop;
                        this.$(wId + index).style.width = this.retcWidth;
                        this.$(wId + index).style.height = this.retcHeight;
                    }


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
            if(position.cuttingX1>position.cuttingX2){
                let x=position.cuttingX1;
                position.cuttingX1=position.cuttingX2;
                position.cuttingX2=x;
            }
            if(position.cuttingY1>position.cuttingY2){
                let y=position.cuttingY1;
                position.cuttingY1=position.cuttingY2;
                position.cuttingY2=y;
            }
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
        //初始化
        loadFragmentData(){
            let that=this;
            let request=[];
            for(let j=0;j<this.templetIdList.length;j++){
                var fragments='';
                var p=0;//记录每次内部循环结束后的位置
                request.push(getfragment(sessionStorage.getItem('templetIdList').split(',')[j]).then(res=>{
                    if(res.code==200){
                        let length;
                        fragments=res.data.fragments;
                        length=fragments.length;
                        // console.log(positions)
                        // let leftParent=this.getElementLeft($('#bigDiv')[0]);
                        // let topParent=this.getElementTop($('#bigDiv')[0]);
                        for(let i=0;i<length;i++){
                            this.tableData.push({
                                'id':this.wId+this.index++,
                                'name':"联合区"+Number((i+1)+p),
                                'page':i+p, //记录加载顺序，方便行点击定位图片
                                'index':i+p, //记录childModelList的索引
                                'fragmentId':fragments[i].fragmentId
                            })
                            this.localcutting.push([]);
                            this.childModelList.push([]);
                            this.btn_visible.push(false);
                            console.log(this.tableData)
                            //this.isShowList.push(true)
                        }

                        p=length;
                        fragments=res.data.fragments;
                        //that.isEdit=true;//进入编辑模式
                    }
                }))
            }
            axios.all(request).then(()=>{
                let orderList=[];
                        that.fragmentIdList.forEach((item,index)=>{
                            that.tableData.forEach((childItem,childIndex)=>{
                                if(childItem.fragmentId==item){
                                    let tempItem=that.tableData.splice(childIndex,1)[0];
                                    tempItem.index=orderList.length;
                                    orderList.push(tempItem);
                                }
                            })
                        })
                        console.log(orderList)
                        that.tableData=orderList;
            })
            console.log(this.btn_visible)
        },
        imgloadFinsh(cnt,total,callbackParams){
            if(cnt==total){
                this.resizeImg(callbackParams);
            }
        },
        reshow(){
            let that=this;
            let request=[];
            getallcutting(sessionStorage.getItem('exam_small_id')).then(res=>{
                let dataTree=res.data.msg;
                console.log(dataTree);
                for(let i=0;i<dataTree.length;i++){
                    let tag;
                    let childIndex=-1;
                    let parentDiv=document.createElement("div");
                    parentDiv.className="parent_preview";
                    parentDiv.style.height="800px";
                    that.imgLoadSuccessCnt.push(0);
                    $('.move_div')[0].appendChild(parentDiv);
                    for(let j=0;j<dataTree[i].length;j++){
                        dataTree[i][j].editFlag=false;
                        if(j==0){
                            dataTree[i][j].childModelIndex=that.childModelIndex++;
                            that.childModelData.push(dataTree[i][j]);
                            tag=that.childModelData.length-1;
                            that.childModelData[tag].mergeItems=[];
                            childIndex=dataTree[i][j].childModelIndex;
                            request.push(getfragmentbyid(dataTree[i][j].fragmentId).then(res=>{
                              let path= res.data.fragment.fragmentImg;
                              let div=document.createElement("div");
                              let image=document.createElement("img");
                              image.src=that.base+"/aies/"+path;
                              image.onload=function(){
                                div.style.width=(dataTree[i][j].cuttingX2-dataTree[i][j].cuttingX1)*800/image.naturalHeight+"px";
                                div.style.height=(dataTree[i][j].cuttingY2-dataTree[i][j].cuttingY1)*800/image.naturalHeight+"px";
                                image.style.transform="translateX(-"+dataTree[i][j].cuttingX1*800/image.naturalHeight+"px) translateY(-"+dataTree[i][j].cuttingY1*800/image.naturalHeight+"px)";
                                that.imgloadFinsh(++that.imgLoadSuccessCnt[i],dataTree[i].length,$(parentDiv));

                              }
                              div.className="preview-800";
                              div.style.overflow="hidden";
                              div.style.margin="0 auto";
                              if(dataTree[i][j].childModelIndex>=0){
                                $('.move_div .parent_preview').eq(dataTree[i][j].childModelIndex)[0].appendChild(div);
                              }
                              image.style.height="800px";
                              div.appendChild(image);
                            }))
                        }else{
                            that.childModelData[tag].mergeItems.push(dataTree[i][j])
                        }


                    }


                    for(let cnt=0;cnt<that.childModelData[tag].mergeItems.length;cnt++){
                      request.push(getfragmentbyid(that.childModelData[tag].mergeItems[cnt].fragmentId).then(res=>{
                        let obj=that.childModelData[tag].mergeItems[cnt];
                        let path= res.data.fragment.fragmentImg;
                        let div=document.createElement("div");
                        let image=document.createElement("img");
                        image.src=that.base+"/aies/"+path;
                        if(cnt==that.childModelData[tag].mergeItems.length-1){
                          image.onload=function(){
                            div.style.width=(obj.cuttingX2-obj.cuttingX1)*(800)/image.naturalHeight+"px";
                            div.style.height=(obj.cuttingY2-obj.cuttingY1)*(800)/image.naturalHeight+"px";
                            image.style.transform="translateX(-"+obj.cuttingX1*800/image.naturalHeight+"px) translateY(-"+obj.cuttingY1*800/image.naturalHeight+"px)";
                            that.imgloadFinsh(++that.imgLoadSuccessCnt[i],dataTree[i].length,$(parentDiv));

                          }
                        }else{
                          image.onload=function(){
                            div.style.width=(obj.cuttingX2-obj.cuttingX1)*(800)/image.naturalHeight+"px";
                            div.style.height=(obj.cuttingY2-obj.cuttingY1)*(800)/image.naturalHeight+"px";
                            image.style.transform="translateX(-"+obj.cuttingX1*800/image.naturalHeight+"px) translateY(-"+obj.cuttingY1*800/image.naturalHeight+"px)";
                            that.imgloadFinsh(++that.imgLoadSuccessCnt[i],dataTree[i].length,$(parentDiv));
                          }
                        }

                        div.className="preview-800";
                        div.style.overflow="hidden";
                        div.style.margin="0 auto";
                        if(childIndex>=0){
                          $('.move_div .parent_preview').eq(childIndex)[0].appendChild(div);
                        }
                        image.style.height="800px";
                        div.appendChild(image);
                      }))
                    }

                }
                axios.all(request).then(res=>{
                  if(res.code==200){
                    this.$notify({
                      type:'success',
                      message:'成功'
                    })
                  }
                })
            })
        }
    },
    mounted(){
        let that=this;
        this.base=baseUrl();
        if(sessionStorage.getItem('templetIdList')){
            let img=$('#source')[0];
            //图片加载完毕后执行回显，并记录其原高
            img.onload =function(){
                that.sourceHeight=img.height;
                that.loadFragmentData();
            }
            this.get_templet_by_examId();
            this.reshow();
            $(document).on('mousedown','img',function(e){
                    e.preventDefault()
            })
        }else{
            getpaper(sessionStorage.getItem('exam_small_id')).then((res) =>{
                let arrayLength=res.data.templets.length;
                let templets=res.data.templets;
                let templetIdList=[];
                if(arrayLength){
                    for(let i=0;i<arrayLength;i++){
                        templetIdList.push(templets[i].templetId);
                    }
                }
                // console.log(res.data.templets[0]);
                // console.log(templetId)
                sessionStorage.setItem('templetIdList',templetIdList);
                console.log("session templetIdList:",templetIdList)
            }).then(()=>{
                let img=$('#source')[0];
                //图片加载完毕后执行回显，并记录其原高
                img.onload =function(){
                    that.sourceHeight=img.height;
                    that.loadFragmentData();
                }
                this.get_templet_by_examId();
                this.reshow();
                $(document).on('mousedown','img',function(e){
                        e.preventDefault()
                })
            })
        }
        
    },
    watch:{
        imgList(oldval,newval){
            let that=this;
            console.log("this.imgList.length")
            console.log(this.imgList)

        }
    }
}
</script>


<style scoped>
body,h1,h2,h3,h4,h5,h6,hr,p,blockquote,dl,dt,dd,ul,ol,li,pre,form,fieldset,legend,input,textarea,th,td{margin:0;padding:0}
img {max-width: 100%; /* This rule is very important, please do not ignore this! */}

.splitView{width: 1200px;float: left;}
.btn_div{width: 1156px;margin: 0 auto;}
.btn_group{float:right}
.itemList{width: 552px;float: left;}
.page_btn{width: 200px;float: left;margin-left: 510px;margin-top: 5px;}
.next{transform:translateX(-800px)}
.last{transform:translateX(800px)}
.click_div{border:2px solid red !important;}
.resizeB{width: 100%;height: 10px;position: absolute;bottom: 0;cursor: n-resize;}
.imgList{display:block;margin: 0 auto;}
.imgshow{display: block}
.imghide{display: none}
.imgSlot{position: relative;}
.cell-edit-input{width:120px}
.previewSlot{height: 800px;display: block;margin: 0 auto}
.imgSlot /deep/ .mydiv{position:absolute; border:1px dashed blue; width:0px; height:0px;left:0px; top:0px; overflow:hidden;}
.imgSlot /deep/ .retc{position:absolute; border:2px solid blue; overflow:hidden; }
.resizeL{width: 10px;height: 100%;position: absolute;left: 0;top: 0;cursor: w-resize;}

            .resizeT{
                width: 100%;
                height: 5%;
                position: absolute;
                top: 0;
                z-index: 2;
                cursor: n-resize;
            }
            .resizeR{
                width: 5%;
                height: 100%;
                position: absolute;
                right: 0;
                top: 0;
                z-index: 2;
                cursor: w-resize;
            }

            .resizeLT{
                width: 5%;
                height: 5%;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 2;
                cursor: nw-resize;
            }
            .resizeLB{
                width: 5%;
                height: 5%;
                position: absolute;
                bottom: 0;
                left: 0;
                z-index: 2;
                cursor: ne-resize;
            }
            .resizeRT{
                width: 5%;
                height: 5%;
                position: absolute;
                top: 0;
                right: 0;
                z-index: 2;
                cursor: ne-resize;
            }
            .resizeRB{
                width: 5%;
                height: 5%;
                position: absolute;
                bottom: 0;
                right: 0;
                z-index: 2;
                cursor: nw-resize;
            }
            .drag_content{
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


