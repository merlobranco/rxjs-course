import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, timer } from "rxjs";
import { tap, map } from "rxjs/operators";
import { Course } from "../model/course";
import { createHttpObservable } from "./util";

// The whole application will access to this service
@Injectable({
    providedIn: 'root'
})
export class Store {

    private subject = new BehaviorSubject<Course[]>([]);
    courses$: Observable<Course[]> = this.subject.asObservable();

    init() {
        const http$ = createHttpObservable('/api/courses');

        http$.pipe(
            tap(() => console.log("HTTP Request executed")),
            map(res => Object.values<Course>(res["payload"]))
        )
        .subscribe(
            courses => this.subject.next(courses)
        );
    }

    selectBeginnerCourses(): Observable<Course[]> {
        return this.filterByCategory('BEGINNER');
    }

    selectAdvancedCourses(): Observable<Course[]> {
        return this.filterByCategory('ADVANCED');
    }

    filterByCategory(category: string): Observable<Course[]> {
        return this.courses$.pipe(
            map(courses => courses.filter(course => course.category == category))
        );
    }
}