// @ts-nocheck
import { useEffect, useRef } from "react";
import { STATUS_ICONS, timeAgo } from "./constants";

export default function LiveMap({ agents, selectedAgent, onAgentClick }) {
    const mapRef = useRef(null);
    const leafletMap = useRef(null);
    const markersRef = useRef({});

    useEffect(() => {
        if (!document.getElementById("leaflet-css")) {
            const link = document.createElement("link");
            link.id = "leaflet-css";
            link.rel = "stylesheet";
            link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
            document.head.appendChild(link);
        }

        const initMap = () => {
            if (leafletMap.current || !mapRef.current) return;

            leafletMap.current = window.L.map(mapRef.current, {
                center: [20.5937, 78.9629],
                zoom: 5,
                zoomControl: true,
            });

            window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "© OpenStreetMap contributors",
                maxZoom: 19,
            }).addTo(leafletMap.current);
        };

        if (window.L) {
            initMap();
        } else {
            const script = document.createElement("script");
            script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
            script.onload = initMap;
            document.head.appendChild(script);
        }

        return () => {
            if (leafletMap.current) {
                leafletMap.current.remove();
                leafletMap.current = null;
                markersRef.current = {};
            }
        };
    }, []);

    useEffect(() => {
        if (!leafletMap.current || !window.L) return;

        const agentsWithLocation = agents.filter((a) => a.hasLocation);
        if (agentsWithLocation.length === 0) return;

        agentsWithLocation.forEach((agentData) => {
            const id = agentData.agent.employeeId;
            const name = `${agentData.agent.firstName} ${agentData.agent.lastName}`;
            const isSelected = selectedAgent?.agent?.employeeId === id;

            const markerColor = isSelected ? "#3b82f6" : "#64748b";
            const icon = window.L.divIcon({
                className: "",
                html: `
          <div style="
            background: ${markerColor};
            width: ${isSelected ? "44px" : "36px"};
            height: ${isSelected ? "44px" : "36px"};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="
              transform: rotate(45deg);
              color: white;
              font-size: ${isSelected ? "14px" : "11px"};
              font-weight: 900;
              font-family: sans-serif;
            ">${name[0]}${agentData.agent.lastName[0]}</span>
          </div>
        `,
                iconSize: [isSelected ? 44 : 36, isSelected ? 44 : 36],
                iconAnchor: [isSelected ? 22 : 18, isSelected ? 44 : 36],
            });

            const popupContent = `
        <div style="min-width:180px; font-family:sans-serif;">
          <p style="font-weight:900; font-size:14px; margin:0 0 4px">${name}</p>
          <p style="color:#64748b; font-size:12px; margin:0 0 6px">${agentData.agent.department}</p>
          <p style="font-size:12px; margin:0 0 3px">
            <b>Status:</b> ${STATUS_ICONS[agentData.visitStatus] || ""} ${agentData.visitStatus}
          </p>
          ${agentData.clientName ? `<p style="font-size:12px; margin:0 0 3px"><b>Client:</b> ${agentData.clientName}</p>` : ""}
          ${agentData.address ? `<p style="font-size:11px; color:#94a3b8; margin:0">${agentData.address}</p>` : ""}
          <p style="font-size:11px; color:#94a3b8; margin:4px 0 0">
            Last seen: ${timeAgo(agentData.lastSeen)}
          </p>
        </div>
      `;

            if (markersRef.current[id]) {
                markersRef.current[id]
                    .setLatLng([agentData.latitude, agentData.longitude])
                    .setIcon(icon)
                    .bindPopup(popupContent);
            } else {
                const marker = window.L.marker([agentData.latitude, agentData.longitude], { icon })
                    .addTo(leafletMap.current)
                    .bindPopup(popupContent)
                    .on("click", () => onAgentClick(agentData));
                markersRef.current[id] = marker;
            }
        });

        if (agentsWithLocation.length > 0 && !selectedAgent) {
            const bounds = agentsWithLocation.map((a) => [a.latitude, a.longitude]);
            leafletMap.current.fitBounds(bounds, { padding: [40, 40] });
        }

        if (selectedAgent?.hasLocation) {
            leafletMap.current.setView(
                [selectedAgent.latitude, selectedAgent.longitude],
                14,
                { animate: true }
            );
            const id = selectedAgent.agent.employeeId;
            markersRef.current[id]?.openPopup();
        }
    }, [agents, selectedAgent, onAgentClick]);

    return (
        <div
            ref={mapRef}
            className="w-full h-full rounded-2xl overflow-hidden"
            style={{ minHeight: "400px" }}
        />
    );
}
