# Quiz Module - Complete Implementation Guide

## 📋 Overview

This Quiz module provides a complete interactive quiz system for the CivoraX LMS platform. It includes question displays, answer tracking, scoring, timer functionality, and result visualization.

---

## 📁 File Structure

```
frontend/
├── src/
│   ├── pages/
│   │   └── student/
│   │       ├── QuizPage.jsx          # Main quiz component
│   │       └── QuizPage.css          # Complete styling
│   ├── services/
│   │   └── quizService.js            # API service for quizzes
│   ├── context/
│   │   └── quiz-context/
│   │       └── QuizContext.jsx       # Quiz state management
│   └── hooks/
│       └── useQuiz.js                # Custom hooks
```

---

## 🚀 Features

✅ **Quiz List Display** - Browse all available quizzes  
✅ **Quiz Preparation Screen** - Review quiz details before starting  
✅ **Interactive Questions** - MCQ with visual feedback  
✅ **Timer** - Countdown with visual warnings  
✅ **Progress Tracking** - Visual progress bar  
✅ **Automatic Scoring** - Real-time score calculation  
✅ **Results Display** - Detailed performance summary  
✅ **Retake Option** - Multiple attempts supported  
✅ **Responsive Design** - Mobile-friendly UI  
✅ **Smooth Animations** - Professional transitions

---

## 🔧 Installation & Setup

### Step 1: Add Quiz Provider to App

```javascript
// frontend/src/App.jsx
import { QuizProvider } from "./context/quiz-context/QuizContext";

function App() {
  return <QuizProvider>{/* Your app routes */}</QuizProvider>;
}

export default App;
```

### Step 2: Import QuizPage Component

```javascript
// In your routing file
import QuizPage from "./pages/student/QuizPage";

// Add to routes
<Route path="/quiz" element={<QuizPage />} />;
```

### Step 3: Ensure Backend Endpoints Exist

The quiz system expects these backend endpoints:

```
GET  /student/courses              - Get student's courses with quizzes
GET  /quiz/course/:courseId        - Get quizzes for a course
GET  /quiz/:quizId                 - Get quiz details with questions
POST /quiz/submit                  - Submit quiz answers
GET  /quiz/:quizId/attempts        - Get user's quiz attempts
GET  /quiz/:quizId/leaderboard     - Get quiz leaderboard
```

---

## 📖 Component API

### QuizPage Component

Main component that handles all quiz functionality.

**Props**: None (uses Context API)

**States**:

- `quizzes` - Array of available quizzes
- `selectedQuiz` - Currently selected quiz
- `currentQuestion` - Index of current question
- `score` - Current score
- `showResults` - Show results screen
- `timeLeft` - Remaining time in seconds
- `quizStarted` - Quiz started flag

**Methods**:

- `fetchQuizzes()` - Load all quizzes
- `handleSelectQuiz()` - Select and prepare quiz
- `handleStartQuiz()` - Start the quiz timer
- `handleAnswerSelect()` - Record answer and move next
- `handleSubmitQuiz()` - Submit answers to backend
- `handleRetakeQuiz()` - Reset for another attempt
- `handleBackToQuizzes()` - Return to quiz list

---

## 🎨 Styling Features

### Color Scheme

```css
--primary-color: #667eea /* Purple gradient start */ --secondary-color: #764ba2
  /* Purple gradient end */ --success-color: #10b981 /* Green for pass */
  --danger-color: #ef4444 /* Red for fail */ --warning-color: #f59e0b
  /* Orange for alerts */;
```

### Responsive Breakpoints

- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: 480px - 767px
- **Small Mobile**: < 480px

---

## 🪝 Custom Hooks

### useQuiz()

Access quiz context and state management.

```javascript
import { useQuiz } from "../hooks/useQuiz";

function MyComponent() {
  const { quizzes, currentQuiz, score, submitQuiz, fetchQuizzes } = useQuiz();

  return <div>{/* Your component */}</div>;
}
```

### useQuizScore()

Calculate score information.

```javascript
import { useQuizScore } from "../hooks/useQuiz";

function Results() {
  const { correct, total, percentage, passed } = useQuizScore(
    answers,
    questions,
  );

  return (
    <div>
      {percentage}% - {passed ? "Passed" : "Failed"}
    </div>
  );
}
```

### useQuizTimer()

Manage quiz timer.

```javascript
import { useQuizTimer } from "../hooks/useQuiz";

function Timer() {
  const { timeLeft, formatTime, isActive, setIsActive } = useQuizTimer(
    600,
    () => handleTimeUp(),
  );

  return <div>{formatTime(timeLeft)}</div>;
}
```

### useQuizHistory()

Track quiz attempts.

```javascript
import { useQuizHistory } from "../hooks/useQuiz";

function History() {
  const { history, addAttempt, getAverageScore } = useQuizHistory();

  return <div>Average: {getAverageScore()}%</div>;
}
```

