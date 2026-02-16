import type { Note, NoteFormatOption, TranscriptSegment } from "@/types/note";
import type { Conversation, Message } from "@/types/chat";
import type { FlashcardDeck, Flashcard } from "@/types/flashcard";
import type { PracticeTest, Question } from "@/types/test";

// ---------------------------------------------------------------------------
// Photo Solver types (defined here until a dedicated type file is created)
// ---------------------------------------------------------------------------

export interface SolutionStep {
  stepNumber: number;
  title: string;
  explanation: string;
  math: string;
}

export interface PhotoSolverSolution {
  id: string;
  imageDescription: string;
  problem: string;
  steps: SolutionStep[];
  finalAnswer: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Note Format Options
// ---------------------------------------------------------------------------

export const noteFormatOptions: NoteFormatOption[] = [
  {
    id: "bullet-points",
    label: "Bullet Points",
    description: "Concise bullet-point notes highlighting key ideas",
    icon: "📝",
  },
  {
    id: "sentences",
    label: "Sentences",
    description: "Full-sentence notes for detailed reading",
    icon: "📄",
  },
  {
    id: "cornell",
    label: "Cornell Notes",
    description: "Structured two-column format with cues and summary",
    icon: "📋",
  },
  {
    id: "outline",
    label: "Outline",
    description: "Hierarchical outline with numbered sections",
    icon: "📑",
  },
  {
    id: "key-concepts",
    label: "Key Concepts",
    description: "Focused on definitions and core concepts",
    icon: "🔑",
  },
  {
    id: "summary",
    label: "Summary",
    description: "Brief summary capturing the main points",
    icon: "📖",
  },
  {
    id: "timeline",
    label: "Timeline",
    description: "Chronological sequence of events or steps",
    icon: "🕐",
  },
  {
    id: "qa-format",
    label: "Q&A Format",
    description: "Question-and-answer pairs for active recall",
    icon: "❓",
  },
];

// ---------------------------------------------------------------------------
// Mock Notes
// ---------------------------------------------------------------------------

export const mockNotes: Note[] = [
  {
    id: "note-1",
    title: "Introduction to Machine Learning",
    content: `• Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.

• Three main types of machine learning:
  - Supervised learning: The model is trained on labeled data. Examples include classification (spam detection) and regression (house price prediction).
  - Unsupervised learning: The model finds hidden patterns in unlabeled data. Common techniques include clustering (K-means) and dimensionality reduction (PCA).
  - Reinforcement learning: An agent learns by interacting with an environment, receiving rewards or penalties for actions taken.

• Key terminology:
  - Features: Input variables used to make predictions.
  - Labels: The output variable the model is trying to predict.
  - Training set: The data used to train the model.
  - Test set: The data used to evaluate the model's performance.
  - Overfitting: When the model performs well on training data but poorly on unseen data.
  - Underfitting: When the model is too simple to capture the underlying patterns.

• Common algorithms:
  - Linear regression: Predicts a continuous output by fitting a straight line to the data.
  - Decision trees: Make decisions by splitting data based on feature thresholds at each node.
  - Neural networks: Layered architectures inspired by the human brain, capable of learning complex non-linear representations.
  - Support vector machines: Find the optimal hyperplane that maximally separates classes in feature space.

• Evaluation metrics:
  - Accuracy: Proportion of correctly classified instances out of all instances.
  - Precision: Of the positive predictions, how many were actually positive.
  - Recall: Of all actual positives, how many were correctly identified by the model.
  - F1 score: Harmonic mean of precision and recall, useful for imbalanced datasets.

• The bias-variance trade-off is fundamental: high bias leads to underfitting, high variance leads to overfitting. The goal is to find a model complexity that minimizes total error on unseen data.`,
    formats: ["bullet-points"],
    sourceType: "video",
    transcript: `Welcome to the introduction to machine learning. Today we're going to cover the foundations of what machine learning is and why it matters in today's world. Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. There are three main types of machine learning that you need to understand. First, supervised learning, where the model is trained on labeled data. This includes tasks like classification, such as spam detection, and regression, like predicting house prices. Second, unsupervised learning, where the model tries to find hidden patterns in data that doesn't have labels. Common techniques here include clustering with algorithms like K-means and dimensionality reduction using PCA. Third, reinforcement learning, where an agent learns by interacting with an environment and receiving rewards or penalties. Let's talk about some key terminology you'll encounter throughout this course. Features are your input variables, the things you use to make predictions. Labels are the output, the thing you're trying to predict. Your training set is what the model learns from, and your test set is what you evaluate it on. Two critical concepts are overfitting and underfitting. Overfitting happens when the model memorizes the training data but can't generalize. Underfitting is when the model is too simple to capture the real patterns.`,
    createdAt: "2026-02-03T09:15:00Z",
    updatedAt: "2026-02-03T10:30:00Z",
    tags: ["CS", "AI"],
    isFavorite: true,
  },
  {
    id: "note-2",
    title: "Organic Chemistry: Molecular Bonds",
    content: `Cues | Notes
--- | ---
What are covalent bonds? | Covalent bonds form when two atoms share one or more pairs of electrons. The shared electrons are attracted to the nuclei of both atoms, holding them together. Covalent bonds are most common between nonmetal atoms and are the primary bond type in organic molecules.
Single vs. double vs. triple bonds | A single bond involves one shared pair of electrons (sigma bond). A double bond involves two shared pairs (one sigma, one pi bond). A triple bond involves three shared pairs (one sigma, two pi bonds). Bond strength increases and bond length decreases from single to triple.
What is electronegativity? | Electronegativity is a measure of an atom's ability to attract shared electrons toward itself. Fluorine is the most electronegative element (3.98). Electronegativity generally increases across a period and decreases down a group on the periodic table.
Polar vs. nonpolar bonds | When two atoms have similar electronegativities, the bond is nonpolar covalent. When the difference is between 0.4 and 1.7, the bond is polar covalent. Above 1.7, the bond is considered ionic. In polar bonds, the more electronegative atom carries a partial negative charge (delta minus).
What is hybridization? | Hybridization is the mixing of atomic orbitals to form new hybrid orbitals suitable for bonding. sp3 hybridization gives tetrahedral geometry (109.5 degrees, e.g., methane). sp2 hybridization gives trigonal planar geometry (120 degrees, e.g., ethene). sp hybridization gives linear geometry (180 degrees, e.g., ethyne).
How does resonance work? | Resonance occurs when a molecule can be represented by two or more valid Lewis structures. The actual structure is a resonance hybrid of all contributing structures. Electrons are delocalized across the molecule, which often increases stability. Benzene is a classic example with its six delocalized pi electrons forming an aromatic ring.

Summary: Molecular bonding is governed by electron sharing (covalent) and electron transfer (ionic). The nature of bonds — single, double, or triple — determines molecular geometry, reactivity, and physical properties. Understanding electronegativity, hybridization, and resonance provides the foundation for predicting how organic molecules will behave in chemical reactions.`,
    formats: ["cornell"],
    sourceType: "pdf",
    transcript: `Chapter 3: Molecular Bonds in Organic Chemistry. Covalent bonds are the backbone of organic chemistry. They form when two atoms share one or more pairs of electrons. The shared electrons are attracted to the nuclei of both atoms, which holds them together. Covalent bonds are most common between nonmetal atoms. We classify these bonds by the number of shared electron pairs. A single bond involves one shared pair, known as a sigma bond. A double bond involves two shared pairs, one sigma and one pi bond. A triple bond involves three shared pairs, one sigma and two pi bonds. As we increase the number of bonds, the bond strength increases and the bond length decreases. This is critically important for understanding molecular reactivity. Electronegativity plays a key role in determining the character of a bond. It measures how strongly an atom attracts shared electrons. Fluorine, with a value of 3.98, is the most electronegative element on the periodic table.`,
    createdAt: "2026-02-05T14:22:00Z",
    updatedAt: "2026-02-05T15:10:00Z",
    tags: ["Chemistry"],
    isFavorite: false,
  },
  {
    id: "note-3",
    title: "World War II: Key Events",
    content: `Timeline of World War II: Key Events

1939-09-01 | Germany Invades Poland
Adolf Hitler's forces launched a massive invasion of Poland using blitzkrieg tactics — fast-moving columns of tanks and infantry supported by dive bombers. Britain and France declared war on Germany two days later on September 3, marking the official start of World War II in Europe.

1940-05-10 | Fall of France
Germany launched its Western Offensive, bypassing the heavily fortified Maginot Line by advancing through the Ardennes forest in Belgium. Within six weeks, France had fallen. The British Expeditionary Force was evacuated from Dunkirk in a dramatic rescue operation involving hundreds of civilian boats, saving over 338,000 Allied soldiers.

1941-06-22 | Operation Barbarossa
Hitler launched the largest military operation in history, invading the Soviet Union with over 3 million soldiers along a 1,800-mile front. The initial advance was rapid, but the campaign stalled before Moscow as the brutal Russian winter set in, stretching German supply lines beyond their limits.

1941-12-07 | Attack on Pearl Harbor
Japan launched a surprise military strike on the United States naval base at Pearl Harbor, Hawaii. The attack destroyed or damaged 19 ships and killed 2,403 Americans. The following day, the United States declared war on Japan, entering World War II as a full combatant.

1942-06-04 | Battle of Midway
A pivotal naval battle in the Pacific Theater. American codebreakers had deciphered Japanese plans, allowing the U.S. Navy to set up an ambush. Four Japanese aircraft carriers were sunk in a single day, shifting the balance of naval power in the Pacific decisively in favor of the Allies.

1944-06-06 | D-Day: Normandy Landings
The largest amphibious military operation in history. Allied forces landed on five beaches along the coast of Normandy, France. Over 156,000 troops crossed the English Channel, establishing a crucial foothold in Western Europe that would lead to the liberation of France and the advance toward Germany.

1945-05-08 | V-E Day: Victory in Europe
Germany surrendered unconditionally to the Allied forces. Adolf Hitler had committed suicide in his bunker in Berlin on April 30. The war in Europe was officially over, though fighting continued in the Pacific Theater against Japan.

1945-08-15 | V-J Day: Victory over Japan
Following the atomic bombings of Hiroshima (August 6) and Nagasaki (August 9), Japan announced its surrender. The formal surrender ceremony took place on September 2 aboard the USS Missouri in Tokyo Bay, bringing World War II to a complete end after six devastating years.`,
    formats: ["timeline"],
    sourceType: "link",
    sourceUrl: "https://example.com/ww2-documentary-series",
    transcript: `The Second World War was the deadliest conflict in human history, resulting in an estimated 70 to 85 million deaths. It began on September 1, 1939, when Nazi Germany, under Adolf Hitler, invaded Poland using a devastating new form of warfare called blitzkrieg. Britain and France declared war on Germany two days later. The early stages of the war saw rapid German expansion across Western Europe. In May 1940, Germany launched its Western Offensive, bypassing the formidable Maginot Line by striking through the Ardennes forest. France fell in just six weeks. The British managed to evacuate over 338,000 soldiers from the beaches of Dunkirk in what became known as the Miracle of Dunkirk. In June 1941, Hitler made the fateful decision to invade the Soviet Union in Operation Barbarossa, opening the devastating Eastern Front.`,
    createdAt: "2026-02-07T11:00:00Z",
    updatedAt: "2026-02-07T12:45:00Z",
    tags: ["History"],
    isFavorite: false,
  },
  {
    id: "note-4",
    title: "Calculus II: Integration Techniques",
    content: `I. Integration Techniques
  A. Substitution Method (u-substitution)
    1. Identify a composite function within the integrand.
    2. Let u equal the inner function and compute du.
    3. Rewrite the integral entirely in terms of u and du.
    4. Integrate with respect to u.
    5. Substitute back to the original variable.
    6. Example: integral of 2x * cos(x^2) dx. Let u = x^2, du = 2x dx. Becomes integral of cos(u) du = sin(u) + C = sin(x^2) + C.

  B. Integration by Parts
    1. Based on the product rule for differentiation: integral of u dv = uv - integral of v du.
    2. Choose u using the LIATE rule: Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential.
    3. The function higher on the LIATE list should be chosen as u.
    4. Example: integral of x * e^x dx. Let u = x, dv = e^x dx. Then du = dx, v = e^x. Result: x*e^x - integral of e^x dx = x*e^x - e^x + C.
    5. Sometimes you need to apply integration by parts more than once (tabular method can speed this up).

  C. Trigonometric Integrals
    1. Integrals involving powers of sin(x) and cos(x).
    2. If one power is odd, save one factor and convert the rest using the identity sin^2 + cos^2 = 1.
    3. If both powers are even, use half-angle identities: sin^2(x) = (1 - cos(2x))/2, cos^2(x) = (1 + cos(2x))/2.
    4. For integrals of sec(x) and tan(x), use analogous strategies with sec^2 = 1 + tan^2.

  D. Partial Fraction Decomposition
    1. Used for rational functions where the degree of the numerator is less than the denominator.
    2. Factor the denominator into linear and irreducible quadratic factors.
    3. Write the decomposition with unknown constants (A, B, C, ...) for each factor.
    4. Solve for the constants by equating coefficients or plugging in convenient values of x.
    5. Integrate each resulting simpler fraction separately.
    6. Example: integral of (3x+5)/((x+1)(x+2)) dx decomposes to A/(x+1) + B/(x+2). Solving gives A = 2, B = 1.

  E. Improper Integrals
    1. Integrals with infinite limits of integration or discontinuous integrands.
    2. Replace the infinite bound with a variable and take the limit as it approaches infinity.
    3. An improper integral converges if the limit exists and is finite; otherwise it diverges.
    4. Comparison test: compare with a known convergent or divergent integral to determine behavior.`,
    formats: ["outline"],
    sourceType: "audio",
    transcript: `Alright class, today we're continuing our study of integration techniques in Calculus II. We've already covered the basics of antiderivatives, and now we're going to look at more sophisticated methods for handling complex integrals. The first technique we'll review is u-substitution, also called the substitution method. The idea here is to identify a composite function within the integrand. You let u equal the inner function and compute du. Then you rewrite the integral entirely in terms of u and du, integrate, and substitute back to the original variable. For example, if we have the integral of 2x times cosine of x squared dx, we let u equal x squared, so du equals 2x dx. The integral becomes simply the integral of cosine u du, which gives us sine of u plus C, or sine of x squared plus C. Simple and elegant. Now let's move on to integration by parts, which is based on the product rule for differentiation.`,
    createdAt: "2026-02-09T08:30:00Z",
    updatedAt: "2026-02-09T09:55:00Z",
    tags: ["Math"],
    isFavorite: true,
  },
  {
    id: "note-5",
    title: "Marketing Strategy Q1 2026",
    content: `The Q1 2026 marketing strategy is built around three core pillars: expanding digital presence, deepening customer engagement, and launching the new product line. Our target audience analysis shows that 68% of our customer base now discovers products through social media, with TikTok and Instagram Reels driving the highest conversion rates among the 18-34 demographic.

For digital advertising, we are allocating 45% of the total marketing budget to paid social campaigns, up from 32% in Q4 2025. The remaining budget splits between content marketing (25%), email campaigns (15%), and event sponsorships (15%). We project a 22% increase in qualified leads through improved targeting using first-party data collected from our updated CRM platform.

Customer engagement will be strengthened through a revamped loyalty program launching in February. The program introduces tier-based rewards, early access to new products, and exclusive content for members. Internal modeling suggests this will increase repeat purchase rates by 18% and average order value by 12% over the quarter.

The new product line — a range of eco-friendly office supplies — will be introduced with a phased launch. Soft launch to loyalty members in late January, followed by a full market release on March 1. Influencer partnerships with sustainability-focused creators will begin seeding content two weeks before the public launch to build anticipation.

Key performance indicators for Q1 include: website traffic growth of 30% quarter-over-quarter, email open rates above 24%, social media engagement rate of 4.5%, and a customer acquisition cost reduction of 10%. Weekly dashboards will track progress, with bi-weekly strategy reviews to adjust tactics as needed.

Regional strategy: North American markets will focus on the product launch, while European markets will prioritize brand awareness campaigns leveraging localized content. APAC will continue with the partnership-driven growth model established in 2025, expanding into two new markets.`,
    formats: ["sentences"],
    sourceType: "video",
    transcript: `Good morning everyone. Let's go through the Q1 2026 marketing strategy. I want to start by talking about our three core pillars for this quarter: expanding our digital presence, deepening customer engagement, and launching the new product line. Now, our target audience analysis from the data team shows that 68% of our customer base now discovers products through social media. Specifically, TikTok and Instagram Reels are driving the highest conversion rates, especially in the 18 to 34 demographic. Based on this, we're allocating 45% of our total marketing budget to paid social campaigns, which is up from 32% last quarter. The rest of the budget breaks down as follows: 25% for content marketing, 15% for email campaigns, and 15% for event sponsorships. We're projecting a 22% increase in qualified leads through improved targeting using the first-party data we've been collecting from our updated CRM.`,
    createdAt: "2026-02-11T16:00:00Z",
    updatedAt: "2026-02-12T09:20:00Z",
    tags: ["Business", "Marketing"],
    isFavorite: false,
  },
  {
    id: "note-6",
    title: "Introduction to Psychology",
    content: `Concept: Classical Conditioning
Definition: A learning process in which a neutral stimulus becomes associated with a meaningful stimulus, eventually triggering a similar response on its own. Discovered by Ivan Pavlov through his experiments with dogs.
Key terms: Unconditioned stimulus (UCS), unconditioned response (UCR), conditioned stimulus (CS), conditioned response (CR). Example: Pavlov's dog salivated (UCR) at the sight of food (UCS). After repeatedly pairing a bell (neutral stimulus) with food, the bell alone (CS) triggered salivation (CR).

Concept: Operant Conditioning
Definition: A method of learning where behavior is shaped by its consequences — reinforcement increases the likelihood of a behavior, while punishment decreases it. Developed by B.F. Skinner using the Skinner Box apparatus.
Key terms: Positive reinforcement (adding a pleasant stimulus to increase behavior), negative reinforcement (removing an aversive stimulus to increase behavior), positive punishment (adding an aversive stimulus to decrease behavior), negative punishment (removing a pleasant stimulus to decrease behavior). Schedules of reinforcement include fixed-ratio, variable-ratio, fixed-interval, and variable-interval.

Concept: Maslow's Hierarchy of Needs
Definition: A motivational theory proposing that human needs are arranged in a hierarchy from basic physiological needs to self-actualization. Lower-level needs must be substantially met before higher-level needs become motivating forces.
Levels (bottom to top): Physiological (food, water, shelter, sleep), Safety (security, stability, employment), Love and Belonging (relationships, friendships, community), Esteem (achievement, recognition, respect), Self-Actualization (realizing personal potential, creativity, fulfillment).

Concept: Cognitive Dissonance
Definition: The mental discomfort experienced when holding two contradictory beliefs, values, or attitudes simultaneously. First proposed by Leon Festinger in 1957 after observing a doomsday cult.
People reduce dissonance by: changing one of the conflicting beliefs, acquiring new information that outweighs the dissonant belief, or reducing the perceived importance of the conflicting cognition. Example: A smoker who knows smoking is harmful may downplay the health risks or emphasize the stress-relief benefits to reduce the uncomfortable tension between their behavior and their knowledge.

Concept: The Big Five Personality Traits (OCEAN)
Definition: A widely accepted model describing five broad dimensions of personality. Each trait exists on a continuous spectrum rather than as an either-or category.
The five traits: Openness to experience (curiosity, imagination, creativity), Conscientiousness (organization, dependability, self-discipline), Extraversion (sociability, assertiveness, positive emotionality), Agreeableness (cooperativeness, trust, altruism), Neuroticism (emotional instability, anxiety, moodiness). Research shows these traits remain relatively stable across adulthood and are influenced by both genetic and environmental factors.`,
    formats: ["key-concepts"],
    sourceType: "pdf",
    transcript: `Introduction to Psychology, Chapter 5: Learning and Behavior. Classical conditioning is one of the most foundational concepts in all of psychology. Discovered by the Russian physiologist Ivan Pavlov, classical conditioning is a learning process in which a neutral stimulus becomes associated with a meaningful stimulus, eventually triggering a similar response on its own. Pavlov famously demonstrated this with his experiments on dogs. The dogs naturally salivated when presented with food — the food is what we call the unconditioned stimulus and the salivation is the unconditioned response. Pavlov then began ringing a bell just before presenting the food. After many repetitions, the dogs began to salivate at the sound of the bell alone. The bell had become a conditioned stimulus, and the salivation in response to the bell was now a conditioned response. This discovery opened up an entirely new understanding of how organisms learn associations.`,
    createdAt: "2026-02-13T10:45:00Z",
    updatedAt: "2026-02-13T11:30:00Z",
    tags: ["Psychology"],
    isFavorite: false,
  },
];

// ---------------------------------------------------------------------------
// Mock Transcript Segments (for note-1)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Mock Conversations
// ---------------------------------------------------------------------------

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    noteId: "note-1",
    title: "Discussion: Machine Learning Basics",
    messages: [
      {
        id: "msg-1-1",
        role: "user",
        content: "Can you explain the difference between supervised and unsupervised learning in simpler terms?",
        timestamp: "2026-02-03T10:35:00Z",
      },
      {
        id: "msg-1-2",
        role: "assistant",
        content: "Of course! Think of supervised learning like studying with an answer key. You give the model lots of examples where you already know the correct answer, and it learns the patterns to predict answers for new examples. For instance, showing it thousands of emails labeled \"spam\" or \"not spam\" so it can classify new emails.\n\nUnsupervised learning is more like sorting a pile of objects without any instructions. The model looks at data without any labels and tries to find natural groupings or patterns on its own. For example, it might group customers into segments based on purchasing behavior, without being told what the segments should be.",
        timestamp: "2026-02-03T10:35:30Z",
      },
      {
        id: "msg-1-3",
        role: "user",
        content: "What is the bias-variance trade-off? Why is it important?",
        timestamp: "2026-02-03T10:37:00Z",
      },
      {
        id: "msg-1-4",
        role: "assistant",
        content: "The bias-variance trade-off is one of the most important concepts in machine learning. It describes the tension between two sources of error:\n\n**Bias** is the error from oversimplifying the model. A high-bias model makes strong assumptions about the data and tends to miss relevant patterns. This leads to underfitting -- the model performs poorly on both training and test data.\n\n**Variance** is the error from making the model too sensitive to the training data. A high-variance model captures noise along with the actual signal, leading to overfitting -- it performs great on training data but poorly on unseen data.\n\nThe trade-off matters because reducing one often increases the other. The goal is to find the sweet spot where total error (bias + variance) is minimized. Techniques like cross-validation, regularization, and ensemble methods help manage this trade-off.",
        timestamp: "2026-02-03T10:37:30Z",
      },
      {
        id: "msg-1-5",
        role: "user",
        content: "Which algorithm would you recommend for a beginner project?",
        timestamp: "2026-02-03T10:40:00Z",
      },
      {
        id: "msg-1-6",
        role: "assistant",
        content: "For a beginner project, I would recommend starting with **linear regression** or a **decision tree**. Here is why:\n\n**Linear regression** is great because it is intuitive -- you are fitting a line through data points. It is easy to visualize, interpret, and debug. Try predicting something like house prices based on features like square footage and number of bedrooms.\n\n**Decision trees** are another excellent starting point because they mirror how humans make decisions through a series of if-then rules. They are easy to visualize and understand. You could build one to classify iris flower species based on petal and sepal measurements.\n\nBoth are available in scikit-learn for Python and require minimal setup. I would suggest starting with a well-known dataset like the Iris dataset or the California Housing dataset from scikit-learn's built-in datasets.",
        timestamp: "2026-02-03T10:40:30Z",
      },
    ],
    createdAt: "2026-02-03T10:35:00Z",
    updatedAt: "2026-02-03T10:40:30Z",
  },
  {
    id: "conv-2",
    noteId: "note-2",
    title: "Discussion: Molecular Bonds",
    messages: [
      {
        id: "msg-2-1",
        role: "user",
        content: "I am confused about the difference between sigma and pi bonds. Can you clarify?",
        timestamp: "2026-02-05T15:15:00Z",
      },
      {
        id: "msg-2-2",
        role: "assistant",
        content: "Great question! Here is a clear breakdown:\n\n**Sigma bonds** form by head-on overlap of orbitals along the axis between two nuclei. They are the strongest type of covalent bond and allow free rotation around the bond axis. Every single bond is a sigma bond.\n\n**Pi bonds** form by the sideways overlap of p-orbitals above and below the bond axis. They are weaker than sigma bonds and prevent rotation because the overlapping regions would break if the atoms rotated.\n\nIn a double bond, you have 1 sigma + 1 pi bond. In a triple bond, you have 1 sigma + 2 pi bonds. The sigma bond always forms first, and the pi bonds layer on top of it. This is why double bonds are shorter and stronger than single bonds, and triple bonds are shorter and stronger still.",
        timestamp: "2026-02-05T15:15:30Z",
      },
      {
        id: "msg-2-3",
        role: "user",
        content: "Why is hybridization important in organic chemistry?",
        timestamp: "2026-02-05T15:18:00Z",
      },
      {
        id: "msg-2-4",
        role: "assistant",
        content: "Hybridization is crucial because it explains the actual geometry and bonding behavior of organic molecules that simple atomic orbital theory cannot:\n\n1. **Molecular geometry**: Carbon has electrons in both 2s and 2p orbitals, but we observe methane (CH4) with four identical bonds at 109.5 degree angles. Hybridization (sp3 in this case) explains how four equivalent orbitals form.\n\n2. **Predicting shape and reactivity**: Knowing the hybridization tells you the shape immediately -- sp3 is tetrahedral, sp2 is trigonal planar, sp is linear. This shape dictates how molecules interact and react.\n\n3. **Bond angles and strengths**: sp orbitals have more s-character (50%), making them shorter and stronger. sp3 orbitals have less s-character (25%), making them longer and more flexible.\n\n4. **Understanding double and triple bonds**: sp2 hybridization leaves one unhybridized p-orbital available to form a pi bond (double bond), and sp hybridization leaves two for pi bonds (triple bond).\n\nWithout hybridization, we could not explain why carbon forms four bonds, why ethene is flat, or why ethyne is linear.",
        timestamp: "2026-02-05T15:18:30Z",
      },
      {
        id: "msg-2-5",
        role: "user",
        content: "Can you give me a real-world example of resonance?",
        timestamp: "2026-02-05T15:22:00Z",
      },
      {
        id: "msg-2-6",
        role: "assistant",
        content: "Absolutely! The best real-world example is **benzene (C6H6)**. If you draw benzene with alternating single and double bonds (called Kekule structures), you would expect some bonds to be longer than others. But in reality, all six carbon-carbon bonds in benzene are exactly the same length (1.40 angstroms) -- intermediate between a single bond (1.54 angstroms) and a double bond (1.34 angstroms).\n\nThis happens because the six pi electrons are delocalized across the entire ring rather than being localized between specific pairs of atoms. Benzene is a resonance hybrid of its two Kekule structures.\n\nThis delocalization gives benzene exceptional stability, often called **aromatic stability**. It is why benzene does not react like a typical alkene -- it prefers substitution reactions (replacing a hydrogen) over addition reactions (which would break the ring's delocalization).\n\nAnother everyday example: the carbonate ion (CO3 2-) in baking soda. Its three C-O bonds are all identical in length due to resonance, even though any single Lewis structure would show one double bond and two single bonds.",
        timestamp: "2026-02-05T15:22:30Z",
      },
    ],
    createdAt: "2026-02-05T15:15:00Z",
    updatedAt: "2026-02-05T15:22:30Z",
  },
  {
    id: "conv-3",
    noteId: "note-4",
    title: "Discussion: Integration Techniques",
    messages: [
      {
        id: "msg-3-1",
        role: "user",
        content: "When should I use u-substitution versus integration by parts?",
        timestamp: "2026-02-09T10:00:00Z",
      },
      {
        id: "msg-3-2",
        role: "assistant",
        content: "Here is a practical guide for choosing between the two:\n\n**Use u-substitution when:**\n- You see a function and its derivative together in the integrand (e.g., cos(x^2) * 2x -- the 2x is the derivative of x^2).\n- The integrand is a composite function f(g(x)) * g'(x).\n- You can simplify the integral by replacing an inner expression with a single variable.\n\n**Use integration by parts when:**\n- The integrand is a product of two different types of functions (e.g., x * e^x, x^2 * sin(x), ln(x) * x).\n- One factor becomes simpler when differentiated and the other is easy to integrate.\n- U-substitution does not simplify things.\n\n**Quick decision process:**\n1. First, always try u-substitution -- it is simpler and faster.\n2. If you cannot find a good u, look for a product of two different function types.\n3. If you see a product, use LIATE to pick u for integration by parts.\n4. If neither works, consider trigonometric identities or partial fractions.",
        timestamp: "2026-02-09T10:00:30Z",
      },
      {
        id: "msg-3-3",
        role: "user",
        content: "Can you walk me through a partial fraction decomposition example?",
        timestamp: "2026-02-09T10:05:00Z",
      },
      {
        id: "msg-3-4",
        role: "assistant",
        content: "Sure! Let us decompose and integrate the integral of (3x + 5) / ((x + 1)(x + 2)) dx.\n\n**Step 1: Set up the decomposition.**\n(3x + 5) / ((x + 1)(x + 2)) = A/(x + 1) + B/(x + 2)\n\n**Step 2: Clear the denominator.**\nMultiply both sides by (x + 1)(x + 2):\n3x + 5 = A(x + 2) + B(x + 1)\n\n**Step 3: Solve for A and B.**\nPlug in x = -1: 3(-1) + 5 = A(-1 + 2) + B(0) -> 2 = A, so **A = 2**\nPlug in x = -2: 3(-2) + 5 = A(0) + B(-2 + 1) -> -1 = -B, so **B = 1**\n\n**Step 4: Integrate.**\nIntegral of [2/(x + 1) + 1/(x + 2)] dx = 2 * ln|x + 1| + ln|x + 2| + C\n\nThe key takeaway: partial fractions turn one complicated fraction into several simpler ones that you already know how to integrate!",
        timestamp: "2026-02-09T10:05:30Z",
      },
      {
        id: "msg-3-5",
        role: "user",
        content: "What are some common mistakes students make with improper integrals?",
        timestamp: "2026-02-09T10:10:00Z",
      },
      {
        id: "msg-3-6",
        role: "assistant",
        content: "Here are the most common mistakes I see with improper integrals:\n\n**1. Forgetting to use limits.** The biggest mistake is treating an improper integral like a regular definite integral. You must replace the infinite bound (or discontinuity) with a variable and take the limit. For example: the integral from 1 to infinity of 1/x^2 dx = lim(b -> infinity) of the integral from 1 to b of 1/x^2 dx. Do not just plug in infinity.\n\n**2. Missing interior discontinuities.** In the integral from -1 to 1 of 1/x^2 dx, the function blows up at x = 0. You must split it into two integrals at the discontinuity and evaluate each as a separate limit. This integral actually diverges!\n\n**3. Assuming convergence.** Students often compute the antiderivative and plug in bounds without checking if the limit exists. For instance, the integral from 1 to infinity of 1/x dx = lim(b -> infinity) ln(b) = infinity, so it diverges.\n\n**4. Sign errors with the comparison test.** When comparing integrals, remember: if your function is smaller than a convergent integral, yours converges. If it is larger than a divergent integral, yours diverges. Getting this backward leads to incorrect conclusions.\n\n**5. Forgetting absolute values in logarithms.** When the antiderivative involves ln, always use absolute value bars to handle negative values correctly.",
        timestamp: "2026-02-09T10:10:30Z",
      },
    ],
    createdAt: "2026-02-09T10:00:00Z",
    updatedAt: "2026-02-09T10:10:30Z",
  },
  {
    id: "conv-4",
    noteId: "note-5",
    title: "Discussion: Q1 Marketing Strategy",
    messages: [
      {
        id: "msg-4-1",
        role: "user",
        content: "What is the rationale behind increasing the social media ad budget to 45%?",
        timestamp: "2026-02-12T09:30:00Z",
      },
      {
        id: "msg-4-2",
        role: "assistant",
        content: "The increase from 32% to 45% is driven by several data-backed factors from the notes:\n\n1. **Audience behavior shift**: 68% of the customer base now discovers products through social media. This is where the audience is, so the budget should follow.\n\n2. **Highest conversion rates**: TikTok and Instagram Reels are specifically driving the highest conversion rates in the 18-34 demographic, which appears to be a key target segment.\n\n3. **Performance-based allocation**: The shift suggests that Q4 2025 social campaigns outperformed other channels in terms of cost per acquisition and ROI, justifying more investment.\n\n4. **New product launch support**: With the eco-friendly office supplies line launching in Q1, social media -- particularly influencer partnerships -- is the ideal channel for product seeding and awareness.\n\nThe strategy essentially follows the data: invest more in what is working best and where the target audience is most active.",
        timestamp: "2026-02-12T09:30:30Z",
      },
      {
        id: "msg-4-3",
        role: "user",
        content: "How does the loyalty program tie into the overall strategy?",
        timestamp: "2026-02-12T09:35:00Z",
      },
      {
        id: "msg-4-4",
        role: "assistant",
        content: "The revamped loyalty program is a central piece of the \"deepening customer engagement\" pillar. Here is how it connects to the broader strategy:\n\n**Revenue impact**: The internal modeling projects an 18% increase in repeat purchase rates and a 12% increase in average order value. These are significant revenue drivers for Q1 without the cost of acquiring entirely new customers.\n\n**Product launch synergy**: Loyalty members get early access to the new eco-friendly product line during the soft launch in late January. This creates exclusivity and generates initial reviews and word-of-mouth before the full March 1 release.\n\n**Data collection**: The tier-based rewards system incentivizes more frequent interactions, which generates first-party data. This data feeds back into the improved CRM targeting mentioned in the strategy, which in turn supports the paid social campaigns.\n\n**Retention vs. acquisition balance**: While 45% of the budget goes to acquisition-focused social ads, the loyalty program works the retention side. Together, they create a balanced growth engine -- bringing in new customers while keeping existing ones engaged and spending more.",
        timestamp: "2026-02-12T09:35:30Z",
      },
      {
        id: "msg-4-5",
        role: "user",
        content: "What risks do you see with this Q1 plan?",
        timestamp: "2026-02-12T09:40:00Z",
      },
      {
        id: "msg-4-6",
        role: "assistant",
        content: "Based on the strategy outlined in the notes, here are the key risks to consider:\n\n**1. Over-reliance on social media (45% budget).** Platform algorithm changes or policy updates (especially from TikTok, given ongoing regulatory scrutiny) could suddenly reduce reach and ROI. Having nearly half the budget in one channel category is a concentration risk.\n\n**2. Aggressive KPI targets.** 30% website traffic growth quarter-over-quarter and a 10% customer acquisition cost reduction simultaneously is ambitious. If the product launch does not generate organic buzz as expected, paid channels alone may not deliver both growth and efficiency.\n\n**3. Phased product launch timing.** The soft launch to loyalty members in late January and full release on March 1 leaves only one month for the product to contribute to Q1 results. Any delays in supply chain, influencer content, or marketing collateral could compress the window further.\n\n**4. Regional strategy fragmentation.** Running three different strategic priorities across North America, Europe, and APAC increases complexity and could dilute focus. Coordination challenges across time zones and teams may slow execution.\n\n**5. First-party data dependency.** The improved targeting relies on CRM data quality. If the updated CRM platform has integration issues or incomplete data migration, the projected 22% lead increase may fall short.\n\nI would recommend building contingency budgets and identifying early warning metrics to trigger strategy adjustments at the bi-weekly reviews.",
        timestamp: "2026-02-12T09:40:30Z",
      },
    ],
    createdAt: "2026-02-12T09:30:00Z",
    updatedAt: "2026-02-12T09:40:30Z",
  },
];

