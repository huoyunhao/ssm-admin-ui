<template>
  <div class="reading">
    <el-container>
      <el-header><h3 align="center">试题列表</h3></el-header>
      <el-main>
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="试题一" name="1" class="item">
            <div><img src="../../../static/img/timg.jpg"/></div>
            <div>
              <el-input v-model="input" placeholder="请输入分数" class="input_f" style="width: 120px;margin-top: 15px"></el-input>
              <el-button type="primary"  @click="submit">提交分数</el-button>


            </div>
          </el-collapse-item>
          <el-collapse-item title="试题二" name="2" class="item">
            <div><img src="../../../static/img/timg.jpg"/></div>
            <div>
              <el-input v-model="input" placeholder="请输入分数" class="input_f" style="width: 120px;margin-top: 15px"></el-input>
              <el-button type="primary" @click="submit">提交分数</el-button>


            </div>
          </el-collapse-item>
          <el-collapse-item title="试题三" name="3" class="item">
            <div><img src="../../../static/img/timg.jpg"/></div>
            <div>
              <el-input v-model="input" placeholder="请输入分数" class="input_f" style="width: 120px;margin-top: 15px"></el-input>
              <el-button type="primary"  @click="submit">提交分数</el-button>


            </div>
          </el-collapse-item>
          <el-collapse-item title="试题四" name="4" class="item">
            <div><img src="../../../static/img/timg.jpg"/></div>
            <div>
              <el-input v-model="input" placeholder="请输入分数" class="input_f" style="width: 120px;margin-top: 15px"></el-input>
              <el-button type="primary"  @click="submit">提交分数</el-button>


            </div>
          </el-collapse-item>
        </el-collapse>




      </el-main>
    </el-container>


  </div>
</template>

<script>
  export default {
    name: "read_item",
    data() {
      return {
        activeNames: ['1'],
        input:''
      };
    },
    methods: {
      handleChange(val) {
        console.log(val);
      },
      submit(){
        this.$message({
          message: '提交成功',
          type: 'success'
        });

      }
    }
  }
</script>

<style scoped>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .item div:first-child{
    width: 100%;
    border-bottom: gainsboro 1px;
    border-bottom-style: inset;
  }
  .item div img{
    width: 100%;
  }
  .el-input__inner{
    width: 120px !important;
  }
</style>
