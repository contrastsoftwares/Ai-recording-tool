import type { Note, TranscriptSegment } from "@/types/note";
import type { Conversation } from "@/types/chat";
import type { FlashcardDeck } from "@/types/flashcard";
import type { PracticeTest } from "@/types/test";

export const mockNotes: Note[] = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    content: `## Introduction to Machine Learning

Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.

### Key Concepts

- **Supervised Learning**: The algorithm learns from labeled training data, making predictions based on known input-output pairs.
- **Unsupervised Learning**: The algorithm identifies patterns in unlabeled data without predefined categories.
- **Reinforcement Learning**: The agent learns by interacting with an environment and receiving rewards or penalties.

### Types of Problems

1. **Classification**: Assigning categories to data points (e.g., spam detection)
2. **Regression**: Predicting continuous values (e.g., house prices)
3. **Clustering**: Grouping similar data points together
4. **Dimensionality Reduction**: Reducing the number of features while preserving important information

### Popular Algorithms

- Linear Regression
- Decision Trees
- Random Forests
- Support Vector Machines (SVM)
- Neural Networks
- K-Nearest Neighbors (KNN)

### Summary

Machine learning is transforming industries by automating decision-making processes. Understanding the fundamentals is essential for anyone entering the field of data science or AI.`,
    formats: ["bullet-points", "key-concepts"],
    sourceType: "video",
    sourceUrl: "https://youtube.com/watch?v=example1",
    transcript: "Welcome to this introduction to machine learning...",
    createdAt: "2026-02-16T10:30:00Z",
    updatedAt: "2026-02-16T10:30:00Z",
    tags: ["AI", "Machine Learning", "Data Science"],
    isFavorite: true,
  },
  {
    id: "2",
    title: "Organic Chemistry: Functional Groups",
    content: `## Organic Chemistry: Functional Groups

Functional groups are specific groupings of atoms within molecules that have their own characteristic properties.

### Major Functional Groups

- **Hydroxyl (-OH)**: Found in alcohols. Makes molecules polar and soluble in water.
- **Carbonyl (C=O)**: Found in aldehydes and ketones. Highly reactive.
- **Carboxyl (-COOH)**: Found in carboxylic acids. Acts as an acid, donating protons.
- **Amino (-NH2)**: Found in amines and amino acids. Acts as a base.
- **Phosphate (-PO4)**: Found in nucleic acids and ATP. Important in energy transfer.

### Naming Conventions

Organic molecules are named based on the longest carbon chain and the functional groups present. The IUPAC naming system provides standardized nomenclature.

### Reactions

Functional groups determine the chemical reactions a molecule can undergo. Common reaction types include substitution, elimination, addition, and condensation.`,
    formats: ["cornell", "outline"],
    sourceType: "pdf",
    createdAt: "2026-02-15T14:20:00Z",
    updatedAt: "2026-02-15T15:00:00Z",
    tags: ["Chemistry", "Organic", "Biology"],
    isFavorite: false,
  },
  {
    id: "3",
    title: "The French Revolution: Causes and Consequences",
    content: `## The French Revolution: Causes and Consequences

The French Revolution (1789-1799) was a period of radical political and societal change in France that fundamentally altered the course of modern history.

### Causes

1. **Financial Crisis**: France was nearly bankrupt due to involvement in the American Revolution and extravagant spending by the monarchy.
2. **Social Inequality**: The rigid estate system placed heavy tax burdens on the Third Estate (commoners) while the clergy and nobility were largely exempt.
3. **Enlightenment Ideas**: Philosophers like Voltaire, Rousseau, and Montesquieu challenged traditional authority and promoted ideas of liberty and equality.
4. **Food Shortages**: Poor harvests in 1788 led to bread shortages and widespread hunger.

### Key Events

- Storming of the Bastille (July 14, 1789)
- Declaration of the Rights of Man and of the Citizen
- Reign of Terror (1793-1794)
- Rise of Napoleon Bonaparte

### Consequences

The Revolution led to the end of absolute monarchy in France, the rise of democratic ideals, and inspired revolutionary movements worldwide.`,
    formats: ["timeline", "summary"],
    sourceType: "link",
    sourceUrl: "https://example.com/french-revolution-article",
    createdAt: "2026-02-14T09:15:00Z",
    updatedAt: "2026-02-14T09:15:00Z",
    tags: ["History", "Revolution", "Europe"],
    isFavorite: true,
  },
  {
    id: "4",
    title: "Podcast: Productivity Systems That Work",
    content: `## Productivity Systems That Work

A comprehensive overview of evidence-based productivity systems discussed in this podcast episode.

### The Pomodoro Technique

Work in focused 25-minute intervals followed by 5-minute breaks. After four cycles, take a longer 15-30 minute break. This technique helps maintain focus and prevents burnout.

### Getting Things Done (GTD)

David Allen's GTD method involves five steps:
1. Capture everything that has your attention
2. Clarify what each item means and what to do about it
3. Organize the results into appropriate categories
4. Reflect on your lists regularly
5. Engage and take action with confidence

### Time Blocking

Assign specific blocks of time to specific tasks or categories of work. This reduces context switching and creates predictable routines.

### Key Takeaways

- No single system works for everyone
- The best system is one you actually use consistently
- Start simple and add complexity only when needed
- Review and adjust your system regularly`,
    formats: ["bullet-points", "summary"],
    sourceType: "audio",
    createdAt: "2026-02-13T16:45:00Z",
    updatedAt: "2026-02-13T17:30:00Z",
    tags: ["Productivity", "Self-Help", "Podcast"],
    isFavorite: false,
  },
  {
    id: "5",
    title: "Calculus: Derivatives and Integration",
    content: `## Calculus: Derivatives and Integration

### Derivatives

The derivative measures the rate of change of a function. It tells us how a function's output changes as its input changes.

**Definition**: f'(x) = lim(h->0) [f(x+h) - f(x)] / h

#### Basic Rules
- Power Rule: d/dx(x^n) = nx^(n-1)
- Product Rule: d/dx(fg) = f'g + fg'
- Chain Rule: d/dx(f(g(x))) = f'(g(x)) * g'(x)

### Integration

Integration is the reverse process of differentiation. It finds the area under a curve.

#### Fundamental Theorem of Calculus
If F is an antiderivative of f, then the integral from a to b of f(x)dx = F(b) - F(a).

### Applications
- Finding velocity and acceleration
- Calculating areas and volumes
- Optimization problems
- Modeling physical systems`,
    formats: ["outline", "qa-format"],
    sourceType: "video",
    sourceUrl: "https://youtube.com/watch?v=example5",
    createdAt: "2026-02-12T11:00:00Z",
    updatedAt: "2026-02-12T12:15:00Z",
    tags: ["Math", "Calculus", "STEM"],
    isFavorite: false,
  },
  {
    id: "6",
    title: "Cell Biology: Mitosis and Meiosis",
    content: `## Cell Biology: Mitosis and Meiosis

### Mitosis

Mitosis is the process of cell division that results in two identical daughter cells. It consists of four main phases:

1. **Prophase**: Chromatin condenses into chromosomes. The nuclear envelope begins to break down.
2. **Metaphase**: Chromosomes align at the cell's equator (metaphase plate).
3. **Anaphase**: Sister chromatids separate and move to opposite poles.
4. **Telophase**: Nuclear envelopes reform around each set of chromosomes.

### Meiosis

Meiosis produces four genetically unique daughter cells with half the chromosome number.

- **Meiosis I**: Homologous chromosomes separate (reductional division)
- **Meiosis II**: Sister chromatids separate (similar to mitosis)

### Key Differences

| Feature | Mitosis | Meiosis |
|---------|---------|---------|
| Daughter cells | 2 | 4 |
| Ploidy | Diploid | Haploid |
| Genetic variation | None | High |
| Purpose | Growth/repair | Gamete production |`,
    formats: ["sentences", "key-concepts"],
    sourceType: "image",
    createdAt: "2026-02-11T08:30:00Z",
    updatedAt: "2026-02-11T09:45:00Z",
    tags: ["Biology", "Cell Biology", "Genetics"],
    isFavorite: true,
  },
];

