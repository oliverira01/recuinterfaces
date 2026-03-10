<template>
    <div class="container mt-4">
        <h2 class="mb-3">Gestión de empleados</h2>
        <div class="row">

        <!-- FORMULARIO -->

        <div class="col-md-4">
        <form @submit.prevent="addEmpleado" class="card p-3 shadow">

        <h4>Empleado</h4>
        <div class="mb-2">
            <label>Nombre</label>
            <input v-model="empleado.nombre" class="form-control">
        </div>

        <div class="mb-2">
            <label>Apellidos</label>
            <input v-model="empleado.apellidos" class="form-control">
        </div>

        <div class="mb-2">
            <label>Email</label>
            <input v-model="empleado.email" class="form-control">
        </div>

        <div class="mb-2">
            <label>Móvil</label>
            <input v-model="empleado.movil" class="form-control">
        </div>

        <div class="mb-2">
            <label>Puesto</label>
            <select v-model="empleado.puesto" class="form-control">
                <option value="">Seleccione</option>
                <option>RRHH</option>
                <option>Contabilidad</option>
                <option>Almacén</option>
                <option>Ventas</option>
            </select>
        </div>

        <p class="text-danger">{{ error }}</p>

        <button class="btn btn-primary w-100">
            Guardar
        </button>
    </form>
</div>

<!-- LISTADO -->
<div class="col-md-8">
    <table class="table table-striped">
    <thead>
        <tr>
        <th>Nombre</th>
        <th>Apellidos</th>
        <th>Email</th>
        <th>Puesto</th>
    </tr>
    </thead>
    <tbody>
        <tr v-for="e in empleados" :key="e.id">

        <td>{{ e.nombre }} {{ e.apellidos }}</td>
        <td>{{ e.email }}</td>
        <td>{{ e.puesto }}</td>

        <td class="d-flex gap-2">

        <button
            class="btn btn-sm btn-warning"
            @click="selEmpleado(e)"
        >
            Cargar
        </button>

        <button
            class="btn btn-sm btn-danger"
            @click="delEmpleado(e.id)"
        >
            Eliminar
        </button>
        </td>
        </tr>
    </tbody>
    </table>
    </div>
</div>
</div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import Swal from 'sweetalert2'


const empleados = ref([])

const empleado = reactive({
  id: null,
  apellidos: '',
  nombre: '',
  email: '',
  movil: '',
  puesto: ''
})

const error = ref('')

function resetEmpleado() {
  empleado.id = null
  empleado.apellidos = ''
  empleado.nombre = ''
  empleado.email = ''
  empleado.movil = ''
  empleado.puesto = ''
}

function validar() {

  if (!empleado.nombre) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'El nombre es obligatorio'
    })
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!empleado.email || !emailRegex.test(empleado.email)) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Debe introducir un email válido'
    })
    return false
  }

  return true
}

function addEmpleado() {

  if (!validar()) return

  if (empleado.id === null) {

    const nuevo = {
      ...empleado,
      id: Date.now()
    }

    empleados.value.push(nuevo)

  } else {

    const index = empleados.value.findIndex(e => e.id === empleado.id)
    empleados.value[index] = { ...empleado }

  }

  Swal.fire({
    icon: 'success',
    title: 'Empleado guardado',
    text: 'Los datos se han guardado correctamente',
    timer: 1500,
    showConfirmButton: false
  })

  resetEmpleado()
}

function selEmpleado(e) {
  Object.assign(empleado, e)
}

function delEmpleado(id) {

  Swal.fire({
    title: '¿Eliminar empleado?',
    text: 'El empleado se eliminará',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar'
  }).then((result) => {

    if (result.isConfirmed) {

      empleados.value = empleados.value.filter(e => e.id !== id)

      Swal.fire(
        'Eliminado',
        'Empleado eliminado correctamente',
        'success'
      )

    }

  })
}

function getEmpleado() {
  return empleados.value
}
</script>

<style scoped>
</style>
