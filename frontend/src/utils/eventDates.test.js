import { partitionEventsByDate } from './eventDates';

test('groups today and future events first, and sorts past events newest-first', () => {
  const events = [
    { id: 'older', date: '2025-12-01' },
    { id: 'later', date: '2026-12-10' },
    { id: 'today', date: '2026-11-01' },
    { id: 'newer-past', date: '2026-10-31' },
    { id: 'sooner', date: '2026-11-05' },
  ];

  const { upcoming, past } = partitionEventsByDate(events, '2026-11-01');

  expect(upcoming.map((event) => event.id)).toEqual(['today', 'sooner', 'later']);
  expect(past.map((event) => event.id)).toEqual(['newer-past', 'older']);
});
