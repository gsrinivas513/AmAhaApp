# Puzzle Loading Architecture - Visual Reference

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                         App.js (Routes)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  /puzzle  ───────────► PuzzlesPage (Display Puzzles)          │
│                         ├─ Load from /puzzles collection        │
│                         └─ Click puzzle → navigate to below     │
│                                                                 │
│  /play/puzzle/:id ──► PuzzlePlayerPage ✅ NEW                 │
│                         ├─ Load puzzle from Firestore           │
│                         ├─ Display metadata                     │
│                         └─ [NEXT] Route to type-specific player │
│                                                                 │
│  /play/:type/:id ──► PlayPage (Generic - Quizzes, etc.)       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Loading Flow

```
┌──────────────┐
│ User at      │
│ /puzzle page │
└──────┬───────┘
       │
       │ Click puzzle card
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ PuzzlesPage.jsx                                                  │
│ ├─ useEffect: Load puzzles from /puzzles collection            │
│ ├─ Display puzzle grid with cards                              │
│ └─ onClick handler: navigate(`/play/puzzle/${puzzle.id}`)      │
└──────────────────────────────────────────────────────────────────┘
       │
       │ Navigate to /play/puzzle/9nl1hH4cB7Xp91qUpqcm
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ PuzzlePlayerPage.jsx ✅ NEW                                      │
│ ├─ useParams: Get id = "9nl1hH4cB7Xp91qUpqcm"                 │
│ ├─ useEffect: Load specific puzzle from Firestore             │
│ │  └─ const puzzleRef = doc(db, 'puzzles', id)               │
│ │  └─ const puzzleSnap = await getDoc(puzzleRef)             │
│ │  └─ setPuzzle({id: puzzleSnap.id, ...puzzleSnap.data()})  │
│ │                                                             │
│ └─ Render:                                                     │
│    ├─ IF loading: Show spinner                                │
│    ├─ IF error: Show error message                            │
│    └─ IF success: Show puzzle metadata                        │
│       ├─ Title: "Find the Matching Pair"                      │
│       ├─ Description: "Match the image with..."               │
│       ├─ Difficulty: "Medium"                                 │
│       ├─ Type: "matching"                                     │
│       └─ Data: {...puzzle data...}                            │
└──────────────────────────────────────────────────────────────────┘
       │
       │ [NEXT PHASE]
       │ Route to type-specific player
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Type-Specific Puzzle Player (To be implemented)                │
│                                                                 │
│ switch(puzzle.type) {                                          │
│   case 'picture-word': return <PictureWordPuzzlePlayer />     │
│   case 'matching': return <MatchingPuzzlePlayer />            │
│   case 'ordering': return <OrderingPuzzlePlayer />            │
│   ... etc                                                      │
│ }                                                              │
└──────────────────────────────────────────────────────────────────┘
```

## Firestore Data Structure

```
Firestore (Database)
│
└─ puzzles/ (Collection)
   │
   ├─ 9nl1hH4cB7Xp91qUpqcm (Document) ← Puzzle ID from URL
   │  │
   │  └─ Fields:
   │     ├─ id: "9nl1hH4cB7Xp91qUpqcm"
   │     ├─ title: "Find the Matching Pair"
   │     ├─ description: "Match the image with the correct word"
   │     ├─ type: "matching"
   │     ├─ difficulty: "Medium"
   │     ├─ ageGroup: "8-12"
   │     ├─ categoryName: "Animals"
   │     ├─ topicName: "Mammals"
   │     ├─ data: {
   │     │   leftItems: [...],
   │     │   rightItems: [...],
   │     │   correctMatches: {...}
   │     │ }
   │     ├─ isPublished: true
   │     ├─ xpReward: 50
   │     └─ createdAt: Timestamp
   │
   ├─ abc123def456 (Another Document)
   │  └─ ...
   │
   └─ xyz789uvw012 (Another Document)
      └─ ...
```

