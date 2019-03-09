<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="学校信息"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="schools" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
              style="width: 100%;">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="60">
      </el-table-column>
      <!--<el-table-column prop="id" label="id" width="220" sortable>-->
      <!--</el-table-column>-->
      <el-table-column prop="companyNum" label="学校编号" width="240" sortable>
      </el-table-column>
      <el-table-column prop="companyName" label="学校名称" width="240" sortable>
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="240" sortable>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="240" sortable>
      </el-table-column>
      <!--<el-table-column prop="grade_name" label="所属年级" width="100"  sortable>-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="school_name" label="所属学校" width="120"  sortable>-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="age" label="年龄" width="100" sortable>-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="birth" label="生日" width="120" sortable>-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="addr" label="地址" min-width="180" sortable>-->
      <!--</el-table-column>-->
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20"
                     :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" ref="editForm">
        <el-form-item label="学校名称" prop="name">
          <el-input v-model="editForm.companyName" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="学校编号">
          <el-input v-model="editForm.companyNum" auto-complete="off"></el-input>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="180px" ref="addForm">
        <el-form-item label="学校（教育局）名称" prop="name">
          <el-input v-model="addForm.companyName" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="学校（教育局）编号">
          <el-input v-model="addForm.companyNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addForm.remark" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属教育局">
          <el-select v-model="addForm.parentId" placeholder="请选择教育局">
            <el-option
              v-for="item in user_companys"
              :key="item.companyId"
              :label="item.companyName"
              :value="item.companyId">
            </el-option>
          </el-select>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import util from '../../common/js/util'
  import NProgress from 'nprogress'
  import {
    get_company,
    dec_company,
    companys,
    add_company,
    edit_company,
    batch_company,
    get_company_by_user,
    get_company_by_id
  } from '../../api/api';

  export default {
    data() {
      return {
        grade_name: '',
        grade_companyId: '',
        filters: {
          name: ''
        },
        grades:
          [
            {
              name: '20302',
              time: '2018'
            }
          ],
        total: 0,
        page: 1,
        listLoading: false,
        sels: [],//列表选中列
        companyId: '',
        //学校列表
        companys: [],
        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ]
        },
        //编辑界面数据
        editForm: {},

        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ]
        },
        //新增界面数据
        addForm: {
          "companyId": "",
          "companyName": "",
          "parentId": "",
          "createTime": "",
          "remark": "",
          "companyNum": ""
        },
        schools: [],
        user_companys: []

      }
    },
    methods: {
      //性别显示转换
      formatSex: function (row, column) {
        return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
      },
      handleCurrentChange(val) {
        this.page = val;
        // this.getGrades();
      },
      //获取学校列表
      getSchools() {

        this.listLoading = true;
        NProgress.start();
        get_company_by_id(sessionStorage.getItem("school_id")).then((res) => {
          // 	this.total = res.data.total;
          console.log(res);
          this.schools = res.data.msg;
          this.listLoading = false;
          NProgress.done();
        });
      },
      //删除
      handleDel: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();

          // let para = {
          //     "companyId": row.companyId
          //
          // };
          //   console.log(para);
          dec_company(row.companyId).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getSchools();
          });
        }).catch(() => {

        });
      },
      //显示编辑界面
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        console.log(row);
        this.editForm = row;
      },
      //显示新增界面
      handleAdd: function () {

        this.addFormVisible = true;

        this.addForm = {
          "companyId": "",
          "companyName": "",
          "parentId": "",
          "createTime": "",
          "remark": "",
          "companyNum": ""
        };
      },
      //编辑
      editSubmit: function () {


        this.$confirm('确认提交吗？', '提示', {}).then(() => {
          this.editLoading = true;
          //NProgress.start();
          let para = {
            "companyId": this.editForm.companyId,
            "companyName": this.editForm.companyName,
            "parentId": this.editForm.parentId,
            "createTime": this.editForm.createTime,
            "remark": this.editForm.remark,
            "companyNum": this.editForm.companyNum
          }
          // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
          edit_company(para).then((res) => {
            this.editLoading = false;
            //NProgress.done();
            this.$message({
              message: '提交成功',
              type: 'success'
            });
            this.$refs['editForm'].resetFields();
            this.editFormVisible = false;
            this.getSchools();
          });
        });


      },
      //新增
      addSubmit: function () {


        this.$confirm('确认提交吗？', '提示', {}).then(() => {
          this.addLoading = true;
          //NProgress.start();
          let para = this.addForm;
          // para.parentId = sessionStorage.getItem('school_id');
          var myDate = new Date();
          para.createTime = "";
          // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
          add_company(para).then((res) => {
            if (res.code == "200") {
              this.addLoading = false;
              //NProgress.done();
              this.$message({
                message: '提交成功',
                type: 'success'
              });
              this.$refs['addForm'].resetFields();
              this.addFormVisible = false;
              this.getSchools();
            } else {
              this.$message({
                message: '提交失败',
                type: 'warning'
              });
              this.addLoading = false;
              this.$refs['addForm'].resetFields();
              this.addFormVisible = false;
              this.getSchools();
            }
            // console.log(res);

          });
        });


      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      //批量删除
      batchRemove: function () {
        var ids = this.sels.map(item => item.companyId);
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = {ids: ids};
          batch_company(para).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getSchools();
          });
        }).catch(() => {

        });
      }
    },
    mounted() {
      get_company_by_user().then((res) => {
        this.user_companys = res.data.msg;

      })

      this.getSchools();
    }
  }

</script>

<style scoped="scoped">

</style>
