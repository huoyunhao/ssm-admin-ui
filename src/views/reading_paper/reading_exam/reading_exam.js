import {
    add_paper_score,
    get_reading_standard,
    get_reading_papers,
    get_reading_progress,
    get_reading_quality,
    get_back_view,
    add_label, get_labels,
    get_papertype, get_excepapertype, ser_paper,
    get_perm_user,
    get_postition//上次批阅到的位置

} from '../../../api/api'
import axios from 'axios';
import {coordinate} from '../../../components/coordinate'
import echarts from 'echarts'
import {cutingPic} from '../../../components/cutingPic'
import {get_paper_list, get_add_data} from '../../../components/read_exam_tools/data_processing'

export default {
    name: "reading_exam",
    data() {
        return {
            fullHeight: "height : " + document.documentElement.clientHeight + "px",
            mainheight: "height : " + document.documentElement.clientHeight - 80 + "px",

            header: {},

            /*---------------阅卷提交需要的信息（核心）-----------------*/
            index: 0,//当前试卷序号
            fragment: [],//切块数组id
            // 公共信息
            add_data: {
                cutingMergeId: '',
                examId: '',
                tStuFragmentId: '',
                userPermId: '',
                score: ''

            },
            paper_list: [],
            points: [],//切割点数组

            // 知识点
            score_points: [],//知识点标准数组并记录分数
            un_point_num: 0,//当前批阅知识点序号
            max_point_num: 0,
            pointsId: [],
            point_x: 0,//当前选择的知识点一维
            point_y: 0,

            /*-------------------------------------------------*/

            // 给分方式
            radio2: '',
            dialogVisible: false,


            // nzq -- 字符串记录打分板的情况
            boardStrScore: 0,//当前得分
            curScore: "",
            board_score: "",
            // nzq -- 评阅质量
            evaluateVisible: false,
            // nzq -- 进度条


            // 分页数据
            pageNum: 1,
            pageSize: 0,
            size: 0,
            startRow: 0,
            endRow: 0,
            total: 0,
            pages: 0,


            // 加载状态
            img_loading: false,
            page_loading: true,
            loading_count: 0,


            view_problem_type: false,
            //试卷类型
            paper_problem: "",
            good_answer: "",
            bad_answer: "",
            t_paper_problem: "",
            t_good_answer: "",
            t_bad_answer: "",

            // 进度
            progress: {
                percent: 0
            },
            // 阅卷质量
            reading_quality: {},
            //回评
            backVisible: false,
            backs: [],
            back_page_info: {},
            // 标注
            draw: false,
            draw_type: "0",
            st_draw: false,
            temp_draws: {
                "labels": []
            },
            view_labels: [],
            label_fun: '',
            /*---------------复查模块----------------------------*/

            formInline: {
                user: '',
                region: ''
            },
            search_form: {
                "cuttingMergeId": "",
                "paperType": "",
                "exceptionStatus": "",
                "userId": "",
                "scoreMin": 0,
                "scoreMax": 0
            },
            user_name: JSON.parse(sessionStorage.getItem('user')).userName,
            paper_type: [],
            exc_paper: [],
            teacher_select_arr: [],
            view_search: false,
            /*-------------------------------------------------*/
            //打分模式切换
            mode_val: '0',
            view_mode: false,
            //复查模式切换
            ser_mode: false,
            //图片缩放
            img_size: 100


        }
    },
    computed: {},
    mounted() {
        // 获取数据
        this.get_quality();
        this.get_progress();
        this.get_standard();


        // 自动适应高度
        const that = this;
        window.onresize = function temp() {
            that.fullHeight = "height : " + document.documentElement.clientHeight + "px";
            that.mainheight = "height : " + document.documentElement.clientHeight - 80 + "px";
        };

        this.keyboard_mode();


    },
    methods: {
        //===========================================附加组件================================================
        formatTooltip(val){
            return val+'%';

        },
        keyboard_mode(status = true) {
            //对整个页面文档监听
            if (status == true) {
                this.$message('键盘操作模式');
            }
            this.mode_val = '0';
            let _this = this;
            document.onkeydown = function (e) {
                let keyNum = window.event ? e.keyCode : e.which;  //获取被按下的键值
                // alert(keyNum);
                let num = Number(keyNum);
                if (num == 13) {
                    _this.enter_points();
                }
                if (num == 190 || num == 110) {
                    _this.view_score_point(_this.un_point_num);
                    _this.mouse_mode(false);
                }

                if ((num >= 96 && num <= 105) || (num >= 48 && num <= 57)) {
                    _this.view_score_point(_this.un_point_num);

                }
                if (num == 38) {
                    --_this.un_point_num;

                    if (_this.un_point_num < 0) {
                        _this.un_point_num = 0;
                    }

                    _this.view_score_point(_this.un_point_num);

                }
                if (num == 40) {
                    ++_this.un_point_num;

                    if (_this.un_point_num < (_this.max_point_num - 1)) {


                    } else {

                        _this.un_point_num = _this.max_point_num - 1;
                    }
                    _this.view_score_point(_this.un_point_num);

                }
                if (num == 8) {
                    _this.board_score = '';
                }

            };

        },

        mouse_mode(status = true) {
            if (status == true) {
                this.$message('鼠标操作模式');
            }

            this.mode_val = '1';
            //对整个页面文档监听
            let _this = this;
            document.onkeydown = function (e) {
                let keyNum = window.event ? e.keyCode : e.which;  //获取被按下的键值
                // alert(keyNum);
                let num = Number(keyNum);
                if (num == 13) {
                    _this.enter_points();
                    if (status == false) {
                        _this.keyboard_mode(false);
                    }

                }

                if ((num >= 96 && num <= 105) || (num >= 48 && num <= 57)) {


                }
                if (num == 38) {
                    --_this.un_point_num;

                    if (_this.un_point_num < 0) {
                        _this.un_point_num = 0;
                    }

                    _this.view_score_point(_this.un_point_num);

                }
                if (num == 40) {
                    ++_this.un_point_num;

                    if (_this.un_point_num < (_this.max_point_num - 1)) {


                    } else {

                        _this.un_point_num = _this.max_point_num - 1;
                    }
                    _this.view_score_point(_this.un_point_num);

                }

            };

        },

        //回评跳转
        go_to_next(type) {
            if (type == 2) {
                if (this.pageNum < this.pages) {
                    this.get_papers(++this.pageNum)
                } else {
                    this.$message({message: '已经是最后一页！'})

                }
            } else {
                if (this.pageNum > 1) {

                    this.get_papers(--this.pageNum)
                } else {
                    this.$message({message: '已经是第一页！'})

                }
            }


        },

// 设置查看问题卷
        view_problem() {
            switch (this.paper_problem) {
                case "20004": this.t_paper_problem = "打回卷";break;
                case "20003": this.t_paper_problem = "雷同试卷";break;
                case "20002": this.t_paper_problem = "疑难试卷";break;
                case "20001": this.t_paper_problem = "试卷损坏";break;
                default: this.t_paper_problem = "无";

            }

            if (this.good_answer == "10001") {
                this.t_good_answer = "是"
            } else {
                this.t_good_answer = "否"
            }
            if (this.bad_answer == "10002") {
                this.t_bad_answer = "是"
            } else {
                this.t_bad_answer = "否"
            }

        },
        set_answer(type) {
            if (type == 1) {
                this.$message('已标记为优秀答案！')
                this.good_answer = "10001";

            } else {
                this.$message('已标记为典型错误！')
                this.bad_answer = "10002";

            }

        },
        set_problrm() {
            this.paper_problem = this.paper_list[this.index].stuCuttingSign;
            this.view_problem_type = true;
        },


        get_quality() {
            get_reading_quality(JSON.parse(sessionStorage.getItem('user')).userId).then((res) => {
                this.reading_quality = res.data;

            })
        },

        get_progress() {
            get_reading_progress().then(res => {

                this.progress.percent = Number(res.data.judgeProgress);
                this.progress.judgedNum = this.total * this.progress.percent.toFixed(2);
                this.progress.judgedNum = parseInt(this.progress.judgedNum);

                console.log(this.total);
                this.progress.notJudged = this.total - this.progress.judgedNum;

                this.progress.percent = this.progress.percent * 100;


                this.progress.percent = parseInt(this.progress.percent);


                // this.progress.percent = this.progress.percent.toFixed(2);


            })

        },

        //  退出  评阅
        outView() {
            this.$router.push({
                path: "/reading_index"
            })
        },
        // 回评
        view_back(page) {
            this.backVisible = true;
            get_back_view().then((res) => {
                this.backs = res.data.packges;


            })
        },

        // nzq 得到分数的字符串(打分板)
        makeScoreString(maxScore) {
            let _this = this;


            // 共有函数
            function redirectScore(ele, score, handle) {
                let length = ele.length;
                for (let i = 0; i < length; i++) {
                    $(ele[i]).on("click", function () {
                        if (score !== undefined && score !== null) {
                            _this.board_score += score;

                        } else {
                            _this.board_score += $(this).text();

                        }
                        if (!handle) {
                            _this.printScore();
                        }
                    })
                }
                if (Object.prototype.toString.call(handle) === "[object Function]") {
                    handle();
                }
            }

            redirectScore($(".drag-grade-error"), "0");
            redirectScore($(".drag-grade-right"), maxScore);
            // redirectScore($(".error-modal"), "0");
            // redirectScore($(".right-modal"), maxScore);
            // 数值键
            redirectScore($(".drag-grade-num"), null, function () {
                $(".drag-sure").on("click", function () {
                    _this.printScore();
                })
            });
            $("#readuceScore").on("click", function () {
                let length = _this.board_score.length;
                if (length > 0) {
                    let scoreArr = _this.board_score.split("");
                    scoreArr.pop();
                    _this.board_score = scoreArr.join("");

                }
            });
            // document.querySelector("#score_input").onkeydown = function (event) {
            //     if (event.key === "Enter") {
            //         _this.printScore()
            //     }
            // }
        },

        // nzq 生成 评阅质量表格
        create_evaluate_table() {
            this.evaluateVisible = true;
            // 防止获取不到DOM节点
            this.$nextTick(() => {
                let myChart = echarts.init(document.getElementById("echart_table"));
                let scores = [];
                let rate = [];
                for (let i in this.reading_quality.readQuality) {
                    scores[i] = this.reading_quality.readQuality[i].score.toString();
                    rate[i] = (this.reading_quality.readQuality[i].rate)
                }
                console.log(rate);
                myChart.setOption({
                    title: {
                        text: '评阅质量',
                        textStyle: {
                            Color: '#303133',
                            fontSize: "18",
                            fontWeight: "500"
                        }
                    },
                    color: ['#3398DB'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },

                    xAxis: {
                        data: scores
                    },
                    yAxis: {},
                    series: [{
                        name: '所占比例',
                        type: 'bar',
                        data: rate,
                        barWidth: '60%'
                    }]
                });
            })
        },


        //标注
        start_draw() {
            if (this.draw_type != "0") {
                this.st_draw = true;
            } else {
                this.st_draw = false;
                let box = document.querySelector(`#img1`);
                let box1 = document.querySelector(`#img2`);
                let box2 = document.querySelector(`#img3`);
                box.onmousedown = null;
                box1.onmousedown = null;
                box2.onmousedown = null;
            }
            this.draw = false;

        },
        close_draw() {
            this.st_draw = true;
            let box = document.querySelector(`#img1`);
            let box1 = document.querySelector(`#img2`);
            let box2 = document.querySelector(`#img3`);
            box.onmousedown = null;
            box1.onmousedown = null;
            box2.onmousedown = null;
            this.draw = false;
        },
        reset_draws() {
            $('div').remove('.draws_div');
            this.temp_draws.labels = [];

        },
        draw_paper(num) {

            if (this.st_draw) {

                let oBox = document.querySelector(`#img${num}`);
                let fBox = document.querySelector("#img_main1");
                let x1, x2, y1, y2
                let temp_div;
                // console.log(fBox.scrollTop);
                let _this = this
                // console.log(12);
                //鼠标按下，获取初始点
                oBox.onmousedown = function (ev) {
                    let offsetLeft = _this.getElementLeft(oBox)
                    let offsetTop = _this.getElementTop(oBox)
                    console.log(offsetTop);

                    ev = window.event || ev;
                    //1.获取按下的点
                    x1 = ev.clientX + fBox.scrollLeft - offsetLeft;
                    y1 = ev.clientY + fBox.scrollTop - offsetTop;
                    //2.创建div
                    let oDiv = document.createElement("div");
                    oBox.appendChild(oDiv);
                    oBox.onmousemove = function (ev) {
                        ev = window.event || ev;

                        x2 = ev.clientX + fBox.scrollLeft - offsetLeft;
                        y2 = ev.clientY + fBox.scrollTop - offsetTop;
                        //3.设置div的样
                        if (y2 >= y1 && _this.draw_type == "50001") {
                            oDiv.style.borderBottom = "1px  green"
                            oDiv.style.borderTop = "3px solid red"
                        } else if (y2 < y1 && _this.draw_type == "50001") {
                            oDiv.style.borderTop = "1px  green"
                            oDiv.style.borderBottom = "3px solid red"
                        } else if (y2 >= y1 && _this.draw_type == "50002") {
                            oDiv.style.borderBottom = "1px  green"
                            oDiv.style.borderTop = "3px dashed red"
                        } else if (y2 < y1 && _this.draw_type == "50002") {
                            oDiv.style.borderTop = "1px  green"
                            oDiv.style.borderBottom = "3px dashed red"
                        }

                        // oDiv.style.borderTop = "1px solid green"
                        temp_div = oDiv;
                        oDiv.style.position = "absolute";
                        oDiv.style.left = (x2 > x1 ? x1 : x2) + "px";
                        oDiv.style.top = (y2 > y1 ? y1 : y2) + "px";
                        oDiv.style.width = Math.abs(x2 - x1) + "px";
                        oDiv.style.height = Math.abs(y2 - y1) + "px";
                        oDiv.className = 'draws_div'
                        x2 = x1 + oDiv.offsetWidth;
                        // console.log(y1, x2);
                    }
                    return false;  //解除在划动过程中鼠标样式改变的BUG
                }
                //在鼠标抬起后终止onmousemove事件
                oBox.onmouseup = function () {
                    temp_div = null;

                    console.log(_this.points[num - 1].x1);
                    oBox.onmousemove = null;
                    let temp_points = {
                        bx: _this.points[num - 1].x1,
                        by: _this.points[num - 1].y1,
                        sx: x1,
                        sy: y1
                    }
                    let temp_points2 = {
                        bx: _this.points[num - 1].x1,
                        by: _this.points[num - 1].y1,
                        sx: x2,
                        sy: y1
                    }
                    console.log(x1 + ',' + y1);
                    console.log(x2 + ',' + y1);
                    if (x2 == undefined) {

                    } else {
                        let point1 = coordinate(temp_points);
                        let point2 = coordinate(temp_points2);
                        console.log(point1.y + '++' + point2.y);

                        let temp_output = {
                            "stuFragmentId": _this.paper_list[_this.index].fragment_info[`${num - 1}`].tStuFragmentId,
                            "labelX1": point1.x.toString(),
                            "labelY1": point1.y.toString(),
                            "labelX2": point2.x.toString(),
                            "labelY2": point2.y.toString(),
                            "labelType": _this.draw_type,
                            "userId": _this.add_data.userPermId

                        }


                        _this.temp_draws.labels.push(temp_output);
                        console.log(_this.temp_draws);
                    }


                    // oBox.onmousedown = null;


                }
                oBox.onmouseleave = function () {

                    if (temp_div != undefined || temp_div != null) {
                        oBox.removeChild(temp_div);
                    }


                }

            }


        },
        output_draws_r() {
            // console.log(this.temp_draws);
            add_label(this.temp_draws).then(res => {
                if (res.code == "200") {
                    this.$message({
                        message: '标注已提交'
                    })
                } else {
                    this.$message({
                        message: '标注提交失败',
                        type: 'warning'
                    })
                }

                this.temp_draws.labels = [];
                this.st_draw = false;

            })
            this.close_draw();
        },
        view_lab() {
            let _this = this;
            let p = new Promise(function (resolve, reject) {
                _this.view_labels = [];
                let requests = []
                for (let i in _this.paper_list[_this.index].fragment_info) {

                    requests[i] = get_labels(_this.paper_list[_this.index].fragment_info[i].tStuFragmentId)


                }

                axios.all(requests).then(axios.spread(function () {
                    for (let i in arguments) {
                        _this.view_labels.push(arguments[i].data.labels)
                    }
                    // console.log(_this.view_labels);
                    resolve('鸡蛋炒饭');


                }))

            })
            return p;


        },
        // 复查
        start_serh() {

            if (this.view_search == false) {
                document.querySelector(".re_ser").style.backgroundColor = '#5e7382';
                this.search_form.cuttingMergeId = this.add_data.cutingMergeId;
                this.search_form.userId = this.add_data.userPermId;
                this.view_search = true;
                get_papertype().then((res) => {
                    this.paper_type = res.data.paperType;
                    this.paper_type.push({
                        dicValue: '0',
                        remark: '正常卷'
                    })
                    this.paper_type.push({
                        dicValue: '',
                        remark: '所有卷'
                    })

                })
                get_excepapertype().then((res) => {
                    this.exc_paper = res.data.exceptionPaperType;
                    this.exc_paper.push({
                        dicValue: '0',
                        remark: '正常卷'
                    })
                    this.exc_paper.push({
                        dicValue: '',
                        remark: '所有卷'
                    })

                })
            } else {
                this.view_search = false;
            }


        },
        sub_serh() {
            ser_paper(this.search_form).then((res) => {
                if (res.code == "200") {
                    this.$message({
                        type: 'success',
                        message: '查询成功！'
                    })
                    this.paper_list = get_paper_list(res.data.pageinfo.list);
                    this.button_display_cutting(this.paper_list[0], 0);
                    this.ser_mode = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: '查询失败！'
                    })
                }


            })


        },
        exit_serh() {
            this.$router.go(0)
        },
        // 切换打分模式
        change_mode() {
            console.log(this.mode_val);
            this.view_mode = false
            switch (this.mode_val) {
                case '0':
                    this.keyboard_mode()
                    break;
                case '1':
                    this.mouse_mode()
                    break;

            }

        },

        //==================================================================================
        get_standard() {

            get_reading_standard().then((res) => {

                this.add_data = get_add_data(res);

                // this.cuttingScorePointList = res.data.msg[0].cuttingList[0].cuttingScorePointList;

                this.makeScoreString(this.add_data.score);


                for (let i in res.data.msg[0].cuttingList) {
                    // 切割点数组
                    let para = {
                        x1: res.data.msg[0].cuttingList[i].cuttingX1,
                        x2: res.data.msg[0].cuttingList[i].cuttingX2,
                        y1: res.data.msg[0].cuttingList[i].cuttingY1,
                        y2: res.data.msg[0].cuttingList[i].cuttingY2
                    };
                    this.points.push(para);
                    // 切块数组
                    this.fragment.push(res.data.msg[0].cuttingList[i].fragmentId);
                    // 知识点模板数组
                    // let sc_para = [];
                    let temp = res.data.msg[0].cuttingList[i].cuttingScorePointList;
                    let Sort = function (temp) {
                        for (var i = 0; i < temp.length - 1; i++) {
                            for (var j = i + 1; j < temp.length; j++) {
                                if (Number(temp[i].pointY) > Number(temp[j].pointY)) {/*如果前面的数据比后面的大就交换位置*/
                                    var list = temp[i];
                                    temp[i] = temp[j];
                                    temp[j] = list;
                                }
                            }
                        }
                        return temp;
                    }
                    temp = Sort(temp);
                    // for (let s in res.data.msg[0].cuttingList[i].cuttingScorePointList) {
                    //
                    //
                    //     sc_para.push(res.data.msg[0].cuttingList[i].cuttingScorePointList[s]);
                    // }
                    this.score_points.push(temp);

                }

                //获取point—id的一维数组
                let temp1 = [];
                temp1 = [].concat.apply([], this.score_points);
                for (let i in temp1) {
                    this.pointsId.push(temp1[i].pointId);
                }


                get_perm_user(this.add_data.cutingMergeId).then(res => {
                    console.log('get_perm_user');
                    console.log(res.data.tempUser);
                    this.teacher_select_arr = res.data.tempUser
                })

                get_postition().then((res) => {
                    this.pageNum = res.data.nextPackgeNum;
                    this.get_papers(res.data.nextPackgeNum);
                })


            })


        },

        get_papers(page) {
            this.paper_list = [];
            this.pageNum = page;
            this.index = 0;

            get_reading_papers(page).then((res) => {
                if (res.code == '400') {
                    this.$message.error(res.data.msg);
                    this.$router.push({path: '/reading_index'});
                }
                this.paper_list = get_paper_list(res.data.msg.list);
                this.total = res.data.msg.total;
                this.pages = res.data.msg.pages;
                this.pageNum = res.data.msg.pageNum;
                //获取进度
                // this.get_progress();
                //获取知识点
                this.view_points();
                //获取当前正批阅的试卷
                let x = this.paper_list.findIndex((value, index, arr) => {
                    return value.state == '0'
                })
                this.index = x;

                this.page_loading = false;
                this.button_display_cutting(this.paper_list[x], x);

            })


        },

        button_display_cutting(item, index) {

            this.$refs.img_main.$el.scrollTop = 0;
            this.view_search = false;
            this.un_point_num = 0;
            document.querySelector('input[data-id="' + this.pointsId[0] + '"]').focus();

            this.index = index;
            this.view_points();
            this.paper_problem = this.paper_list[index].stuCuttingSign;
            this.good_answer = this.paper_list[index].stuCuttingGreat;
            this.bad_answer = this.paper_list[index].stuCuttingError;
            this.view_problem();
            this.view_lab().then((res) => {
                this.img_loading = true; //加载图片


                for (let i  in this.paper_list) {
                    if (i != index) {
                        this.paper_list[i].state = this.paper_list[i].un_state

                    }


                }


                this.paper_list[index].state = "1";


                for (let i in item.url) {
                    let para1 = {
                        x1: this.points[i].x1,
                        y1: this.points[i].y1


                    };
                    let para2 = {
                        x2: this.points[i].x2,
                        y2: this.points[i].y2


                    }
                    cutingPic(
                        item.url[i],
                        para1,
                        para2,
                        document.querySelector(`#img_paper_${i}`),
                        this.view_labels[i]
                    ).then((data) => {
                        this.loading_count++;


                    });
                    // this.img_loading = false;
                    // console.log($("#img_paper_0")[0].data);


                }
                // document.querySelector(".draw_div").
                $(".draws_div").remove();
                this.draw_type = "0";
                this.start_draw();


            })


        },


        printScore() {

            // 获取相应的json数据
            var _this = this;
            (function () {
                var userStorage = JSON.parse(sessionStorage.user);
                var jsonData = {
                    stuCutting: {
                        stuCuttingTotalScore: 0,
                        cutingMergeId: _this.add_data.cutingMergeId,
                        stuId: _this.paper_list[_this.index].stuId,
                        examId: _this.add_data.examId,

                        stuCuttingSign: _this.paper_problem,
                        stuCuttingGreat: _this.good_answer,
                        stuCuttingError: _this.bad_answer,
                        teacherJudgeStatus: "2",
                        stuCuttingId: _this.paper_list[_this.index].stuCuttingId,

                    },
                    stuFragments: [],
                    stuCuttingScorePoints: []
                }


                let total_score = 0;
                let status = false;
                for (let i in _this.score_points) {
                    for (let s in _this.score_points[i]) {
                        let arr = {
                            eachPointScore: _this.score_points[i][s].pointType,
                            cuttingScorePoint: _this.score_points[i][s].pointId

                        };
                        if (_this.score_points[i][s].pointType == "") {
                            console.log('xxxx');
                            status = true;
                        }
                        jsonData.stuCuttingScorePoints.push(arr);

                        total_score += Number(_this.score_points[i][s].pointType)

                    }
                }
                if (status) {
                    _this.$message.error("存在未打分的知识点！");
                    _this.img_loading = false;
                    document.querySelector('input[data-id="' + _this.pointsId[0] + '"]').focus();


                } else {

                    _this.un_point_num = 0;
                    jsonData.stuCutting.stuCuttingTotalScore = total_score;
                    for (let i in _this.paper_list[_this.index].fragment_info) {
                        jsonData.stuFragments.push(_this.paper_list[_this.index].fragment_info[i].tStuFragmentId)
                    }

                    // 拼接完成
                    add_paper_score(jsonData).then(res => {
                        _this.paper_list[_this.index].stuCuttingSign = _this.paper_problem;
                        _this.paper_list[_this.index].stuCuttingGreat = _this.good_answer;
                        _this.paper_list[_this.index].stuCuttingError = _this.bad_answer;
                        _this.paper_list[_this.index].score = total_score;
                        _this.paper_list[_this.index].state = "2";
                        _this.paper_list[_this.index].un_state = "2";
                        _this.paper_list[_this.index].stuCuttingId = res.data.stuCuttingId;
                        _this.paper_list[_this.index].point_score = jsonData.stuCuttingScorePoints;

                        if (res.code == '200') {
                            _this.$message({
                                message: '提交成功！',
                                type: 'success'
                            })
                        } else {
                            _this.$message.error('提交失败！');

                        }


                        _this.index++;

                        if (_this.index < _this.paper_list.length) {
                            _this.paper_problem = _this.paper_list[_this.index].stuCuttingSign;
                            _this.good_answer = _this.paper_list[_this.index].stuCuttingGreat;
                            _this.bad_answer = _this.paper_list[_this.index].stuCuttingError;
                            _this.button_display_cutting(_this.paper_list[_this.index], _this.index);
                        }

                        if (_this.index >= 20 && _this.pageNum < _this.pages && _this.ser_mode == false) {

                            _this.get_papers(++_this.pageNum)
                            _this.index = 0;

                        } else {
                            _this.img_loading = false;


                        }
                        _this.point_x = 0;
                        _this.point_y = 0;
                        _this.get_progress();
                        _this.get_quality();
                        _this.view_problem();
                        // _this.output_draws_r();
                        _this.view_points();

                    })
                }
            })()
            this.boardStrScore = "";


        },


