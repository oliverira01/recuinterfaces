<template>
<div class="container mt-4">
  <h2 class="mb-3">Gestión de tareas</h2>

  <div class="row">
    <!-- ================== FORMULARIO ================== -->
    <div class="col-lg-4">
      <form @submit.prevent="addTarea" class="card p-3 shadow">

        <h5 class="mb-3">Crear / Editar tarea</h5>

        <!-- FECHA -->
        <div class="mb-2">
          <label>Fecha</label>
          <input type="date" v-model="tarea.fecha" class="form-control">
        </div>

        <!-- TITULO -->
        <div class="mb-2">
          <label>Título</label>
          <input v-model="tarea.titulo" class="form-control">
        </div>

        <!-- DESCRIPCION -->
        <div class="mb-2">
          <label>Descripción</label>
          <textarea v-model="tarea.descripcion" class="form-control"></textarea>
        </div>

        <!-- ESTADO -->
        <div class="mb-2">
          <label>Estado</label>
          <select v-model="tarea.estado" class="form-control">
            <option value="">Seleccione</option>
            <option value="pendiente">Pendiente</option>
            <option value="en proceso">En proceso</option>
            <option value="finalizado">Finalizado</option>
          </select>
        </div>

        <!-- PRIORIDAD (RADIOBUTTON) -->
        <div class="mb-2">
          <label>Prioridad</label>

          <div class="d-flex gap-3 mt-1">
            <label>
              <input type="radio" value="baja" v-model="tarea.prioridad"> Baja
            </label>

            <label>
              <input type="radio" value="media" v-model="tarea.prioridad"> Media
            </label>

            <label>
              <input type="radio" value="alta" v-model="tarea.prioridad"> Alta
            </label>
          </div>
        </div>

        <!-- BUSCAR EMPLEADO -->
        <div class="mb-3">
          <label>Empleado ID</label>

          <div class="input-group">

            <input
              v-model.number="tarea.empleadoId"
              :class="empleadoValido ? 'form-control bg-warning' : 'form-control'"
              placeholder="ID empleado"
            >

            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="buscarEmpleado"
            >
              🔍
            </button>

          </div>
        </div>

        <button class="btn btn-primary w-100">
          Guardar tarea
        </button>

      </form>
    </div>

    <!-- ================== LISTADO ================== -->
    <div class="col-lg-8">

      <table class="table table-striped shadow">

        <thead>
          <tr>
            <th>Título</th>
            <th>Fecha</th>
            <th>Empleado</th>
            <th>Estado</th>
            <th>Prioridad</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>

          <tr v-for="t in tareas" :key="t.id">

            <td>{{ t.titulo }}</td>

            <td>{{ t.fecha }}</td>

            <!-- Mostrar nombre del empleado -->
            <td>{{ getEmpleadoNombre(t.empleadoId) }}</td>

            <!-- Indicador visual del estado -->
            <td>
              <span
                class="badge"
                :class="{
                  'bg-danger': t.estado === 'pendiente',
                  'bg-warning': t.estado === 'en proceso',
                  'bg-success': t.estado === 'finalizado'
                }"
              >
                {{ t.estado }}
              </span>
            </td>

            <td>{{ t.prioridad }}</td>

            <td class="d-flex gap-2">

              <button
                class="btn btn-sm btn-warning"
                @click="selTarea(t)"
              >
                Editar
              </button>

              <button
                class="btn btn-sm btn-danger"
                @click="delTarea(t.id)"
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

import { ref, reactive, onMounted } from 'vue'
import Swal from 'sweetalert2'
import empleadosData from '../data/empleados.json'
import tareasData from '../data/tareas.json'

const tareas = ref([])

const empleadoValido = ref(false)

onMounted(() => {
  tareas.value = [...tareasData]
})

const tarea = reactive({
  id: null,
  fecha: '',
  titulo: '',
  descripcion: '',
  estado: '',
  prioridad: '',
  empleadoId: null
})

function resetTarea(){
  tarea.id = null
  tarea.fecha = ''
  tarea.titulo = ''
  tarea.descripcion = ''
  tarea.estado = ''
  tarea.prioridad = ''
  tarea.empleadoId = null
}

function validar(){

  if(!tarea.titulo){
    Swal.fire('Error','El título es obligatorio','error')
    return false
  }

  if(!tarea.estado){
    Swal.fire('Error','Debe seleccionar un estado','error')
    return false
  }

  if(!empleadoValido.value){
    Swal.fire('Error','Empleado no válido','error')
    return false
  }

  return true
}

function addTarea(){

  if(!validar()) return

  if(tarea.id === null){

    tareas.value.push({
      ...tarea,
      id: Date.now()
    })

  }else{

    const index = tareas.value.findIndex(t => t.id === tarea.id)
    tareas.value[index] = {...tarea}

  }

  Swal.fire('Guardado','Tarea guardada correctamente','success')

  resetTarea()
}

function selTarea(t){
  Object.assign(tarea, t)
}

function delTarea(id){

  tareas.value = tareas.value.filter(t => t.id !== id)

  Swal.fire('Eliminado','Tarea eliminada','success')
}

function buscarEmpleado() {
  const emp = empleadosData.find(e => e.id === tarea.empleadoId)

  if(emp){
    empleadoValido.value = true
  }else{
    empleadoValido.value = false
    Swal.fire('Error','Empleado no existe','error')
    tarea.empleadoId = null
  }
}

function getEmpleadoNombre(id) {
  const emp = empleadosData.find(e => e.id === id)

  if(emp){
    return emp.nombre + ' ' + emp.apellidos
  }

  return 'No encontrado'
}

</script>