export const mockTranscriptSegments: TranscriptSegment[] = [
  { start: 0, end: 5, text: "Welcome everyone to today's lecture on machine learning.", speaker: "Professor" },
  { start: 5, end: 12, text: "We're going to cover the fundamental concepts that form the basis of this exciting field.", speaker: "Professor" },
  { start: 12, end: 20, text: "Let's start with a definition. Machine learning is a subset of artificial intelligence.", speaker: "Professor" },
  { start: 20, end: 28, text: "It enables systems to learn and improve from experience without being explicitly programmed.", speaker: "Professor" },
  { start: 28, end: 35, text: "There are three main types of machine learning that you need to know.", speaker: "Professor" },
  { start: 35, end: 45, text: "The first is supervised learning, where the algorithm learns from labeled training data.", speaker: "Professor" },
  { start: 45, end: 55, text: "Think of it like a teacher showing students examples with the correct answers.", speaker: "Professor" },
  { start: 55, end: 65, text: "The second type is unsupervised learning, where we find patterns in unlabeled data.", speaker: "Professor" },
  { start: 65, end: 75, text: "This is useful for discovering hidden structures in data without predefined categories.", speaker: "Professor" },
  { start: 75, end: 85, text: "The third type is reinforcement learning, where an agent learns by trial and error.", speaker: "Professor" },
  { start: 85, end: 95, text: "Now let's look at the common types of problems we solve with machine learning.", speaker: "Professor" },
  { start: 95, end: 105, text: "Classification assigns categories to data points, like spam detection in email.", speaker: "Professor" },
  { start: 105, end: 115, text: "Regression predicts continuous values, such as predicting house prices.", speaker: "Professor" },
  { start: 115, end: 125, text: "Clustering groups similar data points together without predefined labels.", speaker: "Professor" },
  { start: 125, end: 135, text: "And finally, dimensionality reduction helps us simplify complex datasets.", speaker: "Professor" },
  { start: 135, end: 150, text: "In our next session, we'll dive into specific algorithms and their implementations.", speaker: "Professor" },
];

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    noteId: "1",
    title: "Explain supervised learning",
    messages: [
      { id: "m1", role: "user", content: "Can you explain supervised learning in simpler terms?", timestamp: "2026-02-16T10:35:00Z" },
      { id: "m2", role: "assistant", content: "Supervised learning is like learning with a teacher. You give the algorithm examples with the correct answers (labeled data), and it learns the pattern. For example, if you show it 1,000 photos of cats labeled \"cat\" and 1,000 photos of dogs labeled \"dog\", it learns to tell them apart. Then when it sees a new photo, it can predict whether it's a cat or dog.", timestamp: "2026-02-16T10:35:15Z" },
      { id: "m3", role: "user", content: "What's the difference between that and unsupervised learning?", timestamp: "2026-02-16T10:36:00Z" },
      { id: "m4", role: "assistant", content: "Great question! The key difference is that unsupervised learning works without labeled data. Instead of being told \"this is a cat\" or \"this is a dog\", the algorithm looks at the data and finds patterns on its own. Think of it like sorting a pile of mixed coins without knowing their values — you'd naturally group similar-looking ones together.", timestamp: "2026-02-16T10:36:20Z" },
    ],
    createdAt: "2026-02-16T10:35:00Z",
    updatedAt: "2026-02-16T10:36:20Z",
  },
  {
    id: "conv-2",
    noteId: "2",
    title: "Functional groups in biology",
    messages: [
      { id: "m5", role: "user", content: "Why are functional groups important in biology?", timestamp: "2026-02-15T14:25:00Z" },
      { id: "m6", role: "assistant", content: "Functional groups are crucial in biology because they determine how molecules behave and interact. The amino group (-NH2) is essential for building proteins. The phosphate group (-PO4) is vital for energy transfer through ATP. The hydroxyl group (-OH) makes sugars soluble in water. Essentially, functional groups give biomolecules their specific chemical properties.", timestamp: "2026-02-15T14:25:30Z" },
    ],
    createdAt: "2026-02-15T14:25:00Z",
    updatedAt: "2026-02-15T14:25:30Z",
  },
  {
    id: "conv-3",
    noteId: "5",
    title: "Derivative applications",
    messages: [
      { id: "m7", role: "user", content: "When would I use derivatives in real life?", timestamp: "2026-02-12T11:30:00Z" },
      { id: "m8", role: "assistant", content: "Derivatives have many practical applications!\n\n1. **Physics**: Velocity is the derivative of position, and acceleration is the derivative of velocity.\n2. **Economics**: Marginal cost and marginal revenue help businesses optimize pricing.\n3. **Engineering**: Analyzing how structures respond to changing forces.\n4. **Medicine**: The rate at which drug concentration changes in the bloodstream.\n\nBasically, any time you need to understand how fast something is changing, you're using derivatives.", timestamp: "2026-02-12T11:30:30Z" },
    ],
    createdAt: "2026-02-12T11:30:00Z",
    updatedAt: "2026-02-12T11:30:30Z",
  },
];

