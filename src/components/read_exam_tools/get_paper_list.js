export const get_paper_list = (res) => {
    let paper_list = [];
    for (let i in res.data.msg.list) {

        let temp = res.data.msg.list[i]
        let para = {
            stuId: temp.stuFragments[0].stuId,
            state: temp.stuCuttings.teacherJudgeStatus == null ? '0' : temp.stuCuttings.teacherJudgeStatus,
            score: temp.stuCuttings.stuCuttingTotalScore == null ? '0' : temp.stuCuttings.stuCuttingTotalScore,
            index: '',
            un_state: temp.stuCuttings.teacherJudgeStatus == null ? '0' : temp.stuCuttings.teacherJudgeStatus,
            fragment_info: [],
            url: [],
            stuCuttingId: temp.stuCuttings.stuCuttingId == null ? '' : temp.stuCuttings.stuCuttingId,
            stuCuttingError: temp.stuCuttings.stuCuttingError,
            stuCuttingGreat: temp.stuCuttings.stuCuttingGreat,
            stuCuttingSign: temp.stuCuttings.stuCuttingSign,
            num: Number(i)+1,
            point_score:[]


        }

        for(let i1 in res.data.msg.list[i].stuFragments){
            para.url.push(res.data.msg.list[i].stuFragments[i1].imgUrl);
            para.fragment_info.push({
                "tStuFragmentId": res.data.msg.list[i].stuFragments[i1].tStuFragmentId,
                "fragmentId": res.data.msg.list[i].stuFragments[i1].fragmentId

            })
        }
        for(let i2 in res.data.msg.list[i].stuCuttingScorePoint){
            para.point_score.push(res.data.msg.list[i].stuCuttingScorePoint[i2])

        }
        paper_list.push(para);





    }
    return paper_list;


}