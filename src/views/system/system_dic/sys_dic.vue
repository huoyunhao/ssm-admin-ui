<template>
  <section>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">

        <el-form-item>
          <el-button type="primary" @click="open_menu">字典添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="open_edit_dic">修改选中字典</el-button>

        </el-form-item>
        <el-form-item>
          <el-button @click="del_menu" type="danger">删除选中字典</el-button>

        </el-form-item>


      </el-form>
    </el-col>

    <el-col :span="10">
      <el-tree
        :highlight-current="true"
        :data="all_dic"
        :props="defaultProps"
        ref="tree"
        node-key="dictionaryId"
        default-expand-all
        check-strictly
        @node-click="check_select"
      >
      </el-tree>
    </el-col>
    <el-col :span="14">
      <el-form :model="edit_form" label-width="80px" ref="menuForm" :disabled="!ifEdit">
        <el-form-item label="字典值" prop="name">
          <el-input v-model="edit_form.dicValue" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="字典编号">
          <el-input v-model="edit_form.dicNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="字典备注">
          <el-input v-model="edit_form.remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" v-show="ifEdit">
        <el-button @click.native="display_dic = false" v-show="!ifAdd">取消</el-button>
        <el-button type="primary" @click.native="sub_edit_dic" :loading="addLoading" v-show="!ifAdd">提交编辑</el-button>
        <el-button @click.native="display_dic = false" v-show="ifAdd">取消</el-button>
        <el-button type="primary" @click.native="add_dic" :loading="addLoading" v-show="ifAdd">提交新建</el-button>
      </div>
    </el-col>
  </section>

</template>

<script>
  import util from '../../../common/js/util'
  import NProgress from 'nprogress'
  import {get_sys_dics, add_sys_dic, del_sys_dic, update_sys_dic, get_sys_dic_by_id} from '../../../api/api';
  import {js_date} from '../../../components/js_date/js_date'

  export default {
    name: "system_menu",
    data() {
      return {
        ifEdit: false,
        listLoading: true,

        display_dic: false,
        display_edit_dic: false,
        addLoading: false,


        selectedOptions: [],

        edit_dic: {
          "dicValue": "",
          "parentId": "",
          "dicNum": "",
          "remark": ""


        },
        defaultProps: {
          children: 'childrenList',
          label: `remark`,

        },


        // ------------
        tmp_dic_id: '',
        add_form: {

          "dicValue": "",
          "parentId": "",
          "dicNum": "",
          "remark": ""

        },
        edit_form: {
          "dicValue": "",
          "parentId": "",
          "dicNum": "",
          "remark": ""
        },
        all_dic: [],
        ifAdd: false
      }


    },
    methods: {
      check_select(data) {
        console.log(data);
        this.tmp_dic_id = data.dictionaryId;
        this.edit_form = {
          "dicValue": data.dicValue,
          "dicNum": data.dicNum,
          "remark": data.remark,
          "parentId": data.parentId
        };
        console.log(this.edit_form);
      },
      add_dic() {
        this.ifEdit = false;
        this.addLoading = true;
        add_sys_dic(this.edit_form).then((res) => {
          console.log(res);
          this.addLoading = false;
          this.$notify({
            title: '添加成功',
            type: 'success'
          });
          this.edit_form = {
            "dicValue": "",
            "dicNum": "",
            "remark": ""

          };
          this.view_sys_dic();
        })
      },


      open_menu() {
        this.ifEdit = true;
        this.ifAdd = true;
        this.edit_form = {
          "dicValue": "",
          "dicNum": "",
          "remark": "",
          "parentId": this.tmp_dic_id
        }
        // this.get_all_menus();
      },
      open_edit_dic() {
        this.ifEdit = true;
        this.ifAdd = false;

      },
      sub_edit_dic() {
        this.addLoading = true;
        update_sys_dic(this.tmp_dic_id, this.edit_form).then((res) => {
          console.log(res);
          this.$notify({
            title: '更新成功',
            type: 'success'
          });
          this.addLoading = false;
          this.view_sys_dic();
        })
      },

      del_menu() {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          del_sys_dic(this.tmp_dic_id).then((res) => {
            this.$notify({
              title: '删除成功',
              type: 'success'
            });
            this.view_sys_dic();
            this.ifEdit = false;
            this.ifAdd = false;
          });
        })
      },


      view_sys_dic() {
        get_sys_dics(sessionStorage.getItem('exam_small_id')).then((res) => {
          console.log(res);
          this.all_dic = res.data.msg;
          this.for_array(this.all_dic);
          // for(let i in )
        })


      },
      for_array(dictree) {
        for (let i in dictree) {
          dictree[i].dicValue = `${dictree[i].dicValue}(${dictree[i].remark})`;
          if (dictree[i].childrenList.length > 0) {
            // return arguments.callee(dictree[i].childrenList);
            this.for_array(dictree[i].childrenList);
          }
        }
      }
    },
    mounted() {
      this.view_sys_dic();
    }
  }
</script>

<style scoped>

</style>
