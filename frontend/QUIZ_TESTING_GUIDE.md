# Quiz Module Testing Guide

## 🧪 Testing Checklist

### Phase 1: Setup Verification

- [ ] All files are created in correct directories
- [ ] QuizProvider wraps the app root
- [ ] Quiz route is added to router
- [ ] Navigation link is visible
- [ ] No console errors on app load
- [ ] AuthContext is properly configured
- [ ] localStorage has valid token

### Phase 2: UI Rendering

**Test: Quiz List View**

```
Steps:
1. Navigate to /quiz
2. Verify hero section displays "📚 Quiz Master"
3. Verify quiz cards render (if quizzes exist)
4. Verify all card elements show:
   - Quiz icon
   - Quiz title
   - Quiz description
   - Questions count
   - Duration
   - Passing score
   - Start button
5. Test responsive - resize browser to mobile size
6. Verify layout adjusts properly
```

**Test: Quiz Card Click**

```
Steps:
1. Click on any quiz card
2. Verify preparation screen shows
3. Verify all quiz details display
4. Verify "Back to Quizzes" button works
5. Return to quiz list
```

### Phase 3: Quiz Flow

**Test: Start Quiz**

```
Steps:
1. Click on a quiz card
2. View preparation screen
3. Read all instructions
4. Click "Start Quiz Now"
5. Verify:
   - Timer starts counting down
   - First question displays
   - Progress bar shows 0%
   - Question counter shows 1/total
6. Observe timer decreasing
```

**Test: Answer Questions**

```
Steps:
1. Click on option A
2. Verify:
   - Answer is recorded
   - Next question displays
   - Progress bar increments
   - Question counter updates
   - Timer continues counting
3. Try different options
4. Verify visual feedback on hover
5. Verify score updates for correct answers
```

**Test: Progress Tracking**

```
Steps:
1. Answer several questions
2. Check progress bar matches (current/total * 100)
3. Verify question counter increments
4. Check timer decrements properly
5. Answer more questions
6. Verify progress bar fills correctly
```

**Test: Timer Warning**

```
Steps:
1. Note when timer goes below 60 seconds
2. Verify:
   - Timer changes color to red
   - Timer pulses/blinks
   - Warning is visible
3. Continue answering
4. When timer hits 0:
   - Quiz auto-submits
   - Results display
```

### Phase 4: Results Display

**Test: Results Screen**

```
Steps:
1. Complete quiz (answer all questions)
2. Verify results screen shows:
   - Celebration emoji
   - "Quiz Completed!" message
   - Score circle with percentage
   - Correct/total count
   - Pass/Fail badge
   - Feedback message (appropriate for score)
   - Statistics boxes
3. Verify styling matches score (green=pass, red=fail)
```

**Test: Results Actions**

```
Steps:
1. From results, click "Retake Quiz"
2. Verify:
   - Score resets to 0
   - Question counter resets to 1
   - Timer resets
   - Quiz starts over
3. Click back during quiz
4. Click "Back to Quizzes" from results
5. Verify return to quiz list view
```

### Phase 5: API Integration

**Test: API Calls (Use Network Tab)**

```
Steps:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Navigate to /quiz
4. Verify API call: GET /student/courses
   - Status: 200
   - Response has quiz data
5. Click on quiz
6. Verify API call: GET /quiz/:id
   - Status: 200
   - Response has questions
7. Complete quiz
8. Verify API call: POST /quiz/submit
   - Status: 201
   - Response has score
```

**Test: Error Handling**

```
Steps:
1. Stop backend server
2. Try to load quiz page
3. Verify error message displays
4. Refresh or go back
5. Start backend again
6. Verify quizzes load
7. Test with invalid token:
   - Clear localStorage
   - Try to access /quiz
   - Verify redirect to login or error
```

### Phase 6: Responsive Design

**Test: Mobile (480px)**

```
Browser: Chrome DevTools - iPhone SE
Steps:
1. Navigate to /quiz
2. Verify:
   - Layout stacks vertically
   - Text is readable
   - Buttons are large (touch-friendly)
   - No horizontal scroll
3. Take a quiz:
   - Options stack vertically
   - Timer and progress visible
   - Touch interactions work
```

**Test: Tablet (768px)**

```
Browser: Chrome DevTools - iPad
Steps:
1. Navigate to /quiz
2. Verify:
   - Grid shows 2 columns
   - Content fits properly
   - Images scale correctly
3. Take a quiz:
   - Options display in 2x2 grid
   - All elements accessible
```

**Test: Desktop (1024px+)**

```
Browser: Full screen
Steps:
1. Navigate to /quiz
2. Verify:
   - Full grid display
   - All features visible
   - Professional spacing
3. Take a quiz:
   - Question card centered
   - Options well-spaced
   - Timer clearly visible
```

### Phase 7: Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

Test each browser:

1. Load quiz page
2. Take full quiz
3. Check console for errors
4. Verify all animations work
5. Verify styling looks correct

### Phase 8: Performance

**Test: Load Time**

```
Steps:
1. Open DevTools
2. Go to Performance tab
3. Start recording
4. Navigate to /quiz
5. Stop recording
6. Analyze:
   - Load time < 2 seconds
   - No long tasks
   - Smooth animations
7. Measure FCP, LCP, CLS
```

