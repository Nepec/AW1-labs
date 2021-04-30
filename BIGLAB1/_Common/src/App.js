import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import dayjs from 'dayjs'

/* Ract Components */
import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Collapse from 'react-bootstrap/Collapse';

/* Icons */
import PlusCircleFill from 'react-bootstrap-icons/dist/icons/plus-circle-fill';

/* Custom components */
import TaskList from './TaskComponents';
import FilterList from './FilterComponents';
import MainNav from './MainNav'
import AddTaskModal from './AddTaskModal'
import { useViewport } from './utils'

/* Data */
import { filters, tl } from './data';

function App() {
  const [open, setOpen] = useState(true);

  return (
    <Container fluid className="d-flex flex-column height-100 m-0 p-0">
      <MainNav toggleCollapse={isOpen => setOpen(isOpen)} />
      <Content isOpen={open} />
    </Container>
  );
}

function Content(props) {
  const [chosenFilter, setChosenFilter] = useState(1);

  return(
    <Container fluid className="d-flex flex-lg-grow-1 flex-wrap m-0 p-0">
      <Aside chooseFilter={(filterID) => setChosenFilter(filterID)} isOpen={props.isOpen} />
      <Main activeFilter={chosenFilter} />
    </Container>
  );
}

function Aside(props) {
  const { width } = useViewport();
  const breakpoint = 992;

  const show = (width > breakpoint);

  return ( 
    <Collapse in={props.isOpen}>
      <Col as="aside" lg={4} xs={12} className={show ? "show bg-light py-3" : "bg-light py-3"}>
        <FilterList chooseFilter={props.chooseFilter} id="filter-list"/>
      </Col>
    </Collapse>
  );
}

function Main(props) {
  const [tasks, setTasks] = useState(tl);
  const [showModal, setShowModal] = useState(false);

  const addTask = (tsk) => {
      setTasks(oldTasks => [...oldTasks, tsk]);
  }

  return (
    <>
      <Col as="main" lg={8} className="py-3">
        <h1>{filters[props.activeFilter - 1].text}</h1>
        <TaskList 
          tl={tasks} 
          deleteTask={(tskToDelete) => setTasks(tskToDelete)} 
          activeFilter={props.activeFilter}
        />
        <Container fluid className="fixed-bottom d-flex justify-content-between px-4 mb-4">
          <div />
          <PlusCircleFill 
            onClick={() => setShowModal(true)} color="#17a2b8" size={64}
          />
        </Container>
      </Col>
      <AddTaskModal 
        show={showModal}
        onHide={() => setShowModal(false)}
        addTask={(tsk) => addTask(tsk)}
        tasks={tasks}
      />
    </>
  );
}

export default App;
