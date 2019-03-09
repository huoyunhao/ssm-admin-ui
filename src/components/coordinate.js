export const coordinate = points => {
    let output = {
        x: Number(points.bx)+Number(points.sx),
        y: Number(points.by)+Number(points.sy)


    }
    return output;
}
// let points = {
//     bx: 2,
//     by: 3,
//     sx: 2,
//     sy: 3
// }
// let output = coordinate(points);
// console.log(output.x+output.y);