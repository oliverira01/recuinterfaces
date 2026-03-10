<template>
    <!-- Contenedor principal usando Bootstrap -->
    <div class="container mt-4">
        <h2 class="mb-3">Gestión de empleados</h2>

        <!-- Grid de Bootstrap para separar formulario y tabla -->
        <div class="row">

        <!-- ================= FORMULARIO ================= -->

        <div class="col-md-4">
        <!-- submit.prevent evita que la página se recargue -->
        <form @submit.prevent="addEmpleado" class="card p-3 shadow">

        <h4>Empleado</h4>

        <!-- Campo nombre con enlace reactivo mediante v-model -->
        <div class="mb-2">
            <label>Nombre</label>
            <input v-model="empleado.nombre" class="form-control">
        </div>

        <!-- Campo apellidos -->
        <div class="mb-2">
            <label>Apellidos</label>
            <input v-model="empleado.apellidos" class="form-control">
        </div>

        <!-- Campo email -->
        <div class="mb-2">
            <label>Email</label>
            <input v-model="empleado.email" class="form-control">
        </div>

        <!-- Campo móvil -->
        <div class="mb-2">
            <label>Móvil</label>
            <input v-model="empleado.movil" class="form-control">
        </div>

        <!-- Select para elegir el puesto -->
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

        <!-- Mensaje de error si existe -->
        <p class="text-danger">{{ error }}</p>

        <!-- Botón para guardar empleado -->
        <button class="btn btn-primary w-100">
            Guardar
        </button>
    </form>
</div>

<!-- ================= LISTADO DE EMPLEADOS ================= -->
<div class="col-md-8">

    <!-- Tabla que muestra los empleados -->
    <table class="table table-striped">

    <thead>
        <tr>
        <th>Nombre</th>
        <th>Email</th>
        <th>Puesto</th>
        <th>Acciones</th>
    </tr>
    </thead>

    <tbody>

        <!-- v-for recorre el array de empleados -->
        <tr v-for="e in empleados" :key="e.id">

        <!-- Muestra nombre y apellidos -->
        <td>{{ e.nombre }} {{ e.apellidos }}</td>

        <!-- Email del empleado -->
        <td>{{ e.email }}</td>

        <!-- Puesto del empleado -->
        <td>{{ e.puesto }}</td>

        <!-- Botones de acciones -->
        <td class="d-flex gap-2">

        <!-- Cargar datos del empleado en el formulario -->
        <button
            class="btn btn-sm btn-warning"
            @click="selEmpleado(e)"
        >
            Cargar
        </button>

        <!-- Eliminar empleado -->
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
import { reactive, ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import empleadosData from '../data/empleados.json'

const empleados = ref([])

onMounted(() => {
  empleados.value = [...empleadosData]  // copia los datos del JSON para no modificarlo directamente
})

function guardarLocal() {
  localStorage.setItem('empleados', JSON.stringify(empleados.value))
}

// Objeto reactivo que representa el empleado del formulario
const empleado = reactive({
  id: null,
  apellidos: '',
  nombre: '',
  email: '',
  movil: '',
  puesto: ''
})


// Variable para mensajes de error
const error = ref('')


// Función para limpiar el formulario
function resetEmpleado() {
  empleado.id = null
  empleado.apellidos = ''
  empleado.nombre = ''
  empleado.email = ''
  empleado.movil = ''
  empleado.puesto = ''
}


// Función de validación del formulario
function validar() {

  // Validar nombre obligatorio
  if (!empleado.nombre) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'El nombre es obligatorio'
    })
    return false
  }

  // Expresión regular para validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Validar formato de email
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


// Función para añadir o actualizar un empleado
function addEmpleado() {

  // Si la validación falla no continúa
  if (!validar()) return

  // Si el empleado no tiene id se crea uno nuevo
  if (empleado.id === null) {

    const nuevo = {
      ...empleado,
      id: Date.now() // id generado con timestamp
    }

    // Se añade al array de empleados
    empleados.value.push(nuevo)

    guardarLocal()

  } else {

    // Si ya tiene id se actualiza el empleado
    const index = empleados.value.findIndex(e => e.id === empleado.id)
    empleados.value[index] = { ...empleado }

    guardarLocal()
  }

  // Mensaje de éxito
  Swal.fire({
    icon: 'success',
    title: 'Empleado guardado',
    text: 'Los datos se han guardado correctamente',
    timer: 1500,
    showConfirmButton: false
  })

  // Limpiar formulario
  resetEmpleado()
}


// Cargar datos de un empleado en el formulario
function selEmpleado(e) {
  Object.assign(empleado, e)
}


// Eliminar empleado
function delEmpleado(id) {

  // Confirmación antes de eliminar
  Swal.fire({
    title: '¿Eliminar empleado?',
    text: 'El empleado se eliminará',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar'
  }).then((result) => {

    if (result.isConfirmed) {

      // Filtra el array quitando el empleado eliminado
      empleados.value = empleados.value.filter(e => e.id !== id)

      guardarLocal()
      // Mensaje de eliminación correcta
      Swal.fire(
        'Eliminado',
        'Empleado eliminado correctamente',
        'success'
      )
    }
  })
}


// Devuelve la lista de empleados
function getEmpleado() {
  return empleados.value
}

</script>

<style scoped>
</style>