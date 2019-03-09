<template>
  <section>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">

        <el-form-item>
          <el-button type="primary" @click="open_menu">菜单添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="open_edit_menu">修改选中菜单</el-button>

        </el-form-item>
        <el-form-item>
          <el-button @click="del_menu" type="danger">删除选中菜单</el-button>

        </el-form-item>


        <!--<span>菜单预览</span>-->
        <!--<el-cascader-->
        <!--:options="cir_menus"-->
        <!--v-model="selectedOptions"-->
        <!--expand-trigger="hover"-->


        <!--:props="props"-->
        <!--&gt;-->
        <!--</el-cascader>-->

        <!--<el-form-item>-->
        <!--<el-button type="success" ref="date_search">角色管理</el-button>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
        <!--<el-button type="warning">用户管理</el-button>-->
        <!--</el-form-item>-->

      </el-form>
    </el-col>
    <el-table highlight-current-row style="width: 0%;">
      <!--<el-table-column type="selection" width="55">-->
      <!--</el-table-column>-->
      <!--<el-table-column type="index" width="60">-->
      <!--</el-table-column>-->


      <!--<el-table-column prop="menuParentId" label="上级菜单" width="100"  sortable>-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="name" label="菜单名称" width="100"  sortable>-->
      <!--</el-table-column>-->

      <!--<el-table-column label="操作" width="150">-->
      <!--<template slot-scope="scope">-->
      <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
      <!--<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>-->
      <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
    <el-col :span="10">
      <el-tree
        :data="cir_menus"
        :props="defaultProps"
        ref="tree"
        node-key="menuId"
        default-expand-all
        check-strictly
        @node-click="check_select"
        :highlight-current="true"
      >
      </el-tree>
    </el-col>
    <el-col :span="14">
      <h4>{{ formTitle }}</h4>
      <el-form :model="edit_menu" label-width="80px" ref="edit_menu" :disabled="ifEdit">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="edit_menu.menuName" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="菜单url">
          <el-input v-model="edit_menu.menuUrl" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单path">
          <el-input v-model="edit_menu.path" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单备注">
          <el-input v-model="edit_menu.menuRemark" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标名称">
          <el-input v-model="edit_menu.iconCls" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单组件">
          <el-input v-model="edit_menu.component" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" v-show="!ifEdit">
        <el-button @click.native="cancelEdit" v-show="!display_menu">取消</el-button>
        <el-button type="primary" @click.native="sub_edit_menu" :loading="addLoading" v-show="!display_menu">提交修改
        </el-button>
        <el-button @click.native="display_menu = false" v-show="display_menu">取消</el-button>
        <el-button type="primary" @click.native="add_menu" :loading="addLoading" v-show="display_menu">提交新建</el-button>
      </div>
    </el-col>
    <!--添加-->
    <!--<el-dialog title="菜单添加" :close-on-click-modal="false">-->
    <!--<el-form :model="menuForm" label-width="80px" ref="menuForm">-->
    <!--<el-form-item label="菜单名称" prop="name">-->
    <!--<el-input v-model="menuForm.menuName" auto-complete="off"></el-input>-->
    <!--</el-form-item>-->

    <!--<el-form-item label="菜单url">-->
    <!--<el-input v-model="menuForm.menuUrl" auto-complete="off"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="菜单path">-->
    <!--<el-input v-model="menuForm.path" auto-complete="off"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="菜单备注">-->
    <!--<el-input v-model="menuForm.menuRemark" auto-complete="off"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="图标名称">-->
    <!--<el-input v-model="menuForm.iconCls" auto-complete="off"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="菜单组件">-->
    <!--<el-input v-model="menuForm.component" auto-complete="off"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="上级菜单">-->


    <!--<el-tree-->
    <!--:data="cir_menus"-->
    <!--show-checkbox-->


    <!--:props="defaultProps"-->
    <!--ref="add_tree"-->
    <!--node-key="menuId"-->
    <!--default-expand-all-->
    <!--check-strictly-->
    <!--@check-change="check_select"-->
    <!--&gt;-->
    <!--</el-tree>-->


    <!--</el-form-item>-->


    <!--</el-form>-->
    <!--<div slot="footer" class="dialog-footer">-->
    <!--<el-button @click.native="display_menu = false">取消</el-button>-->
    <!--<el-button type="primary" @click.native="add_menu" :loading="addLoading">提交</el-button>-->
    <!--</div>-->
    <!--</el-dialog>-->
    <!--编辑-->


  </section>

</template>