//获取焦点，动态双向绑定
        view_score_point(num) {
            console.log(document.querySelector('input[data-id="' + this.pointsId[num] + '"]').value);
            document.querySelector('input[data-id="' + this.pointsId[num] + '"]').focus();
            this.board_score = document.querySelector('input[data-id="' + this.pointsId[num] + '"]').value;
            // document.querySelector('#score_input').focus();
            this.point_x = document.querySelector('input[data-id="' + this.pointsId[num] + '"]').getAttribute('data-x');
            this.point_y = document.querySelector('input[data-id="' + this.pointsId[num] + '"]').getAttribute('data-y');
        },

        get_point_pos(item, index) {

            let style = "";

            let top = Number(item.pointY) - Number(this.points[index].y1) - 20 + 'px';
            let left = Number(item.pointX) - Number(this.points[index].x1) - 25 + 'px';

            style = 'position: absolute; top:' + top + ';left:' + left + ';';

            return style;


        },
        get_ico_pos(item, index) {
            let style = "";

            let top = Number(item.pointY) - Number(this.points[index].y1) - 20 + 'px';
            let left = Number(item.pointX) - Number(this.points[index].x1) + 25 + 'px';

            style = 'position: absolute; top:' + top + ';left:' + left + ';';

            return style;

        },
        return_class(item, index) {
            // console.log(item.pointType);
            let conut = 0;
            for (let i in item.pointType) {
                if (item.pointType.charAt(i) == '.') {
                    conut++;
                }
            }
            if (conut > 1) {
                this.$message({
                    type: 'warning',
                    message: '请注意小数点！'
                })
                item.pointType = '';
                this.board_score = '';
            }
            if (parseFloat(item.pointType) > parseFloat(item.echoPointScore)) {

                item.pointType = '';
                this.board_score = '';
                this.$message({
                    type: 'warning',
                    message: '超出给分点满分！'
                })
                return 'false'
            } else if (item.pointType == '') {
                return 'noes';
            } else if (item.pointType == item.echoPointScore) {
                return 'allok'

            } else if (item.pointType == '0') {
                return 'fail'
            } else {
                return 'banok'
            }

        },

        enter_points() {
            this.boardStrScore = Number(this.boardStrScore) + Number(document.querySelector('input[data-id="' + this.pointsId[this.un_point_num] + '"]').value);
            this.boardStrScore = this.boardStrScore.toString();

            this.un_point_num++;
            console.log(this.un_point_num + ':' + this.pointsId.length);
            console.log(document.querySelectorAll('input'));
            // let temp = [];
            // temp = [].concat.apply([], this.score_points);
            // for (let i in temp) {
            //     this.temp.push(temp[i].pointId);
            // }
            if (Number(this.un_point_num) == Number(this.pointsId.length)) {
                this.un_point_num = 0;
                this.printScore();
                console.log('hehe');
            } else {
                console.log(this.un_point_num);
                this.view_score_point(this.un_point_num);
                // document.querySelector('input[data-id="'+this.pointsId[this.un_point_num]+'"]').focus();
            }


        },
        // 鼠标点击事件
        click_view(x, y) {
            this.point_x = x;
            this.point_y = y;
            this.mouse_mode();


        },
        view_points() {
            console.log(this.index);
            document.querySelector('input[data-id="' + this.pointsId[0] + '"]').focus();

            let arr = this.paper_list[this.index].point_score;
            let num = 0;
            if (arr[num].eachPointScore == undefined || arr[num].eachPointScore == '') {
                for (let i in this.score_points) {
                    for (let s in this.score_points[i]) {


                        this.score_points[i][s].pointType = '';
                        num++;
                    }
                }

            } else {
                for (let i in this.score_points) {
                    for (let s in this.score_points[i]) {


                        this.score_points[i][s].pointType = arr[num].eachPointScore;
                        num++;
                    }
                }
            }
            this.max_point_num = num;


        }
    },

    watch: {
        loading_count(newvalue, oldvalue) {
            if (newvalue == this.fragment.length) {
                this.img_loading = false;
                this.loading_count = 0;
            }

        },
        st_draw(newv, old) {
            if (newv == true) {
                $("#img1,#img2,#img3").css({"cursor": "crosshair"});

                // document.querySelector("#img1").style.cursor = 'crosshair';
            } else {
                $("#img1,#img2,#img3").css({"cursor": "auto"});

                // document.querySelector("#img1").style.cursor = 'auto';

            }
        },
        header(newv, oldv) {
            this.$nextTick(() => {
                this.$refs.page_head.$el.style.height = '90px'
                // $('.el-form-item__label')[1].style.color = 'white'
                $('.el-form-item__label').css('color', 'white');
                console.log(this.$refs.page_head.$el.style.height);
            })
        },
        board_score(newv, oldv) {


            if (newv == '') {


            } else {
                this.score_points[this.point_x][this.point_y].pointType = Number(newv).toString();
                if (newv == NaN || this.score_points[this.point_x][this.point_y].pointType.toString() == 'NaN') {
                    this.board_score = '';
                    this.score_points[this.point_x][this.point_y].pointType = '';
                }
            }


        },
        img_size(newv,oldv){
            this.$refs.img1.width = 770*newv/100;

        }


    },


    //自由移动窗口
    directives: {
        drag(el) {
            el.onmousedown = function (e) {
                //获取鼠标点击处分别与div左边和上边的距离：鼠标位置-div位置
                var divx = e.clientX - document.getElementById('drag').offsetLeft;
                var divy = e.clientY - document.getElementById('drag').offsetTop;
                //包含在onmousedown里，表示点击后才移动，为防止鼠标移出div，使用document.onmousemove
                document.onmousemove = function (e) {
                    //获取移动后div的位置：鼠标位置-divx/divy
                    var l = e.clientX - divx;
                    var t = e.clientY - divy;
                    document.getElementById('drag').style.left = l + 'px';
                    document.getElementById('drag').style.top = t + 'px';
                }
                document.onmouseup = function (e) {
                    document.onmousemove = null;
                    document.onmouseup = null;
                }
            }
        }
    },


    components: {}

}
