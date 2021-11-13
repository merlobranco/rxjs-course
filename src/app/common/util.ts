import { Observable } from "rxjs";

export function createHttpObservable(url: string) {
    return new Observable(
      observer => {
        // Getting courses through a promise
        fetch(url)
          .then(response => {
            return response.json();
          })
          .then(body => {
            observer.next(body);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          })
      }
    );
  }