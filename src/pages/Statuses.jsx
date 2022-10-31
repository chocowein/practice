import {useState, useEffect} from 'react'

const StatusForm = (props) => {
  return (
    <>
      <input name="name" value={props.status.name} onChange={props.changeHandler}/>
      <button onClick={props.clickHandler}>{props.buttonText}</button>
    </>
  )
}

const StatusItem = (props) => {
  const [edit, setEdit] = useState(false)
  const [status, setStatus] = useState(props.status)

  const clickHandler = () => {
    setEdit(!edit)
    props.editHandler(props.status.id, status)
  }

  const changeHandler = (e) => {
    const name = e.target.name
    const value = e.target.value

    setStatus({
      ...status,
      [name]: value
    })
  }

  return (
    <li>
      {edit
        ? (
          <StatusForm
            status={status}
            clickHandler={clickHandler}
            changeHandler={changeHandler}
            buttonText="更新"
          />
        ): (
          <div>
            <h2>{props.status.id}:{props.status.name}</h2>
            <button onClick={clickHandler}>
              編集
            </button>
          </div>
        )
      }
    </li>
  )
}

const StatusArea = (props) => {
  return (
    <ul>
      {props.statuses.map(status => (
        <StatusItem
          status={status}
          editHandler={props.editHandler}
        />
      ))}
    </ul>
  )
}

const Statuses = () => {
  const [statuses, setStatuses] = useState([])
  const [newStatus, setNewStatus] = useState({
    name: ''
  })

  const fetchStatuses = async () => {
    const res = await fetch('http://localhost:3001/statuses')
    const data = await res.json()

    setStatuses(data)
  }

  const clickHandler = async () => {
    await fetch('http://localhost:3001/statuses', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newStatus)
    })
    fetchStatuses()
    setNewStatus({
      name: '',
    })
  }


  const editHandler = async (id, editStatus) => {
    await fetch(`http://localhost:3001/statuses/${id}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editStatus)
    })
    fetchStatuses()
  }

  const changeHandler = (e) => {
    const value = e.target.value
    const name = e.target.name

    setNewStatus({
      ...newStatus,
      [name]: value
    })
  }

  useEffect(() => {
    fetchStatuses()
  }, [])
  return (
    <>
      <StatusForm
        status={newStatus}
        clickHandler={clickHandler}
        changeHandler={changeHandler}
        buttonText="登録"
      />
      <StatusArea
        statuses={statuses}
        editHandler={editHandler}
      />
    </>
  )
}

export default Statuses;