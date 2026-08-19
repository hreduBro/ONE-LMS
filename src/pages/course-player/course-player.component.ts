import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LmsDataService } from '../../services/lms-data.service';
import { Course, Lesson, QuizQuestion, Certificate } from '../../models/lms.model';

@Component({
  selector: 'app-course-player',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './course-player.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursePlayerComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  lms = inject(LmsDataService);

  courseId = signal<string>('');
  activeLessonId = signal<string>('');
  isSidebarOpen = signal<boolean>(true);
  showCertificateModal = signal<boolean>(false);
  earnedCertificate = signal<Certificate | null>(null);

  // Active quiz state
  selectedAnswers = signal<Record<string, number>>({});
  quizSubmitted = signal<boolean>(false);
  quizScore = signal<number>(0);
  quizPassed = signal<boolean>(false);

  // Active note-taking scratchpad
  lessonNotes = signal<string>('');

  // Course computed
  course = computed<Course>(() => {
    const id = this.courseId();
    const found = this.lms.courses().find(c => c.id === id);
    return found || this.lms.courses()[0];
  });

  // Current enrollment computed
  enrollment = computed(() => {
    const c = this.course();
    const user = this.lms.activeUser();
    return this.lms.enrollments().find(e => e.courseId === c.id && e.userId === user.id);
  });

  // All lessons flat list
  allLessons = computed<Lesson[]>(() => {
    const list: Lesson[] = [];
    this.course().modules.forEach(m => m.lessons.forEach(l => list.push(l)));
    return list;
  });

  // Active lesson computed
  activeLesson = computed<Lesson>(() => {
    const id = this.activeLessonId();
    const list = this.allLessons();
    const found = list.find(l => l.id === id);
    return found || list[0];
  });

  // Active lesson index
  currentLessonIndex = computed(() => {
    const current = this.activeLesson();
    return this.allLessons().findIndex(l => l.id === current.id);
  });

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.courseId.set(id);
        const c = this.course();
        const user = this.lms.activeUser();
        
        // Ensure user is enrolled
        this.lms.enrollInCourse(c.id, user.id);

        // Select first lesson or last completed
        const enr = this.enrollment();
        if (enr && enr.lastAccessedLessonId) {
          this.activeLessonId.set(enr.lastAccessedLessonId);
        } else if (c.modules[0]?.lessons[0]) {
          this.activeLessonId.set(c.modules[0].lessons[0].id);
        }
      }
    });
  }

  selectLesson(lessonId: string) {
    this.activeLessonId.set(lessonId);
    this.quizSubmitted.set(false);
    this.selectedAnswers.set({});
  }

  isLessonCompleted(lessonId: string): boolean {
    const enr = this.enrollment();
    return enr ? enr.completedLessonIds.includes(lessonId) : false;
  }

  // Mark active lesson as completed
  markLessonComplete() {
    const course = this.course();
    const lesson = this.activeLesson();
    const user = this.lms.activeUser();

    this.lms.completeLesson(course.id, lesson.id, user.id);

    // Check if course became 100% complete
    const enr = this.enrollment();
    if (enr && enr.progressPercent === 100) {
      const cert = this.lms.certificates().find(c => c.courseId === course.id && c.userId === user.id);
      if (cert) {
        this.earnedCertificate.set(cert);
        this.showCertificateModal.set(true);
      }
    } else {
      this.goToNextLesson();
    }
  }

  goToNextLesson() {
    const idx = this.currentLessonIndex();
    const all = this.allLessons();
    if (idx < all.length - 1) {
      this.selectLesson(all[idx + 1].id);
    }
  }

  goToPrevLesson() {
    const idx = this.currentLessonIndex();
    const all = this.allLessons();
    if (idx > 0) {
      this.selectLesson(all[idx - 1].id);
    }
  }

  // Quiz submission
  selectQuizOption(questionId: string, optionIdx: number) {
    if (this.quizSubmitted()) return;
    this.selectedAnswers.update(prev => ({
      ...prev,
      [questionId]: optionIdx
    }));
  }

  submitQuiz(questions: QuizQuestion[], passingScorePercent = 75) {
    let totalPoints = 0;
    let earnedPoints = 0;
    const answers = this.selectedAnswers();

    questions.forEach(q => {
      totalPoints += q.points;
      if (answers[q.id] === q.correctAnswerIndex) {
        earnedPoints += q.points;
      }
    });

    const scorePercent = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 100;
    const passed = scorePercent >= passingScorePercent;

    this.quizScore.set(scorePercent);
    this.quizPassed.set(passed);
    this.quizSubmitted.set(true);

    if (passed) {
      const course = this.course();
      const lesson = this.activeLesson();
      const user = this.lms.activeUser();
      this.lms.completeLesson(course.id, lesson.id, user.id, scorePercent);

      const cert = this.lms.certificates().find(c => c.courseId === course.id && c.userId === user.id);
      if (cert) {
        this.earnedCertificate.set(cert);
      }
    }
  }

  retryQuiz() {
    this.quizSubmitted.set(false);
    this.selectedAnswers.set({});
  }

  viewCertificate() {
    const course = this.course();
    const user = this.lms.activeUser();
    const cert = this.lms.certificates().find(c => c.courseId === course.id && c.userId === user.id);
    if (cert) {
      this.earnedCertificate.set(cert);
      this.showCertificateModal.set(true);
    }
  }

  printCertificate() {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}
