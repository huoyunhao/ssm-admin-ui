<template>
<el-container>
  <el-header></el-header>
  <el-main>
      <el-row>
          <el-col :span="13" :offset="5">
              <el-table
    :data="tableData"
    style="width: 100%;border:1px solid #ebeef5;"
     @row-click="rowClick"
    >
    <el-table-column prop="selectNum" label="题号" align="center" width="100"></el-table-column>
    <el-table-column
      prop="selectTypeName"
      label="选择题类型"
      width="150" align="center">
    </el-table-column>
    <el-table-column
      prop="selectScore"
      label="选择题分数"
      width="200" align="center">
      <template slot-scope="scope">
          <el-input v-model="scope.row.selectScore" style="width:40px"></el-input>
      </template>
    </el-table-column>
    <el-table-column
      label="正确答案"
      width="400" align="center">
      <template slot-scope="scope">
        <el-checkbox-group v-model="checkList[scope.$index]"  @change="check_answer">
            <el-checkbox label="选项 A" ></el-checkbox>
            <el-checkbox label="选项 B" ></el-checkbox>
            <el-checkbox label="选项 C" ></el-checkbox>
            <el-checkbox label="选项 D" ></el-checkbox>
        </el-checkbox-group>
      </template>
    </el-table-column>
    <el-table-column
      
      label="操作"
      width="135" align="center">
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="deleteRow(scope.$index, tableData)"
          type="text"
          size="small">
           &nbsp; &nbsp;&nbsp;&nbsp;移除
        </el-button>
        <el-button
          @click.native.prevent="editRow(scope.$index, tableData)"
          type="text"
          size="small">
           &nbsp; &nbsp;&nbsp;&nbsp;设置
        </el-button>
      </template>
    </el-table-column>
  </el-table>
            
          </el-col>
        
      </el-row>
        <el-row>
            <el-col :span="1" :offset="17">
                <el-button type="text" @click="add_row">
                    <i class="el-icon-circle-plus-outline"></i>添加
                </el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="2" :offset="10">
                <el-button type="primary" @click="innerVisible=true">多选判分规则</el-button>
            </el-col>
            <el-col :span="2" >
                <el-button type="primary" @click="submit">确定</el-button>
            </el-col>
            
        </el-row>
        
        <el-dialog
        title="插入选择题"
        :visible.sync="dialogVisible"
        width="30%">
            <span>
                <el-form ref="form" :model="form" label-width="100px">
                    <el-form-item label="选择题数量">
                        <el-input placeholder="请输入选择题数量" v-model="form.number"></el-input>
                    </el-form-item>
                    <el-form-item label="分数">
                        <el-input placeholder="请输入选择题分数" v-model="form.score"></el-input>
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="initSelect">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
        title="插入选择题"
        :visible.sync="answerInsert_dgVisible"
        width="30%">
            
            <span>
                <el-form :model="answerForm" label-width="100px">
                    <el-form-item label="选择题答案">
                        <el-input placeholder="请输入选择题答案"  @keyup.native="filterChar" v-model="answerForm.answerList"></el-input>
                    </el-form-item>
                    <el-form-item label="分数">
                        <el-input placeholder="请输入该题分数" v-model="answerForm.score"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="是否严格">
                        <el-input placeholder="请输入该题分数" v-model="answerForm.score"></el-input>
                    </el-form-item>
                    <el-form-item label="漏选扣分">
                        <el-input placeholder="请输入该题分数" v-model="answerForm.score"></el-input>
                    </el-form-item>
                    <el-form-item label="错选扣分">
                        <el-input placeholder="请输入该题分数" v-model="answerForm.score"></el-input>
                    </el-form-item> -->
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="answerInsert">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                width="30%"
                title="多选判分规则"
                :visible.sync="innerVisible"
                append-to-body>
                <span>
                    <el-form :model="judgeRule" label-width="100px">
                        <el-form-item label="是否严格">
                            <el-radio-group v-model="judgeRule.isStrict" @change="test">
                                <el-radio :label="1">宽松</el-radio>
                                <el-radio :label="0">标准</el-radio>
                                <el-radio :label="2">严格</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="漏选扣分">
                            <el-input placeholder="漏选扣分分数" v-model="judgeRule.eachMiss"></el-input>
                        </el-form-item>
                        <el-form-item label="错选扣分">
                            <el-input placeholder="错选扣分分数" v-model="judgeRule.eachWrong"></el-input>
                        </el-form-item>
                    </el-form>
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="ruleInsert">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog
            title="该题判分规则"
            :visible.sync="ruleFormVisable"
            width="30%">
                <span>
                        <el-form :model="ruleForm" label-width="100px">
                            <el-form-item label="是否严格">
                                <el-radio-group v-model="ruleForm.isStrict" @change="test">
                                    <el-radio :label="1">宽松</el-radio>
                                    <el-radio :label="0">标准</el-radio>
                                    <el-radio :label="2">严格</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="漏选扣分">
                                <el-input placeholder="漏选扣分分数" v-model="ruleForm.eachMiss"></el-input>
                            </el-form-item>
                            <el-form-item label="错选扣分">
                                <el-input placeholder="错选扣分分数" v-model="ruleForm.eachWrong"></el-input>
                            </el-form-item>
                        </el-form>
                    </span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="ruleFormVisable = false">取 消</el-button>
                    <el-button type="primary" @click="submitEditItem">确 定</el-button>
                </span>
            </el-dialog>
  </el-main>
