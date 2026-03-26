import { useEffect, useState } from "react";

export interface GeoPosition {
    lat: number;
    lng: number;
}

export default function useGeolocation() {
    const [position, setPosition] = useState<GeoPosition | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Trình duyệt không hỗ trợ GPS");
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                setPosition({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
            },
            (err) => {
                setError(err.message);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 1000,
                timeout: 5000,
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return { position, error };
}