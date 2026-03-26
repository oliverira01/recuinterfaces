<template>
  <div class="contenedor-principal">
    <Header></Header>
    <main class="contenido">
      <router-view />
    </main>
    <Footer></Footer>
  </div>
</template>

<script setup>
import Header from "./components/HeaDer.vue"
import Footer from "./components/FooTer.vue"
</script>

<style scoped>
  .contenedor-principal {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 80%;
    margin: auto;
  }

  .contenido {
    flex: 1;
  }
</style>
