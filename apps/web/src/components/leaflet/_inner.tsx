'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import Leaflet from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import markerPng from './marker-icon.png';

const markerIcon = new Leaflet.Icon({
  iconUrl: markerPng.src,
  iconAnchor: [markerPng.width / 2, markerPng.height],
});

export interface MarkerProps extends Omit<ComponentPropsWithoutRef<typeof Marker>, 'children'> {
  popupProps: ComponentPropsWithoutRef<typeof Popup>;
}
export interface LeafletMapProps extends ComponentPropsWithoutRef<typeof MapContainer> {
  markers?: Array<MarkerProps>;
}

const LeafletMapInner = ({ center, markers, ...props }: LeafletMapProps) => {
  if (typeof window === 'undefined') {
    return <div />;
  }
  return (
    <div className="[&>.leaflet-container]:h-96 [&>.leaflet-container]:w-full">
      <MapContainer center={center || markers?.[0]?.position} zoom={16} scrollWheelZoom={false} {...props}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // attribution='<a href="https://api.portal.hkmapservice.gov.hk/disclaimer" target="_blank" class="copyrightDiv">© Map information from Lands Department</a><div style="margin-left:4px;width:28px;height:28px;display:inline-flex;background:url(https://api.hkmapservice.gov.hk/mapapi/landsdlogo.jpg);background-size:28px;"></div>'
          // url="https://mapapi.geodata.gov.hk/gs/api/v1.0.0/xyz/basemap/wgs84/{z}/{x}/{y}.png"
        />
        {markers?.map(({ popupProps, ...props }, index) => (
          <Marker key={index} icon={markerIcon} {...props}>
            <Popup {...popupProps} />
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafletMapInner;