---

## 📡 API Service Methods

### quizService.js

```javascript
import quizService from "../services/quizService";

// Get quizzes for a course
quizService
  .getQuizzes(courseId, token)
  .then((data) => console.log(data))
  .catch((err) => console.error(err));

// Get single quiz
quizService
  .getQuizById(quizId, token)
  .then((data) => console.log(data))
  .catch((err) => console.error(err));

// Submit quiz
quizService
  .submitQuiz(quizData, token)
  .then((data) => console.log(data))
  .catch((err) => console.error(err));

// Get attempts
quizService
  .getQuizAttempts(quizId, token)
  .then((data) => console.log(data))
  .catch((err) => console.error(err));

// Calculate score
const score = quizService.calculateScore(answers, questions);
```

---

## 🔄 Quiz Flow

### 1. Quiz List View

- Display all available quizzes in grid
- Show quiz metadata (questions, duration, difficulty)
- Click "Start Quiz" button

### 2. Preparation Screen

- Display quiz instructions
- Show quiz details (questions, time limit, passing score)
- Click "Start Quiz Now" button

### 3. Active Quiz View

- Display current question (index/total)
- Show progress bar
- Display timer with warning
- Present MCQ options
- Auto-advance to next question
- Auto-submit when done

### 4. Results Screen

- Show score percentage
- Display correct/total count
- Show pass/fail badge
- Display personalized message
- Offer retake or back options

---

## 🎯 Data Structure

### Quiz Object

```javascript
{
  _id: "60d5ec49c1234567890abc",
  title: "JavaScript Basics",
  description: "Test your JavaScript fundamentals",
  difficulty: "Beginner",
  duration: 15,           // minutes
  passingScore: 60,       // percentage
  questions: [...]        // Array of questions
}
```

### Question Object

```javascript
{
  _id: "60d5ec49c1234567890def",
  question: "What does JS stand for?",
  imageUrl: null,
  options: [
    {
      text: "JavaScript",
      isCorrect: true
    },
    {
      text: "Java Source",
      isCorrect: false
    },
    // ... more options
  ]
}
```

### Answer Object

```javascript
{
  questionId: "60d5ec49c1234567890def",
  selectedOption: 0,      // index of selected option
  isCorrect: true,
  timeSpent: 45           // seconds
}
```

### Quiz Submission Object

```javascript
{
  quizId: "60d5ec49c1234567890abc",
  courseId: "60d5ec49c1234567890xyz",
  score: 85,              // percentage
  totalQuestions: 10,
  answers: [...],         // Array of answers
  timeSpent: 450          // seconds
}
```

---

## 🐛 Troubleshooting

### Issue: Quiz not loading

**Solution**: Ensure backend endpoints are correctly implemented and token is valid

### Issue: Timer not working

**Solution**: Check if `timeLeft` state is properly initialized with quiz duration

### Issue: Answers not being recorded

**Solution**: Verify `handleAnswerSelect` is called with correct parameters

### Issue: CORS errors

**Solution**: Ensure backend CORS config includes frontend origin

### Issue: Styles not applied

**Solution**: Check if QuizPage.css is properly imported in QuizPage.jsx

---

## 🔐 Security Considerations

✅ **Token Validation** - All API calls require JWT token  
✅ **Backend Verification** - Score calculated server-side  
✅ **Answer Encryption** - Store answers securely  
✅ **Rate Limiting** - Prevent quiz submission spam  
✅ **Time Validation** - Verify quiz duration server-side

---

## 📱 Responsive Design

The quiz system is fully responsive:

- **Mobile** (< 480px): Single column, larger touch targets
- **Tablet** (480-768px): 2-column options, optimized spacing
- **Desktop** (768px+): 2-column options, full features
- **Large Screen** (1024px+): Multi-column quizzes

---

## 🎮 User Experience

### Animations

- Smooth fade-in/slide-up transitions
- Hover effects on buttons and options
- Progress bar animation
- Results celebration animation
- Timer pulse warning effect

### Accessibility

- Semantic HTML structure
- Clear labels and instructions
- Keyboard navigation support
- Color contrast compliance
- Readable font sizes

---

## 📞 Support & Documentation

For issues or questions:

1. Check the troubleshooting section
2. Review backend API implementation
3. Verify environment variables
4. Check browser console for errors
5. Test API endpoints with Postman

---

## 🚀 Future Enhancements

- [ ] Question bank randomization
- [ ] Partial credit system
- [ ] Detailed answer explanations
- [ ] Quiz categories/filters
- [ ] Performance analytics
- [ ] Leaderboard system
- [ ] Certificate generation
- [ ] Export results as PDF
- [ ] Proctoring features
- [ ] AI-powered question generation

---

**Version**: 1.0.0  
**Last Updated**: February 4, 2026  
**Maintained By**: CivoraX Development Team