## Request Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ Browser: http://localhost:3000/play/puzzle/9nl1hH4cB7X...      │
└─────────────────────────────────────────────────────────────────┘
                           │
                           │ Route matches /play/puzzle/:id
                           │
                           ▼
                    ┌──────────────┐
                    │ Router       │
                    │ (App.js)     │
                    └──────┬───────┘
                           │
                           │ Renders
                           │
                           ▼
            ┌─────────────────────────────────┐
            │ PuzzlePlayerPage Component      │
            └──────────┬──────────────────────┘
                       │
                       │ useParams()
                       │ Gets: id = "9nl1hH4cB7X..."
                       │
                       ▼
            ┌─────────────────────────────────┐
            │ useEffect (on mount)            │
            │ ├─ Set loading = true          │
            │ └─ Call loadPuzzle()           │
            └──────────┬──────────────────────┘
                       │
                       │ async loadPuzzle()
                       │
                       ▼
            ┌─────────────────────────────────┐
            │ Firestore Query                 │
            │                                 │
            │ doc(db, 'puzzles', id)         │
            │ getDoc(puzzleRef)              │
            │                                 │
            │ HTTP Request to Firebase       │
            │ GET /puzzles/9nl1hH4cB7X...   │
            └──────────┬──────────────────────┘
                       │
                       │ Network delay (100-500ms)
                       │
                       ▼
            ┌─────────────────────────────────┐
            │ Firebase Response               │
            │ {                               │
            │   id: "9nl1hH4cB7X...",         │
            │   title: "Find...",             │
            │   type: "matching",             │
            │   data: {...},                  │
            │   ...                           │
            │ }                               │
            └──────────┬──────────────────────┘
                       │
                       │ setPuzzle(data)
                       │ setLoading(false)
                       │
                       ▼
            ┌─────────────────────────────────┐
            │ Component Re-renders            │
            │ loading = false                 │
            │ puzzle = {...data}              │
            └──────────┬──────────────────────┘
                       │
                       ▼
            ┌─────────────────────────────────┐
            │ Display Puzzle Metadata         │
            │ ✅ Title                        │
            │ ✅ Description                  │
            │ ✅ Difficulty                   │
            │ ✅ Category                     │
            │ ✅ Type                         │
            │ ✅ Raw Data                     │
            └─────────────────────────────────┘
```

## State Management

```
PuzzlePlayerPage Component State:

┌──────────────────────────────────────────────────────────┐
│                    Initial State                         │
├──────────────────────────────────────────────────────────┤
│  puzzle: null                                            │
│  loading: true                                           │
│  error: null                                             │
└──────────────────────────────────────────────────────────┘
            │
            │ useEffect runs, loadPuzzle() called
            │
            ▼
┌──────────────────────────────────────────────────────────┐
│                   Loading State                          │
├──────────────────────────────────────────────────────────┤
│  puzzle: null                                            │
│  loading: true  ← Show spinner                          │
│  error: null                                             │
└──────────────────────────────────────────────────────────┘
            │
            │ Firestore response received
            │
            ▼
    SUCCESS CASE                ERROR CASE
        │                           │
        ▼                           ▼
┌──────────────────┐     ┌──────────────────┐
│  puzzle: {...}   │     │  puzzle: null    │
│  loading: false  │     │  loading: false  │
│  error: null     │     │  error: "not..., │
│                  │     │  found"          │
│  Render: Metadata│     │  Render: Error   │
└──────────────────┘     └──────────────────┘
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────┐
│              loadPuzzle() function                      │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
    ┌─────────────┐
    │ Try Block   │
    └─────┬───────┘
          │
          ├─► doc(db, 'puzzles', id)
          │
          ├─► getDoc(puzzleRef)
          │
          ├─► puzzleSnap.exists() ?
          │   │
          │   ├─ YES: setState → render puzzle
          │   │
          │   └─ NO: setError("Puzzle not found")
          │
          └─► SUCCESS: Render metadata
                       ├─ Title
                       ├─ Description
                       └─ Metadata cards


         OR


    ┌─────────────┐
    │ Catch Block │
    └─────┬───────┘
          │
          └─► error caught
              │
              ├─► setError("Failed to load puzzle")
              │
              └─► RENDER: Error message
                  ├─ Error icon (❌)
                  ├─ Message text
                  └─ Back button
