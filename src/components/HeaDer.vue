<script setup>
import logo from '@/assets/logo.png'
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary contenedor-navbar">
    <router-link class="navbar-brand" to="/">
      <img :src="logo" alt="logo" height="40">
    </router-link>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="menu">
      <ul class="navbar-nav ms-auto">

        <li class="nav-item">
          <router-link class="nav-link" to="/">Inicio</router-link>
        </li>

        <li class="nav-item">
          <router-link class="nav-link" to="/empleados">Empleados</router-link>
        </li>

        <li class="nav-item">
          <router-link class="nav-link" to="/tareas">Tareas</router-link>
        </li>

        <li class="nav-item">
          <router-link class="nav-link" to="/estadisticas">Estadisticas</router-link>
        </li>

        <li class="nav-item">
          <router-link class="nav-link" to="/about">Acerca</router-link>
        </li>

      </ul>
    </div>

  </nav>
</template>

<style>
.contenedor-navbar {
  padding: 1rem !important;
  margin-bottom: .5rem;
}
</style>