**Test: Quiz Performance**

```
Steps:
1. Start a 20-question quiz
2. Answer questions rapidly
3. Verify:
   - No lag between clicks
   - Progress updates smoothly
   - Timer counts accurately
   - No memory leaks (check Task Manager)
```

### Phase 9: Data Validation

**Test: Score Calculation**

```
Steps:
1. Take quiz with known answers
2. Answer 5 correct, 5 incorrect (out of 10)
3. Verify score = 50%
4. Test with 10 correct = 100%
5. Test with 0 correct = 0%
6. Verify calculations are accurate
```

**Test: Timer Accuracy**

```
Steps:
1. Start 1-minute quiz
2. Observe timer
3. Time it with stopwatch:
   - Should count down 60→59→...→1→0
   - Takes exactly 60 seconds
4. Verify on-time auto-submit
```

**Test: Pass/Fail Logic**

```
Steps:
1. Take quiz with passing score (≥60%)
2. Verify: Pass badge, green styling
3. Take quiz with failing score (<60%)
4. Verify: Fail badge, red styling
5. Score exactly 60% = Pass
```

### Phase 10: User Experience

**Test: Empty States**

```
Steps:
1. When no quizzes: See "No Quizzes Available"
2. When loading: See spinner
3. When error: See error message
4. When no questions: See appropriate message
```

**Test: Visual Feedback**

```
Steps:
1. Hover over quiz card: Lift effect
2. Hover over option: Highlight effect
3. Click option: Visual change
4. Answer correctly: Score increments
5. Timer low: Color change
6. Complete quiz: Celebration animation
```

**Test: Navigation**

```
Steps:
1. Quiz List → Click Quiz → Preparation Screen
2. Preparation → Click Start → Active Quiz
3. Active Quiz → Answer All → Results
4. Results → Click Retake → Active Quiz (same)
5. Results → Click Back → Quiz List
6. At any point, verify back buttons work
```

---

## 🐛 Common Issues & Debugging

### Issue: Quizzes not loading

```
Debug Steps:
1. Check browser console for errors
2. Check Network tab - API call status
3. Verify backend is running (localhost:8000)
4. Check if token is valid
5. Test API directly: curl -H "Authorization: Bearer TOKEN" http://localhost:8000/student/courses
6. Check MongoDB connection
```

### Issue: Timer not working

```
Debug Steps:
1. Check if useEffect is running
2. Verify quizStarted state = true
3. Check interval is being set
4. In DevTools: Type in console - check setTimeLeft updates
5. Verify no errors in timer useEffect
6. Check if component re-renders properly
```

### Issue: Score not calculating

```
Debug Steps:
1. Check handleAnswerSelect is called
2. Verify answers array is being updated
3. In DevTools: console.log answers after each question
4. Verify isCorrect property on options
5. Check score state updates in React DevTools
6. Verify calculation logic: score + (isCorrect ? 1 : 0)
```

### Issue: Styles not applying

```
Debug Steps:
1. Verify CSS file is imported in JSX
2. Check CSS file path is correct
3. Inspect element in DevTools
4. Check for CSS conflicts
5. Verify class names match
6. Check no CSS specificity issues
7. Clear browser cache (Ctrl+Shift+Delete)
```

### Issue: API 401 errors

```
Debug Steps:
1. Check localStorage has token
2. Verify token format: "Bearer <token>"
3. Test token validity in backend
4. Check token expiration
5. Verify CORS credentials enabled
6. Test with fresh login
7. Check Authorization header in Network tab
```

---

## 📊 Test Data Preparation

### Create Sample Quiz (Backend)

```javascript
// Sample quiz for testing
const sampleQuiz = {
  title: "JavaScript Basics",
  description: "Test your JavaScript knowledge",
  difficulty: "Beginner",
  duration: 2, // 2 minutes for testing
  passingScore: 60,
  questions: [
    {
      question: "What does JS stand for?",
      options: [
        { text: "JavaScript", isCorrect: true },
        { text: "Java Source", isCorrect: false },
        { text: "JSON Script", isCorrect: false },
      ],
    },
    {
      question: "Which is a primitive type?",
      options: [
        { text: "String", isCorrect: true },
        { text: "Array", isCorrect: false },
        { text: "Object", isCorrect: false },
      ],
    },
    // Add 8 more questions...
  ],
};
```

---

## ✅ Final Testing Checklist

- [ ] All views render correctly
- [ ] Quiz flow works end-to-end
- [ ] Timer counts accurately
- [ ] Score calculates correctly
- [ ] Results display properly
- [ ] Responsive design works
- [ ] All buttons function
- [ ] No console errors
- [ ] API calls succeed
- [ ] Token handling works
- [ ] Error states handled
- [ ] Animations smooth
- [ ] Performance acceptable
- [ ] Mobile friendly
- [ ] Cross-browser compatible

---

## 🚀 Ready for Production?

Once all checks pass, your quiz module is ready to deploy:

✅ Tested on multiple browsers  
✅ Verified responsive design  
✅ Confirmed API integration  
✅ Validated error handling  
✅ Checked performance metrics  
✅ Reviewed security (tokens, validation)

**Congratulations!** Your quiz system is production-ready. 🎉
