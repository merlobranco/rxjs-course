import { Observable } from "rxjs";

export function createHttpObservable<T>(url: string) {
    return new Observable<T>(
      observer => {

        const controller = new AbortController();
        const signal = controller.signal;

        // Getting courses through a promise
        fetch(url, {signal})
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            // With this appoach we could manage now 400, 500 errors
            else {
              observer.error('Request failed status code: ' + response.status);
            }
          })
          .then(body => {
            observer.next(body);
            observer.complete();
          })
          // By default, here we only catch errors related with the network, DNS and so on
          // Not 400, 500 errors
          .catch(err => {
            observer.error(err);
          });

        return () => controller.abort();
      }
    );
  }