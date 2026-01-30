<template>
    <div class="card">

        <div style="cursor: pointer;" @click="$emit('selectProject', project.nombre)" class="card-body">
            <h5  >{{ project.nombre }}</h5>
            <strong class="fs-4 text-primary">
                {{ project.id }}
            </strong>
            <p>{{ project.direccion }}</p>
            <p>{{ project.provincia }}</p>
            <p>{{ project.municipio }}</p>
            <!-- <div class="row">
                <div class="col-auto">
                    <i class="bi bi-bounding-box text-primary"></i>
                    2 Baths, 2 bad
                </div>
                <div class="col-auto">
                    <i class="bi bi-aspect-ratio text-primary"></i>
                    2 Baths, 2 bad
                </div>
            </div> -->
        </div>
        <div class="card-footer">
            <div class="row">
                <div class="col">
                    <a :href="`./building_units_complete.html?code=${project.id}`" class="btn btn-lg btn-primary w-100">Visualizar en 3D</a>
                </div>
                <div class="col">
                    <button @click="$router.push({name: 'apartments-list', params: { id: project.id} })" class="btn btn-lg btn-primary w-100">Detalles</button>
                </div>
            </div>
        </div>
    </div>
    <!-- <div class="card">
        <img src="https://mir-s3-cdn-cf.behance.net/projects/404/470cde237648193.Y3JvcCwzMjgxLDI1NjYsMCwxMjE.jpg" class="card-img-top" />
        <div class="card-body">
            <h5 style="cursor: pointer;" @click="$emit('selectProject', 'Uepa')">3-rooms apartaments</h5>
            <strong class="fs-4 text-primary">
                $5.00/Mo
            </strong>
            <p>2464 Royal Ln Mesa, new Jersey 45463</p>
            <div class="row">
                <div class="col-auto">
                    <i class="bi bi-bounding-box text-primary"></i>
                    2 Baths, 2 bad
                </div>
                <div class="col-auto">
                    <i class="bi bi-aspect-ratio text-primary"></i>
                    2 Baths, 2 bad
                </div>
            </div>
        </div>
        <div class="card-footer">
            <button class="btn btn-lg btn-primary w-100">Visualizar en 3D</button>
        </div>
    </div> -->
</template>

<script setup lang="ts">
import type { IProject } from '../../interfaces/projects';

defineProps<{
    project:IProject
}>()

defineEmits<{
    (event: 'selectProject', args: string): void;
}>();

</script>

<style scoped>

</style>