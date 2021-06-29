function calculateDotProduct(x, y) {
    // Only for 2-dim vectors
    return x[0] * y[1] - x[1] * y[0] 
} 

function calculateDotProductWithOrigin(p0, p1, p2) {
    // p0 is the origin
    
    // Liegt p0p2 im Uhrzeigersinn zu p0p1?
    // (p1-p0)o(p2-p0) = (x1 - x0)*(y2-y0) o ((x2 - x0)*(y1 - y0))
    // Falls < 0: liegt nicht im Uhrzeigersinn
    // Falls > 0: liegt im Uhrzeigersinn
    // Falls 0: Kollinear
    return (p1[0] - p0[0]) * (p2[1] - p0[1]) - (p2[0] - p0[0]) * (p1[1] - p0[1])
} 

// console.log(calculateDotProduct([47.83819366870157, 12.278890622248914], [47.439248369668775, 12.719107611793177]))
// console.log(calculateDotProductWithOrigin([47.439248369668775, 12.719107611793177], [47.83819366870157, 12.278890622248914], [48.934269796021226, 13.0424692695018]))

// 47.439248369668775, 12.719107611793177 LEOGANG
// 47.83819366870157, 12.278890622248914 Samerberg
// 48.934269796021226, 13.0424692695018 Geißkopf
// 47.59742560160809, 11.050041784675047 Oberammergau

function onSegment(p1, p2, p3){
    // Prüft Konvexkombination
    if((Math.min(p1[0], p2[0]) <= p3[0] && p3[0] <= Math.max(p1[0], p2[0])) && Math.max(p1[1], p2[1]) <= p3[1] && p3[1] <= Math.max(p1[1], p2[1])){
        return true
    } else return false
}

function calculateIntersection(p1, p2, p3, p4){
    const d1 = calculateDotProductWithOrigin(p3, p4, p1)
    const d2 = calculateDotProductWithOrigin(p3, p4, p2)
    const d3 = calculateDotProductWithOrigin(p1, p2, p3)
    const d4 = calculateDotProductWithOrigin(p1, p2, p4)
    
    // console.log(d1)
    // console.log(d2)
    // console.log(d3)
    // console.log(d4)

    if(((d1 > 0 && d2 < 0) || (d1<0 && d2 >0)) && ((d3 > 0 && d4 <0) || (d3 < 0 && d4 > 0))){
        return true
    }else{
        // Prüfe kolineare Fälle
        if(d1 === 0 && onSegment(p3, p4, p1)) return true 
        if(d2 === 0 && onSegment(p3, p4, p2)) return true 
        if(d3 === 0 && onSegment(p1, p2, p3)) return true 
        if(d4 === 0 && onSegment(p1, p2, p4)) return true 
        return false
    } 
}

// const osternoheZuSamerberg = {
//     p1: [47.83819366870157, 12.278890622248914],
//     p2: [49.713076088730105, 11.44392972968316],
// }

// const geisskopfZuOberammergau = {
//     p1: [48.934269796021226, 13.0424692695018],
//     p2: [47.59742560160809, 11.050041784675047],
// }

// const osternoheZuOberammergau = {
//     p1: [47.83819366870157, 12.278890622248914],
//     p2: [47.59742560160809, 11.050041784675047],
// }

// console.log(calculateIntersection(osternoheZuSamerberg.p1, osternoheZuSamerberg.p2, geisskopfZuOberammergau.p1, geisskopfZuOberammergau.p2))
