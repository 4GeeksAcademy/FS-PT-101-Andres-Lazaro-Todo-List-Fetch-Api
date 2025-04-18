import React, { useState, useEffect } from "react";

import '../../styles/index.css'


//Falta añadir la funcionalidad a updateTask
//Agregue un botón de limpieza de todas las tareas que eliminará toda la lista del servidor y actualizará la lista vacía en el front-end.

export const TodoList = () => {

    //Inicializacion de componentes 
    const [newTaskLabel, setNewTaskLabel] = useState('')            // inicializamos el useState de newTaskLabel--- como un string vacio 
    const [taskList, setTaskList] = useState([])                    // inicializamos el useState taskList como una lista vacia  --- array que contiene las tareas 
    const [editModeTaskId, setEditModeTaskId] = useState(null)      // inicializamos el useState de editTaskId en null --- contiene el id de la tarea que se esta editando 
    const [editTaskLabel, setEditTaskLabel] = useState('')          //inicializamos  el useState de la editTaskLabel como string vacio 

    const todayDate = `${new Date().toLocaleDateString('en-US', { weekday: 'long' })}, ${new Date().getDate()}`
    // Se ejecuta una vez se abre la pagina o se recarga 

    // Definicion de la funcion crear usuario (createUser) POST 
    const createUser = () => {

        fetch('https://playground.4geeks.com/todo/users/Lazaroth', {
            method: "POST", //Definimos el método  POST 
            headers: {
                'Content-Type': 'application/json'
            }

        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`error status code : ${response.status}`)
                }
                return response.json()
            })

            .then(() => getUserTodos())
            .catch(err => console.log(err))
    }

    //Definicion Funcion getUserTodos obtiene las tareas del usuario
    const getUserTodos = () => {

        //Metodo GET
        fetch('https://playground.4geeks.com/todo/users/Lazaroth')

            .then(response => {

                if (!response.ok) {
                    throw new Error(`error code: ${response.status}`)
                }
                return response.json()
            })
            // coge la respuesta y la pasa a formato json (la parsea) response.json() === parsedJson (tenemos la respuesta parseada )
            .then(parsedJson => setTaskList(parsedJson))
            .catch(err => createUser())  // si se produce un error al obtener los todos llamamos a la funcion crear usuario 
    }
    // Definicion de la Funcion createTask crea una Tarea para un usuario especifico
    const createTask = () => {

        fetch('https://playground.4geeks.com/todo/todos/Lazaroth', { // Llamada http POST a ala Api de tareas  
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ label: newTaskLabel, is_done: false }) // Construye el body con JSON.strigyfy 

            /*  Resultado de la funcion JSON.strigyfy
            
            { 
                "label": "valor que tenga la tarea en el input",
                "is_done": false
            } 
            */
        })
            .then(resp => { //Entonces utilizamos la respuesta 
                if (!resp.ok) {
                    throw new Error(`errorr status code: ${resp.status} `) // si la respuesta noo es succes (200-300) error me elevas el error 
                }
                return resp.json() // Si la respuesta es succes quiero el json de la respuesta 
            })

            .then(() => getUserTodos())  // Entonces se crea la tarea y llamamos a  getUserTodos() y se actualiza el listado de tareas dinamicamente sin necesidad de recargar la pagina llamando a getUserTodo
            .catch(err => console.log(err))
    }


    // Definicion de la funcion handleDelete con el método DELETE 
    const handleDelete = id => {
        //DELETE
        fetch('https://playground.4geeks.com/todo/todos/' + id, {
            method: "DELETE", //El metodo siempre en mayusc

        })
            .then(resp => {
                getUserTodos()
            })
            .catch(err => console.log(err))
    }

    // Definicion de la funcion handleSave
    const handleSave = (id) => (e) => { //pedir una tutoria para que me expliquen  poque necesitamos dos funciones flecha anidadas
        e.preventDefault();
        handlePUT(id) // hacemos la llamada a la api para actrualizar la tarea con el id especifico 
        setEditModeTaskId(null) //actualizamos el valor de editoModeTaskId a null. Para que ninguna tarea se muestre en mode de edición  

    }

    const handlePUT = (id) => {
        //PUT
        fetch('https://playground.4geeks.com/todo/todos/' + id, {
            method: "PUT", //El metodo siempre en mayusc
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                "label": editTaskLabel,
                "is_done": false
            }),

        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`error status code : ${response.status}`)
                }
                return response.json()
            })
            .then(() => getUserTodos())
            .catch(err => console.log(err))
    }

    //Cargamos los Todos --> las tareas
    useEffect(() => {// Hook de reactc que se ejecuta una unica vez cuando se recarga la página porque le pasamos un array vacio como segundo parametro 
        getUserTodos()
    }, [])

    // Definicion Funcion HANDLESUBMIT CUANDO SE HACE ENTER EN EL INPUT DE TAREAS 
    const handleSubmit = (e) => {
        e.preventDefault(); // no se ejecuta la accion por defecto 
        createTask();
        setNewTaskLabel(''); // se limpia el input 
    }

    const handleDeleteAllTasks = () => {

        // si  taskListexiste y no esta vacio entra 
        if (taskList.todos) {
            //Recorremos el array de tareas con un for y, en cada iteración, llamamos a handleDelete(tarea.id) para eliminar la tarea en el servidor.
            // lo hacemos de esta manera porque la api no tiene un metodo DELETE para eliminar todas las tareas 
            for (let i = 0; i < taskList.todos.length; i++) {
                handleDelete(taskList.todos[i].id);
            }
        }
    };




    //Devolvemos la Plantilla (Template)
    return (
        <div container className="todo">

            <h2 className='date'>Today is: {todayDate}</h2>

            <form onSubmit={handleSubmit}>
                <div className="write-task-container">
                <i class="fa-solid fa-angles-down"></i>
                    <span className="mx-3">Write new task</span>
                    <i class="fa-solid fa-angles-down"></i>
                </div>
                <input className="inputTask mt-3 input-group-text bg-body-tertiary" type="text" maxLength="50" value={newTaskLabel} onChange={input => { setNewTaskLabel(input.target.value); console.log(newTaskLabel); }} />
                <input className="btn btn-success my-2" type="submit" value="Add Task" />
                <h2 className="tareasPendientes ">Pending Tasks: </h2>

            </form>
            <div>
                <ul className="list-group">
                    {taskList.todos?.map((tarea, index) => ( // recorrro la lista de tareas con map para renderizar cada una de ellas 
                        editModeTaskId === tarea.id ? (      // si alguna de las tareas esta en edicion pinto el formulario 

                            <form key={index} onSubmit={handleSave(tarea.id)}>
                                <input className="inputTask my-3 input-group-text bg-body-tertiary" type="text" value={editTaskLabel} onChange={input => setEditTaskLabel(input.target.value)} />
                                <input className="mb-3 btn btn-primary" type="submit" value="Guardar Cambios " />
                            </form>
                        ) : (
                            // si esta tarea no se esta editando pinto el li 

                            <li className="tareas list-group-item rounded-2 list-group-item-dark " key={index}>

                                <span className='tareasCreadas'>
                                    {tarea.label}
                                </span>
                                <span style={{ marginLeft: '10px' }}> {/* Esto agrega espacio sin salto de línea */}
                                    {todayDate}
                                </span>


                                <span className="btn btn-success"
                                    style={{ marginLeft: '10px', color: 'white', cursor: 'pointer' }}
                                    onClick={() => { setEditModeTaskId(tarea.id); setEditTaskLabel(tarea.label) }}><span class="fa-solid fa-pen-to-square"></span></span>
                                <span className="btn btn-danger"
                                    onClick={() => handleDelete(tarea.id)}
                                    style={{ marginLeft: '10px', color: 'white', cursor: 'pointer' }}>
                                    <span class="fa-solid fa-trash"></span>
                                </span>

                            </li>
                        )
                    ))}




                    {taskList.todos?.length > 0 && (
                        // comprobamos si el array todos dentro de taskList tiene elementos 
                        // solo mostramos el boton de eliminar todas las tareas si el array contiene elementos 
                        <div className="deleteAllTasks">
                            <span className="btn btn-danger " onClick={() => handleDeleteAllTasks()}>
                                Delete All Tasks
                            </span>
                        </div>
                    )}
                </ul>



            </div>
        </div>
    );
}

export default TodoList;