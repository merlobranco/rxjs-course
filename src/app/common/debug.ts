import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export enum RxJsLoggingLevel {
    TRACE,
    DEBUG,
    INFO,
    ERROR
}

let rxjsLoggingLevel = RxJsLoggingLevel.INFO;

export function setRxjsLoggingLevel(level: RxJsLoggingLevel) {
    rxjsLoggingLevel = level;
}

// Higher order function> function that returns other function
export const debug = (level: number, message: string) =>
    (source: Observable<any>) => source
        .pipe(
            tap(val => {
                if (level >= rxjsLoggingLevel) {
                    console.log(message + ": ", val)
                }
            })
        )