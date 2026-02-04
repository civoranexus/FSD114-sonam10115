# Quick Start Guide - Quiz Integration

## ⚡ 5-Minute Setup

### Step 1: Wrap App with QuizProvider

```javascript
// frontend/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { QuizProvider } from "./context/quiz-context/QuizContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QuizProvider>
      <App />
    </QuizProvider>
  </React.StrictMode>,
);
```

### Step 2: Add Route to Quiz Page

```javascript
// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuizPage from "./pages/student/QuizPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ...other routes... */}
        <Route path="/quiz" element={<QuizPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Step 3: Add Navigation Link

```javascript
// In your navigation/menu component
<NavLink to="/quiz" className="nav-link">
  📚 Quizzes
</NavLink>
```

---

## ✅ Verification Checklist

- [ ] QuizProvider wraps entire app
- [ ] QuizPage route added
- [ ] Navigation link added
- [ ] Backend API endpoints working
- [ ] CSS files imported
- [ ] AuthContext properly configured
- [ ] localStorage has accessToken

---

## 🧪 Test the Setup

1. Navigate to `http://localhost:5173/quiz`
2. Should see "Quiz Master" hero section
3. Should display quiz cards if quizzes exist
4. Click "Start Quiz" to test flow
5. Complete a quiz and check results

---

## 📝 Component Usage Examples

### Example 1: Display Quiz List Only

```javascript
import { useQuiz } from "../hooks/useQuiz";

function QuizBrowser() {
  const { quizzes, fetchQuizzes } = useQuiz();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    fetchQuizzes(token);
  }, []);

  return (
    <div className="quiz-grid">
      {quizzes.map((quiz) => (
        <div key={quiz._id} className="quiz-card">
          <h3>{quiz.title}</h3>
          <p>{quiz.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Custom Quiz Form

```javascript
import quizService from '../services/quizService'

function CustomQuizForm() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (answers) => {
    setLoading(true)
    try {
      const result = await quizService.submitQuiz(
        {
          quizId: 'quiz-id',
          answers: answers,
          score: 85
        },
        localStorage.getItem('accessToken')
      )
      console.log('Result:', result)
    } finally {
      setLoading(false)
    }
  }

  return (
    // Your form JSX
  )
}
```

### Example 3: Score Display Widget

```javascript
import { useQuizScore } from "../hooks/useQuiz";

function ScoreWidget({ answers, questions }) {
  const { percentage, passed, correct, total } = useQuizScore(
    answers,
    questions,
  );

  return (
    <div className="score-widget">
      <div className={`score-badge ${passed ? "pass" : "fail"}`}>
        {percentage}%
      </div>
      <p>
        {correct}/{total} correct
      </p>
    </div>
  );
}
```

---

## 🔗 API Integration

### Expected Backend Endpoints

Your backend should implement these endpoints:

```
GET /student/courses
  Returns: { data: [{ _id, title, quizzes: [...] }, ...] }

POST /quiz/submit
  Body: { quizId, courseId, score, totalQuestions, answers, timeSpent }
  Returns: { success: true, data: {...} }

GET /quiz/:quizId/attempts
  Returns: { data: [...attempts] }
```

---

## 🎨 Customization

### Change Primary Color

Edit `QuizPage.css`:

```css
:root {
  --primary-color: #YOUR_COLOR;
  --secondary-color: #YOUR_COLOR2;
}
```

### Adjust Question Layout

Edit `QuizPage.jsx`:

```javascript
<div
  className="options-grid"
  style={{
    gridTemplateColumns: "repeat(1, 1fr)", // Change grid columns
  }}
>
  {/* options */}
</div>
```

### Modify Timer Behavior

Edit `QuizPage.jsx`:

```javascript
const timeWarning = timeLeft < 60; // Change warning threshold
```

---

## 🐛 Common Issues & Solutions

| Issue                                      | Solution                              |
| ------------------------------------------ | ------------------------------------- |
| "useQuiz must be used within QuizProvider" | Wrap app with `<QuizProvider>`        |
| Token undefined                            | Check localStorage key matches        |
| API 401 errors                             | Verify token is valid and not expired |
| Styles not applying                        | Check CSS file is imported            |
| Quiz not loading                           | Check backend endpoints               |
| Timer not counting                         | Verify `quizStarted` state changes    |
| Answers not saved                          | Check `handleAnswerSelect` is called  |

---

## 📞 Need Help?

1. **Check Console**: Press F12 and check browser console for errors
2. **Verify Backend**: Test endpoints with Postman
3. **Check Token**: Ensure accessToken exists in localStorage
4. **Review Logs**: Check backend server logs for errors
5. **Test Manually**: Try quiz flow step by step

---

**Ready to go!** 🚀

Your quiz system is now integrated and ready to use.