</el-container>
  
</template>

<script>
import axios from 'axios'
import {addSelectAnswer,getSelectAnswer,delSelectAnswer,updateSelectAnswer} from '../../../api/api.js'
  export default {
    methods: {
      deleteRow(index, rows) {
        if(this.isEdit){
            delSelectAnswer(rows[index].tSelectId).then(res=>{
                if(res.code==200){
                    this.$notify({
                            type: 'success',
                            message: '删除成功'
                        })
                }
            })
        }
        rows.splice(index, 1);
      },
      editRow(index,rows){
          if(rows[index].selectType==2){
              this.ruleForm.isStrict=rows[index].isStrict;
              this.ruleForm.eachMiss=rows[index].eachMiss;
              this.ruleForm.eachWrong=rows[index].eachWrong;
              this.ruleFormVisable=true;
          }
          this.editIndex=index;
      },
      submitEditItem(){
          this.tableData[this.editIndex].isStrict=this.ruleForm.isStrict;
          this.tableData[this.editIndex].eachMiss=this.ruleForm.eachMiss;
          this.tableData[this.editIndex].eachWrong=this.ruleForm.eachWrong;
          this.ruleFormVisable = false
          console.log(this.tableData[this.editIndex])
      },
      add_row(){
          this.tableData.push({
              selectNum: this.tableData.length+1,
              selectType: 1,
              selectAnswer: [],
              selectScore:this.form.score,
              selectBlockId: sessionStorage.getItem("selectBlockId"),
              selectTypeName:"单选"
          })
          this.checkList.push([])
      },
      submit(){
          let that=this;
          let request=[];
          let parm=JSON.parse(JSON.stringify(this.tableData));
        for(let i=0;i<parm.length;i++){
            delete parm[i].selectTypeName
            let array=parm[i].selectAnswer
            if(typeof array =="object"){
                parm[i].selectAnswer="";
                array.forEach(element => {
                    console.log(element)
                    switch(element){
                        case "选项 A":parm[i].selectAnswer+="a-";break;
                        case "选项 B":parm[i].selectAnswer+="b-";break;
                        case "选项 C":parm[i].selectAnswer+="c-";break;
                        case "选项 D":parm[i].selectAnswer+="d-";break;
                    }
                });
                parm[i].selectAnswer=parm[i].selectAnswer.substring(0,parm[i].selectAnswer.length-1)
            }
            
            
            if(that.isEdit){
                let tSelectId=parm[i].tSelectId;
                delete parm[i].tSelectId
                if(tSelectId){
                    request.push(updateSelectAnswer(parm[i],tSelectId).then(res=>{
                        if(res.code==200)
                        this.$notify({
                                    type: 'success',
                                    message: '更新成功'
                                })
                    }))
                }else{
                    parm[i].examId=sessionStorage.getItem('exam_small_id')
                    request.push(addSelectAnswer(parm[i]).then(res=>{
                    if(res.code==200)
                    this.$notify({
                                type: 'success',
                                message: '录入成功'
                            })
                    }))
                }
                
            }else{
                parm[i].examId=sessionStorage.getItem('exam_small_id')
                request.push(addSelectAnswer(parm[i]).then(res=>{
                if(res.code==200)
                this.$notify({
                            type: 'success',
                            message: '录入成功'
                        })
                }))
            }
            
        }
        axios.all(request);
      },
      check_answer(checkList){
          let length=checkList.length;
        //   let item=checkList.pop();
        //   checkList.push(item);
        console.log(checkList.length)
          if(checkList.length>1){
              console.log("多选")
              console.log(checkList)
              this.tableData[this.clickIndex].selectTypeName="多选";
              this.tableData[this.clickIndex].selectType=2
              this.tableData[this.clickIndex].isStrict=this.judgeRule.isStrict;
              this.tableData[this.clickIndex].eachMiss=this.judgeRule.eachMiss;
              this.tableData[this.clickIndex].eachWrong=this.judgeRule.eachWrong;
          }else{
              console.log("单选")
              console.log(checkList)
              this.tableData[this.clickIndex].selectTypeName="单选";
              this.tableData[this.clickIndex].selectType=1
          }
        //   for(let i=0;i<checkList.length;i++){
              this.tableData[this.clickIndex].selectAnswer=checkList
        //   }
          
        
        //this.tableData[this.clickIndex].selectAnswer=this.tableData[this.clickIndex].selectAnswer.substring(0,this.tableData[this.clickIndex].selectAnswer.length-1);
        console.log(this.tableData)
      },
      rowClick(rowData){
          this.clickIndex=Number(rowData.selectNum)-1
      },
      initSelect(){
          for(let i=0;i<this.form.number;i++){
              this.tempTableData.push({
                    selectNum: i+1,
                    selectType: 1,
                    selectAnswer: [],
                    selectScore:this.form.score,
                    selectBlockId: sessionStorage.getItem("selectBlockId"),
                    selectTypeName:"单选"
              })
              this.checkList.push([])
          }
          let that=this;
          this.dialogVisible = false
          this.answerInsert_dgVisible=true;//开始选择题录入
          document.onkeydown=function(e){
                if(e.keyCode==13){
                    that.answerInsert();
                }
            }
          this.answerForm.score=this.form.score;
      },
      //选择题录分规则
      ruleInsert(){
          let judgeRule=this.judgeRule;
          this.tableData.forEach(item=>{
              if(item.selectType==2){
                item.isStrict=judgeRule.isStrict;
                item.eachMiss=judgeRule.eachMiss;
                item.eachWrong=judgeRule.eachWrong;
              }else{
                item.isStrict=0;
                item.eachMiss=0;
                item.eachWrong=0;
              }
          })
          this.innerVisible = false
          console.log(this.tableData)
      },
      answerInsert(){//选择题答案录入谈话框回车键事件
            let answerList=[];
            for(let char of this.answerForm.answerList){
                answerList.push(this.replaceSuit(char))
            }
            this.tempTableData[this.InsertingIndex].selectAnswer=answerList;
            this.tempTableData[this.InsertingIndex].selectScore=this.answerForm.score;
            if(answerList.length>1){
                this.tempTableData[this.InsertingIndex].selectTypeName="多选"
                this.tempTableData[this.InsertingIndex].selectType=2
            }
            this.checkList[this.InsertingIndex]=answerList;
            this.answerInsert_dgVisible=false;
            this.tableData.push(this.tempTableData[this.InsertingIndex++])
            if(this.InsertingIndex<this.tempTableData.length){
                setTimeout(()=>{
                    this.answerInsert_dgVisible=true;
                    setTimeout(()=>{
                        $('.el-form input').eq(2)[0].focus();//自动聚焦
                        this.answerForm.score=this.form.score;
                    },100)
                },500);
            }else{
                this.tempTableData.forEach(item=>{
                    if(item.selectType==2){
                        this.isMultipleChoice=true;
                    }
                })
                if(this.isMultipleChoice){//有多选，开始录入多选规则
                    this.innerVisible=true;
                }
                document.onkeydown=null;
            }
            
            
      },
      replaceSuit(str){
          let result;
          let itemA="选项 A"
          let itemB="选项 B"
          let itemC="选项 C"
          let itemD="选项 D"
          switch(str){
              case "a":result=itemA;break;
              case "b":result=itemB;break;
              case "c":result=itemC;break;
              case "d":result=itemD;break;
          }
          return result;
      },
      reshow(){
          let that=this;
          let answerList=[];
          console.log(sessionStorage)
          getSelectAnswer(sessionStorage.getItem("selectBlockId")).then(res=>{
              if(res.data.msg.length){
                res.data.msg[0].templetSelectList.forEach(element=>{
                    that.tableData.push(element);
                })
                let array=res.data.msg[0].templetSelectList;
                that.dialogVisible=false;
                for(let i=0;i<array.length;i++){
                    answerList=[];//清空
                    if(that.tableData[i].selectType==1){
                        that.$set(that.tableData[i],"selectTypeName","单选")
                        that.checkList.push([that.replaceSuit(that.tableData[i].selectAnswer)])
                    }else{
                        that.$set(that.tableData[i],"selectTypeName","多选")
                        that.tableData[i].selectAnswer.split("-").forEach(element=>{
                            console.log(element)
                            answerList.push(that.replaceSuit(element))
                        })
                        that.judgeRule.isStrict=that.tableData[i].isStrict;
                        that.judgeRule.eachMiss=that.tableData[i].eachMiss;
                        that.judgeRule.eachWrong=that.tableData[i].eachWrong;
                        that.checkList.push(answerList)
                    }
                }
                that.isEdit=true;
              }
              
          })
      },
      test(value){
          console.log(value);
      },
      filterChar(){
          if(this.answerForm.answerList.length){
                let char = this.answerForm.answerList[this.answerForm.answerList.length-1];
                if(char<'a'||char>'d'){
                        this.answerForm.answerList=this.answerForm.answerList.substring(0,this.answerForm.answerList.length-1);
                }
            }
      }
    },
    data() {
      return {
        checkList: [],
        strictRadio:1,
        innerVisible:false,
        clickIndex:0,
        isMultipleChoice:false,//是否有多选题，有就弹出多选规则模态框
        dialogVisible:true,
        ruleForm:{
            //某一道题判分规则
            isStrict:0,
            eachMiss:0,
            eachWrong:0
        },
        ruleFormVisable:false,
        editIndex:0,
        form:{
            number:0,
            score:0
        },
        tableData: [],
        tempTableData:[],
        index:0,
        isEdit:false,
        answerForm:{
            answerList:'',
            score:0
        },
        InsertingIndex:0,//记录录入到第几题了
        answerInsert_dgVisible:false,
        judgeRule:{//所有题的判分规则
            isStrict:0,
            eachMiss:0,
            eachWrong:0
        }
      }
    },
    mounted(){
        let that=this;
        document.onkeydown=function(e){
            if(e.keyCode==13){
                that.initSelect();
            }
        }
        this.reshow();
        
    },
    
  }
</script>