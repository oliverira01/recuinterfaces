<template>
  <div class="container mt-4">
    <h2 class="mb-3">Gestión de tareas</h2>
  <div class="row">

  <!--FORMULARIO-->
  <div class="col-lg-4">
    <form @submit.prevent="addTarea" class="card p-3 shadow">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">Crear / Editar tarea</h5>
        <button
          type="button"
          class="btn btn-sm btn-secondary"
          @click="resetTarea"
        >
          Limpiar
        </button>
      </div>

      <div class="mb-2">
        <label>Fecha</label>
        <input type="date" v-model="tarea.fecha" class="form-control">
      </div>

      <div class="mb-2">
        <label>Título</label>
        <input v-model="tarea.titulo" class="form-control">
      </div>

      <div class="mb-2">
        <label>Descripción</label>
        <textarea v-model="tarea.descripcion" class="form-control"></textarea>
      </div>

      <div class="mb-2">
        <label>Estado</label>
        <select v-model="tarea.estado" class="form-control">
          <option value="">Seleccione</option>
          <option value="pendiente">Pendiente</option>
          <option value="en proceso">En proceso</option>
          <option value="finalizado">Finalizado</option>
        </select>
      </div>

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

    <!-- EMPLEADO -->
    <div class="mb-3">
      <label>Empleado ID</label>
    <div class="input-group">

    <input
      v-model.number="tarea.empleadoId"
      :class="empleadoValido ? 'form-control bg-warning' : 'form-control'"
      placeholder="ID empleado"
    />

    <button
      type="button"
      class="btn btn-outline-secondary"
      @click="buscarEmpleado"
    >
      🔍
    </button>
    </div>

    <div v-if="empleadoEncontrado" class="mt-2 text-success">
      Empleado: {{ empleadoEncontrado.nombre }} {{ empleadoEncontrado.apellidos }}
    </div>

    </div>

    <button class="btn btn-primary w-100">
      Guardar tarea
    </button>
  </form>
</div>

<!--LISTADO-->
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
        <td>{{ getEmpleadoNombre(t.empleadoId) }}</td>
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
            <i class="bi bi-pencil"></i>
          </button>

          <button
            class="btn btn-sm btn-danger"
            @click="delTarea(t.id)"
          >
             <i class="bi bi-trash"></i>
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

const API_TAREAS = 'http://localhost:3000/tareas'
const API_EMPLEADOS = 'http://localhost:3000/empleados'

const tareas = ref([])
const empleados = ref([])

const empleadoValido = ref(false)

const tarea = reactive({
id:null,
fecha:'',
titulo:'',
descripcion:'',
estado:'',
prioridad:'',
empleadoId:null
})

/*PARA EL EMPLEADO DEL INPUT*/
const empleadoEncontrado = ref(null)

/*CARGAR DATOS*/
async function cargarDatos(){
try{

Swal.fire({
title:'Cargando datos...',
allowOutsideClick:false,
didOpen:()=>Swal.showLoading()
})

const resT = await fetch(API_TAREAS)
const resE = await fetch(API_EMPLEADOS)

tareas.value = await resT.json()
empleados.value = await resE.json()

Swal.close()

}catch(error){
Swal.fire('Error','No se pudieron cargar los datos','error')

}
}

onMounted(cargarDatos)

/*RESET*/
function resetTarea(){

tarea.id=null
tarea.fecha=''
tarea.titulo=''
tarea.descripcion=''
tarea.estado=''
tarea.prioridad=''
tarea.empleadoId=null

empleadoValido.value=false
empleadoEncontrado.value=null

}


/*VALIDAR*/
function validar(){

if(!tarea.titulo){
Swal.fire('Error','El título es obligatorio','error')
return false
}

if(!tarea.estado){
Swal.fire('Error','El estado es obligatorio','error')
return false
}

if(!tarea.fecha){
Swal.fire('Error','La fecha es obligatoria','error')
return false
}

if(!empleadoValido.value){
Swal.fire('Error','Empleado no válido','error')
return false
}

return true
}
/*ADD / EDIT*/

async function addTarea(){

if(!validar()) return

const result = await Swal.fire({
title:"¿Guardar cambios?",
icon:"question",
showCancelButton:true,
confirmButtonText:"Guardar",
cancelButtonText:"Cancelar"
})
if(!result.isConfirmed) return

try{
if(tarea.id === null){

const res = await fetch(API_TAREAS,{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify(tarea)
})

const data = await res.json()

tareas.value.push(data)
}else{
await fetch(`${API_TAREAS}/${tarea.id}`,{
method:'PUT',
headers:{'Content-Type':'application/json'},
body:JSON.stringify(tarea)
})
cargarDatos()
}
Swal.fire('Guardado','Tarea guardada','success')

resetTarea()
}catch(error){
Swal.fire('Error','No se pudo guardar la tarea','error')
}
}
/*EDITAR*/

function selTarea(t){
  Object.assign(tarea,t)

  empleadoValido.value=true
  empleadoEncontrado.value = empleados.value.find(
  e => Number(e.id) === Number(t.empleadoId)
  )
}

/*DELETE*/
async function delTarea(id){

const result = await Swal.fire({
title:'¿Eliminar tarea?',
icon:'warning',
showCancelButton:true
})

if(!result.isConfirmed) return

try{
if(tarea.id === id){
resetTarea()
}

await fetch(`${API_TAREAS}/${id}`,{
method:'DELETE'
})

tareas.value = tareas.value.filter(t=>t.id!==id)

Swal.fire('Eliminado','Tarea eliminada','success')

}catch(error){
Swal.fire('Error','No se pudo eliminar','error')
}
}

/*BUSCAR EMPLEADO*/
function buscarEmpleado(){
const emp = empleados.value.find(
  e => Number(e.id) === Number(tarea.empleadoId)
)

if(emp){
  empleadoValido.value = true
  empleadoEncontrado.value = emp

}else{
  empleadoValido.value = false
  empleadoEncontrado.value = null

  Swal.fire('Error','Empleado no existe','error')

  tarea.empleadoId = null
}
}

/*NOMBRE EMPLEADO*/
function getEmpleadoNombre(id){
const emp = empleados.value.find(
  e => Number(e.id) === Number(id)
)
if(emp){
  return emp.nombre + ' ' + emp.apellidos
}
return 'No encontrado'
}
</script>