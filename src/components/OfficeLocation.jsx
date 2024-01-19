import React, { useEffect, useRef } from 'react'
import { GoogleMap, Marker } from "@react-google-maps/api";
import threeDots from '../assets/3dots.png'

export default function OfficeLocation(props) {
    const [lat, lng] = props.location;
    const coordinates = { lat, lng };

    useEffect(() => {
        const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            console.error(
                "Google Maps API key not found. Make sure to set it in the .env file."
            );
        }
    }, []);

    const opt = useRef(null);
    const showOpt = ()=>{
        console.log(opt.current)
    }

    return (
        <div className='flex flex-col rounded-lg bg-[#F8F8FF] w-60'>
            <div className='flex flex-col justify-center relative'>
                <GoogleMap
                    mapContainerStyle={{ height: "120px", aspectRatio: "16/9", borderRadius: "8px 8px 0px 0px" }}
                    center={coordinates}
                    zoom={12}
                    options={{
                        zoomControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                    }}
                >
                    {props.location && <Marker position={coordinates} />}
                </GoogleMap>
                <div className="absolute flex z-4 justify-center align-center" style={{ background: 'linear-gradient(350deg, rgba(255, 255, 255, 0.6) 18.89%, rgba(255, 255, 255, 0) 100%)', width: "100%", height: "100%" }}>
                    <div className="flex w-48 justify-between align-center relative">
                        <div className="flex flex-col justify-center align-start">
                            <p className='font-bold text-base text-[#1C1C1C]'>{props.name}</p>
                            <p className='font-normal tracking-wider text-xs text-[#1C1C1C]'>Mumbai, Maharashtra</p>
                        </div>
                        <div className='flex flex-col justify-center align-start relative'>
                            <img src={threeDots} height={40} width={40} alt="" onClick={showOpt} />
                            <ul ref={opt} className="popup text-sm font-medium p-4 gap-1 w-26 z-7 border-2 flex flex-col absolute rounded-lg bg-[#FFFFFF] cursor-pointer" style={{ top: "78px", left: "-29px" }}>
                                <li className='text-[#464F60]'>Edit</li>
                                <li className='text-[#D1293D]'>Remove</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col rounded-lg gap-y-3.5 px-3 py-3'>
                <p className='text-base font-medium text-[#1C1C1C]'>Address of this</p>
                <p className='text-sm tracking-wider font-normal text-[#78858F] break-words'>IT Park, Karond road, near ampetheater, 462001</p>
                <p className='text-sm tracking-wider font-normal text-[#78858F]'>Mumbai, Maharashtra, India</p>
            </div>

        </div >
    )
}
