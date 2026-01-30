<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup lang="ts">
interface INominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import leafletApi from '../../apis/leaflet-api';

//@ts-ignore
import L, { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.css';

// FIX iconos (coloca esto antes de crear el mapa)
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const mapContainer = ref<HTMLDivElement | null>(null);
let map: LeafletMap | null = null;
let currentMarker: L.Marker | null = null;

const props = defineProps<{
  projectName?: string;
}>()

watch(props, async (value) =>{
  if(!value.projectName) return;

  const query = await leafletApi.get<INominatimResult[]>(`/search?q=${ encodeURIComponent(value.projectName) }`)

  if(query.data && query.data.length>=1){

    goToResult(query.data[0]!)
  }

})

onMounted(() => {
  if (!mapContainer.value) return;

  // Crear mapa centrado (ejemplo: RD)
  map = L.map(mapContainer.value).setView([19.42847, -70.6871], 8);

  // Capa base (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  // Ejemplo: marcador
  L.marker([19.42847, -70.6871])
    .addTo(map)
    .bindPopup('Aquí puede ser tu ubicación.')
    .openPopup();
});

onBeforeUnmount(() => {
  if (map) {
    map.remove(); // Limpia el mapa al destruir el componente
    map = null;
  }
});

const goToResult = (item: INominatimResult) => {
  if (!map) return;
  const lat = parseFloat(item.lat);
  const lon = parseFloat(item.lon);

  map.setView([lat, lon], 15);

  if (currentMarker) {
    currentMarker.remove();
  }

  currentMarker = L.marker([lat, lon]).addTo(map).bindPopup(item.display_name).openPopup();
};
</script>

<style >
.map-wrapper {
  width: 100%;
  height: 100%;
}

/* Ajusta la altura según tu layout */
.map-container {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
