<template>
    <div class="check-stadio">
                    <el-dropdown split-button type="primary" size="small">
                        请选择批阅块
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>黄金糕</el-dropdown-item>
                            <el-dropdown-item>狮子头</el-dropdown-item>
                            <el-dropdown-item>螺蛳粉</el-dropdown-item>
                            <el-dropdown-item>双皮奶</el-dropdown-item>
                            <el-dropdown-item>蚵仔煎</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <div class="stdio-paper" v-if="haveCheckData">
                        标杆卷
                    </div>
                    <div class="not-have-paper" v-else>
                        本次考试暂时无标杆卷
                    </div>
                </div>
</template>
<script>
export default {
    data(){
        return {
            haveCheckData: false,
        }
    }
}
</script>
<style scoped>

</style>