// ---------------------------------------------------------------------------
// Mock Flashcard Decks
// ---------------------------------------------------------------------------

export const mockFlashcardDecks: FlashcardDeck[] = [
  {
    id: "deck-1",
    noteId: "note-1",
    title: "Machine Learning Fundamentals",
    cards: [
      {
        id: "card-1-1",
        front: "What are the three main types of machine learning?",
        back: "Supervised learning (trained on labeled data), unsupervised learning (finds patterns in unlabeled data), and reinforcement learning (agent learns through environment interaction and rewards).",
        difficulty: "easy",
        timesReviewed: 3,
      },
      {
        id: "card-1-2",
        front: "What is overfitting?",
        back: "Overfitting occurs when a model performs well on training data but poorly on unseen data. It happens when the model is too complex and captures noise in the training data rather than the underlying pattern.",
        difficulty: "easy",
        timesReviewed: 2,
      },
      {
        id: "card-1-3",
        front: "Explain the bias-variance trade-off.",
        back: "High bias leads to underfitting (model is too simple and misses patterns). High variance leads to overfitting (model is too sensitive to training data noise). The goal is to find the model complexity that minimizes total error, balancing both bias and variance.",
        difficulty: "medium",
        timesReviewed: 1,
      },
      {
        id: "card-1-4",
        front: "What is the difference between classification and regression?",
        back: "Classification predicts discrete categories or labels (e.g., spam vs. not spam). Regression predicts continuous numerical values (e.g., house prices). Both are types of supervised learning.",
        difficulty: "easy",
        timesReviewed: 4,
      },
      {
        id: "card-1-5",
        front: "What is the F1 score and when is it useful?",
        back: "The F1 score is the harmonic mean of precision and recall: F1 = 2 * (precision * recall) / (precision + recall). It is particularly useful when dealing with imbalanced datasets where accuracy alone can be misleading.",
        difficulty: "medium",
        timesReviewed: 1,
      },
      {
        id: "card-1-6",
        front: "How does a decision tree make predictions?",
        back: "A decision tree splits data based on feature thresholds at each node, creating a tree-like structure of if-then rules. Each leaf node represents a prediction. It recursively partitions the feature space to minimize impurity (e.g., Gini index or entropy for classification).",
        difficulty: "medium",
        timesReviewed: 0,
      },
      {
        id: "card-1-7",
        front: "What is a neural network?",
        back: "A neural network is a layered architecture inspired by the human brain, consisting of input, hidden, and output layers. Each layer contains neurons connected by weighted edges. It learns complex non-linear representations through backpropagation and gradient descent.",
        difficulty: "hard",
        timesReviewed: 0,
      },
      {
        id: "card-1-8",
        front: "What is the purpose of a test set in machine learning?",
        back: "A test set is a portion of data held back from training and used solely to evaluate the model's performance on unseen data. It provides an unbiased estimate of how well the model will generalize to new, real-world inputs.",
        difficulty: "easy",
        timesReviewed: 2,
      },
    ],
    createdAt: "2026-02-03T11:00:00Z",
    progress: {
      total: 8,
      mastered: 3,
      learning: 3,
      notStarted: 2,
    },
  },
  {
    id: "deck-2",
    noteId: "note-2",
    title: "Organic Chemistry: Bonds & Structure",
    cards: [
      {
        id: "card-2-1",
        front: "What is a covalent bond?",
        back: "A covalent bond forms when two atoms share one or more pairs of electrons. The shared electrons are attracted to the nuclei of both atoms, holding them together. Covalent bonds are most common between nonmetal atoms.",
        difficulty: "easy",
        timesReviewed: 3,
      },
      {
        id: "card-2-2",
        front: "How do single, double, and triple bonds differ?",
        back: "A single bond has one shared electron pair (sigma bond). A double bond has two shared pairs (one sigma, one pi). A triple bond has three shared pairs (one sigma, two pi). Bond strength increases and bond length decreases from single to triple.",
        difficulty: "medium",
        timesReviewed: 2,
      },
      {
        id: "card-2-3",
        front: "What is electronegativity?",
        back: "Electronegativity is a measure of an atom's ability to attract shared electrons toward itself in a chemical bond. Fluorine is the most electronegative element (3.98). It generally increases across a period and decreases down a group on the periodic table.",
        difficulty: "easy",
        timesReviewed: 1,
      },
      {
        id: "card-2-4",
        front: "Describe sp3 hybridization.",
        back: "sp3 hybridization involves mixing one s orbital and three p orbitals to form four equivalent sp3 hybrid orbitals. This results in a tetrahedral geometry with bond angles of 109.5 degrees. A common example is methane (CH4).",
        difficulty: "medium",
        timesReviewed: 0,
      },
      {
        id: "card-2-5",
        front: "What is resonance in organic chemistry?",
        back: "Resonance occurs when a molecule can be represented by two or more valid Lewis structures. The actual structure is a hybrid of all resonance structures, with electrons delocalized across the molecule. This delocalization often increases stability. Benzene is a classic example.",
        difficulty: "hard",
        timesReviewed: 0,
      },
      {
        id: "card-2-6",
        front: "What determines whether a bond is polar or nonpolar?",
        back: "The electronegativity difference between the two bonded atoms determines polarity. Similar electronegativities result in a nonpolar covalent bond. A difference of 0.4 to 1.7 produces a polar covalent bond. A difference above 1.7 indicates an ionic bond. In polar bonds, the more electronegative atom carries a partial negative charge.",
        difficulty: "medium",
        timesReviewed: 1,
      },
    ],
    createdAt: "2026-02-05T16:00:00Z",
    progress: {
      total: 6,
      mastered: 2,
      learning: 2,
      notStarted: 2,
    },
  },
];

