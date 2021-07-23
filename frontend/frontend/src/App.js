import './App.css';
import React, { Component } from 'react';
import jQuery from 'jquery';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      activeItem: {
        id: null,
        title: '',
        completed: false,
      },
      editing: false,
    }
    this.fetchTasks = this.fetchTasks.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCookie = this.getCookie.bind(this);
  }
  getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  componentWillMount() {
    this.fetchTasks();
  }
  fetchTasks() {
    console.log("Fetching");
    fetch('http://127.0.0.1:8000/api/task-list/')
      .then(response => response.json())
      .then(data => {
        this.setState(
          {
            todoList: data,
          }
        )
      })
  }
  handleChange(e) {
    var name = e.target.name;
    var value = e.target.value;
    console.log('Name', name)
    console.log('Value', value);
    this.setState({
      activeItem: {
        ...this.state.activeItem,
        title: value
      }
    })
  }



  handleSubmit(e) {
    var csrftoken = this.getCookie('csrftoken');

    e.preventDefault();
    console.log(this.state.activeItem);
    var url = 'http://127.0.0.1:8000/api/task-create/';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify(this.state.activeItem)
    }).then((response) => {
      this.fetchTasks()
      this.setState({
        activeItem: {
          id: null,
          title: '',
          completed: false,
        }
      })
    }).catch(function (error) {
      console.log(error);
    })
  }
  render() {
    var tasks = this.state.todoList;
    return (
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form onSubmit={this.handleSubmit} id="form">
              <div className="flex-wrapper">
                <div style={{ flex: 6 }}>
                  <input onChange={this.handleChange} className="form-control" id="title" value={this.state.activeItem.title} type="text" name="title" placeholder="Add task.." />
                </div>

                <div style={{ flex: 1 }}>
                  <input id="submit" className="btn btn-warning" type="submit" name="Add" />
                </div>
              </div>
            </form>
          </div>
          <div id="list-wrapper">
            {tasks.map(function (task, index) {
              return (
                <div key={index} className="task-wrapper flex-wrapper">
                  <div style={{ flex: 7 }}>
                    <span>{task.title}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <button className="btn btn-sm btn-outline-info">Edit</button>
                  </div>
                  <div style={{ flex: 1 }}>
                    <button className="btn btn-sm btn-outline-danger delete">X</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
