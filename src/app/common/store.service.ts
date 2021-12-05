import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, timer } from "rxjs";
import { fromPromise } from "rxjs/internal-compatibility";
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

    saveCourse(courseId: number, changes): Observable<any> {
        const courses = this.subject.getValue();
        const courseIndex = courses.findIndex(course => course.id == courseId);

        const newCourses = courses.slice(0);

        // Using js spread operator
        newCourses[courseIndex] = {
            ...courses[courseIndex],
            ...changes
        };

        // In order to broadcast the changes to all the subscribers, we cannot just change the in memory data.
        // The subscribers won't be notified
        // The in memory dat should be immutable, we should create a copy of it and notified the subscribers with all the changes
        this.subject.next(newCourses);

        return fromPromise(fetch(`/api/courses/${courseId}`, {
            method: 'PUT',
            body: JSON.stringify(changes),
            headers: {
                'content-type': 'application/json'
            }
        }));
    }
}