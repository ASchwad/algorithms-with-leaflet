import _ from "lodash";
import { crowDistance } from "./crowDistance";

export function dijkstra(vertices, edges, source) {

    let distances = vertices.map(vertex => {
        return {
            id: vertex.properties.PARK_ID,
            name: vertex.properties.NAME,
            distance: 99999,
            predecessor: null,
            processed: false,
            coordinates: vertex.geometry.coordinates
        }
    })
    distances[_.findIndex(distances, ['id', source])].distance = 0
    // Get node with current minimal distance from distances array and which is not processed yet
    vertices.forEach(() => {
        let processedDistances = _.filter(distances, ['processed', false])
        let fromPark = _.minBy(processedDistances, 'distance');
        
        //let fromPark = _.find(distances, (park) => park.id === 1)
        // Für jeden Knoten v mit einer Kante von u nach v
        _.filter(edges, (edge) => edge.properties.from === fromPark.id)
        .forEach(adjacentEdge => {
            let toPark = _.find(distances, ['id', adjacentEdge.properties.to])
            if(toPark.distance > fromPark.distance + crowDistance(fromPark.coordinates, toPark.coordinates)){
                distances[_.findIndex(distances, ['id', toPark.id])].distance = fromPark.distance + crowDistance(fromPark.coordinates, toPark.coordinates)
                distances[_.findIndex(distances, ['id', toPark.id])].processed = false
                distances[_.findIndex(distances, ['id', toPark.id])].predecessor = fromPark.id

            }
        })
        distances[_.findIndex(distances, ['id', fromPark.id])].processed = true
    })
    console.log(_.filter(distances, ['processed', true]))
}