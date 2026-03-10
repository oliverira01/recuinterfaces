<template>
  <footer class="bg-primary text-white py-3">
    <div class="container d-flex justify-content-between align-items-center">

      <div class="footer-links">
        <router-link class="text-white me-3" to="/">Aviso Legal</router-link>
        <router-link class="text-white me-3" to="/">Política de Cookies</router-link>
        <router-link class="text-white" to="/">Contacto</router-link>
      </div>

      <div class="footer-copy">
        &copy; {{ new Date().getFullYear() }} Alexandre Oliveira Vilar, Todos los derechos reservados
      </div>

    </div>
  </footer>
</template>

<script setup>
</script>

<style>
footer a {
  text-decoration: none;
}

footer a:hover {
  text-decoration: underline;
}
</style>