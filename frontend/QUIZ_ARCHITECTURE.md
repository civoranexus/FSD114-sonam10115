# Quiz Module Architecture Diagram

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        QUIZ PAGE                             │
│                   (QuizPage.jsx)                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Quiz List   │  │ Preparation  │  │ Active Quiz  │      │
│  │    View      │  │   Screen     │  │    View      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                   │                  │             │
│         └───────────────────┴──────────────────┘             │
│                       ↓                                       │
│  ┌──────────────────────────────────┐                       │
│  │      Results Screen              │                       │
│  └──────────────────────────────────┘                       │
└─────────────────────────────────────────────────────────────┘
           │                                      │
           ↓                                      ↓
    ┌──────────────────┐              ┌──────────────────┐
    │ QuizContext      │              │ Custom Hooks     │
    │ (State Mgmt)     │              │ (Logic)          │
    └──────────────────┘              └──────────────────┘
           │                                      │
           └──────────────┬───────────────────────┘
                          ↓
                ┌──────────────────┐
                │ quizService.js   │
                │ (API Calls)      │
                └──────────────────┘
                          │
                          ↓
                ┌──────────────────┐
                │ Backend API      │
                │ (Express.js)     │
                └──────────────────┘
```

---

## 🔄 Component Interaction Flow

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERACTION                      │
└─────────────────────────────────────────────────────────┘
                         │
                         ↓
        ┌────────────────────────────────┐
        │  Display Quiz List View        │
        │  - Fetch quizzes from API      │
        │  - Show quiz cards             │
        │  - Loading states              │
        └────────────────────────────────┘
                         │
            ┌────────────┴────────────┐
            │ (User clicks Start)      │
            ↓                          ↓
    ┌──────────────────┐    ┌──────────────────┐
    │ Load Quiz Data   │    │ Display Prep     │
    │ - Fetch details  │    │ Screen           │
    │ - Load questions │    │ - Show rules     │
    └──────────────────┘    │ - Start button   │
            │               └──────────────────┘
            │                        │
            └────────────┬───────────┘
                         │ (Click Start)
                         ↓
            ┌──────────────────────────┐
            │ Start Quiz               │
            │ - Initialize timer       │
            │ - Show first question    │
            │ - Record answers         │
            └──────────────────────────┘
                         │
                         ↓
            ┌──────────────────────────┐
            │ Display Questions        │
            │ 1. Show question text    │
            │ 2. Display options       │
            │ 3. Update progress       │
            │ 4. Update timer          │
            └──────────────────────────┘
                         │
                         ↓
            ┌──────────────────────────┐
            │ User Selects Answer      │
            │ - Record in state        │
            │ - Calculate score        │
            │ - Auto-advance           │
            └──────────────────────────┘
                         │
                    ┌────┴────┐
                    │ More Qs? │
                    └────┬────┘
                Yes   │       │    No
                      ↓       ↓
                  Next Q   Submit
                    │       Quiz
                    │         │
                    └────┬────┘
                         ↓
            ┌──────────────────────────┐
            │ Calculate Final Score    │
            │ - Count correct answers  │
            │ - Calculate percentage   │
            │ - Determine pass/fail    │
            └──────────────────────────┘
                         │
                         ↓
            ┌──────────────────────────┐
            │ Display Results          │
            │ - Score percentage       │
            │ - Correct/Total count    │
            │ - Pass/Fail badge        │
            │ - Feedback message       │
            └──────────────────────────┘
                         │
                    ┌────┴────┐
                    │          │
             Retake │          │ Back
               Quiz │          │
                    ↓          ↓
                  Reset    Quiz List
```

---

## 📁 File Structure & Dependencies

```
frontend/
│
├── src/
│   │
│   ├── pages/
│   │   └── student/
│   │       ├── QuizPage.jsx          ← Main component
│   │       ├── QuizPage.css          ← Styling
│   │       └── QUIZ_README.md        ← Documentation
│   │
│   ├── context/
│   │   └── quiz-context/
│   │       └── QuizContext.jsx       ← State Management
│   │
│   ├── services/
│   │   └── quizService.js            ← API Layer
│   │
│   ├── hooks/
│   │   └── useQuiz.js                ← Custom Hooks
│   │
│   └── App.jsx
│       ├── imports QuizPage
│       └── wraps with QuizProvider
│
├── QUIZ_SETUP.md                    ← Integration Guide
└── QUIZ_IMPLEMENTATION_SUMMARY.md   ← Overview
```

---

## 🔗 API Communication

```
┌──────────────────┐
│  QuizPage.jsx    │
└─────────┬────────┘
          │
          │ calls
          ↓
┌──────────────────────────┐
│  quizService.js          │
├──────────────────────────┤
│ - getQuizzes()           │
│ - getQuizById()          │
│ - submitQuiz()           │
│ - getQuizAttempts()      │
│ - getQuizLeaderboard()   │
└─────────┬────────────────┘
          │
          │ axios GET/POST
          ↓
┌──────────────────────────┐
│ Express Backend API      │
├──────────────────────────┤
│ GET  /student/courses    │
│ GET  /quiz/:quizId       │
│ POST /quiz/submit        │
│ GET  /quiz/:id/attempts  │
│ GET  /quiz/:id/lb        │
└──────────────────────────┘
          │
          │
          ↓
┌──────────────────────────┐
│ MongoDB Database         │
├──────────────────────────┤
│ - Quiz Collection        │
│ - Question Collection    │
│ - QuizAttempt Collection │
└──────────────────────────┘
```

