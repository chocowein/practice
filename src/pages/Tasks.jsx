import { useState, useEffect, useContext, createContext } from 'react'

const StatusContext = createContext()

const TaskItem = (props) => {
  const [edit, setEdit] = useState(false)
  const [task, setTask] = useState(props.task)
  const {statuses} = useContext(StatusContext)
  
  const changeHandler = (e) => {
      const name = e.target.name
      let value = e.target.value
      if (name === 'status') {
        value = Number(value)
      }
      setTask({
        ...task,
        [name]: value
      })
    }

  const clickHandler = () => {
    setEdit(!edit)
    props.editHandler(props.task.id, task)
  }
  
  return (
    <li>
      {edit
        ? (
          <TaskForm
            task={task}
            clickHandler={clickHandler}
            changeHandler={changeHandler}
            buttonText="編集"
          />
        ): (
          <div>
            <h2>{props.task.id}:{props.task.title}</h2>
            <p>{props.task.content}</p>
            <p>{statuses.find(
                (status) => status.id === props.task.status
              )?.name}
            </p>
            <button onClick={clickHandler}>
              編集
            </button>
            <button onClick={() => {props.deleteHandler(props.task.id)}}>
              削除
            </button>
          </div>
        )
      }
    </li>

  )
}


const TaskArea = (props) => {
  return (
    <ul>
      {props.tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          editHandler={props.editHandler}
          deleteHandler={props.deleteHandler}
        />
      ))}
    </ul>
  )
}

const TaskForm = (props) => {
  const {statuses} = useContext(StatusContext)
  return (
    <>
      <input name="title" value={props.task.title} onChange={props.changeHandler}/>
      <textarea name="content" value={props.task.content} onChange={props.changeHandler}/>
      <select name="status" value={props.task.status} onChange={props.changeHandler}>
        {statuses.map((status) => (
          <option key={status.id} value={status.id}>{status.name}</option>
        ))}
      </select>
      <button onClick={props.clickHandler}>{props.buttonText}</button>
    </>
  )
}

const Tasks = () => {
  const [newTask, setNewTask] = useState({
    title: '',
    content: '',
    status: 0
  });
  const [statuses, setStatuses] = useState([])
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:3001/tasks')
    const data = await res.json()
    setTasks(data)
  }

  const fetchStatuses = async () => {
    const res = await fetch('http://localhost:3001/statuses')
    const data = await res.json()
    setStatuses(data)
  }

  const clickHandler = async () => {
    await fetch('http://localhost:3001/tasks', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTask)
    })
    fetchTasks()
    setNewTask({
      title: '',
      content: '',
      status: 0
    })
  }

  const deleteHandler = async (id) => {
    await fetch(`http://localhost:3001/tasks/${id}`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    fetchTasks()
  }

  const editHandler = async (id, editTask) => {
    await fetch(`http://localhost:3001/tasks/${id}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editTask)
    })
    fetchTasks()
  }

  const changeHandler = (e) => {
    const name = e.target.name
    let value = e.target.value
    if (name === 'status') {
      value = Number(value)
    }
    setNewTask({
      ...newTask,
      [name]: value
    })
  }

  useEffect(() => {
    fetchTasks()
    fetchStatuses()
  }, [])

  return (
    <div>
      <StatusContext.Provider value={{statuses: statuses}}>
        <TaskForm
          task={newTask}
          clickHandler={clickHandler}
          changeHandler={changeHandler}
          buttonText="追加"
        />
        <TaskArea
          tasks={tasks}
          editHandler={editHandler}
          deleteHandler={deleteHandler}
        />
      </StatusContext.Provider>
    </div>
  );
}

export default Tasks;