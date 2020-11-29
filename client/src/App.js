import React from 'react';
import './App.css';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from "graphql-tag";
import Service from '../src/components/Service'

const READ_TODOS = gql`
  query todos{
    todos {
      id
      text
      description
      completed
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($text: String!, $description: String!) {
    createTodo(text: $text, description: $description)
  }
`;

const REMOVE_TODO = gql`
  mutation RemoveTodo($id: String!) {
    removeTodo(id: $id)
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: String!) {
    updateTodo(id: $id)
  }
`;

function App() {
  let name, description;
  const { data, loading, error } = useQuery(READ_TODOS);
  const [createTodo] = useMutation(CREATE_TODO);
  const [deleteTodo] = useMutation(REMOVE_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);

  if (loading) return <p>loading...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  return (
    <div className="app">
      <h3>CRUD Application : </h3>
      <form onSubmit={e => {
        e.preventDefault();
          createTodo({ variables: { text: name.value, description: description.value } });
          name.value = '';
          description.value =''
          window.location.reload();
      
      }}>
        <input className="form-control mb-2" type="text" placeholder="Enter Name" ref={node => { name = node; }}></input>
        <input type="text" className="form-control" placeholder="Enter Description" ref={node=>{description =node}}/>
        <button className="btn btn-primary px-5 my-2" type="submit">Submit</button>
      </form>
      <ul>
        {data.todos.map((todo) =>
          <li key={todo.id} className="w-100">
            <span style={{"paddingRight":"20px"}}>{todo.text}</span>
            <span className="pt-2">{todo.description}</span>
            <button className="btn btn-sm btn-danger ml-2 float-right" onClick={() => {
              deleteTodo({ variables: { id: todo.id } });
              window.location.reload();
            }}>Delete</button>
            <button className={`btn btn-sm float-right ${todo.completed ? "btn-success" : "btn-info"}`} onClick={() => {
              updateTodo({ variables: { id: todo.id } });
              window.location.reload();
            }}>{todo.completed ? <span>Completed</span> : <span>Not completed</span>}</button>
          </li>
        )}
      </ul>
      <Service/>
    </div>
  );
}

export default App;