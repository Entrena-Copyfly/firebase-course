import {Component, OnInit} from '@angular/core';
import 'firebase/firestore';
import {AngularFirestore} from '@angular/fire/firestore';
import {COURSES, findLessonsForCourse} from './db-data';
import { Observable } from 'rxjs';


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent {

    course$: Observable<any>;
    lessons: any[];

    constructor(private db: AngularFirestore) {
    }

    async ngOnInit() {
        this.course$ = this.db.doc('/courses/7hU1lWbJwtGSzVukH3RI').valueChanges();
        const courseRef = await this.db.doc('/courses/7hU1lWbJwtGSzVukH3RI').get().toPromise();
        if(courseRef.exists) {
            // Obtenemos la colección de lecciones dentro del curso
            const lessonsSnapshot = await courseRef.ref.collection('lessons').get();
            
            // Creamos un array con los datos de las lecciones
            this.lessons = lessonsSnapshot.docs.map(doc => doc.data());
            console.log(this.lessons)
        }
    }

    onReadCollection() {
        this.db.collection("courses", ref => ref
            .where("seqNo", "<=", 5)
            .where("lessonsCount", "<=", 10)
            .orderBy("seqNo"))
            .get().subscribe(snaps => {
            snaps.forEach(snap => {
                console.log(snap.id);
                console.log(snap.data());
            })
        })
    }

    onReadAllLesssons() {
        this.db.collectionGroup("lessons", ref => ref.where("seqNo", "==", 1)).get().subscribe(snaps => {
            snaps.forEach(snap => {
                console.log(snap.id);
                console.log(snap.data());
            });
        })
    }

    async uploadData() {
        const coursesCollection = this.db.collection('courses');
        const courses = await this.db.collection('courses').get();
        for (let course of Object.values(COURSES)) {
            const newCourse = this.removeId(course);
            const courseRef = await coursesCollection.add(newCourse);
            const lessons = await courseRef.collection('lessons');
            const courseLessons = findLessonsForCourse(course['id']);
            console.log(`Uploading course ${course['description']}`);
            for (const lesson of courseLessons) {
                const newLesson = this.removeId(lesson);
                delete newLesson.courseId;
                await lessons.add(newLesson);
            }
        }
    }

    removeId(data: any) {
        const newData: any = {...data};
        delete newData.id;
        return newData;
    }

    onReadDoc() {
        this.db.doc("/courses/7hU1lWbJwtGSzVukH3RI").get().subscribe(snap => {
            console.log(snap.data())
            console.log(snap.id)
        })
    }


}
















