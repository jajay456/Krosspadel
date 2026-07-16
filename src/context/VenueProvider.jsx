import { useState, useEffect, useCallback } from "react";
import { VenueContext } from "./VenueContext";
import { getVenues } from "../service/venueService";

export const VenueProvider = ({ children }) => {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshVenues = useCallback(async () => {
        setLoading(true);
        const data = await getVenues();
        setVenues(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        getVenues().then(data => {
            setVenues(data);
            setLoading(false);
        });
    }, []);

    return (
        <VenueContext.Provider value={{ venues, loading, refreshVenues }}>
            {children}
        </VenueContext.Provider>
    );
};