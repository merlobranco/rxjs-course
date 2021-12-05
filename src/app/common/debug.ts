import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

// Higher order function> function that returns other function
export const debug = (level: number, message: string) =>
    (source: Observable<any>) => source
        .pipe(
            tap(val => {
                console.log(message + ": " + val)
            })
        )