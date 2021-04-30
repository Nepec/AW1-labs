import React, { useState } from 'react';
import dayjs from 'dayjs';

const useViewport = () => {
  const [width, setWidth] = useState(window.innerWidth);

  React.useEffect( () => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [] );

  return { width };
}

const isTaskDuplicate = (newTask, tl) => {
  return tl.some( t => (t.description === newTask.description && t.deadline === newTask.deadline) );
}

const buildDate = (deadline, hours, minutes) => {
  const today = dayjs();
  let dateTime;

  if (deadline && hours && minutes) {
    hours = (parseInt(hours) < 10) ? '0' + hours : hours;
    minutes = (parseInt(minutes) < 10) ? '0' + minutes : minutes;

    dateTime = deadline.concat('T', hours, ':', minutes, ':00.000Z')
  } else if (deadline) {
    dateTime = deadline;
  } else
    return "";

  if (dayjs(dateTime).isBefore(today, 'day'))
    return undefined;

  return hours ? dayjs(dateTime).format("YYYY-MM-DD:HH:mm") : dayjs(dateTime).format("YYYY-MM-DD");
}

export { useViewport, isTaskDuplicate, buildDate }