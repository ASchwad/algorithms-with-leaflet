import React from "react";
import Polyline from 'react-leaflet-arrowheads'
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import * as parkData from "./data/bikeparks.json";
import * as parkEdges from "./data/bikepark_edges.json";
import "./App.css";
import {crowDistance} from './crowDistance'
import { dcClosestpair } from "./DC_closestPair";
import _ from "lodash";
import { dijkstra } from "./shortestPaths";


const randomLines = () => {
  return parkData.features.map((park, key) => {
    const nextPark = (key + 1 < parkData.features.length) ? parkData.features[key + 1] : parkData.features[0]
    return <Polyline
      key={park.properties.PARK_ID}
      positions={[
        // [47.49984519210629, 10.365775754123737],
        // [47.49984519210629, 9.365775754123737]
        park.geometry.coordinates,
        nextPark.geometry.coordinates
      ]}
      onmouseover={(x) => {
        alert(`Distanz zwischen ${park.properties.NAME} und ${nextPark.properties.NAME} beträgt ${crowDistance(park.geometry.coordinates, nextPark.geometry.coordinates)} km.`)
      }}
    />
  })
}

const edgesFromFile = () => {
  return parkEdges.features.map((edge, key) => {
    const fromPark = _.find(parkData.features, (park) => park.properties.PARK_ID === edge.properties.from)
    const toPark = _.find(parkData.features, (park) => park.properties.PARK_ID === edge.properties.to)
    return <Polyline
      key
      positions={[
        fromPark.geometry.coordinates,
        toPark.geometry.coordinates
      ]}
      arrowheads={{size: '10px', frequency: "3", color: "black"}}
    />
  })
}

export default function App() {
  dijkstra(parkData.features, parkEdges.features, 8)
  // console.log("CLOSEST PAIR Distance: ",dcClosestpair(_.sortBy(parkData.features, [function(o) { return o.geometry.coordinates[1]}])))
  const [activePark, setActivePark] = React.useState(null);
  return (
    <Map center={[48.9657065, 10.9764000000002]} zoom={7}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      {parkData.features.map(park => (
        <Marker
          key={park.properties.PARK_ID}
          position={[
            park.geometry.coordinates[0],
            park.geometry.coordinates[1]
          ]}
          onClick={() => {
            setActivePark(park);
          }}
        />
      ))}

      {edgesFromFile()}
      {/* {randomLines()} */}

      {activePark && (
        <Popup
          position={[
            activePark.geometry.coordinates[0],
            activePark.geometry.coordinates[1]
          ]}
          onClose={() => {
            setActivePark(null);
          }}
        >
          <div>
            <h2>{activePark.properties.NAME}</h2>
            <a target="_blank" rel="noopener noreferrer" href={activePark.properties.WEBSITE}>Website</a>  
          </div>
        </Popup>
      )}
    </Map>
  );
}