export const mockFlashcardDecks: FlashcardDeck[] = [
  {
    id: "deck-1",
    noteId: "1",
    title: "Machine Learning Fundamentals",
    cards: [
      { id: "fc-1", front: "What is supervised learning?", back: "A type of ML where the algorithm learns from labeled training data, making predictions based on known input-output pairs.", difficulty: "easy", timesReviewed: 3 },
      { id: "fc-2", front: "What is unsupervised learning?", back: "A type of ML where the algorithm identifies patterns in unlabeled data without predefined categories.", difficulty: "easy", timesReviewed: 2 },
      { id: "fc-3", front: "What is reinforcement learning?", back: "A type of ML where an agent learns by interacting with an environment and receiving rewards or penalties.", difficulty: "medium", timesReviewed: 1 },
      { id: "fc-4", front: "What is classification?", back: "Assigning categories to data points, such as spam detection in email filtering.", difficulty: "easy", timesReviewed: 4 },
      { id: "fc-5", front: "What is regression?", back: "Predicting continuous values, such as predicting house prices based on features.", difficulty: "medium", timesReviewed: 2 },
      { id: "fc-6", front: "Name 3 popular ML algorithms", back: "Linear Regression, Decision Trees, Neural Networks, Random Forests, SVM, KNN (any 3).", difficulty: "medium", timesReviewed: 1 },
      { id: "fc-7", front: "What is clustering?", back: "Grouping similar data points together without predefined labels.", difficulty: "easy", timesReviewed: 3 },
      { id: "fc-8", front: "What is dimensionality reduction?", back: "Reducing the number of features in a dataset while preserving the most important information.", difficulty: "hard", timesReviewed: 0 },
    ],
    createdAt: "2026-02-16T10:45:00Z",
    progress: { total: 8, mastered: 3, learning: 3, notStarted: 2 },
  },
  {
    id: "deck-2",
    noteId: "2",
    title: "Organic Chemistry: Functional Groups",
    cards: [
      { id: "fc-9", front: "What is a hydroxyl group?", back: "(-OH) Found in alcohols. Makes molecules polar and soluble in water.", difficulty: "easy", timesReviewed: 2 },
      { id: "fc-10", front: "What is a carbonyl group?", back: "(C=O) Found in aldehydes and ketones. Highly reactive.", difficulty: "medium", timesReviewed: 1 },
      { id: "fc-11", front: "What is a carboxyl group?", back: "(-COOH) Found in carboxylic acids. Acts as an acid, donating protons.", difficulty: "medium", timesReviewed: 1 },
      { id: "fc-12", front: "What is an amino group?", back: "(-NH2) Found in amines and amino acids. Acts as a base.", difficulty: "easy", timesReviewed: 3 },
      { id: "fc-13", front: "What is a phosphate group?", back: "(-PO4) Found in nucleic acids and ATP. Important in energy transfer.", difficulty: "medium", timesReviewed: 0 },
      { id: "fc-14", front: "What naming system is used for organic molecules?", back: "The IUPAC naming system based on the longest carbon chain and functional groups.", difficulty: "hard", timesReviewed: 0 },
    ],
    createdAt: "2026-02-15T15:00:00Z",
    progress: { total: 6, mastered: 2, learning: 2, notStarted: 2 },
  },
];