```

## Component Lifecycle

```
┌──────────────────────────────────────────────────────────────┐
│                    Component Mounts                          │
└────────┬─────────────────────────────────────────────────────┘
         │
         ▼
   useState() calls
   ├─ puzzle: null
   ├─ loading: true
   └─ error: null
         │
         ▼
   useEffect runs (dependency: [id])
   │
   ├─ Sets loading = true
   │
   ├─ Calls loadPuzzle()
   │    │
   │    ├─ Firestore doc reference
   │    ├─ getDoc() promise
   │    ├─ Data received
   │    └─ setState calls
   │
   └─ Component re-renders
         │
         ├─ IF loading: Show spinner
         ├─ IF error: Show error
         └─ IF puzzle: Show metadata
         │
         ▼ (user interacts)
   ┌──────────────────────────┐
   │ User clicks "Back"       │
   │ navigate('/puzzle')      │
   │ Component unmounts       │
   └──────────────────────────┘
```

## Route Resolution

```
User navigates to URL:
http://localhost:3000/play/puzzle/9nl1hH4cB7Xp91qUpqcm


Router matching process:
├─ /                          ✗ No match
├─ /categories                ✗ No match
│ ...
├─ /play/quiz/:type/:id       ✗ No match (quiz, not puzzle)
├─ /play/:type/:id            ✗ No match (generic, puzzle-specific exists)
│
└─► /play/puzzle/:id          ✅ MATCH
    │
    └─► Render: <PuzzlePlayerPage />
        │
        └─► useParams() extracts:
            id: "9nl1hH4cB7Xp91qUpqcm"
```

## Before vs After Comparison

```
BEFORE (BROKEN):                  AFTER (FIXED):
┌─────────────────────────────┐   ┌─────────────────────────────┐
│ /play/puzzle/:id            │   │ /play/puzzle/:id            │
│ (Route not defined)         │   │ (Properly routed)           │
│                             │   │                             │
│ Falls back to:              │   │ Routes to:                  │
│ /play/:type/:id             │   │ <PuzzlePlayerPage />        │
│ └─ PlayPage                 │   │ └─ Loads from Firestore    │
│    └─ DEMO_QUESTIONS array  │   │    └─ Displays puzzle data  │
│       └─ Quiz data ❌        │   │       └─ Puzzle data ✅    │
│                             │   │                             │
│ Rendered:                   │   │ Rendered:                   │
│ "What is the capital        │   │ "Find the Matching Pair"    │
│  of France?" ❌             │   │ Title, Difficulty ✅        │
└─────────────────────────────┘   └─────────────────────────────┘
```

## Integration Points

```
PuzzlesPage.jsx
    │
    │ Click handler:
    │ onClick={() => navigate(`/play/puzzle/${puzzle.id}`)}
    │
    ▼
App.js (Routes)
    │
    │ <Route path="/play/puzzle/:id" element={<PuzzlePlayerPage />} />
    │
    ▼
PuzzlePlayerPage.jsx
    │
    ├─ useParams() → id
    │
    ├─ useEffect() → loadPuzzle()
    │
    ├─ Firebase Integration
    │   └─ doc(db, 'puzzles', id)
    │   └─ getDoc(puzzleRef)
    │
    └─ Render metadata
         │
         └─ [NEXT PHASE]
            Route to type-specific player
            └─ <PictureWordPuzzlePlayer />
            └─ <MatchingPuzzlePlayer />
            └─ etc.
```

This visual reference helps understand how the puzzle loading system works and how data flows from the puzzle list through to the puzzle player component.
