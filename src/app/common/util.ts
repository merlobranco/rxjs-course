import { Observable } from "rxjs";

export function createHttpObservable(url: string) {
    return new Observable(
      observer => {

        const controller = new AbortController();
        const signal = controller.signal;

        // Getting courses through a promise
        fetch(url, {signal})
          .then(response => {
            return response.json();
          })
          .then(body => {
            observer.next(body);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          });

        return () => controller.abort();
      }
    );
  }