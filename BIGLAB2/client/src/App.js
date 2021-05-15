import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Main from './Main';
import FilterList from './FilterComponents';
import MainNav from './MainNav';
import { useViewport } from './utils';

import { Container, Col, Collapse } from 'react-bootstrap';

import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

function App() {
  const [open, setOpen] = useState(true);

  return (
    <Router>
      <Container fluid className="d-flex flex-column height-100 m-0 p-0">
        <MainNav toggleCollapse={isOpen => setOpen(isOpen)} />
        <Content isOpen={open} />
      </Container>
    </Router>
  );
}

function Content(props) {
  const { width } = useViewport();
  const breakpoint = 992;

  const lg = width > breakpoint;

  return (
    <Container fluid className="d-flex flex-lg-grow-1 flex-wrap m-0 p-0">
      <Aside lg={lg} isOpen={props.isOpen} />
      <Switch>
        <Route
          exact
          path="/:url"
          render={({ match }) => (
            <Main lg={lg} activeFilter={match.params.url} />
          )}
        />
        <Route path="/" render={() => <Redirect to="/all" />} />
      </Switch>
    </Container>
  );
}

function Aside(props) {
  return (
    <Collapse in={props.isOpen}>
      <Col
        as="aside"
        lg={4}
        xs={12}
        className={props.lg ? 'show bg-light py-3' : 'bg-light py-3'}
      >
        <FilterList id="filter-list" />
      </Col>
    </Collapse>
  );
}

export default App;
