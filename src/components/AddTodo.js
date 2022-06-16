import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types'
import CategoryService from "../services/CategoryService";
import { Form } from "react-bootstrap";

function useInputValue(defaultValue = '') {
    const [value, setValue] = useState(defaultValue)

    return {
        bind: {
            value,
            onChange: event => setValue(event.target.value)
        },
        clear: () => setValue(''),
        value: () => value
    }
}

function AddTodo({ onCreate, userId }){
    const [val, setVal] = useState(0);
    const [options, setOptions] = useState([]);
    const input = useInputValue('')
    const timeInput = React.useRef();
    const id = JSON.parse(localStorage.getItem('user')).id;

    useEffect(() => {
        if(userId === 0){
            CategoryService.getCategoryByUserId(id).then(res => {
                setOptions(res.data)
            })
        } else {      
            console.log("start")    
            CategoryService.getCategoryByUserIdForAdmin(userId).then(res => {
                setOptions(res.data)
                console.log("work", res.data)
            })
        }
    }, [userId]);

    function submitHandler(event) {
        event.preventDefault()
        if (input.value().trim()) {
            onCreate(input.value(), val, timeInput.current.value)
            
            input.clear()
            timeInput.current.value = ''
        }
    }

    return (
        <form onSubmit={submitHandler}>
            <div className="form-group">
              <label htmlFor="name">Name of todo</label>
              <input className="form-control"
                name="name"
                {...input.bind} />
            </div>
            <div className="mob-d-flex">
                <input ref={timeInput} type="date" id="time" name="time" className="mar-right time-input"/>
                <Form.Select className="mar-right" value={val} onChange={(e) => setVal(e.target.value)}>
                    <option key={0} value={0}>WithoutCategory</option>
                    {options.map((o) => {
                        const { name, id } = o;
                        return <option key={id} value={id}>{name}</option>;
                    })}
                </Form.Select>
                <button className="btn btn-dark btn-block" type="submit">Add</button>
            </div>
        </form>
    )
}

AddTodo.propTypes = {
    onCreate: PropTypes.func.isRequired
}

export default AddTodo