// ---------------------------------------------------------------------------
// Mock Practice Tests
// ---------------------------------------------------------------------------

export const mockPracticeTests: PracticeTest[] = [
  {
    id: "test-1",
    noteId: "note-1",
    title: "Machine Learning Fundamentals Quiz",
    questions: [
      {
        id: "q-1-1",
        type: "multiple-choice",
        question: "Which type of machine learning uses labeled data for training?",
        options: [
          "Unsupervised learning",
          "Supervised learning",
          "Reinforcement learning",
          "Semi-supervised learning",
        ],
        correctAnswer: "Supervised learning",
        explanation: "Supervised learning is specifically defined as training a model on labeled data, where each training example includes both the input features and the correct output label. The model learns to map inputs to outputs based on these labeled examples.",
      },
      {
        id: "q-1-2",
        type: "multiple-choice",
        question: "What does the F1 score measure?",
        options: [
          "The ratio of correct predictions to total predictions",
          "The harmonic mean of precision and recall",
          "The variance of the model's predictions",
          "The speed of model training",
        ],
        correctAnswer: "The harmonic mean of precision and recall",
        explanation: "The F1 score is calculated as F1 = 2 * (precision * recall) / (precision + recall). It provides a single metric that balances both precision and recall, and is especially useful for evaluating models on imbalanced datasets where accuracy can be misleading.",
      },
      {
        id: "q-1-3",
        type: "multiple-choice",
        question: "Which of the following is an example of unsupervised learning?",
        options: [
          "Email spam classification",
          "House price prediction",
          "Customer segmentation using K-means clustering",
          "Image recognition with labeled photos",
        ],
        correctAnswer: "Customer segmentation using K-means clustering",
        explanation: "K-means clustering is an unsupervised learning technique that groups data points into clusters based on similarity without using predefined labels. The other options all involve labeled data, making them supervised learning tasks.",
      },
      {
        id: "q-1-4",
        type: "true-false",
        question: "Overfitting occurs when a model performs well on training data but poorly on unseen data.",
        correctAnswer: "True",
        explanation: "This is the definition of overfitting. The model has learned the noise and specific patterns of the training data too closely, so it fails to generalize to new, unseen data. Techniques like regularization, cross-validation, and early stopping can help prevent overfitting.",
      },
      {
        id: "q-1-5",
        type: "short-answer",
        question: "Explain the difference between features and labels in machine learning.",
        correctAnswer: "Features are the input variables used to make predictions, while labels are the output variables the model is trying to predict.",
        explanation: "In supervised learning, features (also called predictors or independent variables) are the characteristics of the data that the model uses as input. Labels (also called targets or dependent variables) are the outcomes the model learns to predict. For example, when predicting house prices, features might include square footage and number of bedrooms, while the label is the sale price.",
      },
      {
        id: "q-1-6",
        type: "fill-blank",
        question: "High bias leads to _______, while high variance leads to overfitting.",
        correctAnswer: "underfitting",
        explanation: "In the bias-variance trade-off, high bias means the model is too simple and makes strong assumptions about the data, leading to underfitting -- the model cannot capture the underlying patterns. High variance means the model is too complex and overly sensitive to the training data, leading to overfitting.",
      },
    ],
    createdAt: "2026-02-04T08:00:00Z",
  },
  {
    id: "test-2",
    noteId: "note-3",
    title: "World War II Key Events Quiz",
    questions: [
      {
        id: "q-2-1",
        type: "multiple-choice",
        question: "What event directly caused the United States to enter World War II?",
        options: [
          "The invasion of Poland",
          "The fall of France",
          "The attack on Pearl Harbor",
          "Operation Barbarossa",
        ],
        correctAnswer: "The attack on Pearl Harbor",
        explanation: "Japan's surprise attack on the U.S. naval base at Pearl Harbor on December 7, 1941, killed 2,403 Americans and destroyed or damaged 19 ships. The following day, Congress declared war on Japan, bringing the United States fully into World War II.",
      },
      {
        id: "q-2-2",
        type: "true-false",
        question: "The Battle of Midway was a decisive Allied victory in the European Theater.",
        correctAnswer: "False",
        explanation: "The Battle of Midway (June 1942) took place in the Pacific Theater, not the European Theater. It was a pivotal naval battle where American forces, aided by codebreaking intelligence, sank four Japanese aircraft carriers, shifting the balance of naval power in the Pacific in favor of the Allies.",
      },
      {
        id: "q-2-3",
        type: "multiple-choice",
        question: "How many Allied soldiers were evacuated from Dunkirk?",
        options: [
          "Over 100,000",
          "Over 200,000",
          "Over 338,000",
          "Over 500,000",
        ],
        correctAnswer: "Over 338,000",
        explanation: "The evacuation of Dunkirk (Operation Dynamo) rescued over 338,000 Allied soldiers from the beaches of Dunkirk, France in late May to early June 1940. The operation was remarkable for involving hundreds of civilian boats alongside military vessels to cross the English Channel.",
      },
      {
        id: "q-2-4",
        type: "short-answer",
        question: "What was Operation Barbarossa and when did it begin?",
        correctAnswer: "Operation Barbarossa was the German invasion of the Soviet Union, launched on June 22, 1941. It was the largest military operation in history, involving over 3 million soldiers.",
        explanation: "Operation Barbarossa began on June 22, 1941, when Hitler launched a massive invasion of the Soviet Union with over 3 million soldiers along an 1,800-mile front. Despite rapid initial advances, the campaign stalled before Moscow as the brutal Russian winter set in and German supply lines were stretched beyond their limits.",
      },
      {
        id: "q-2-5",
        type: "fill-blank",
        question: "D-Day, the largest amphibious military operation in history, took place on _______ along the coast of Normandy, France.",
        correctAnswer: "June 6, 1944",
        explanation: "The Normandy landings on June 6, 1944 (D-Day) involved over 156,000 Allied troops crossing the English Channel and landing on five beaches along the Normandy coast. This operation established a crucial foothold in Western Europe that led to the liberation of France and the eventual Allied advance toward Germany.",
      },
    ],
    createdAt: "2026-02-08T14:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// Mock Photo Solver Solutions
// ---------------------------------------------------------------------------

export const mockPhotoSolverSolutions: PhotoSolverSolution[] = [
  {
    id: "photo-solve-1",
    imageDescription: "A handwritten calculus integration problem on notebook paper",
    problem: "Evaluate the integral: integral of x^2 * e^x dx",
    steps: [
      {
        stepNumber: 1,
        title: "Identify the technique",
        explanation: "This integral is a product of an algebraic function (x^2) and an exponential function (e^x). Since these are two different types of functions multiplied together, we use integration by parts. We will need to apply it twice because differentiating x^2 once gives 2x, which still requires another round of integration by parts.",
        math: "Formula: integral of u dv = u*v - integral of v du",
      },
      {
        stepNumber: 2,
        title: "First application of integration by parts",
        explanation: "Using the LIATE rule, we choose u = x^2 (algebraic, higher priority) and dv = e^x dx (exponential). Then du = 2x dx and v = e^x. Applying the integration by parts formula gives us a new integral that still contains a product of different function types.",
        math: "integral of x^2 * e^x dx = x^2 * e^x - integral of 2x * e^x dx",
      },
      {
        stepNumber: 3,
        title: "Second application of integration by parts",
        explanation: "For the remaining integral of 2x * e^x dx, we again apply integration by parts. Choose u = 2x and dv = e^x dx. Then du = 2 dx and v = e^x. This reduces the integral to a simple exponential that we can evaluate directly.",
        math: "integral of 2x * e^x dx = 2x * e^x - integral of 2 * e^x dx = 2x * e^x - 2*e^x",
      },
      {
        stepNumber: 4,
        title: "Combine and simplify",
        explanation: "Substituting the result from Step 3 back into the equation from Step 2 and adding the constant of integration C, we arrive at the final answer. We can factor out e^x for a cleaner expression.",
        math: "integral of x^2 * e^x dx = x^2 * e^x - (2x * e^x - 2*e^x) + C = e^x * (x^2 - 2x + 2) + C",
      },
    ],
    finalAnswer: "e^x * (x^2 - 2x + 2) + C",
    createdAt: "2026-02-10T13:20:00Z",
  },
  {
    id: "photo-solve-2",
    imageDescription: "A physics textbook page showing a projectile motion diagram with a ball launched at an angle",
    problem: "A ball is launched from ground level at an angle of 35 degrees with an initial velocity of 28 m/s. Find the maximum height, total time of flight, and horizontal range. Ignore air resistance. Use g = 9.8 m/s^2.",
    steps: [
      {
        stepNumber: 1,
        title: "Resolve initial velocity into components",
        explanation: "The initial velocity must be broken into horizontal (vx) and vertical (vy) components using trigonometry. The horizontal component remains constant throughout the flight because there is no air resistance, while the vertical component changes due to gravitational acceleration.",
        math: "vx = 28 * cos(35) = 22.94 m/s\nvy = 28 * sin(35) = 16.06 m/s",
      },
      {
        stepNumber: 2,
        title: "Calculate maximum height",
        explanation: "At maximum height, the vertical velocity becomes zero momentarily. Using the kinematic equation v^2 = v0^2 - 2*g*h, we set v = 0 and solve for h. This gives us the peak height of the projectile's parabolic trajectory.",
        math: "0 = vy^2 - 2*g*h\nh = vy^2 / (2*g) = (16.06)^2 / (2 * 9.8) = 257.92 / 19.6 = 13.16 m",
      },
      {
        stepNumber: 3,
        title: "Calculate time to reach maximum height and total flight time",
        explanation: "Using v = v0 - g*t and setting v = 0 at the peak, we find the time to reach maximum height. The total flight time is exactly twice this value because the trajectory is symmetric when the projectile launches from and lands at the same height (ground level).",
        math: "t_up = vy / g = 16.06 / 9.8 = 1.639 s\nt_total = 2 * t_up = 3.278 s",
      },
      {
        stepNumber: 4,
        title: "Calculate horizontal range",
        explanation: "The horizontal range is the total horizontal distance traveled during the entire flight. Since the horizontal velocity is constant (no air resistance), the range is simply the horizontal velocity component multiplied by the total time of flight.",
        math: "R = vx * t_total = 22.94 * 3.278 = 75.19 m",
      },
      {
        stepNumber: 5,
        title: "Verify with the standard range formula",
        explanation: "We can verify our answer using the standard range formula R = v0^2 * sin(2*theta) / g. This formula is derived from the same kinematic equations and should give the same result, which confirms our step-by-step calculation is correct.",
        math: "R = v0^2 * sin(2*theta) / g = (28)^2 * sin(70) / 9.8 = 784 * 0.9397 / 9.8 = 75.14 m (confirmed)",
      },
    ],
    finalAnswer: "Maximum height = 13.16 m, Total time of flight = 3.28 s, Horizontal range = 75.19 m",
    createdAt: "2026-02-14T15:45:00Z",
  },
];

// ---------------------------------------------------------------------------
// Mock Stats (convenience aggregate)
// ---------------------------------------------------------------------------

export const mockStats = {
  totalNotes: 6,
  flashcardsCreated: 14,
  testsTaken: 2,
  hoursRecorded: 3.5,
};

// ---------------------------------------------------------------------------
// Backward-compatible Photo Solver types & data
// (used by the photo-solver page and solution-steps component)
// ---------------------------------------------------------------------------

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
        explanation:
          "We need to evaluate the indefinite integral of x^2 * e^x. This is a product of a polynomial and an exponential function, which requires integration by parts.",
        math: "integral of x^2 * e^x dx",
      },
      {
        title: "Apply integration by parts (first round)",
        explanation:
          "Using the formula integral of u dv = uv - integral of v du, we choose u = x^2 and dv = e^x dx. Then du = 2x dx and v = e^x.",
        math: "= x^2 * e^x - integral of 2x * e^x dx",
      },
      {
        title: "Apply integration by parts (second round)",
        explanation:
          "We still have a product of x and e^x, so we apply integration by parts again with u = 2x and dv = e^x dx. Then du = 2 dx and v = e^x.",
        math: "= x^2 * e^x - (2x * e^x - integral of 2 * e^x dx)",
      },
      {
        title: "Evaluate the remaining integral",
        explanation:
          "The remaining integral of 2 * e^x dx is straightforward: it equals 2*e^x. Now we combine all terms.",
        math: "= x^2 * e^x - 2x * e^x + 2*e^x + C",
      },
      {
        title: "Factor and simplify",
        explanation:
          "We can factor out e^x from all terms to get a cleaner final expression.",
        math: "= e^x * (x^2 - 2x + 2) + C",
      },
    ],
    finalAnswer: "e^x * (x^2 - 2x + 2) + C",
  },
  {
    id: "physics",
    label: "Physics Problem",
    subject: "Physics",
    subjectDetail: "Classical Mechanics",
    steps: [
      {
        title: "Understand the problem",
        explanation:
          "A 5 kg block slides down a frictionless inclined plane that makes a 30 degree angle with the horizontal. We need to find the acceleration of the block and its velocity after sliding 4 meters from rest.",
      },
      {
        title: "Draw free body diagram and identify forces",
        explanation:
          "The forces acting on the block are: gravity (mg downward) and normal force (N perpendicular to the surface). Since the plane is frictionless, only the component of gravity along the incline causes acceleration.",
        math: "F_parallel = mg * sin(theta) = 5 * 9.8 * sin(30)",
      },
      {
        title: "Calculate the acceleration",
        explanation:
          "Using Newton's second law (F = ma), and since the only force along the incline is the gravity component, we can find the acceleration directly.",
        math: "a = g * sin(30) = 9.8 * 0.5 = 4.9 m/s^2",
      },
      {
        title: "Find the final velocity",
        explanation:
          "Using the kinematic equation v^2 = v0^2 + 2*a*s, where initial velocity v0 = 0 (starts from rest), a = 4.9 m/s^2, and s = 4 m.",
        math: "v = sqrt(2 * 4.9 * 4) = sqrt(39.2) = 6.26 m/s",
      },
    ],
    finalAnswer: "Acceleration = 4.9 m/s^2, Final velocity = 6.26 m/s",
  },
];