---

## 🎯 State Management Flow

```
┌─────────────────────────────────────┐
│     QuizContext (Initial State)      │
├─────────────────────────────────────┤
│ - quizzes: []                        │
│ - currentQuiz: null                  │
│ - currentQuestion: 0                 │
│ - answers: []                        │
│ - score: 0                           │
│ - loading: false                     │
│ - error: null                        │
│ - quizAttempts: []                   │
└──────────────┬──────────────────────┘
               │
               ├─────────────────────────────────┐
               │                                 │
               ↓                                 ↓
     ┌──────────────────┐         ┌──────────────────┐
     │ State Updates    │         │ Action Methods   │
     ├──────────────────┤         ├──────────────────┤
     │ - setQuizzes()   │         │ - fetchQuizzes() │
     │ - setCurrentQuiz │         │ - fetchQuiz()    │
     │ - setCurrentQ()  │         │ - recordAnswer() │
     │ - setAnswers()   │         │ - nextQuestion() │
     │ - setScore()     │         │ - submitQuiz()   │
     │ - setLoading()   │         │ - resetQuiz()    │
     │ - setError()     │         │ - fetchAttempts()│
     └──────────────────┘         └──────────────────┘
               │                          │
               └──────────────┬───────────┘
                              │
                              ↓
                     QuizPage Component
                    (Re-renders on change)
```

---

## 🎨 View Hierarchy

```
QuizPage (Root)
│
├── QuizLoader (loading && !selectedQuiz)
│   └── Spinner
│
├── QuizListView (quizzes && !selectedQuiz)
│   ├── HeroSection
│   ├── QuizGrid
│   │   └── QuizCard[] (Mapped)
│   │       ├── Header
│   │       ├── Body
│   │       └── Button
│   └── EmptyState
│
├── QuizPrepView (!quizStarted && !showResults)
│   ├── BackButton
│   ├── PrepHeader
│   ├── PrepDetails
│   ├── Instructions
│   └── StartButton
│
├── ActiveQuizView (quizStarted && !showResults)
│   ├── HeaderBar
│   ├── ProgressBar
│   ├── QuestionCard
│   │   ├── QuestionNumber
│   │   ├── QuestionText
│   │   ├── QuestionImage (Optional)
│   │   ├── OptionButton[] (Mapped)
│   │   └── QuestionFooter
│   └── Timer
│
└── ResultsView (showResults)
    ├── ResultsCard
    │   ├── Icon (Animated)
    │   ├── Title
    │   ├── ScoreCircle
    │   ├── StatusBadge
    │   ├── FeedbackMessage
    │   ├── StatsBoxes[]
    │   └── ActionButtons
    └── Navigation
```

---

## 🔄 Data Flow Example

```
User Action: Click "Start Quiz"
        │
        ↓
handleStartQuiz()
        │
        ├─ setQuizStarted(true)
        ├─ setTimeLeft(quiz.duration * 60)
        └─ Start Timer
        │
        ↓
Timer Effect Runs
        │
        ├─ Every 1 second: setTimeLeft(prev => prev - 1)
        └─ Triggers Re-render
        │
        ↓
Display Active Quiz View
        │
        ├─ Show question[currentQuestion]
        ├─ Display timer with timeLeft
        └─ Display progress bar
        │
        ↓
User Clicks Answer Option
        │
        ↓
handleAnswerSelect(index, isCorrect)
        │
        ├─ recordAnswer() in state
        ├─ isCorrect ? setScore(score + 1)
        ├─ Auto-advance to next question OR
        └─ Call handleSubmitQuiz() if last
        │
        ↓
State Updates Trigger Re-render
```

---

## 📊 Database Model Structure

```
Quiz Collection
├── _id
├── title
├── description
├── difficulty
├── duration (minutes)
├── passingScore (%)
└── questions[] (array of question IDs)

Question Collection
├── _id
├── quizId (ref to Quiz)
├── question (text)
├── imageUrl
├── options[]
│   ├── text
│   └── isCorrect
└── explanation

QuizAttempt Collection
├── _id
├── userId
├── quizId
├── courseId
├── score (%)
├── totalQuestions
├── answers[]
│   ├── questionId
│   ├── selectedOption
│   ├── isCorrect
│   └── timeSpent
├── timeSpent (total)
└── timestamp
```

---

## 🔐 Security Layer

```
Request Flow with Authentication
        │
        ├─ Client: Get token from localStorage
        │
        ├─ Axios Interceptor
        │   ├─ Add Authorization: Bearer {token}
        │   └─ Send with withCredentials: true
        │
        ↓
Backend Middleware
        │
        ├─ auth-middleware.js
        │   ├─ Verify JWT signature
        │   ├─ Check token expiration
        │   ├─ Attach user payload to req.user
        │   └─ Update lastActive timestamp
        │
        ↓
Route Handler
        │
        ├─ Verify user owns the quiz
        ├─ Validate score server-side
        └─ Save to database
```

---

This comprehensive architecture ensures:
✅ **Modularity** - Separated concerns (components, hooks, services)
✅ **Scalability** - Easy to extend with new features
✅ **Maintainability** - Clear structure and organization
✅ **Performance** - Optimized rendering and API calls
✅ **Security** - Token-based authentication throughout
✅ **Reliability** - Error handling and fallbacks