export const noteFormatOptions = [
  { id: "bullet-points" as const, label: "Bullet Points", description: "Concise bullet point summaries", icon: "list" },
  { id: "sentences" as const, label: "Sentences", description: "Full paragraph explanations", icon: "text" },
  { id: "cornell" as const, label: "Cornell Notes", description: "Two-column: cues + notes + summary", icon: "columns" },
  { id: "outline" as const, label: "Outline", description: "Hierarchical numbered structure", icon: "list-ordered" },
  { id: "key-concepts" as const, label: "Key Concepts", description: "Terms and definitions", icon: "key" },
  { id: "summary" as const, label: "Summary", description: "Brief overview of main points", icon: "file-text" },
  { id: "timeline" as const, label: "Timeline", description: "Chronological event sequence", icon: "clock" },
  { id: "qa-format" as const, label: "Q&A Format", description: "Question and answer pairs", icon: "help-circle" },
];

export const mockStats = {
  totalNotes: 6,
  flashcardsCreated: 14,
  testsTaken: 2,
  hoursRecorded: 3.5,
};

// ── Practice Tests ──

export const mockPracticeTests: PracticeTest[] = [
  {
    id: "test-1",
    noteId: "1",
    title: "Machine Learning Fundamentals Quiz",
    createdAt: "2026-02-16T11:00:00Z",
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "Which type of machine learning uses labeled training data to make predictions?",
        options: ["Unsupervised Learning", "Supervised Learning", "Reinforcement Learning", "Transfer Learning"],
        correctAnswer: "B",
        explanation: "Supervised learning algorithms learn from labeled training data, using known input-output pairs to make predictions on new, unseen data.",
      },
      {
        id: "q2",
        type: "true-false",
        question: "Clustering is a type of supervised learning that assigns predefined labels to data points.",
        correctAnswer: "False",
        explanation: "Clustering is actually an unsupervised learning technique. It groups similar data points together without using predefined labels or categories.",
      },
      {
        id: "q3",
        type: "multiple-choice",
        question: "Which of the following is an example of a regression problem?",
        options: ["Classifying emails as spam or not spam", "Predicting house prices based on features", "Grouping customers by purchase behavior", "Detecting anomalies in network traffic"],
        correctAnswer: "B",
        explanation: "Regression problems involve predicting continuous values. Predicting house prices is a classic regression task where the output is a continuous number.",
      },
      {
        id: "q4",
        type: "fill-blank",
        question: "In reinforcement learning, the agent learns by interacting with an environment and receiving ________ or penalties.",
        correctAnswer: "rewards",
        explanation: "Reinforcement learning operates on a reward-penalty system where the agent takes actions in an environment and receives rewards for desirable outcomes and penalties for undesirable ones.",
      },
      {
        id: "q5",
        type: "short-answer",
        question: "Explain the key difference between classification and regression in machine learning.",
        correctAnswer: "Classification predicts discrete categories or labels (e.g., spam vs. not spam), while regression predicts continuous numerical values (e.g., price, temperature).",
        explanation: "The fundamental difference lies in the output type: classification outputs are categorical (discrete classes), while regression outputs are continuous numerical values.",
      },
      {
        id: "q6",
        type: "true-false",
        question: "K-Nearest Neighbors (KNN) is a type of neural network algorithm.",
        correctAnswer: "False",
        explanation: "KNN is an instance-based learning algorithm, not a neural network. It classifies new data points based on the majority class of their k nearest neighbors in the feature space.",
      },
    ],
  },
  {
    id: "test-2",
    noteId: "6",
    title: "Cell Biology: Mitosis & Meiosis Review",
    createdAt: "2026-02-15T14:30:00Z",
    questions: [
      {
        id: "q7",
        type: "multiple-choice",
        question: "During which phase of mitosis do chromosomes align at the cell's equator?",
        options: ["Prophase", "Metaphase", "Anaphase", "Telophase"],
        correctAnswer: "B",
        explanation: "During metaphase, chromosomes line up along the metaphase plate (the cell's equator) before being separated in the next phase.",
      },
      {
        id: "q8",
        type: "true-false",
        question: "Meiosis produces two genetically identical daughter cells.",
        correctAnswer: "False",
        explanation: "Meiosis produces four genetically unique daughter cells with half the chromosome number (haploid). It is mitosis that produces two genetically identical daughter cells.",
      },
      {
        id: "q9",
        type: "fill-blank",
        question: "The separation of homologous chromosomes occurs during Meiosis ________.",
        correctAnswer: "I",
        explanation: "During Meiosis I (specifically Anaphase I), homologous chromosomes separate and move to opposite poles. This is the reductional division that halves the chromosome number.",
      },
      {
        id: "q10",
        type: "multiple-choice",
        question: "What is the primary purpose of meiosis?",
        options: ["Growth and tissue repair", "Producing genetically identical cells", "Gamete (sex cell) production", "Replacing damaged cells"],
        correctAnswer: "C",
        explanation: "The primary purpose of meiosis is to produce gametes (sperm and egg cells) for sexual reproduction, resulting in cells with half the normal chromosome number.",
      },
    ],
  },
];

