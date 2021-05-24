import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { filters } from './data';
import { filterToUrl } from './utils';
import { TaskAdder } from './AdderComponents';
import TaskList from './TaskComponents';

import { Col, Container } from 'react-bootstrap';

import React, { useEffect, useState } from 'react';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(dayjs.tz.guess());

const API = '/api/tasks/';

function Main(props) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(undefined);
  const [editMode, setEditMode] = useState(-1);

  const [show, setShow] = useState(false);
  const [description, setDescription] = useState({ value: '', isValid: false });
  const [isPrivate, setIsPrivate] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const [date, setDate] = useState({ value: '', isValid: true });
  const [time, setTime] = useState('00:00');
  const [validated, setValidated] = useState(false);

  const deleteTask = tskID => {
    setTasks(tsks => tsks.filter(t => t.id !== tskID));
  };

  const editTask = tskID => {
    if (tskID >= 0) {
      const currentTask = tasks.find(task => task.id === tskID);

      setDescription({
        value: currentTask.description,
        isValid: checkDescValidity(currentTask.description),
      });
      setIsPrivate(currentTask.isPrivate);
      setIsImportant(currentTask.isUrgent);
      setDate({
        value: currentTask.date ? currentTask.date.format('YYYY-MM-DD') : '',
        isValid: checkDateValidity(currentTask.date, tskID),
      });
      setTime(currentTask.date ? currentTask.date.format('HH:mm') : '');
    } else clearForm();

    setEditMode(tskID);
  };

  const handleShow = () => {
    setEditMode(-1);
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
    setValidated(false);
  };

  const handleSubmit = event => {
    event.preventDefault();
    let id;

    if (description.isValid && date.isValid) {
      if (editMode >= 0) {
        id = editMode;
        deleteTask(id);
      } else id = tasks.sort((a, b) => a.id - b.id)[tasks.length - 1].id + 1;

      let taskDate;

      if (!date.value) taskDate = '';
      else if (date.value && !time)
        taskDate = dayjs.tz(`${date.value}T00:00:00.000Z`);
      else taskDate = dayjs.tz(`${date.value}T${time}:00.000Z`);

      const task = {
        description: description.value,
        private: isPrivate,
        important: isImportant,
        deadline: taskDate,
      };

      setNewTask(task);
      handleClose();
      clearForm();

      setEditMode(-1);
    } else setValidated(true);
  };

  const handleDescChange = ev => {
    setDescription({
      value: ev.target.value,
      isValid: checkDescValidity(ev.target.value),
    });
  };

  const handleDateChange = (ev, tskID) => {
    setDate({
      value: ev.target.value,
      isValid: checkDateValidity(ev.target.value, tskID),
    });
  };

  const handleTimeChange = (ev, value) => {
    setTime(value);
  };

  const checkDescValidity = desc => !!desc;

  const checkDateValidity = (date, tskID) => {
    if (!date) return true;
    else if (tskID >= 0) return true;
    else return dayjs(date) >= dayjs().startOf('d');
  };

  const clearForm = () => {
    setValidated(false);
    setDescription({ value: '', isValid: false });
    setIsPrivate(false);
    setIsImportant(false);
    setDate({ value: '', isValid: true });
    setTime('00:00');
  };

  const formProps = {
    lg: props.lg,
    editMode,
    editTask,
    description,
    isPrivate,
    isImportant,
    date,
    time,
    validated,
    setIsPrivate,
    setIsImportant,
    handleSubmit,
    handleDateChange,
    handleDescChange,
    handleTimeChange,
  };

  const filterName = filters.filter(
    filter => filterToUrl(filter.text) === props.activeFilter
  );

  useEffect(() => {
    async function fetchTasks() {
      fetch(API + props.activeFilter)
        .then(response => {
          if (!response.ok) throw Error(response.statusText);
          /* let type = response.headers.get('Content-Type');
          if (type !== 'application/json')
            throw new TypeError(`Expected JSON, got ${type}`); */
          return response.json();
        })
        .then(data => setTasks(data.content))
        .catch(err => console.log(err));
    }

    fetchTasks();
  }, [props.activeFilter, newTask]);

  useEffect(() => {
    async function addNewTask(nt) {
      fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nt),
      }).catch(err => console.log(`Failed to store data on server: ${err}`));
    }
    newTask && addNewTask(newTask);
    setNewTask(undefined);
  }, [newTask]);

  return (
    <Col as="main" lg={8} className="py-3">
      <h1>{filterName[0] ? filterName[0].text : ''}</h1>
      <TaskList tasks={tasks} deleteTask={deleteTask} {...formProps} />
      <Container
        fluid
        className="fixed-bottom d-flex flex-row-reverse px-4 mb-4"
      >
        <TaskAdder
          clearForm={clearForm}
          show={show}
          handleShow={handleShow}
          handleClose={handleClose}
          {...formProps}
        />
      </Container>
    </Col>
  );
}

export default Main;
