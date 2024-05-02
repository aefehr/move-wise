import { MapContainer, TileLayer } from 'react-leaflet'
import './map.scss'
import "leaflet/dist/leaflet.css";
import Pin from '../pin/Pin';

function Map({ items, latitude, longitude, zoom = 10, randomOffset = false }) {
  // Generate a random offset between -0.05 and 0.05
  const offset = (Math.random() * 0.1) - 0.05;

  // Apply the random offset to latitude and longitude if randomOffset is true
  const finalLatitude = randomOffset ? latitude + offset : latitude;
  const finalLongitude = randomOffset ? longitude + offset : longitude;

  return (
    <MapContainer center={[finalLatitude, finalLongitude]} zoom={zoom} scrollWheelZoom={true} className='map'>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items.map(item => (
        <Pin item={item} key={item.id} />
      ))}
    </MapContainer>
  )
}

export default Map
