import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';

import React, { useState } from 'react';

import { buildDate, isTaskDuplicate } from './utils';

function AddTaskModal(props) {
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  const [errorMsg, setErrorMsg] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const nt = {
      id: props.tasks.length + 1,
      description: newTaskDesc,
      isPrivate: isPrivate,
      isUrgent: isUrgent,
      date: deadline,
    };

    const errorMessages = [
      { id: 'desc', text: 'Task description missing.', raised: false, },
      { id: 'dup', text: 'Task duplicated.', raised: false, },
      { id: 'date', text: 'Dedline already expired.', raised: false, },
    ];

    if (newTaskDesc === '')
      errorMessages[0].raised = true;

    if (isTaskDuplicate(nt, props.tasks))
      errorMessages[1].raised = true;

    if ((nt.date = buildDate(deadline, hours, minutes)) === undefined)
      errorMessages[2].raised = true;

    if (errorMessages.every(m => !m.raised)) {
      props.addTask(nt);
      
      setErrorMsg([]);

      setNewTaskDesc("");
      setIsPrivate(false);
      setIsUrgent(false);
      setDeadline("");
      setHours("");
      setMinutes("");
      props.onHide();
    } else {
      const list = errorMessages.filter((m) => m.raised && m.text);
      setErrorMsg(list);
    }

  }

  return (
    <Modal show={props.show} onHide={props.onHide} size="lg" centered>
      <Modal.Header>
        <h2>Add a New Task</h2>
      </Modal.Header>
      <Modal.Body>
        {
          errorMsg.map(msg => (
            <Alert variant="danger" key={msg.id}>
              {msg.text}
            </Alert>
          ))
        }
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Row className="d-flex align-items-center">
            <Form.Group as={Col} xs={8}>
              <Form.Control
                required
                type="text"
                placeholder="Describe your task..."
                value={newTaskDesc}
                onChange={event => setNewTaskDesc(event.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Please insert a description.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} noValidate>
              <Form.Check
                inline
                custom
                type="checkbox"
                id={"custom-checkbox-private"}
                label={"Private"}
                onChange={() => setIsPrivate(old => !old)}
              />
              <Form.Check
                inline
                custom
                type="checkbox"
                id={"custom-checkbox-urgent"}
                label={"Urgent"}
                onChange={() => setIsUrgent(old => !old)}
              />
            </Form.Group>
          </Form.Row>
          {/* <Form.Label className="pl-1 mb-0">Set your Deadline</Form.Label> */}
          <Form.Row className="d-flex align-items-center">
            
            <Form.Group as={Col} xs={6} lg={8} noValidate>
              <Form.Control
                type="date"
                value={deadline}
                onChange={event => setDeadline(event.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} className="d-flex align-items-center">
                <Col as="span" lg={3} className="px-0">
                  <Form.Control
                    as="select"
                    custom
                    value={hours}
                    onChange={event => setHours(event.target.value)}
                  >
                    {[...Array(24)].map((_, i) => <option key={i}>{i}</option>)}
                  </Form.Control>
                </Col>
                <span className="p-2">:</span>
                <Col as="span" lg={3} className="px-0">
                  <Form.Control
                    as="select"
                    custom
                    value={minutes}
                    onChange={event => setMinutes(event.target.value)}
                  >
                    {[...Array(60)].map((_, i) => (i % 5) === 0 && <option key={i}>{i}</option>).filter(m => m)}
                  </Form.Control>
                </Col>
              </Form.Group>
          </Form.Row>
          <Form.Row className="d-flex justify-content-end">
            <Button
              type="submit"
              variant="info"
              className="mr-2">
              Submit
            </Button>
            <Button
              onClick={() => {
                props.onHide(); setErrorMsg([]); setNewTaskDesc(""); setIsPrivate(false);
                setIsUrgent(false); setDeadline(""); setHours(""); setMinutes("");
              }}
              variant="secondary"
              className="mr-3">
              Cancel
            </Button>
          </Form.Row>
        </Form>

      </Modal.Body>

    </Modal>
  );
}

export default AddTaskModal;