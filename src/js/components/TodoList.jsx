import React, { useState, useEffect } from "react";


//Falta añadir la funcionalidad a updateTask
//Agregue un botón de limpieza de todas las tareas que eliminará toda la lista del servidor y actualizará la lista vacía en el front-end.

export const TodoList = () => {

    //Inicializacion de componentes 
    const [task, setTask] = useState('')  // inicializamos el useState de task vacio  -- string 
    const [data, setData] = useState([])  // inicializamos el useState data como una lista vacia  --- array

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

            .then(() => getUserTodos)
            .catch(err => console.log(err))
    }

    const getUserTodos = () => { //Definicion Funcion getUserTodos obtiene las tareas del usuario

        //Metodo GET
        fetch('https://playground.4geeks.com/todo/users/Lazaroth')

            .then(response => {
                console.log(response)
                if (!response.ok) throw new Error(`error code: ${response.status}`)
                return response.json()
            })
            // coge la respuesta y la pasa a formato json (la parsea) response.json() === parsedJson (tenemos la respuesta parseada )
            .then(parsedJson => setData(parsedJson))
            .catch(err => createUser())
    }

    const createTask = () => {  // Definicion de la Funcion createTask crea una Tarea para un usuario especifico

        fetch('https://playground.4geeks.com/todo/todos/Lazaroth', { // Llamada http POST a ala Api de tareas 
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ label: task, is_done: false }) // Construye el body con JSON.strigyfy 
               
            /*  Resultado de la funcion JSON.strigyfy
            
            { 
                "label": "valor que tenga la tarea en el input",
                "is_done": false
            } 
            */
        })
            .then(resp => { //Entonces utilizamos la respuesta 
                if (!resp.ok) throw new Error(`errorr status code: ${resp.status} `) // si la respuesta noo es succes (200-300) error me elevas el error 
                return resp.json() // Si la respuesta es succes quiero el json de la respuesta 
            })

            .then(() => getUserTodos())  // se crea la tarea y se actualiza getUserTodos() el listado de tareas dinamicamente sin necesidad de recargar la pagina llamando a getUserTodo
            .catch(err => console.log(err))

    }

    const handleDelete = id => {  // Definicion de la funcion handleDelete con el método DELETE 
        //DELETE
        fetch('https://playground.4geeks.com/todo/todos/' + id, {
            method: "DELETE", //El metodo siempre en mayusc

        })
            .then(resp => {
                getUserTodos()
            })
            .catch(err => console.log(err))
    }

    const updateTask = () =>{
         //PUT

    }

    //Carrgamos los Todos --> las tareas
    useEffect(() => {// Hook de reactcque se ejecuta una unica vez cuando se recarga la página porque le pasamos un array vacio como segundo parametro 
        getUserTodos()

    }, [])

    // Definicion Funcion HANDLESUBMIT CUANDO SE HACE ENTER EN EL INPUT DE TAREAS 
    const handleSubmit = e => {

        e.preventDefault(); // no se ejecuta la accion por defecto 
        createTask();
        setTask(''); // se limpia el input 
    }

     //Devolvemos la Plantilla (Template)
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={task} onChange={input => setTask(input.target.value)} />
                <input type="submit" hidden />
            </form>

            <div>
                <ul>
                    {data.todos?.map((tarea, index) => <li key={index}>{tarea.label} <span className="btn btn-danger" onClick={() => handleDelete(tarea.id)}>X</span></li>)}
                    {/*Recore el estado de tareas y crea un li por cada tarea */}
                    
                    {/* 
                    {
                    "name": "Lazaroth",
                     "todos": []
                     }
                    */}



                </ul>
            </div>
        </div>

    );

}

export default TodoList;