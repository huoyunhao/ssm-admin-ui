<template>
    <el-container class="exam_reading" v-loading="page_loading">
        <el-aside width="92px" style="background-color:#e5e5e5;padding-top: 40px"
                  :style="fullHeight" ref="button_main">

            <el-button icon="el-icon-arrow-up" circle @click="go_to_next(1)" size="mini" type="primary"
                       style="margin-left: 28px;margin-bottom: 10px"></el-button>
            <button :class="{'el-button--info': item.state === '0', 'el-button--primary': item.state === '1', 'el-button--success': item.state === '2', }"
                    class="el-button el-button--small is-round"
                    style="margin-bottom: 8px;margin-left: 10px;width: 67.016px"
                    v-for="(item,index) in paper_list" :key="index" @click="button_display_cutting(item,index)"
                    :ref="'button_'+index"


            >{{item.num}} / {{item.score}}
            </button>
            <el-button icon="el-icon-arrow-down" circle @click="go_to_next(2)" size="mini" type="primary"
                       style="margin-left: 28px"></el-button>
        </el-aside>


        <el-container>
            <el-header style="background-color:#515b65;line-height: 40px;min-width: 940px;height: 40px"  ref="page_head">


                <el-row :span="24">
                    <el-col :span="22">
                        <el-button size="small" round icon="el-icon-setting" type="info">设置</el-button>
                        <el-button size="small" round icon="el-icon-document" @click="create_evaluate_table"
                                   type="info">评阅质量
                        </el-button>
                        <el-button size="small" round icon="el-icon-d-arrow-left" type="info" @click="view_back(1)">回评
                        </el-button>
                        <!--<el-button  size="small" round icon="el-icon-edit-outline" type="info" @click="start_serh">复查</el-button>-->
                        <el-popover
                                placement="bottom"
                                width="100%"
                                trigger="click"

                                popper-class="re_ser">
                            <el-row :span="24" style="padding-top: 20px">
                                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                                    <el-form-item label="阅卷老师" >
                                        <el-select v-model="search_form.userId" placeholder="选择老师">
                                            <el-option  :label="user_name" :value="add_data.userPermId"></el-option>

                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="试卷类型" >
                                        <el-select v-model="search_form.paperType" placeholder="选择类型">
                                            <el-option :label="item.remark" :value="item.dicValue" v-for="item in this.paper_type" :key="item.dicValue"></el-option>

                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="异常类型" >
                                        <el-select v-model="search_form.exceptionStatus" placeholder="选择类型">
                                            <el-option :label="item.remark" :value="item.dicValue" v-for="item in this.exc_paper" :key="item.dicValue"></el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item label="分数范围" >
                                        <el-input-number v-model="search_form.scoreMin"  :min="0" :max="Number(add_data.score)" label="最低分"></el-input-number>
                                    </el-form-item>
                                    <el-form-item label="~~" >
                                        <el-input-number v-model="search_form.scoreMax"  :min="0" :max="Number(add_data.score)" label="最高分"></el-input-number>

                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click="sub_serh">查询</el-button>
                                        <el-button type="danger" @click="exit_serh">退出复查</el-button>
                                    </el-form-item>

                                </el-form>


                            </el-row>
                            <el-button size="small" round icon="el-icon-edit-outline" type="info" slot="reference" @click="start_serh">复查</el-button>
                        </el-popover>

                        <el-progress :percentage="progress.percent" :stroke-width="18" :text-inside="true"
                                     style="min-width:30%;display: inline-block;padding-right: 0px;"></el-progress>
                        <span style="color: white">总完成量：{{progress.judgedNum}}；未完成量：{{progress.notJudged}}；总量：{{total}}；
                        当前包：{{pageNum}}；总包数：{{pages}}

                        </span></el-col>
                    <el-col :span="2">
                        <el-button @click="outView" size="small" round type="danger" class="exit">退出当前评阅</el-button>
                    </el-col>


                </el-row>
                <!--复查-->



            </el-header>
            <el-main style="background-color: #91999e;text-align: center;padding-left: 0px;padding-right: 0px;padding-top: 45px"
                     :style="fullHeight" v-loading="img_loading" ref="img_main" id="img_main1">


                <div class="crop">

                    <div id="img1" @mouseenter ="draw_paper(1)" >
                        <template v-for="(item,inde) in score_points[0]">
                            <input :data-id="item.pointId" :style="get_point_pos(item,0)" style="height: 40px;width: 50px;border-color: red;font-size: 22px;
                            color: red;font-weight: bold;
                            background-color: #f56c6c30;"
                                   :data-x="'0'"
                                   :data-y="inde"
                            v-model="item.pointType"
                                   :placeholder="item.echoPointScore"
                                   @click="click_view(0,inde)"
                                   onkeyup="value=value.replace(/[^\d\.]/g, '')"
                            />
                            <div :class="return_class(item,inde)"
                                 :style="get_ico_pos(item,0)" style="height:40px;width: 50px"
                                 :data-id = "item.pointType" :data-ids="item.echoPointScore"
                            ></div>


                        </template>

                        <img id="img_paper_0" src="" ref="img1"><br/>
                    </div>
                    <div id="img2" @mouseenter="draw_paper(2)" >
                        <template v-for="(item,inde) in score_points[1]">
                            <input :data-id="item.pointId" :style="get_point_pos(item,1)" style="height: 40px;width: 50px;border-color: red;font-size: 20px;
                            color: red;font-weight: bold;
                            background-color: #f56c6c30;"
                                   :data-x="'1'"
                                   :data-y="inde"
                                   v-model="item.pointType"
                                   :placeholder="item.echoPointScore"
                                   @click="click_view(1,inde)"
                                   onkeyup="value=value.replace(/[^\d\.]/g, '')"
                            />
                            <div :class="return_class(item,inde)"
                                 :style="get_ico_pos(item,1)" style="height:40px;width: 50px"
                                 :data-id = "item.pointType" :data-ids="item.echoPointScore"
                            ></div>


                        </template>
                        <img id="img_paper_1" src=""><br/>
                    </div>
                    <div id = "img3" @mouseenter="draw_paper(3)" >
                        <template v-for="(item,inde) in score_points[2]">
                            <input :data-id="item.pointId" :key="inde" :style="get_point_pos(item,2)" style="height: 40px;width: 50px;border-color: red;font-size: 20px;
                            color: red;font-weight: bold;
                            background-color: #f56c6c30;"
                                   :data-x="'2'"
                                   :data-y="inde"
                                   v-model="item.pointType"
                                   :placeholder="item.echoPointScore"
                                   @click="click_view(2,inde)"
                                   onkeyup="value=value.replace(/[^\d\.]/g, '')"
                            />
                            <div :class="return_class(item,inde)"
                                 :key="inde"
                                 :style="get_ico_pos(item,2)" style="height:40px;width: 50px"
                                 :data-id = "item.pointType" :data-ids="item.echoPointScore"
                            ></div>


                        </template>
                        <img id="img_paper_2" src="">
                    </div>





                </div>


                <!-- -->
                <!--<div v-loading="show"><img :src="img_url" width="100%"  /></div>-->


                <div id="drag" v-drag>
                    <el-button-group>
                        <!--<el-input v-model="score" class="exam_name" @keyup.enter.native="sub"></el-input>-->
                        <!--<el-button type="primary" size="small" @click="sub">提交</el-button>-->
                    </el-button-group>
                    <div class="drag-title">打分板</div>
                    <div class="drag-input">

                        <input
                                v-if="score_points.length > 0"
                                v-model="score_points[point_x][point_y].pointType"
                               id="score_input" type="text"
                               onkeyup="value=value.replace(/[^\d\.]/g, '')" placeholder="请打分">
                        <!--<button type="primary" size="small" id="readuceScore">后退</button>-->
                    </div>
                    <div class="drag-handle">
                        <el-row>
                            <button class="drag-grade-num">1</button>
                            <button class="drag-grade-num">2</button>
                            <button class="drag-grade-num">3</button>
                            <button class="right-modal" @click="set_answer(1)">优秀答案</button>
                        </el-row>
                        <el-row>
                            <button class="drag-grade-num">4</button>
                            <button class="drag-grade-num">5</button>
                            <button class="drag-grade-num">6</button>
                            <button class="error-modal" @click="set_answer(0)">典型错误</button>
                        </el-row>
                        <el-row>
                            <button class="drag-grade-num">7</button>
                            <button class="drag-grade-num">8</button>
                            <button class="drag-grade-num">9</button>
                            <button class="drag-grade-error" disabled="disabled">0×</button>
                        </el-row>
                        <el-row>
                            <button class="drag-grade-num">0</button>
                            <button class="drag-grade-num">.5</button>
                            <button class="drag-grade-right" disabled="disabled">{{this.add_data.score}}√</button>
                            <button class="drag-sure" @click="printScore">打分</button>
                        </el-row>
                    </div>
                    <div class="cur-score">当前分数：<span>{{boardStrScore?boardStrScore:0}}</span></div>
                </div>


            </el-main>
            <el-footer style="background-color: #3a4b5f;line-height: 40px" height="40px">
                <!--<el-button size="small" round icon="el-icon-document" type="info" @click="set_problrm">标记为问题卷-->
                <!--</el-button>-->
                <el-popover
                        placement="top"
                        width="160"
                        v-model="view_problem_type">
                    <div>
                        <el-radio-group v-model="paper_problem"
                                        size="mini">
                            <el-radio :label="'20004'" border>打回卷</el-radio>
                            <br/>
                            <el-radio :label="'20003'" border>雷同卷</el-radio>
                            <br/>
                            <el-radio :label="'20001'" border>试卷损坏</el-radio>
                            <br/>
                            <el-radio :label="'20002'" border>疑难试卷</el-radio>
                            <br/>


                        </el-radio-group>


                    </div>
                    <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="view_problem_type = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="view_problem_type = false">确定</el-button>
                    </div>
                    <el-button slot="reference" size="small" round icon="el-icon-document" type="info" @click="set_problrm">标记为问题卷</el-button>
                </el-popover>
                <!--<el-button size="small" round icon="el-icon-document" type="info" @click="draw = true,st_draw = false">标注</el-button>-->
                <el-popover
                        placement="top"
                        width="100"
                        v-model="draw">
                    <el-radio-group v-model="draw_type"
                                    size="mini">
                        <el-radio :label="'50001'" border>直线</el-radio>
                        <br/>
                        <el-radio :label="'50002'" border>虚线</el-radio>
                        <br/>
                        <el-radio :label="'0'" border>鼠标</el-radio>




                    </el-radio-group>
                    <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="draw = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="start_draw">确定</el-button>
                    </div>
                    <el-button  size="small" round icon="el-icon-document" type="info" @click="draw = true,st_draw = false" slot="reference">标注</el-button>
                </el-popover>

                <el-button size="small" round icon="el-icon-document" type="info" @click="reset_draws">重置标注</el-button>
                <el-button size="small" round icon="el-icon-document" type="info" @click="output_draws_r">提交标注</el-button>
                <!--<el-button size="small" round icon="el-icon-document" type="info" @click="dialogVisible = true">给分方式-->
                <!--</el-button>-->
                <el-popover
                        placement="top"
                        width="100"
                        v-model="view_mode">
                    <el-radio-group v-model="mode_val"
                                    size="mini">
                        <el-radio :label="'0'" border>纯键盘打分模式</el-radio>
                        <br/>
                        <el-radio :label="'1'" border>鼠标打分模式</el-radio>
                        <br/>





                    </el-radio-group>
                    <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="view_mode = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="change_mode">确定</el-button>
                    </div>
                    <el-button  size="small" round icon="el-icon-document" type="info"  slot="reference">打分模式切换</el-button>
                </el-popover>
                <span style="color: wheat">问题卷类型：{{t_paper_problem}}；典型错误：{{t_bad_answer}}；优秀答案：{{t_good_answer}}</span>
                <el-slider v-model="img_size"
                           :format-tooltip="formatTooltip"
                           :max="200"
                           style="float: right; width: 300px"
                           :step="5"
                           show-stops
                           label="图片大小"
                >

                </el-slider>
            </el-footer>
        </el-container>




        <el-dialog
                title="给分方式"
                :visible.sync="dialogVisible"
                width="15%"
                v-dialogDrag>
            <!-- nzq 这里报错了 -->
            <!--:before-close="handleClose"-->
            <div>
                <el-radio-group v-model="radio2"
                                size="mini">
                    <el-radio :label="3" border>系统默认型</el-radio>
                    <br/>
                    <el-radio :label="6" border>直接给分板</el-radio>
                    <br/>
                    <el-radio :label="9" border>数字小键盘</el-radio>
                    <br/>
                    <el-radio :label="12" border>累计扣分型</el-radio>
                    <br/>
                    <el-radio :label="14" border>累计加分型</el-radio>

                </el-radio-group>


            </div>

            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!--<el-dialog-->
                <!--title="问题卷类型"-->
                <!--:visible.sync="view_problem_type"-->
                <!--width="15%"-->
                <!--v-dialogDrag>-->

            <!--<div>-->
                <!--<el-radio-group v-model="paper_problem"-->
                                <!--size="mini">-->
                    <!--<el-radio :label="'20004'" border>打回卷</el-radio>-->
                    <!--<br/>-->
                    <!--<el-radio :label="'20003'" border>雷同卷</el-radio>-->
                    <!--<br/>-->
                    <!--<el-radio :label="'20001'" border>试卷损坏</el-radio>-->
                    <!--<br/>-->
                    <!--<el-radio :label="'20002'" border>疑难试卷</el-radio>-->
                    <!--<br/>-->


                <!--</el-radio-group>-->


            <!--</div>-->

            <!--<span slot="footer" class="dialog-footer">-->
              <!--<el-button @click="view_problem_type = false">取 消</el-button>-->
              <!--<el-button type="primary" @click="view_problem_type = false">确 定</el-button>-->
            <!--</span>-->
        <!--</el-dialog>-->

        <!--阅卷质量-->
        <el-dialog :visible.sync="evaluateVisible" :close-on-click-modal="false" width="80%">
            <div class="evaluate-table-average">
                <p>&nbsp;评阅平均分:&nbsp;<span>{{reading_quality.avg}}</span>&nbsp;分</p>
            </div>
            <div ref="evaluateTable" class="evaluate-table" id="echart_table"></div>
        </el-dialog>
        <!--回评-->
        <el-dialog :visible.sync="backVisible" :close-on-click-modal="false" title="回评">

            <div>
                <el-table
                        :data="backs"
                        style="width: 100%">
                    <el-table-column
                            label="包序号"
                            width="180" prop="pakege">

                    </el-table-column>
                    <el-table-column
                            label="开始时间"
                            width="180">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 10px">{{ scope.row.startDate }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="结束时间"
                            width="180">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 10px">{{ scope.row.endDate }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    @click="get_papers(scope.row.pakege),backVisible = false">回评
                            </el-button>

                        </template>
                    </el-table-column>
                </el-table>
            </div>


            <!--<div style="display: block;width: 100%">-->
                <!--<el-pagination layout="total,  prev, pager, next, jumper" @current-change="handleCurrentChange"-->
                               <!--:page-size="back_page_info.pageSize"-->
                               <!--:total="back_page_info.total"-->
                               <!--:current-page="back_page_info.pageNum">-->
                <!--</el-pagination>-->
            <!--</div>-->


        </el-dialog>
        <!--标注-->
        <!--<el-dialog :visible.sync="draw" :close-on-click-modal="false" >-->
            <!--<el-radio-group v-model="draw_type"-->
                            <!--size="mini">-->
                <!--<el-radio :label="'50001'" >直线</el-radio>-->

                <!--<el-radio :label="'50002'" >虚线</el-radio>-->

                <!--<el-radio :label="'0'" >鼠标</el-radio>-->




            <!--</el-radio-group>-->
            <!--<span slot="footer" class="dialog-footer">-->
              <!--<el-button @click="draw = false">取 消</el-button>-->
              <!--<el-button type="primary" @click="start_draw">确 定</el-button>-->
            <!--</span>-->
        <!--</el-dialog>-->


    </el-container>
</template>

<script src="./reading_exam.js">

</script>

<style scoped>
    @import 'reading_exam.css';
    .re_ser{
        background-color: #5e7382 !important;
    }
</style>
