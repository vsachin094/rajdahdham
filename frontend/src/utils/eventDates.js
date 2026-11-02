export function partitionEventsByDate(events, today = localDateString()) {
  const upcoming = [];
  const past = [];

  events.forEach((event) => {
    (event.date >= today ? upcoming : past).push(event);
  });

  upcoming.sort((first, second) => first.date.localeCompare(second.date));
  past.sort((first, second) => second.date.localeCompare(first.date));

  return { upcoming, past };
}

function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