<script>
  import util from '../../../common/js/util'
  import NProgress from 'nprogress'
  import {
    get_cir_menu,
    add_system_menu,
    get_all_menu,
    get_menu_by_id,
    update_menu,
    del_menu_by_id
  } from '../../../api/api';
  import {js_date} from '../../../components/js_date/js_date'

  export default {
    name: "system_menu",
    data() {
      return {
        menuParentId: [],
        formTitle: '',
        ifEdit: true,
        listLoading: true,
        menuForm: {
          "menuName": "",
          "menuUrl": "",
          "menuRemark": "",
          "menuParentId": "",
          "iconCls": "",
          "component": "",
          "path": ""


        },
        all_menu: [],
        display_menu: false,
        display_edit_menu: false,
        addLoading: false,
        cir_menus: [],
        props: {
          value: "menuId",
          label: "name"
        },
        selectedOptions: [],
        menu_name: "",
        edit_menu: {
          "menuName": "",
          "menuUrl": "",
          "menuRemark": "",
          "menuParentId": "",
          "iconCls": "",
          "component": "",
          "path": ""


        },
        defaultProps: {
          children: 'children',
          label: 'name',

        },
        tmp_menu_id: ''


      }


    },
    methods: {
      cancelEdit() {
        this.ifEdit = true;
        this.formTitle = '';

      },
      add_menu() {
        console.log(this.menuParentId);
        this.addLoading = true;
        this.edit_menu.menuParentId = this.menuParentId[0];
        add_system_menu(this.edit_menu).then((res) => {
          console.log(res);
          this.addLoading = false;
          this.$message({
            message: '添加成功',
            type: 'success'
          });
          this.edit_menu = {
            "menuName": "",
            "menuUrl": "",
            "menuRemark": "",
            "menuParentId": "",
            "iconCls": "",
            "component": "",
            "path": ""
          };
          console.log(this.edit_menu);
          this.display_menu = false;
          this.ifEdit = true;
          this.cir_menus = [];
          this.get_cir_menu();
        })
      },
      get_all_menus() {

        get_all_menu().then((res) => {
          this.all_menu = res.data.msg;
          console.log(this.all_menu);
          for (let i  in  this.all_menu) {
            if (this.all_menu[i].menuParentId != undefined && this.all_menu[i].menuParentId != "") {
              get_menu_by_id(this.all_menu[i].menuParentId).then((res) => {
                let name = "";

                name = res.data.msg.name;
                this.all_menu[i].menuParentId = name + '/';

                this.$set(this.all_menu, i, this.all_menu[i]);


                // return name;

              })


            }


          }
          this.listLoading = false;


        })

      },
      get_menu_by_id(id) {
        let name = "";

        get_menu_by_id(id).then((res) => {

          name = res.data.msg.name;
          this.menu_name = name;

          // return name;

        })

      },
      get_cir_menu() {
        get_cir_menu().then((res) => {
          this.cir_menus = res;


        })
      },
      open_menu() {
        this.formTitle = '添加表单';
        this.ifEdit = false;
        this.display_menu = true;
        console.log(this.display_menu);
        this.edit_menu = {
          "menuName": "",
          "menuUrl": "",
          "menuRemark": "",
          "menuParentId": "",
          "iconCls": "",
          "component": "",
          "path": ""

        }
        console.log(this.menuParentId)
        // this.get_all_menus();
      },
      open_edit_menu() {
        this.ifEdit = false;
        this.display_menu = false;
        this.formTitle = '修改表单';
      },
      sub_edit_menu() {
        this.ifEdit = true;
        this.addLoading = true;
        update_menu(this.menuParentId[0], this.edit_menu).then((res) => {
          this.$message({
            message: '更新成功',
            type: 'success'
          });
          this.addLoading = false;
          this.display_edit_menu = false;
          this.get_cir_menu();


        })


      },

      handleEdit(index, row) {
        this.display_edit_menu = true;
        console.log(row);
        this.edit_menu.menuName = row.name;
        this.edit_menu.menuUrl = row.path;
        this.edit_menu.iconCls = row.iconCls;
        this.edit_menu.menuRemark = row.menuRemark;


      },
      del_menu() {
        this.ifEdit = true;
          this.$confirm('确认删除该记录吗?', '提示', {
            type: 'warning'
          }).then(() => {

            del_menu_by_id(this.menuParentId).then((res) => {
              if(res.code == "200"){
                this.$message({
                message: '删除成功',
                type: 'success'
              });

              }
              
              this.get_cir_menu();
              this.edit_menu = {
                "menuName": "",
                "menuUrl": "",
                "menuRemark": "",
                "menuParentId": "",
                "iconCls": "",
                "component": "",
                "path": ""

              };

            });


          })

      },
      getCheckedKeys() {
        console.log(this.$refs.tree.getCheckedKeys());
      },
      check_select(data) {
        console.log(data);
        this.menuParentId = [];
        if (this.display_menu == true) {
          this.edit_menu.menuParentId = data.menuId;
          this.menuParentId.push(data.menuId);
          console.log(this.menuParentId)
        }
        else {
          this.menuParentId.push(data.menuId);
          if (data.children) {
            for (let item of data.children) {
              this.menuParentId.push(item.menuId)
            }
          }
          console.log(this.menuParentId);
          get_menu_by_id(data.menuId).then((res) => {
            this.edit_menu = {
              "menuName": res.data.msg.name,
              "menuUrl": res.data.msg.menuUrl,
              "menuRemark": res.data.msg.menuRemark,
              "menuParentId": res.data.msg.menuParentId,
              "iconCls": res.data.msg.iconCls,
              "component": res.data.msg.component,
              "path": res.data.msg.path

            }
            // this.display_edit_menu = true;
          });
        }
      }

    },
    mounted() {
      // this.get_all_menus();
      this.get_cir_menu();


    }
  }
</script>

<style scoped>
  .dialog-footer {
    float: right;
  }
</style>