// ── Photo Solver Examples ──

export interface PhotoSolverStep {
  title: string;
  explanation: string;
  math?: string;
}

export interface PhotoSolverExample {
  id: string;
  label: string;
  subject: string;
  subjectDetail: string;
  steps: PhotoSolverStep[];
  finalAnswer: string;
}

export const mockPhotoSolverExamples: PhotoSolverExample[] = [
  {
    id: "calculus",
    label: "Calculus Problem",
    subject: "Mathematics",
    subjectDetail: "Integral Calculus",
    steps: [
      {
        title: "Identify the integral type",
        explanation: "We need to evaluate the indefinite integral of x² · e^x. This is a product of a polynomial and an exponential function, which requires integration by parts.",
        math: "∫ x² eˣ dx",
      },
      {
        title: "Apply integration by parts (first round)",
        explanation: "Using the formula ∫ u dv = uv − ∫ v du, we choose u = x² and dv = e^x dx. Then du = 2x dx and v = e^x.",
        math: "= x² eˣ − ∫ 2x eˣ dx",
      },
      {
        title: "Apply integration by parts (second round)",
        explanation: "We still have a product of x and e^x, so we apply integration by parts again with u = 2x and dv = e^x dx. Then du = 2 dx and v = e^x.",
        math: "= x² eˣ − (2x eˣ − ∫ 2 eˣ dx)",
      },
      {
        title: "Evaluate the remaining integral",
        explanation: "The remaining integral ∫ 2 e^x dx is straightforward: it equals 2e^x. Now we combine all terms.",
        math: "= x² eˣ − 2x eˣ + 2eˣ + C",
      },
      {
        title: "Factor and simplify",
        explanation: "We can factor out e^x from all terms to get a cleaner final expression.",
        math: "= eˣ (x² − 2x + 2) + C",
      },
    ],
    finalAnswer: "eˣ (x² − 2x + 2) + C",
  },
  {
    id: "physics",
    label: "Physics Problem",
    subject: "Physics",
    subjectDetail: "Classical Mechanics",
    steps: [
      {
        title: "Understand the problem",
        explanation: "A 5 kg block slides down a frictionless inclined plane that makes a 30° angle with the horizontal. We need to find the acceleration of the block and its velocity after sliding 4 meters from rest.",
      },
      {
        title: "Draw free body diagram and identify forces",
        explanation: "The forces acting on the block are: gravity (mg downward) and normal force (N perpendicular to the surface). Since the plane is frictionless, only the component of gravity along the incline causes acceleration.",
        math: "F∥ = mg sin(θ) = 5 × 9.8 × sin(30°)",
      },
      {
        title: "Calculate the acceleration",
        explanation: "Using Newton's second law (F = ma), and since the only force along the incline is the gravity component, we can find the acceleration directly.",
        math: "a = g sin(30°) = 9.8 × 0.5 = 4.9 m/s²",
      },
      {
        title: "Find the final velocity",
        explanation: "Using the kinematic equation v² = v₀² + 2as, where initial velocity v₀ = 0 (starts from rest), a = 4.9 m/s², and s = 4 m.",
        math: "v = √(2 × 4.9 × 4) = √39.2 ≈ 6.26 m/s",
      },
    ],
    finalAnswer: "Acceleration = 4.9 m/s², Final velocity ≈ 6.26 m/s",
  },
];
