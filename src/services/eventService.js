// @flow
import * as mysql from 'mysql';
import { connection } from './connect';

class Event {
  id: number;
  name: string;
  location: string;
  city: string;
  startDate: Date;
  endDate: Date;
  details: string;
}

class Participant {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
}

class EventService {
  getEvents(): Promise<Event[]> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM Events', (error, result) => {
        if(error) {
          reject(error);
          return;
        }

        resolve(result);
      });
    });
  }

  getUserEvents(id: number): Promise<Event[]> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM Events e, Participants WHERE e.id = events_id AND users_id = ?', [id], (error, result) => {
        if(error) {
          reject(error);
          return;
        }

        resolve(result);
      });
    });
  }

  getEvent(id: number): Promise<Event[]> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM Events WHERE id=?', [id], (error, result) => {
        if(error) {
          reject(error);
          return;
        }

        resolve(result);
      });
    });
  }

  editEvent(id: number, name: string, location: string, city: string, startDate: string, endDate: string, details: string): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE Events SET name=?, location=?, city=?, startDate=?, endDate=?, details=? WHERE id=?;',
      [name, location, city, startDate, endDate, details, id], (error, result) => {
        if(error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  getParticipants(id: number): Promise<Participant[]> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM Users u, Participants WHERE u.id = users_id AND events_id = ?', [id], (error, result) => {
        if(error) {
          reject(error);
          return;
        }

        resolve(result);
      });
    });
  }

  applyEvent(user_id: number, event_id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO Participants (users_id, events_id) VALUES (?, ?)', [user_id, event_id], (error, result) => {
        if(error) {
          reject(error);
          return;
        }

        resolve(result);
      });
    });
  }

  unapplyEvent(user_id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM Participants WHERE users_id=?', [user_id], (error, result) => {
        if(error) {
          reject(error);
          return;
        }

        resolve(result);
      });
    });
  }

  createEvent(newEvent: Event): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO `Events` ( `name`, `location`, `city`, `startDate`, `endDate`, `details`) VALUES (?, ?, ?, ?, ?, ?)',
       [newEvent.name, newEvent.location, newEvent.city, newEvent.startDate, newEvent.endDate, newEvent.details], (error, result) => {
        if(error) {
          reject(error);
          return;
        }

        resolve(result);
      });
    });
  }
}

let eventService = new EventService();

export { Event, eventService }
