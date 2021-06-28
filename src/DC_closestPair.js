import _, { min } from "lodash";
import { crowDistance } from "./crowDistance";

export function dcClosestpair(points) {
    // Requires sorted points

    // Check base cases
    if(points == null) return 0
    else{
        const n = points.length
        if(n === 2) return crowDistance(points[0].geometry.coordinates, points[1].geometry.coordinates)
        else if(n === 3){
            return min([
                crowDistance(points[0].geometry.coordinates, points[1].geometry.coordinates), 
                crowDistance(points[0].geometry.coordinates, points[2].geometry.coordinates),
                crowDistance(points[1].geometry.coordinates, points[2].geometry.coordinates), 
            ])
        }else{
            // Divide at n/2
            var dl = points.slice(0, n/2);
            var dr = points.slice(n/2);
            let mid = points[Math.round(n/2)].geometry.coordinates
            // Required to efficiently determine which combine pairs should be considered for the calculations
            let minimumDistance = _.min([dcClosestpair(dl), dcClosestpair(dr)])
            let minimumDistanceAsCoord = Math.min(...[dcClosestpair(dl), dcClosestpair(dr)]) / 74.63
                        
            // Merge
            // Get all points which are within the range of mid.x +- minimumdistance and mid +- minimumdistance
            // --> Flaw: Distance is in KM and not applicable to coordinates
            // --> Translate each 74.63 km to one degree latitude
            let reducedPoints = [] 
            _.forEach(points, (point) => {
                if((mid[1] - minimumDistanceAsCoord) <= point.geometry.coordinates[1] && point.geometry.coordinates[1] <= (mid[1] + minimumDistanceAsCoord)) reducedPoints.push(point)
                // else console.log("SAVED CALCULATION")
            })
            _.forEach(reducedPoints, (point, key) => {
                for(var i = key + 1; i<reducedPoints.length; i++){
                    // console.log(`Von ${point.properties.NAME} zu ${reducedPoints[i].properties.NAME}`)
                    // console.log(crowDistance(point.geometry.coordinates, reducedPoints[i].geometry.coordinates))
                    // console.log(Math.min(...[minimumDistance, crowDistance(point.geometry.coordinates, reducedPoints[i].geometry.coordinates)]))
                    
                    minimumDistance = Math.min(...[minimumDistance, crowDistance(point.geometry.coordinates, reducedPoints[i].geometry.coordinates)])
                }
            })

            return minimumDistance
        }
    }
}