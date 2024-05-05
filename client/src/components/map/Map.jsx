import { MapContainer, TileLayer } from 'react-leaflet'
import './map.scss'
import "leaflet/dist/leaflet.css";
import Pin from '../pin/Pin';

function Map({ items, latitude, longitude, zoom = 10, pin_house = true }) {
    return (
        <MapContainer center={[latitude, longitude]} zoom={zoom} scrollWheelZoom={true} className='map'>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {items.map(item => (
                <Pin item={item} key={item.id} pin_house={pin_house} />
            ))}
        </MapContainer>
    )
}

export default Map
