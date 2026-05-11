"use client";

import { useEffect, useRef } from "react";

const MONTES_CLAROS_CENTER: [number, number] = [-16.7278, -43.8425];
const MONTES_CLAROS_BOUNDS: [[number, number], [number, number]] = [
  [-16.812, -43.965],
  [-16.645, -43.748],
];

type Road = {
  t: string;
  p: [number, number][];
};

type RoadMapData = {
  roads: Road[];
};

function getRoadStyle(type: string): import("leaflet").PolylineOptions {
  const majorRoads = new Set(["motorway", "trunk", "primary", "secondary"]);
  const connectorRoads = new Set(["tertiary", "unclassified"]);

  if (majorRoads.has(type)) {
    return {
      color: "#ffffff",
      opacity: 0.82,
      weight: 1.35,
      lineCap: "round",
      lineJoin: "round",
      interactive: false,
    };
  }

  if (connectorRoads.has(type)) {
    return {
      color: "#ffffff",
      opacity: 0.52,
      weight: 0.72,
      lineCap: "round",
      lineJoin: "round",
      interactive: false,
    };
  }

  return {
    color: "#ffffff",
    opacity: 0.28,
    weight: 0.42,
    lineCap: "round",
    lineJoin: "round",
    interactive: false,
  };
}

export function MontesClarosMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    let disposed = false;
    let resizeObserver: ResizeObserver | null = null;
    let map: import("leaflet").Map | null = null;

    async function initializeMap() {
      const container = containerRef.current;

      if (!container || mapRef.current || disposed) return;

      const L = await import("leaflet");

      if (disposed || !container) return;

      map = L.map(container, {
        center: MONTES_CLAROS_CENTER,
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        dragging: true,
        tapHold: false,
        preferCanvas: true,
      });

      mapRef.current = map;

      const bounds = L.latLngBounds(MONTES_CLAROS_BOUNDS);
      map.setMaxBounds(bounds.pad(0.18));

      const roadRenderer = L.canvas({ padding: 0.45 });
      const response = await fetch("/data/montes-claros-roads.json");
      const roadMap = (await response.json()) as RoadMapData;

      const activeMap = mapRef.current;

      if (disposed || !activeMap) return;

      roadMap.roads.forEach((road) => {
        L.polyline(road.p, {
          ...getRoadStyle(road.t),
          renderer: roadRenderer,
        }).addTo(activeMap);
      });

      resizeObserver = new ResizeObserver(() => {
        map?.invalidateSize(false);
      });
      resizeObserver.observe(container);

      window.setTimeout(() => {
        map?.invalidateSize(false);
      }, 0);
    }

    initializeMap();

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div ref={containerRef} className="contact-map__viewport h-full w-full" />
      <div aria-hidden className="contact-map__triangle" />
    </div>
  );
}
