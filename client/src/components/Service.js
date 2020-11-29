import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from "graphql-tag";

const READ_SERVICES = gql`
  query services{
    services {
      id
      title
      content
    }
  }
`;

const CREATE_SERVICE = gql`
  mutation CreateService($title: String!, $content: String!) {
    createService(title: $title, content: $content)
  }
`;

const REMOVE_SERVICE = gql`
  mutation RemoveService($id: String!) {
    removeService(id: $id)
  }
`;

const UPDATE_SERVICE = gql`
  mutation UpdateService($id: String!) {
    updateService(id: $id)
  }
`;

const Service = () => {
  let title, content;
  const { data, loading, error } = useQuery(READ_SERVICES);
  const [createService] = useMutation(CREATE_SERVICE);
  const [deleteService] = useMutation(REMOVE_SERVICE);
  const [updateService] = useMutation(UPDATE_SERVICE);

  if (loading) return <p>loading...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  return (
    <div className="app-aa">
      <div className="service-content-area">
          <h3>Service CRUD Operation : </h3>
        <form onSubmit={e => {
            e.preventDefault();
            createService({ variables: { title: title.value, content: content.value } });
            title.value = '';
            content.value =''
            window.location.reload();
        
        }}>
            <input className="form-control mb-2" type="text" placeholder="Enter Name" ref={node => { title = node; }}></input>
            <input type="text" className="form-control" placeholder="Enter Description" ref={node=>{content =node}}/>
            <button className="btn btn-primary px-5 my-2" type="submit">Submit</button>
        </form>
              <ul>
        {data.services.map((service) =>
          <li key={service.id} className="w-100">
            <span style={{"paddingRight":"20px"}}>{service.title}</span>
            <span className="pt-2">{service.content}</span>
            <button className="btn btn-sm btn-danger ml-2 float-right" onClick={() => {
              deleteService({ variables: { id: service.id } });
              window.location.reload();
            }}>Delete</button>
            <button className={`btn btn-sm float-right ${service.completed ? "btn-success" : "btn-info"}`} onClick={() => {
              updateService({ variables: { id: service.id } });
              window.location.reload();
            }}>{service.completed ? <span>Completed</span> : <span>Not completed</span>}</button>
          </li>
        )}
      </ul>
      </div>
    </div>
  );
}

export default Service;