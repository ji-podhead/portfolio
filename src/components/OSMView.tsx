"use client";
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import * as d3 from 'd3';
import * as d3Geo from 'd3-geo';

// SVG Icons data, similar to svgListe.json
const svgIcons = {
    markerPath: "M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z",
    markerView: "0 0 24 24",
    // Placeholder for a university icon
    universityIcon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"
};

// Data for the map locations
const locations = [
    { id: "tu", name: "TU Berlin", coords: [52.512, 13.327] as [number, number], icon: svgIcons.universityIcon },
    { id: "ds", name: "DeepSafety GmbH", coords: [52.520, 13.380] as [number, number], icon: svgIcons.markerPath } // Using a generic marker for the company
];

const OSMView = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const selectedMarker = useRef<string | null>(null);

    useEffect(() => {
        if (!mapRef.current || (mapRef.current as any)._leaflet_id) return;

        const map = L.map(mapRef.current).setView([52.516, 13.35], 13);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        const svg = d3.select(map.getPanes().overlayPane).append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .style("position", "absolute")
            .style("z-index", 400);

        const g = svg.append("g").attr("class", "leaflet-zoom-hide");

        // Create marker groups
        const markerGroups = g.selectAll(".marker")
            .data(locations)
            .enter()
            .append("g")
            .attr("class", "marker")
            .attr("id", d => `marker-${d.id}`);

        // Add circle background
        markerGroups.append("circle")
            .attr("r", 20)
            .style("fill", "#1a1a1a")
            .style("stroke", "#00ff41")
            .style("stroke-width", 2)
            .style("opacity", 0.8)
            .attr("transform", "scale(0.75)");

        // Add icon
        markerGroups.append("path")
            .attr("d", d => d.icon)
            .attr("fill", "white")
            .attr("transform", "scale(0.5) translate(-24, -24)");

        // Add popup text (initially hidden)
        const popup = markerGroups.append("g")
            .attr("class", "popup")
            .style("opacity", 0);

        popup.append("rect")
            .attr("width", 150)
            .attr("height", 30)
            .attr("rx", 5)
            .attr("ry", 5)
            .style("fill", "black")
            .style("stroke", "#00ff41")
            .attr("y", -50)
            .attr("x", -75);

        popup.append("text")
            .text(d => d.name)
            .attr("text-anchor", "middle")
            .attr("y", -30)
            .style("fill", "white")
            .style("font-size", "12px");


        const updatePositions = () => {
            markerGroups.attr("transform", d => {
                const point = map.latLngToLayerPoint(new L.LatLng(d.coords[0], d.coords[1]));
                return `translate(${point.x}, ${point.y})`;
            });
        };

        // Interactivity
        markerGroups.on('mouseover', function (event, d) {
            if (selectedMarker.current === d.id) return;
            d3.select(this).select("circle").transition().duration(150).attr("transform", "scale(1)");
            d3.select(this).select(".popup").transition().duration(150).style("opacity", 1);
        });

        markerGroups.on('mouseout', function (event, d) {
            if (selectedMarker.current === d.id) return;
            d3.select(this).select("circle").transition().duration(150).attr("transform", "scale(0.75)");
            d3.select(this).select(".popup").transition().duration(150).style("opacity", 0);
        });

        markerGroups.on('click', function (event, d) {
            // Unselect previous
            if(selectedMarker.current) {
                 d3.select(`#marker-${selectedMarker.current}`).select("circle").transition().duration(150).attr("transform", "scale(0.75)");
                 d3.select(`#marker-${selectedMarker.current}`).select(".popup").transition().duration(150).style("opacity", 0);
            }
            // Select new one
            selectedMarker.current = d.id;
            d3.select(this).select("circle").transition().duration(150).attr("transform", "scale(1.2)");
            d3.select(this).select(".popup").transition().duration(150).style("opacity", 1);
            map.setView(d.coords, 15, { animate: true });
        });

        map.on("viewreset moveend", updatePositions);
        updatePositions();

        return () => {
            map.remove();
        };

    }, [mapRef]);

    return (
        <section id="map-section" className="h-screen w-screen relative">
            <h2 className="absolute top-10 left-1/2 -translate-x-1/2 z-10 text-white text-3xl font-mono" style={{textShadow: '2px 2px 4px #000'}}>My Locations</h2>
            <div ref={mapRef} style={{ height: '100%', width: '100%', backgroundColor: '#111' }}></div>
        </section>
    );
};

export default OSMView;