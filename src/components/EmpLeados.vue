<template>
  <div class="container mt-4">
    <h2 class="mb-3">Gestión de empleados</h2>
  <div class="row">

  <!--FORMULARIO-->
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

      <button class="btn btn-primary w-100">
        Guardar
      </button>
    </form>
  </div>

  <!--TABLA-->
  <div class="col-md-8">
    <table class="table table-striped shadow">
      <thead>
          <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Puesto</th>
          <th>Acciones</th>
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
import { ref, reactive, onMounted } from 'vue'
import Swal from 'sweetalert2'

const API = 'http://localhost:3000/empleados'

const empleados = ref([])

const empleado = reactive({
id:null,
apellidos:'',
nombre:'',
email:'',
movil:'',
puesto:''
})

/*CARGAR EMPLEADOS*/
async function cargarEmpleados(){
try{
Swal.fire({
title:'Cargando empleados...',
allowOutsideClick:false,
didOpen:()=>Swal.showLoading()
})

const res = await fetch(API)
empleados.value = await res.json()

Swal.close()
}catch(error){
Swal.fire('Error','No se pudieron cargar empleados','error')
}
}

onMounted(cargarEmpleados)

/*RESET FORM*/
function resetEmpleado(){

empleado.id=null
empleado.apellidos=''
empleado.nombre=''
empleado.email=''
empleado.movil=''
empleado.puesto=''
}

/*VALIDACION*/
function validar(){
if(!empleado.nombre){
Swal.fire('Error','El nombre es obligatorio','error')
return false
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

if(!empleado.email || !emailRegex.test(empleado.email)){

Swal.fire('Error','Debe introducir un email válido','error')
return false
}
return true

}

/*ADD / EDIT*/
async function addEmpleado(){
if(!validar()) return
try{
if(empleado.id === null){

/* POST */
const res = await fetch(API,{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify(empleado)
})

const data = await res.json()

empleados.value.push(data)

}else{
/* PUT */
await fetch(`${API}/${empleado.id}`,{
method:'PUT',
headers:{'Content-Type':'application/json'},
body:JSON.stringify(empleado)
})

cargarEmpleados()
}
Swal.fire({
icon:'success',
title:'Empleado guardado',
timer:1500,
showConfirmButton:false
})

resetEmpleado()

}catch(error){
Swal.fire('Error','No se pudo guardar el empleado','error')
}

}

/*CARGAR EMPLEADO EN FORM */
function selEmpleado(e){
Object.assign(empleado,e)

}
/*ELIMINAR*/
async function delEmpleado(id){

const result = await Swal.fire({
title:'¿Eliminar empleado?',
icon:'warning',
showCancelButton:true,
confirmButtonText:'Sí, eliminar'
})

if(!result.isConfirmed) return
try{

await fetch(`${API}/${id}`,{
method:'DELETE'
})

empleados.value = empleados.value.filter(e=>e.id!==id)
Swal.fire('Eliminado','Empleado eliminado','success')

}catch(error){
Swal.fire('Error','No se pudo eliminar','error')

}
}

</script>
<style scoped>
</style>