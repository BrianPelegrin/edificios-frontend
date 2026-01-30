<template>
    <section class="ms-4 mt-4">
        <!-- <section class="my-4 align-items-center row">
            <div class="col-12 col-xl-6 mb-2">

                <ul class="nav nav-pills nav-fill bg-white rounded p-2 border">
                    <li class="nav-item">
                        <button class="nav-link active">Rent</button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link">Buy</button>
                    </li>
                </ul>
            </div>
            <div class="col-12 col-xl-6 mb-2">
                <input class="form-control form-control-lg"  placeholder="Buscar" />
            </div>
        </section> -->

        <section class="card">
            <div class="card-header">
                <div class="row">
                    <div class="mb-3 col-12">
                        <input class="form-control form-control-lg w-100"  placeholder="Buscar" />
                    </div>
                    <div class="col-12 col-md-6 col-xl-3 mb-2">
                        <select class="form-select">
                            <option>Location</option>
                        </select>
                    </div>
                    <div class="col-12 col-md-6 col-xl-3 mb-2">
                        <select class="form-select">
                            <option>3 Rooms</option>
                        </select>
                    </div>
                    <div class="col-12 col-md-6 col-xl-3 mb-2">
                        <select class="form-select">
                            <option>All type</option>
                        </select>
                    </div>
                    <div class="col-12 col-md-6 col-xl-3">
                        <select class="form-select">
                            <option>More filter</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="card-body" style="overflow-y: auto; max-height: 80vh;">
                <div class="row">
                    <div v-for="project in projects " :key="project.id" class="col-12 col-xxl-6  mb-4">
                        <ProjectListItem :project="project" @select-project="$emit('selectProject', $event)" />
                    </div>
                </div>
            </div>
        </section>
    </section>
</template>

<script setup lang="ts">
import type { IProject } from '../../interfaces/projects';
import ProjectListItem from './ProjectListItem.vue';

interface IProps{
    projects: IProject[]
}

interface IEmit {
    (event: 'selectProject', args: string): void;
}

defineProps<IProps>()
defineEmits<IEmit>()

</script>

<style scoped>

</style>