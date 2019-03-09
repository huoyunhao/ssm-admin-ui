<template>
        <div>
            <div class="splitView">
                <div ref="imgSlot" id="bigDiv" style="width:1156px;height:800px;border:1px solid #ebeef5;margin:0 auto;overflow:hidden"  >
                </div>
                <div class="btn_div">
                    <div class="page_btn">
                        <el-button type="primary" icon="el-icon-arrow-left" circle @click="prev_paper"></el-button>
                        <el-button type="primary" icon="el-icon-arrow-right" circle @click="next_paper"></el-button>
                    </div>   
                    <div class="link_btn">
                        <el-button type="warning" @click="$router.push({ path:'/exam_big_cutting'})">重新编辑</el-button>
                        <el-button type="primary" @click="$router.push({ path:'/student_paper_upload'})">确认无误</el-button>
                    </div>
                </div>
            </div>
            <div style="display:none"><img id="source" :src="'http://120.79.250.60/aies/'+imgList[0]"></div>
        </div>
</template>
<script>
import axios from 'axios'
import {pushselectblockp,pushfragmentp,pushpaperheaderp,getselectsubblock,getpaper,getpaperhead,getfragment,getselectblock,edittemppaperhead,edittemselectblock,edittemfragment,delselect,delfragmen,delpaperhead} from '../../../api/api.js'
export default {
    data(){
        return{
            num:0,
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
            sourceHeight:0,
            isEdit:false,//记录是否是编辑状态
            currentPage:0,//记录图片翻页功能当前页
            isShowList:[],
            showIndex:0
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
        //重现函数
        reshow(){
            let that=this;
            for(let j=0;j<this.templetIdList.length;j++){
                getpaperhead(sessionStorage.getItem('templetIdList').split(',')[j]).then(res=>{
                if(res.code==200){
                    let position=res.data.templetPaperHeaders[0];
                    let leftParent=this.getElementLeft($('#bigDiv')[0]);
                    let topParent=this.getElementTop($('#bigDiv')[0]);
                    position.type=1
                    let div = document.createElement("div");
                    let sourceHeight=this.sourceHeight;
                    let retcLeft=position.x1*800.0/sourceHeight;
                    let retcTop=position.y1*800.0/sourceHeight;
                    let retcWidth=(position.x2-position.x1)*800.0/sourceHeight;
                    let retcHeight=(position.y2-position.y1)*800.0/sourceHeight;
                    div.id=this.wId+this.index;
                    div.className = "retc headRetcColor";
                    div.style.left = (retcLeft+leftParent).toString()+"px";
                    div.style.top = (retcTop+topParent).toString()+"px";
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
                        sessionStorage.setItem('selectBlockId',position.selectBlockId)
                        let leftParent=this.getElementLeft($('#bigDiv')[0]);
                        let topParent=this.getElementTop($('#bigDiv')[0]);
                        position.type=2
                        let div = document.createElement("div");
                        let sourceHeight=this.sourceHeight;
                        let retcLeft=position.x1*800/sourceHeight;
                        let retcTop=position.y1*800/sourceHeight;
                        let retcWidth=(position.x2-position.x1)*800/sourceHeight;
                        let retcHeight=(position.y2-position.y1)*800/sourceHeight;
                        console.log(position)
                        console.log(retcLeft,retcTop,retcWidth,retcHeight)
                        div.id=this.wId+this.index;
                        div.className = "retc selectRetcColor";
                        div.style.left = (retcLeft+leftParent).toString()+"px";
                        div.style.top = (retcTop+topParent).toString()+"px";
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
                                let leftParent=this.getElementLeft($('#bigDiv')[0]);
                                let topParent=this.getElementTop($('#bigDiv')[0]);
                                let sourceHeight=this.sourceHeight;
                                position.forEach((item,index)=>{
                                    let div = document.createElement("div");
                                    let retcLeft=item.x1*800/sourceHeight;
                                    let retcTop=item.y1*800/sourceHeight;
                                    let retcWidth=(item.x2-item.x1)*800/sourceHeight;
                                    let retcHeight=(item.y2-item.y1)*800/sourceHeight;
                                    console.log(item)
                                    console.log(retcLeft,retcTop,retcWidth,retcHeight)
                                    div.id=this.wId+this.index;
                                    div.className = "retc selectSubRetcColor";
                                    div.style.left = (retcLeft+leftParent).toString()+"px";
                                    div.style.top = (retcTop+topParent).toString()+"px";
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
                        let leftParent=this.getElementLeft($('#bigDiv')[0]);
                        let topParent=this.getElementTop($('#bigDiv')[0]);
                        for(let i=0;i<positions.length;i++){
                            positions[i].type=3;
                            let div = document.createElement("div");
                            let sourceHeight=this.sourceHeight;
                            let retcLeft=positions[i].fragmentPointX1*800/sourceHeight;
                            let retcTop=positions[i].fragmentPointY1*800/sourceHeight;
                            let retcWidth=(positions[i].fragmentPointX2-positions[i].fragmentPointX1)*800/sourceHeight;
                            let retcHeight=(positions[i].fragmentPointY2-positions[i].fragmentPointY1)*800/sourceHeight;
                            div.id=this.wId+this.index;
                            div.className = "retc retcColor";
                            div.style.left = (retcLeft+leftParent).toString()+"px";
                            div.style.top = (retcTop+topParent).toString()+"px";
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
        }
        this.get_templet_by_examId();
        
        
        
    },
    watch:{
        imgList(oldval,newval){
            let that=this;
            console.log("this.imgList.length")
            console.log(this.imgList[1])
            for(let i=0;i<that.imgList.length;i++){
                //console.log(that.$refs)
                if(i==0){
                    $(that.$refs.imgSlot).append(`<div class="page_div"><img class='imgList' src="http://120.79.250.60/aies/${this.imgList[i]}" style="height:800px  " ><div>`)
                }else{
                    $(that.$refs.imgSlot).append(`<div class="page_div" style="display:none"><img class='imgList' src="http://120.79.250.60/aies/${this.imgList[i]}" style="height:800px;" ><div>`)
                }
                
            }
            document.getElementsByTagName('img').onmousedown = function(e){
                e.preventDefault()
            };
        }
    }
}
</script>


<style scoped>
body,h1,h2,h3,h4,h5,h6,hr,p,blockquote,dl,dt,dd,ul,ol,li,pre,form,fieldset,legend,input,textarea,th,td{margin:0;padding:0}
.splitView{width: 1200px;margin:0 auto;}
.btn_div{width: 1156px;margin: 0 auto;}
.btn_group{float:right}
.itemList{width: 552px;float: left;}
.page_btn{width: 200px;float: left;margin-left: 510px;margin-top: 5px;}
.next{transform:translateX(-800px)}
.last{transform:translateX(800px)}
.click_div{border:2px solid red !important;}
.link_btn{float:right;padding-top: 50px}
.splitView /deep/ .mydiv{position:absolute; border:1px dashed blue; width:0px; height:0px;left:0px; top:0px; overflow:hidden;}
.splitView /deep/ .retc{position:absolute;  overflow:hidden; }
.splitView /deep/ .retcColor{border:2px solid blue;}
.splitView /deep/ .headRetcColor{border: 2px solid #E6A23C}
.splitView /deep/ .selectRetcColor{border: 2px solid #005d61}
.splitView /deep/ .selectSubRetcColor{border:2px solid #00a6ae};
.splitView /deep/ .click_div{border:2px solid red !important;}
</style>


