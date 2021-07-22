import './App.css';
import React, { Component } from 'react';

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
  };
  componentWillMount() {
    this.fetchTasks();
  }
  fetchTasks() {
    console.log("Fetching");
    fetch('http://127.0.0.1:8000/api/task-list/')
      .then(response => response.json())
      .then(data => console.log('Data :', data))
  }

  render() {
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

          </div>
        </div>
      </div>
    )
  }
}

export default App;
