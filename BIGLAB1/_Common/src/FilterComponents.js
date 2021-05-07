import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';

import {filters} from './data';

function Filter(props) {
    return (
      <NavLink
        to={`/${props.text}`}
        className="nav-link rounded-0 border-top text-dark hover-bg-light"
      >
        {props.text}
      </NavLink>
    );
}

function FilterList(props) {
  const filterList = filters.map( filter => <Filter key={filter.id} chooseFilter={props.chooseFilter} {...filter} />)
  return (
      <Nav variant="pills" className="flex-column" defaultActiveKey="1" id="filter-list">
          {filterList}
      </Nav>
  );
}

export default FilterList;

{/* <Nav.Link 
            className="rounded-0 border-top text-dark hover-bg-light" 
            eventKey={props.id}
            onSelect={() => props.chooseFilter(props.id)}
        >{props.text}</Nav.Link> */}