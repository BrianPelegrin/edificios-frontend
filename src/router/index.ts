import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router"

import LoginView from "../views/auth/LoginView.vue"
import MainLayout from "../layouts/MainLayout.vue"
import ProjectListGridview from "../views/projects/ProjectListGridview.vue"

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name:'login',
        component: LoginView
    },
    {
        path:'/',
        component: MainLayout,
        children: [
            {
                path:'projects',
                name:'projects-list',
                component: ProjectListGridview
            },
            {
                path:'projects-form',
                name:'projects-form',
                component: () => import('../views/projects/ProjectFormView.vue')
            },
            {
                path:'projects-form/:id',
                name:'projects-form-edit',
                component: () => import('../views/projects/ProjectFormView.vue')
            },
            {
                path:'projects-map',
                name:'projects-map',
                component: () => import('../views/projects/ProjectsListView.vue')
            },
            {
                path:'projects/apartments/:id',
                name:'apartments-list',
                component: ()=> import('../views/projects/ApartmentListView.vue')
            },
            {
                path:'projects/apartments',
                component: ()=> import('../views/projects/ApartmentListView.vue')
            },
            {
                path: 'projects/:id',
                name:'project-view',
                component: () => import('../views/projects/ProjectView.vue')
            },
            {
                path: 'buildings',
                name:'buildings-view',
                component: () => import('../views/buildings/BuildingsView.vue')
            },
            {
                path: 'buildings-form',
                name:'buildings-form',
                component: () => import('../views/buildings/BuildingFormView.vue')
            },
            {
                path: 'users',
                name:'users-list',
                component: () => import('../views/auth/UsersListView.vue')
            },
            {
                path: 'users-form',
                name:'users-form',
                component: () => import('../views/auth/UserFormView.vue')
            },
            {
                path: 'users-form/:id',
                name:'users-form-edit',
                component: () => import('../views/auth/UserFormView.vue')
            },
            {
                path:'',
                redirect:'/projects'
            }
        ]
    },
    {
        path:'/',
        redirect:'/projects'
    }
]

export default createRouter({
    history: createWebHashHistory(),
    routes
})
