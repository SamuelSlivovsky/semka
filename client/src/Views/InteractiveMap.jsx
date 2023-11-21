import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Make sure to import Leaflet CSS

export default function InteractiveMap() {
  const [selectedFloor, setSelectedFloor] = useState(1);

  const renderMap = (geojsonData) => {
    const data = `{"type":"FeatureCollection","features":[{"type":"Feature", "id": 1, "properties":{"level": [1]},"geometry":{"type":"Polygon","coordinates":[[[17.15103790730194,48.155265316382355],[17.151064103352127,48.15509832550825],[17.151008800577586,48.155082791445835],[17.15101171125039,48.15510609253769],[17.15095349780313,48.15510220902314],[17.150970961836606,48.15495851877748],[17.15102335393979,48.15496628582807],[17.15104663931865,48.1548128863605],[17.150979693853373,48.154809002823725],[17.150982604526035,48.15475851681907],[17.151005889904923,48.15475657504845],[17.151075403785427,48.154310198444335],[17.15111281620031,48.154043138353444],[17.151243759652886,48.15403065887574],[17.151243759652886,48.15400070811745],[17.15118764103096,48.15399821222044],[17.151251242135857,48.15361384258435],[17.151804945878013,48.15365377722591],[17.151722638565246,48.15401318760246],[17.15153557648989,48.15400569991172],[17.15151312904098,48.15426776842915],[17.151490681592037,48.15441003363506],[17.151453269177154,48.154582248882804],[17.151505646558007,48.15481686002954],[17.15186854698382,48.15484181859955],[17.151947113054632,48.15434763666332],[17.152313754721433,48.15439006661245],[17.152227706167622,48.154871768866855],[17.15332763163397,48.15496411593679],[17.153316407909045,48.15507642908162],[17.153368785289928,48.155088908305004],[17.153350079082912,48.15523616290872],[17.153436127637576,48.15524365041992],[17.15341368018869,48.15543832532023],[17.15309567466079,48.15542335035414],[17.15307322721185,48.15556311653515],[17.15327151301119,48.15558058728118],[17.15323035935438,48.15582268128918],[17.152901130102435,48.1558027148163],[17.152886165136493,48.15589256388307],[17.15178998137793,48.15581269805372],[17.151834876275814,48.15550072096562],[17.15169645034024,48.15549323349251],[17.15162910799347,48.155425846182425],[17.151636590476414,48.15530854213546],[17.15103790730194,48.155265316382355]]]}},{"type":"Feature", "id": 542, "properties":{"level":[1,2],"room_number":"RA420"},"geometry":{"type":"Polygon","coordinates":[[[17.15106187954538,48.15510268388866],[17.15123850876759,48.15511705367413],[17.151225584678656,48.155197524396755],[17.15130743724535,48.155200398348455],[17.151298821185776,48.15528661683561],[17.1510403393969,48.15526649920139],[17.15106187954538,48.15510268388866]]]}}]}`;
    let parsed = JSON.parse(data);
    geojsonData = parsed;

    // Define the style for the GeoJSON features (adjust as needed)
    const style = {
      color: 'blue',
      weight: 2,
      opacity: 0.8,
    };

    return (
      <MapContainer
        center={[48.15510268388866, 17.15106187954538]} // Adjust the center based on your data
        zoom={15}
        style={{ height: '500px', width: '100%' }}
      >
        {/* Add a tile layer (you can use other tile providers) */}
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

        {/* Add GeoJSON layers for floors and rooms */}
        {geojsonData.features
          .filter((feature) =>
            feature.properties.level.some((level) => level === selectedFloor)
          )
          .map((feature) => (
            <GeoJSON
              key={feature.id}
              data={feature.geometry}
              style={style}
              eventHandlers={{
                click: (event) => handleFeatureClick(event, feature),
              }}
            />
          ))}
      </MapContainer>
    );
  };

  const handleFeatureClick = (event, feature) => {
    const roomNumber = feature.properties.room_number;

    // Extract coordinates from the clicked event
    const { lat, lng } = event.latlng;

    // Open a popup at the clicked location
    event.target.bindPopup(`<b>Room Number:</b> ${roomNumber}`).openPopup();

    // You can also use a state to manage the open popups if needed
  };

  const handleFloorChange = (floorNumber) => {
    setSelectedFloor(floorNumber);
  };

  return (
    <div>
      <div>
        <button onClick={() => handleFloorChange(1)}>Floor 1</button>
        <button onClick={() => handleFloorChange(2)}>Floor 2</button>
        {/* Add more buttons for additional floors as needed */}
      </div>
      {renderMap()}
    </div>
  );
}
