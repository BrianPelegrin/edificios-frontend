<template>
    <div>
        <MapLeaflet :project-name="projectName" />
        <ProjectList
            :projects="projects"
            @select-project="onSelectProject" 
            class="w-30 project-list-absoulute" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import MapLeaflet from '../../components/projects/MapLeaflet.vue';
import ProjectList from '../../components/projects/ProjectList.vue';
import type { IProject } from '../../interfaces/projects';
import buildingsApi from '../../apis/buildings-api';

const projectName = ref<string>('')

const onSelectProject = ( name:string ) => {
    projectName.value = name;
}

const projects = ref<IProject[]>([]);

onMounted(async ()=>{
  const response = await buildingsApi.get<IProject[]>('/api/projects')
  projects.value = response.data;
})


</script>

<style>
.project-list-absoulute{
    position: fixed;
    top: 0;
    left: 10;    
    bottom: 0;
    z-index: 1020;
}
/* 

.bg{
    background-image: url('https://media.wired.com/photos/59269cd37034dc5f91bec0f1/191:100/w_1280,c_limit/GoogleMapTA.jpg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    height: 100vh;
    overflow: hidden;

} */

@media (min-width: 768px){
    .w-30{
        max-width: 40%;
    }
}
</style>