/**
 * @author YXJ
 * @data 2018/10/25
 * @Description : 截图生成 URLdata,并标注
 */

// 数据格式
/*let url = "http://ofyaji162.bkt.clouddn.com/touxiang.jpg"
let position1 = {
  x1 : 0,
  y1 : 0
}
let position2 = {
  x2 : 200,
  y2 : 266
}*/
// let labels = [{
//     x1: 0,
//     x2: 0,
//     y1: 0,
//     y2: 0,
//     type:""
// }]
// https://www.jianshu.com/p/6fe06667b748
function cutingPic (url, position1, position2,elem,labels) {
    var p = new Promise(function(resolve, reject){
        url = "http://120.79.250.60:80/aies/img?path=" + url
        var img = new Image();
        img.crossOrigin = "";
        img.onload = function () {
            // 图 =》canvas
            var canvas = document.createElement('canvas');
            var width = canvas.width =position2.x2 - position1.x1;

            var height = canvas.height =position2.y2 - position1.y1;
            // canvas.width = img.width;
            // canvas.height = img.height;



            // 绘制
            canvas.getContext('2d').drawImage(img, position1.x1, position1.y1, width, height, 0, 0, width, height);

            var context=canvas.getContext("2d");
            context.lineWidth= 2
            context.strokeStyle="#FF0000"

            for(let i in labels){

                if(labels[i].labelType == "50002"){
                    console.log(labels[i].labelType)
                    context.beginPath();

                    context.setLineDash([5,5]);


                    context.moveTo(labels[i].labelX1 - position1.x1,labels[i].labelY1 - position1.y1)

                    context.lineTo(labels[i].labelX2 - position1.x1,labels[i].labelY2 - position1.y1)

                    context.stroke()
                    context.save()
                }else {
                    // context.setLineDash([]);
                    console.log(labels[i].labelType);
                    context.beginPath();
                    context.setLineDash([]);




                    context.moveTo(labels[i].labelX1 - position1.x1,labels[i].labelY1 - position1.y1)

                    context.lineTo(labels[i].labelX2 - position1.x1,labels[i].labelY2 - position1.y1)

                    context.stroke()
                    context.save()
                }


            }



            // canvas =》img
            // console.log(canvas.toDataURL());
            elem.src = canvas.toDataURL();
            elem.data = false;
            resolve('鸡蛋炒饭');


        }
        img.src=url;
                

    });


    return p;
}
// 调用格式
/*cutingPic(url, position1, position2, function (x) {
  var img  = document.createElement('img');
  img.src= x;
  document.body.appendChild(img);
})*/
export { cutingPic }
