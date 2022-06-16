import React, { Component } from "react";
import UserService from "../services/UserService";
import EventBus from "../common/EventBus";
import ToggleSwitch from "./ToggleSwitch";
import CategoryService from "../services/CategoryService"
import TodoItem from './TodoItem'
import AddTodo from './AddTodo'
import TodoItemService from '../services/TodoItemService';

const styles = {
    ul: {
        listStyle: 'none',
        margin: 0,
        padding: 0
    }
}

let generalTodos = [];
export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      options: [],
      todos: [],
      inputValue: ''
    };

    this.onChange = this.onChange.bind(this);
    this.getTodosByUserId = this.getTodosByUserId.bind(this)
    this.toggleTodo = this.toggleTodo.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.getInputValue = this.getInputValue.bind(this);
    this.onToogle = this.onToogle.bind(this);
  }

  

  componentDidMount() {
    UserService.getUserBoard().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
    this.getCategoryByUserId();
    this.getTodosByUserId()
  }

    toggleTodo(id) {
        TodoItemService.toggleTodo(id).then(() =>{
            this.getTodosByUserId()
        }); 
    }

    addTodo(title, categoryId, todoDay) {
      const userId = JSON.parse(localStorage.getItem('user')).id;
      TodoItemService.createTodo({ title, completed: false, user_id: userId, category_id: categoryId, day: todoDay}).then(() =>{
          this.getTodosByUserId()
      }); 
  }

    getTodosByUserId() {
        const id = JSON.parse(localStorage.getItem('user')).id;
        TodoItemService.getTodosByUserId(id).then(res => {
            this.setState({ todos: res.data })
            generalTodos = res.data
        })
    }

  onChange(i){
    if(i){
        this.setState({
            todos: generalTodos.filter(it => it.category && it.category.name === i)})
    } else this.setState({
        todos: generalTodos.filter(it => it.category === null)
    })
  }

  onDelete(id){
    CategoryService.deleteCategory(id).then(() =>{
        this.getCategoryByUserId()
    }); 
    this.setState({todos: generalTodos})
  }

  getCategoryByUserId(){
    const id = JSON.parse(localStorage.getItem('user')).id;
    CategoryService.getCategoryByUserId(id).then(res => {
        this.setState({ options: res.data })
    });
  }

  submitHandler() {
    const id = JSON.parse(localStorage.getItem('user')).id;
    if (this.state.inputValue) {
        CategoryService.createCategory({name: this.state.inputValue}, id).then(() =>{
            this.getCategoryByUserId()
        }); 
        this.setState({ inputValue: ' '})
        window.location.reload();
    }
  }

  getInputValue = (event)=>{
    if(event){
        const userValue = event.target.value;
        this.setState({ inputValue: userValue})
    }
    };

  onToogle(categoryId){
    console.log(categoryId)
        CategoryService.toogleId(categoryId).then(() =>{
          this.getCategoryByUserId()
      }); 
  }

  render() {
    return (
      <div>
        <header className="jumbotron">
          <h3 className="title">Categories</h3>
        </header>
        <div className="mob-d-flex">
            <div className="w-45">
            <label htmlFor="categoryName">Name of category</label>
              <div className="d-flex">
                <input className="form-control" onChange={(e) => this.getInputValue(e)} value= {this.state.inputValue}/>
                <button className="btn btn-dark btn-block btn-category" onClick={() => this.submitHandler()} >Add Category</button>
              </div>
              <div>
                <button className="category-button" onClick={() => this.setState({todos: generalTodos})}>All categories</button>
                <button className="category-button" onClick={() => this.onChange(null)}>WithoutCategory</button>
                { this.state.options.map((obj) => {
                    return (<div key={obj.id} className="d-flex"><button className="category-button" onClick={() => this.onChange(obj.name)}>{obj.name}</button>
                    <button onClick={() => this.onDelete(obj.id)} className="cross-button">&#x2715;</button>
                    <ToggleSwitch label={obj.name} categoryId={obj.id} open={obj.open} onChange={() => this.onToogle(obj.id)}/><br /></div>)
                }) }
              </div>
            </div>
            <div className="w-45">
                <AddTodo onCreate= { this.addTodo } userId={0}></AddTodo>
                <ul style={styles.ul}>
                    { this.state.todos.map((todo, index) => {
                        return <TodoItem todo={todo} key={todo.id} i={index} onChange={this.toggleTodo}/>
                    }) }
                </ul>
            </div>
        </div>
      </div>
    );
  }
}