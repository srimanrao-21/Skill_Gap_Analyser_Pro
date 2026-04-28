// server/aiMentor.js — Comprehensive context-aware AI Placement Mentor engine.
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize Gemini API
console.log("[AI Mentor] Checking for GEMINI_API_KEY...");
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

if (genAI) {
  console.log("[AI Mentor] Gemini API initialized successfully.");
} else {
  console.warn("[AI Mentor] GEMINI_API_KEY not found in environment variables.");
}

// This module provides intelligent, topic-aware responses.
// It uses Gemini AI when available, with a rule-based fallback.

// ─── Knowledge Base ───────────────────────────────────────────────────
const KNOWLEDGE = {

  // ── DSA & CODING ──────────────────────────────────────────────────
  dsa: {
    arrays: "**Arrays** are the most fundamental data structure. Start with:\n• Two Pointer technique (LeetCode #167, #15)\n• Sliding Window (LeetCode #3, #209)\n• Prefix Sums (LeetCode #560)\n• Kadane's Algorithm for max subarray (LeetCode #53)\n\nPractice tip: Solve 20 easy array problems before moving to medium.",
    strings: "**String manipulation** is heavily tested in interviews:\n• Pattern matching — KMP Algorithm\n• Anagram problems (LeetCode #49, #242)\n• Palindrome checks (LeetCode #125, #5)\n• String hashing for efficient comparisons\n\nFocus on understanding character frequency maps — they solve 60% of string problems.",
    linkedlist: "**Linked Lists** test pointer manipulation skills:\n• Reversal (LeetCode #206) — the most classic problem\n• Cycle detection — Floyd's Tortoise & Hare (LeetCode #141)\n• Merge two sorted lists (LeetCode #21)\n• Remove nth node from end (LeetCode #19)\n\nTip: Always draw diagrams when working with linked lists. Track your pointers carefully.",
    trees: "**Trees & Binary Trees** are interview favorites:\n• BFS vs DFS traversal — know both approaches\n• Inorder, Preorder, Postorder (LeetCode #94, #144, #145)\n• Lowest Common Ancestor (LeetCode #236)\n• Validate BST (LeetCode #98)\n• Level Order Traversal (LeetCode #102)\n\nMost tree problems can be solved recursively. Master the recursive pattern first, then learn iterative approaches.",
    graphs: "**Graph algorithms** are advanced but crucial for top companies:\n• BFS/DFS — foundational traversal (LeetCode #200, #733)\n• Dijkstra's shortest path\n• Topological Sort (LeetCode #207, #210)\n• Union-Find for connectivity problems\n• Minimum Spanning Tree (Kruskal's/Prim's)\n\nStart with grid-based problems (islands, mazes) before moving to abstract graphs.",
    dp: "**Dynamic Programming** is the most feared topic, but it follows patterns:\n\n**5 Key Patterns:**\n1. **Fibonacci-style** — Climbing Stairs (#70), House Robber (#198)\n2. **0/1 Knapsack** — Partition Equal Subset Sum (#416)\n3. **Unbounded Knapsack** — Coin Change (#322)\n4. **LCS/LIS** — Longest Common Subsequence (#1143)\n5. **Grid DP** — Unique Paths (#62), Min Path Sum (#64)\n\n**Learning approach:** For each problem, first write the recursive solution, then add memoization, then convert to tabulation.",
    sorting: "**Sorting algorithms** you must know:\n• QuickSort — O(n log n) average, most practical\n• MergeSort — O(n log n) guaranteed, good for linked lists\n• HeapSort — uses priority queue\n• Counting Sort — O(n+k) for limited range integers\n\nInterview tip: Know when to use which. QuickSort for general purpose, MergeSort when stability matters, Counting Sort for constrained ranges.",
    stacks: "**Stacks & Queues** solve many tricky problems:\n• Valid Parentheses (LeetCode #20)\n• Min Stack (LeetCode #155)\n• Next Greater Element (LeetCode #496)\n• Implement Queue using Stacks (LeetCode #232)\n• Monotonic Stack pattern — very powerful!\n\nThe monotonic stack pattern alone can solve 15+ medium/hard problems.",
    recursion: "**Recursion & Backtracking** fundamentals:\n• Subsets (LeetCode #78)\n• Permutations (LeetCode #46)\n• N-Queens (LeetCode #51)\n• Sudoku Solver (LeetCode #37)\n• Word Search (LeetCode #79)\n\n**Key insight:** Every backtracking problem follows the pattern: Choose → Explore → Unchoose. Draw the decision tree to understand the solution space.",
    hashing: "**Hash Maps & Sets** are incredibly versatile:\n• Two Sum (LeetCode #1) — THE classic hash map problem\n• Group Anagrams (LeetCode #49)\n• Longest Consecutive Sequence (LeetCode #128)\n• Subarray Sum Equals K (LeetCode #560)\n\nHash maps provide O(1) lookup which turns many O(n²) solutions into O(n)."
  },

  // ── INTERVIEW PREP ────────────────────────────────────────────────
  interview: {
    behavioral: "**Behavioral Interview Tips (STAR Method):**\n\n**S**ituation — Set the scene briefly\n**T**ask — What was your responsibility?\n**A**ction — What specific steps did you take?\n**R**esult — What was the measurable outcome?\n\n**Common questions to prepare:**\n• Tell me about a time you faced a conflict in a team\n• Describe a challenging project and how you handled it\n• Tell me about a time you failed and what you learned\n• How do you handle tight deadlines?\n• Describe a situation where you showed leadership\n\n**Golden Rule:** Always quantify your results. \"Improved load time by 40%\" > \"Made the app faster\".",
    technical: "**Technical Interview Strategy:**\n\n1. **Clarify** — Ask about edge cases, constraints, input range\n2. **Brute force first** — Show you can solve it, even if O(n²)\n3. **Optimize** — Discuss time/space tradeoffs\n4. **Code** — Write clean, modular code\n5. **Test** — Walk through examples, check edge cases\n\n**Time management:** Spend 5 min understanding, 5 min planning, 15 min coding, 5 min testing\n\n**Communication is key** — Think out loud. Interviewers evaluate your thought process, not just the final answer.",
    system_design: "**System Design Interview Framework:**\n\n1. **Requirements** (5 min) — Functional & non-functional\n2. **Estimation** (5 min) — QPS, storage, bandwidth\n3. **High-level design** (10 min) — APIs, data flow, components\n4. **Deep dive** (15 min) — Database schema, caching, scaling\n5. **Bottlenecks** (5 min) — Single points of failure, monitoring\n\n**Must-know concepts:** Load balancing, CDN, Database sharding, Message queues, Caching (Redis), Microservices vs Monolith\n\n**Practice problems:** Design URL shortener, Design Twitter feed, Design a chat system.",
    hr: "**HR Interview — Common Questions & Strategies:**\n\n• **Why this company?** → Research their products, culture, recent news\n• **Why should we hire you?** → Match your skills to their requirements\n• **Salary expectations?** → Research market rates on Glassdoor/Levels.fyi\n• **Where do you see yourself in 5 years?** → Show ambition aligned with company growth\n• **Do you have questions for us?** → ALWAYS ask questions! Ask about team culture, tech stack, growth opportunities\n\n**Red flags to avoid:** Badmouthing previous employers, showing no research about the company, being vague about your contributions.",
    aptitude: "**Aptitude Test Preparation:**\n\n**Quantitative:**\n• Number Systems, HCF/LCM\n• Percentages, Profit & Loss\n• Time & Work, Speed & Distance\n• Probability & Permutations\n\n**Logical Reasoning:**\n• Blood Relations\n• Coding-Decoding\n• Syllogisms\n• Seating Arrangements\n\n**Verbal:**\n• Reading Comprehension\n• Sentence Correction\n• Para-jumbles\n\n**Resources:** IndiaBix, PrepInsta, GeeksforGeeks Aptitude section\n**Tip:** Practice 20 questions daily for 30 days — consistency beats cramming."
  },

  // ── RESUME ────────────────────────────────────────────────────────
  resume: {
    general: "**Resume Best Practices for Freshers:**\n\n**Structure (1 page ONLY):**\n1. **Header** — Name, email, phone, LinkedIn, GitHub\n2. **Education** — College, CGPA, relevant coursework\n3. **Skills** — Categorize: Languages, Frameworks, Tools, Databases\n4. **Projects** (2-3) — Use action verbs + quantified results\n5. **Experience** — Internships, freelance, open source\n6. **Achievements** — Hackathons, certifications, competitive coding ranks\n\n**Golden rules:**\n• Use action verbs: Built, Developed, Implemented, Optimized, Designed\n• Quantify everything: \"Reduced API response time by 60%\"\n• Tailor your resume for each company\n• ATS-friendly format — avoid tables, images, fancy fonts",
    projects: "**How to write project descriptions on resume:**\n\n❌ Bad: \"Made a website using React\"\n✅ Good: \"Built a full-stack e-commerce platform using React, Node.js, and MongoDB. Implemented JWT authentication, payment gateway integration with Stripe, and real-time order tracking. Served 500+ test users with 99.9% uptime.\"\n\n**Project formula:** [Action verb] + [What you built] + [Technologies used] + [Impact/Scale]\n\n**Must-have projects for freshers:**\n1. A full-stack web app with authentication\n2. A data analysis / ML project (if targeting data roles)\n3. An open-source contribution or a published package\n4. A system design project (e.g., URL shortener, chat app)",
    ats: "**ATS (Applicant Tracking System) Tips:**\n\nMost companies use ATS to filter resumes before a human sees them.\n\n**Do:**\n• Use standard section headings (Education, Experience, Skills)\n• Include keywords from the job description\n• Use standard fonts (Arial, Calibri, Times New Roman)\n• Save as PDF with proper text (not scanned image)\n\n**Don't:**\n• Use tables, columns, or text boxes\n• Use headers/footers for important info\n• Use icons or images for contact info\n• Use creative section names like \"My Superpowers\"\n\n**Test your resume:** Use jobscan.co or resumeworded.com to check ATS compatibility."
  },

  // ── SKILLS & LEARNING PATHS ───────────────────────────────────────
  skills: {
    frontend: "**Frontend Developer Roadmap:**\n\n**Phase 1 (Weeks 1-4):** HTML5, CSS3, JavaScript ES6+\n**Phase 2 (Weeks 5-8):** React.js, State Management (Context/Redux), Hooks\n**Phase 3 (Weeks 9-10):** TypeScript, Testing (Jest/React Testing Library)\n**Phase 4 (Weeks 11-12):** Performance optimization, Accessibility, SEO\n\n**Key skills to master:**\n• Responsive Design & CSS Grid/Flexbox\n• React lifecycle & hooks (useState, useEffect, useRef, useMemo)\n• API integration (REST, GraphQL)\n• Build tools (Vite, Webpack)\n• Version control (Git)\n\n**Portfolio must-haves:** 3 deployed projects on Vercel/Netlify with source code on GitHub.",
    backend: "**Backend Developer Roadmap:**\n\n**Phase 1:** Choose a language — Node.js (JavaScript) or Python (Django/Flask) or Java (Spring Boot)\n**Phase 2:** Database — SQL (PostgreSQL/MySQL) + NoSQL (MongoDB)\n**Phase 3:** APIs — REST API design, Authentication (JWT/OAuth), Rate limiting\n**Phase 4:** DevOps basics — Docker, CI/CD, Cloud (AWS/GCP)\n\n**Essential concepts:**\n• MVC architecture pattern\n• ORM (Prisma, Sequelize, SQLAlchemy)\n• Caching strategies (Redis)\n• Message queues (RabbitMQ, Kafka)\n• Microservices vs Monolith architecture\n\n**Build these:** CRUD API → Auth system → Real-time chat → Scalable microservice",
    fullstack: "**Full Stack Developer in 16 Weeks:**\n\n**Weeks 1-4:** Frontend fundamentals (HTML, CSS, JS, React)\n**Weeks 5-8:** Backend (Node.js, Express, MongoDB/PostgreSQL)\n**Weeks 9-12:** Full-stack projects with authentication, deployment\n**Weeks 13-16:** Advanced — TypeScript, Testing, Docker, CI/CD\n\n**The MERN/PERN Stack is most beginner-friendly:**\n• MongoDB/PostgreSQL + Express + React + Node.js\n\n**Capstone project idea:** Build a SaaS product (task manager, invoice generator, or student platform) with:\n• User auth (signup/login/password reset)\n• CRUD operations\n• Payment integration\n• Responsive UI\n• Deployed to production",
    data: "**Data Science / ML Roadmap:**\n\n**Foundation:** Python, Statistics, Linear Algebra\n**Data Analysis:** Pandas, NumPy, Matplotlib, Seaborn\n**Machine Learning:** Scikit-learn, Feature Engineering\n**Deep Learning:** TensorFlow/PyTorch, CNNs, RNNs, Transformers\n**MLOps:** Model deployment, Flask/FastAPI, Docker\n\n**Key projects for portfolio:**\n1. EDA on a real-world dataset (Kaggle)\n2. Predictive model (regression/classification)\n3. NLP project (sentiment analysis/chatbot)\n4. Computer Vision project\n5. End-to-end ML pipeline with deployment\n\n**Certifications:** Google Data Analytics, IBM Data Science, Andrew Ng's ML course",
    devops: "**DevOps Engineer Roadmap:**\n\n1. **Linux** — Command line, shell scripting, permissions\n2. **Networking** — TCP/IP, DNS, HTTP/HTTPS, Load Balancers\n3. **Version Control** — Git, GitHub Actions\n4. **Containers** — Docker, Docker Compose\n5. **Orchestration** — Kubernetes basics\n6. **CI/CD** — Jenkins, GitHub Actions, GitLab CI\n7. **Cloud** — AWS (EC2, S3, Lambda, RDS) or GCP/Azure\n8. **IaC** — Terraform or CloudFormation\n9. **Monitoring** — Prometheus, Grafana, ELK Stack\n\n**Certifications to target:** AWS Cloud Practitioner → AWS Solutions Architect → CKA (Kubernetes)"
  },

  // ── COMPANIES ─────────────────────────────────────────────────────
  companies: {
    tcs: "**TCS (Tata Consultancy Services):**\n• **Hiring Process:** TCS NQT (National Qualifier Test) → Technical Interview → HR\n• **Eligibility:** 60%+ throughout, no active backlogs\n• **Package:** ₹3.36 - 7 LPA (Digital role higher)\n• **Preparation:** Focus on aptitude, basic coding (C/Java/Python), verbal ability\n• **Tips:** TCS NQT score > 1500 for Digital role. Practice on TCS iON platform.",
    infosys: "**Infosys:**\n• **Hiring Process:** InfyTQ Assessment / On-campus → Technical + HR\n• **Eligibility:** 65%+ throughout\n• **Packages:** ₹3.6 LPA (SE) / ₹5 LPA (Power Programmer) / ₹6.5+ LPA (DSE)\n• **Preparation:** InfyTQ certification helps. Strong coding in Python/Java. HackerRank-style problems.\n• **Tips:** Complete InfyTQ courses early. The certification gives direct interview access.",
    wipro: "**Wipro:**\n• **Hiring Process:** Elite NLTH → Online Assessment → Technical + HR\n• **Eligibility:** 60%+ throughout\n• **Packages:** ₹3.5 LPA (Elite) / ₹6.5 LPA (Turbo)\n• **Preparation:** Aptitude + basic coding + essay writing\n• **Tips:** Wipro Turbo requires good coding skills. Focus on arrays, strings, basic SQL.",
    google: "**Google SDE Interview:**\n• **Rounds:** Phone Screen → 4-5 On-site (Coding + System Design + Behavioral)\n• **Focus Areas:** DSA (Medium-Hard LeetCode), System Design, Googleyness\n• **Preparation Timeline:** 3-6 months minimum\n• **Key Topics:** Arrays, Trees, Graphs, DP, System Design at scale\n• **Resources:** LeetCode (Google tagged), \"Cracking the Coding Interview\", System Design Primer\n• **Tips:** Practice on Google Docs (no IDE in interviews). Focus on clean, bug-free code.",
    microsoft: "**Microsoft SDE Interview:**\n• **Rounds:** Online Assessment → 3-4 On-site rounds\n• **Focus:** DSA, Problem-solving, System Design (for experienced)\n• **Key Topics:** Trees, Graphs, DP, Design Patterns, OOP\n• **Resources:** LeetCode (Microsoft tagged), \"Elements of Programming Interviews\"\n• **Tips:** Microsoft values clean code and good design. They often ask you to write production-quality code on whiteboard.",
    amazon: "**Amazon SDE Interview:**\n• **Rounds:** Online Assessment → Phone Screen → 4-5 On-site (includes Bar Raiser)\n• **Focus:** Leadership Principles + DSA\n• **Key Topics:** Arrays, Trees, Graphs, DP, System Design\n• **Leadership Principles:** Customer Obsession, Ownership, Dive Deep, Deliver Results — prepare 2 STAR stories per principle\n• **Tips:** Amazon heavily weighs behavioral rounds. Every answer should tie back to a Leadership Principle."
  },

  // ── GENERAL CAREER ────────────────────────────────────────────────
  career: {
    fresher: "**Career Advice for Freshers:**\n\n1. **Build a strong GitHub profile** — Contribute to open source, showcase projects\n2. **Network** — Connect with engineers on LinkedIn, attend meetups, join Discord communities\n3. **Certifications** — AWS Cloud Practitioner, Google IT Support, Meta Frontend Developer\n4. **Competitive Coding** — Aim for 3★ on CodeChef or 1400+ on Codeforces\n5. **Internships** — Apply early (6 months before graduation)\n\n**Application strategy:**\n• Apply to 50+ companies (don't be selective initially)\n• Customize resume for each application\n• Follow up with recruiters on LinkedIn\n• Track all applications in a spreadsheet",
    salary: "**Salary Negotiation Tips:**\n\n• **Research first:** Use Glassdoor, Levels.fyi, AmbitionBox for market rates\n• **Never give a number first** — Let the company make the first offer\n• **Consider total compensation:** Base + Bonus + Stock + Benefits\n• **For freshers:** Focus on learning opportunities over salary for your first role\n• **Counter offer script:** \"I'm excited about this role. Based on my research and the value I bring, I was expecting something in the range of X-Y. Can we discuss?\"\n\n**Typical fresher packages (India 2024):**\n• Service companies: ₹3-5 LPA\n• Product companies: ₹6-15 LPA\n• FAANG/Top startups: ₹15-45 LPA",
    linkedin: "**LinkedIn Profile Optimization:**\n\n1. **Headline:** Don't just say \"Student\" → \"Aspiring SDE | React & Node.js | 3★ CodeChef\"\n2. **About section:** Tell your story in 3 paragraphs — who you are, what you do, what you're looking for\n3. **Experience:** Include internships, freelance, open source contributions\n4. **Projects:** Add project links with descriptions and tech stack\n5. **Skills & Endorsements:** Add 10+ relevant skills\n6. **Recommendations:** Request from professors, mentors, internship managers\n7. **Activity:** Post about your learning journey, share articles, engage with content\n\n**Connection strategy:** Connect with 5 engineers at your target company. Engage with their content for 2 weeks before asking for referrals.",
    portfolio: "**Building a Developer Portfolio:**\n\n**Must-have elements:**\n1. Clean landing page with your name, role, and tagline\n2. About section with your story\n3. Skills section with tech stack icons\n4. Projects (3-5) with live demos, GitHub links, and descriptions\n5. Blog section (optional but impressive)\n6. Contact form\n\n**Tech recommendations:** Build with React/Next.js, deploy on Vercel\n\n**Design tips:**\n• Dark theme looks more professional for dev portfolios\n• Add subtle animations (Framer Motion)\n• Make it mobile-responsive\n• Optimize for performance (< 3s load time)\n\n**Examples to study:** brittanychiang.com, mattfarley.ca, dejan.works"
  },

  // ── CODING PLATFORMS ──────────────────────────────────────────────
  platforms: {
    leetcode: "**LeetCode Strategy for Placements:**\n\n**Target:** 150-200 problems over 3 months\n\n**Distribution:**\n• Easy: 50 problems (build confidence)\n• Medium: 80-100 problems (interview standard)\n• Hard: 20-30 problems (for FAANG-level)\n\n**Study plan:**\n• Week 1-2: Arrays & Strings (20 problems)\n• Week 3-4: Linked Lists & Stacks (15 problems)\n• Week 5-6: Trees & Graphs (20 problems)\n• Week 7-8: Dynamic Programming (20 problems)\n• Week 9-10: Mixed practice & contests\n• Week 11-12: Company-specific problems\n\n**Pro tips:**\n• Use the \"Blind 75\" or \"NeetCode 150\" curated list\n• Participate in weekly contests\n• Review solutions even for problems you solve — learn optimal approaches",
    hackerrank: "**HackerRank for Placements:**\n\n• Many Indian companies (TCS, Infosys, Wipro, Cognizant) use HackerRank for assessments\n• Focus on: Problem Solving, SQL, and your primary language certification\n• Complete the skill certifications — they appear on your profile\n• Practice medium-difficulty problems with time limits\n\n**HackerRank vs LeetCode:**\n• HackerRank is better for company assessments and certifications\n• LeetCode is better for interview-style problem solving\n• Do both!",
    codeforces: "**Codeforces for Competitive Programming:**\n\n**Rating targets:**\n• Newbie → Pupil (1200): Basic problem solving\n• Pupil → Specialist (1400): Good for most companies\n• Specialist → Expert (1600): Top company level\n\n**Getting started:**\n• Solve Div 2 A & B problems first\n• Participate in every contest (consistency matters)\n• Upsolve problems you couldn't solve during contest\n• Use the problem filter by rating (start at 800, work up)\n\n**Resources:** CP-algorithms.com, Codeforces blog editorials, Competitive Programmer's Handbook (free PDF)"
  },

  // ── CS FUNDAMENTALS ─────────────────────────────────────────────
  cs: {
    oop: "**Object-Oriented Programming (OOP):**\n\n**4 Pillars:**\n1. **Encapsulation** — Bundling data + methods together. Use private fields + public getters/setters.\n2. **Abstraction** — Hide complex implementation, expose simple interface. Abstract classes & interfaces.\n3. **Inheritance** — Child class inherits from parent. Promotes code reuse. Types: Single, Multiple (interfaces), Multilevel, Hierarchical.\n4. **Polymorphism** — Same method, different behavior.\n   • Compile-time: Method overloading (same name, different params)\n   • Runtime: Method overriding (child redefines parent method)\n\n**Key concepts:**\n• **SOLID Principles** — Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion\n• **Design Patterns** — Singleton, Factory, Observer, Strategy, Builder\n• **Association vs Aggregation vs Composition**\n\n**Interview tip:** Be ready to explain with real-world examples. E.g., Polymorphism → a Shape class with draw() overridden by Circle, Rectangle.",
    os: "**Operating Systems — Key Concepts:**\n\n**Process Management:**\n• Process vs Thread — Process has own memory space; threads share memory\n• Process states: New → Ready → Running → Waiting → Terminated\n• Context Switching — saving/restoring process state\n• CPU Scheduling: FCFS, SJF, Round Robin, Priority\n\n**Memory Management:**\n• Paging — Fixed-size blocks; eliminates external fragmentation\n• Segmentation — Variable-size blocks based on logical divisions\n• Virtual Memory — Uses disk as extended RAM; page faults\n• Page Replacement: FIFO, LRU, Optimal\n\n**Synchronization:**\n• Critical Section Problem\n• Mutex vs Semaphore — Mutex is binary (1 thread), Semaphore can allow N\n• Deadlock conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait\n• Deadlock handling: Prevention, Avoidance (Banker's Algorithm), Detection\n\n**File Systems:** FAT, NTFS, ext4, inodes, hard links vs soft links",
    dbms: "**Database Management Systems (DBMS):**\n\n**Relational Model:**\n• Tables (Relations), Rows (Tuples), Columns (Attributes)\n• Primary Key, Foreign Key, Candidate Key, Super Key\n• Constraints: NOT NULL, UNIQUE, CHECK, DEFAULT\n\n**Normalization:**\n• 1NF — No repeating groups, atomic values\n• 2NF — No partial dependencies\n• 3NF — No transitive dependencies\n• BCNF — Every determinant is a candidate key\n\n**SQL Essentials:**\n• DDL: CREATE, ALTER, DROP, TRUNCATE\n• DML: SELECT, INSERT, UPDATE, DELETE\n• Joins: INNER, LEFT, RIGHT, FULL OUTER, CROSS, SELF\n• Aggregations: GROUP BY, HAVING, COUNT, SUM, AVG\n• Subqueries, Views, Indexes\n\n**Transactions (ACID):**\n• Atomicity — All or nothing\n• Consistency — Valid state transitions\n• Isolation — Concurrent transactions don't interfere\n• Durability — Committed data persists\n\n**Indexing:** B-Tree, B+ Tree, Hash Index. Indexes speed up reads but slow down writes.",
    networking: "**Computer Networking Fundamentals:**\n\n**OSI Model (7 Layers):**\n7. Application — HTTP, FTP, SMTP, DNS\n6. Presentation — Encryption, Compression\n5. Session — Session management\n4. Transport — TCP (reliable), UDP (fast)\n3. Network — IP addressing, Routing\n2. Data Link — MAC address, Ethernet\n1. Physical — Cables, signals\n\n**TCP vs UDP:**\n• TCP: Connection-oriented, reliable, ordered. Used for HTTP, email, file transfer.\n• UDP: Connectionless, fast, no guarantee. Used for streaming, gaming, DNS.\n\n**Key Protocols:**\n• HTTP/HTTPS — Web communication (port 80/443)\n• DNS — Domain name → IP resolution\n• TCP 3-way handshake: SYN → SYN-ACK → ACK\n• DHCP — Automatic IP assignment\n\n**IP Addressing:** IPv4 (32-bit), IPv6 (128-bit), Subnetting, CIDR notation\n**Important:** Know the difference between TCP and UDP, how DNS works, and HTTP status codes (200, 301, 400, 401, 403, 404, 500).",
    architecture: "**Computer Architecture Basics:**\n\n**CPU Components:**\n• ALU (Arithmetic Logic Unit) — performs calculations\n• Control Unit — directs operations\n• Registers — fast, small storage inside CPU\n• Cache — L1, L2, L3 (faster than RAM, smaller)\n\n**Memory Hierarchy:** Registers → Cache → RAM → SSD/HDD\n• Speed decreases, capacity increases as you go down\n\n**Key Concepts:**\n• Von Neumann vs Harvard Architecture\n• RISC vs CISC — Reduced vs Complex Instruction Set Computing\n• Pipelining — Execute multiple instructions simultaneously\n• Instruction Cycle: Fetch → Decode → Execute → Store\n\n**Number Systems:** Binary, Octal, Hexadecimal conversions\n**Boolean Algebra:** AND, OR, NOT, XOR, NAND, NOR gates\n\n**For interviews:** Focus on cache, memory hierarchy, and how CPU executes instructions."
  },

  // ── PROGRAMMING LANGUAGES ─────────────────────────────────────
  programming: {
    python: "**Python — Complete Guide:**\n\n**Why Python?**\n• Simple syntax, beginner-friendly\n• #1 for Data Science, ML, AI, scripting\n• Widely used at Google, Netflix, Instagram, Spotify\n\n**Core Concepts:**\n• Variables, Data Types (int, float, str, bool, list, dict, tuple, set)\n• Control Flow: if/elif/else, for, while\n• Functions, *args, **kwargs, lambda\n• List comprehensions: `[x*2 for x in range(10)]`\n• OOP: Classes, inheritance, dunder methods (__init__, __str__)\n\n**Advanced:**\n• Decorators & Generators\n• Context Managers (with statement)\n• Exception Handling (try/except/finally)\n• File I/O, JSON handling\n• Virtual environments (venv, pip)\n\n**For DSA:** Python's built-in: list, dict, set, heapq, collections (deque, Counter, defaultdict)\n\n**Practice:** Start with Python basics on HackerRank, then move to LeetCode.",
    java: "**Java — Complete Guide:**\n\n**Why Java?**\n• Platform independent (JVM)\n• Strong OOP support\n• Used heavily in enterprise, Android, backend\n• Most popular for coding interviews\n\n**Core Concepts:**\n• Classes & Objects, Constructors\n• Inheritance, Interfaces, Abstract Classes\n• Access Modifiers: public, private, protected, default\n• Exception Handling: try-catch-finally, custom exceptions\n• Collections Framework: ArrayList, HashMap, HashSet, LinkedList, PriorityQueue, TreeMap\n\n**Advanced:**\n• Generics, Lambdas, Streams API\n• Multithreading: Thread, Runnable, synchronized, ExecutorService\n• JVM internals: Stack, Heap, Garbage Collection\n• Design Patterns in Java\n\n**For DSA:** Java Collections Framework is extremely powerful. Master ArrayList, HashMap, PriorityQueue, and Stack.\n\n**Resources:** Oracle Java tutorials, Effective Java by Joshua Bloch",
    javascript: "**JavaScript — Complete Guide:**\n\n**Core Concepts:**\n• Variables: var vs let vs const\n• Data Types: Primitive (string, number, boolean, null, undefined, symbol) vs Reference (object, array)\n• Functions: Regular, Arrow, IIFE, Higher-order functions\n• Closures — Function retaining access to outer scope\n• Prototypes & Prototype Chain\n• `this` keyword — depends on how function is called\n\n**ES6+ Features:**\n• Destructuring, Spread/Rest operators\n• Template Literals, Optional Chaining\n• Promises, async/await\n• Modules (import/export)\n• Map, Set, WeakMap, WeakSet\n\n**Async JavaScript:**\n• Event Loop — Call Stack, Task Queue, Microtask Queue\n• Callbacks → Promises → async/await (evolution)\n• fetch API, XMLHttpRequest\n\n**DOM Manipulation:** querySelector, addEventListener, createElement\n\n**Interview favorites:** Closures, Event Loop, Hoisting, == vs ===, call/apply/bind",
    cpp: "**C++ for Competitive Programming & Interviews:**\n\n**Why C++?**\n• Fastest execution — crucial for competitive programming\n• STL (Standard Template Library) is incredibly powerful\n• Used in systems programming, game development\n\n**Essential STL:**\n• Containers: vector, set, map, unordered_map, stack, queue, priority_queue, deque\n• Algorithms: sort, binary_search, lower_bound, upper_bound, next_permutation\n• Iterators: begin(), end(), rbegin()\n\n**Key Concepts:**\n• Pointers & References\n• Memory management: new/delete, smart pointers\n• OOP: Classes, Virtual functions, Polymorphism\n• Templates & Generic Programming\n\n**CP Template tip:**\n```\n#include <bits/stdc++.h>\nusing namespace std;\ntypedef long long ll;\n#define pb push_back\n#define all(x) x.begin(), x.end()\n```\n\n**Resources:** CP-algorithms.com, Competitive Programmer's Handbook",
    sql: "**SQL — Complete Interview Guide:**\n\n**Basic Queries:**\n• SELECT, WHERE, ORDER BY, LIMIT\n• DISTINCT, LIKE, IN, BETWEEN\n• AND, OR, NOT operators\n\n**Joins:**\n• INNER JOIN — matching rows from both tables\n• LEFT JOIN — all from left + matching from right\n• RIGHT JOIN — all from right + matching from left\n• FULL OUTER JOIN — all rows from both\n• SELF JOIN — table joined with itself\n\n**Aggregation:**\n• GROUP BY + HAVING\n• COUNT(), SUM(), AVG(), MIN(), MAX()\n\n**Advanced:**\n• Subqueries (scalar, correlated)\n• Window Functions: ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), LEAD()\n• CTEs (WITH clause)\n• UNION, INTERSECT, EXCEPT\n• CASE WHEN expressions\n\n**Practice:** LeetCode Database problems, HackerRank SQL track, SQLZoo.net\n\n**Interview tip:** Most companies test SQL — even for SDE roles. Practice at least 30 SQL problems.",
    git: "**Git & Version Control:**\n\n**Essential Commands:**\n• `git init` — Initialize repository\n• `git clone <url>` — Clone remote repo\n• `git add .` — Stage all changes\n• `git commit -m \"message\"` — Commit\n• `git push origin main` — Push to remote\n• `git pull` — Fetch + merge\n• `git branch <name>` — Create branch\n• `git checkout <branch>` — Switch branch\n• `git merge <branch>` — Merge branch\n\n**Advanced:**\n• `git rebase` — Rewrite history linearly\n• `git stash` — Temporarily save changes\n• `git cherry-pick` — Apply specific commit\n• `git log --oneline --graph` — Visual history\n• `.gitignore` — Exclude files from tracking\n\n**Branching Strategy:**\n• main/master — production code\n• develop — integration branch\n• feature/* — individual features\n• hotfix/* — urgent fixes\n\n**Interview tip:** Know the difference between merge and rebase, how to resolve conflicts, and Git workflow."
  },

  // ── WEB DEVELOPMENT ─────────────────────────────────────────────
  webdev: {
    http: "**HTTP Protocol — Deep Dive:**\n\n**HTTP Methods:**\n• GET — Retrieve data (idempotent)\n• POST — Create resource\n• PUT — Update/Replace resource (idempotent)\n• PATCH — Partial update\n• DELETE — Remove resource (idempotent)\n\n**Status Codes:**\n• 200 OK, 201 Created, 204 No Content\n• 301 Moved Permanently, 302 Found\n• 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests\n• 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable\n\n**Headers:** Content-Type, Authorization, Cache-Control, CORS headers\n**HTTPS:** HTTP + TLS/SSL encryption. Certificates, CA, handshake process.\n\n**REST API Design:**\n• Use nouns for resources: /users, /posts, /comments\n• Use HTTP methods for actions\n• Version your API: /api/v1/users\n• Use proper status codes\n• Implement pagination: ?page=1&limit=20",
    auth: "**Authentication & Authorization:**\n\n**Authentication (Who are you?):**\n• Session-based — Server stores session, client stores cookie\n• Token-based (JWT) — Stateless, token contains user info\n• OAuth 2.0 — Login with Google/GitHub/Facebook\n\n**JWT (JSON Web Token):**\n• Structure: Header.Payload.Signature\n• Stored in: httpOnly cookie (secure) or localStorage (less secure)\n• Contains: user ID, roles, expiry time\n• Refresh tokens for long sessions\n\n**Authorization (What can you do?):**\n• Role-based access control (RBAC): Admin, User, Moderator\n• Permission-based: read, write, delete\n\n**Security Best Practices:**\n• Hash passwords (bcrypt, argon2) — NEVER store plain text\n• Use HTTPS always\n• Implement rate limiting\n• Validate & sanitize all inputs\n• Use CSRF tokens for forms\n• Set httpOnly, secure, sameSite on cookies",
    security: "**Web Security Essentials:**\n\n**Common Vulnerabilities (OWASP Top 10):**\n\n1. **SQL Injection** — Malicious SQL in user input\n   Prevention: Parameterized queries, ORM\n\n2. **XSS (Cross-Site Scripting)** — Injecting malicious scripts\n   Prevention: Sanitize output, Content Security Policy\n\n3. **CSRF (Cross-Site Request Forgery)** — Unauthorized actions via forged requests\n   Prevention: CSRF tokens, SameSite cookies\n\n4. **Broken Authentication** — Weak passwords, session hijacking\n   Prevention: Strong hashing, MFA, secure sessions\n\n5. **Sensitive Data Exposure** — Unencrypted data\n   Prevention: HTTPS, encrypt at rest, minimize data collection\n\n**Security Headers:**\n• Content-Security-Policy\n• X-Frame-Options\n• Strict-Transport-Security\n• X-Content-Type-Options\n\n**Interview tip:** Know SQL injection and XSS prevention — they're asked in almost every security discussion.",
    testing: "**Software Testing Fundamentals:**\n\n**Types of Testing:**\n• **Unit Testing** — Test individual functions/components\n• **Integration Testing** — Test how modules work together\n• **E2E Testing** — Test complete user flows\n• **Performance Testing** — Load testing, stress testing\n\n**Testing Pyramid:** Many unit tests → Fewer integration tests → Few E2E tests\n\n**Popular Tools:**\n• JavaScript: Jest, Vitest, React Testing Library, Cypress, Playwright\n• Python: pytest, unittest\n• Java: JUnit, Mockito\n\n**TDD (Test-Driven Development):**\n1. Write a failing test (Red)\n2. Write minimum code to pass (Green)\n3. Refactor (Refactor)\n\n**Key Concepts:**\n• Mocking & Stubbing — Replace dependencies with fake objects\n• Code Coverage — % of code tested (aim for 80%+)\n• AAA Pattern: Arrange → Act → Assert\n\n**Interview tip:** Know the testing pyramid and be able to write unit tests for your projects."
  },

  // ── GENERAL STUDY & CONCEPTS ────────────────────────────────────
  general_study: {
    time_complexity: "**Time & Space Complexity:**\n\n**Big O Notation — Common Complexities:**\n• O(1) — Constant: Hash map lookup, array access by index\n• O(log n) — Logarithmic: Binary search, balanced BST operations\n• O(n) — Linear: Simple loop, linear search\n• O(n log n) — QuickSort, MergeSort\n• O(n²) — Quadratic: Nested loops, Bubble sort\n• O(2ⁿ) — Exponential: Recursive Fibonacci, subsets\n• O(n!) — Factorial: Permutations, brute-force TSP\n\n**How to analyze:**\n1. Count the number of operations relative to input size\n2. Drop constants: O(2n) → O(n)\n3. Keep dominant term: O(n² + n) → O(n²)\n\n**Space complexity** — memory used by the algorithm\n• In-place algorithms: O(1) extra space\n• Recursion uses O(depth) stack space\n\n**Interview tip:** Always state the time AND space complexity of your solution. Then discuss if it can be optimized.",
    design_patterns: "**Software Design Patterns:**\n\n**Creational Patterns:**\n• **Singleton** — Only one instance. Example: Database connection pool\n• **Factory** — Create objects without specifying exact class\n• **Builder** — Construct complex objects step by step\n\n**Structural Patterns:**\n• **Adapter** — Make incompatible interfaces work together\n• **Decorator** — Add behavior to objects dynamically\n• **Facade** — Simple interface to complex subsystem\n\n**Behavioral Patterns:**\n• **Observer** — Notify multiple objects of state changes (event systems)\n• **Strategy** — Switch algorithms at runtime\n• **Iterator** — Traverse collections without exposing internals\n\n**MVC (Model-View-Controller):**\n• Model — Data & business logic\n• View — UI presentation\n• Controller — Handles user input, updates model\n\n**Interview tip:** Know Singleton, Factory, Observer, and Strategy with real-world examples.",
    agile: "**Agile & Software Development Methodology:**\n\n**Agile Principles:**\n• Individuals over processes\n• Working software over documentation\n• Customer collaboration over contracts\n• Responding to change over following a plan\n\n**Scrum Framework:**\n• **Sprint** — 2-4 week development cycle\n• **Daily Standup** — 15 min: What I did, what I'll do, blockers\n• **Sprint Planning** — Select user stories for the sprint\n• **Sprint Review** — Demo to stakeholders\n• **Retrospective** — What went well, what to improve\n\n**Roles:** Product Owner, Scrum Master, Development Team\n\n**Tools:** Jira, Trello, Linear, Notion\n\n**Other Methodologies:** Kanban (visual workflow), Waterfall (sequential), XP (Extreme Programming)\n\n**Interview relevance:** Many companies ask about Agile experience. Know Scrum basics even as a fresher.",
    open_source: "**Contributing to Open Source:**\n\n**Why contribute?**\n• Builds your GitHub profile\n• Real-world coding experience\n• Networking with experienced developers\n• Impressive on resume\n\n**How to start:**\n1. Find projects: GitHub Explore, 'good first issue' label, firsttimersonly.com\n2. Fork the repository\n3. Clone locally, create a branch\n4. Make your changes (fix a bug, add docs, add tests)\n5. Push and create a Pull Request\n6. Respond to review feedback\n\n**Beginner-friendly projects:** freeCodeCamp, first-contributions, EddieHubCommunity\n\n**Tips:**\n• Start with documentation improvements\n• Read the CONTRIBUTING.md file\n• Be respectful and patient\n• Small valuable contributions > large messy ones"
  }
};

// ─── Intent Classification ────────────────────────────────────────────
function classifyIntent(message) {
  const msg = message.toLowerCase();

  // Greeting
  if (/^(hi|hello|hey|howdy|greetings|good\s*(morning|afternoon|evening)|sup|what'?s?\s*up)/i.test(msg)) return 'greeting';

  // Farewell
  if (/^(bye|goodbye|see\s*you|thanks?\s*(you|a lot|so much)?|thank|great\s*thanks|ok\s*thanks)/i.test(msg)) return 'farewell';

  // About self
  if (/who\s*are\s*you|what\s*are\s*you|your\s*name|what\s*can\s*you\s*do|what\s*do\s*you\s*do|help\s*me|how\s*can\s*you\s*help/.test(msg)) return 'about_self';

  // DSA topics
  if (/\b(array|two\s*pointer|sliding\s*window|prefix\s*sum|kadane)/i.test(msg)) return 'dsa_arrays';
  if (/\b(string|palindrome|anagram|substring|pattern\s*match)/i.test(msg)) return 'dsa_strings';
  if (/\b(linked\s*list|singly|doubly|circular\s*list)/i.test(msg)) return 'dsa_linkedlist';
  if (/\b(tree|binary\s*tree|bst|binary\s*search\s*tree|bfs|dfs|traversal|inorder|preorder|postorder)/i.test(msg)) return 'dsa_trees';
  if (/\b(graph|dijkstra|topological|union\s*find|shortest\s*path|bfs|dfs|adjacency)/i.test(msg)) return 'dsa_graphs';
  if (/\b(dynamic\s*programming|dp|memoiz|tabulation|knapsack|coin\s*change|fibonacci|subsequence)/i.test(msg)) return 'dsa_dp';
  if (/\b(sort|sorting|quicksort|mergesort|heapsort|bubble\s*sort|insertion\s*sort)/i.test(msg)) return 'dsa_sorting';
  if (/\b(stack|queue|monotonic|lifo|fifo|parenthes|bracket)/i.test(msg)) return 'dsa_stacks';
  if (/\b(recursion|backtrack|permutation|combination|subset|n[\s-]*queen)/i.test(msg)) return 'dsa_recursion';
  if (/\b(hash|hashmap|hash\s*map|hash\s*set|hash\s*table|dictionary|two\s*sum)/i.test(msg)) return 'dsa_hashing';
  if (/\b(dsa|data\s*structure|algorithm|problem\s*solv|coding\s*question|practice\s*problem)/i.test(msg)) return 'dsa_general';

  // Interview
  if (/\b(behavioral|behaviour|star\s*method|tell\s*me\s*about\s*a\s*time|hr\s*question)/i.test(msg)) return 'interview_behavioral';
  if (/\b(technical\s*interview|coding\s*interview|whiteboard|coding\s*round|technical\s*round)/i.test(msg)) return 'interview_technical';
  if (/\b(system\s*design|design\s*.*system|scalab|high\s*level\s*design|low\s*level\s*design|hld|lld)/i.test(msg)) return 'interview_system_design';
  if (/\b(hr\s*interview|hr\s*round|why\s*this\s*company|tell\s*me\s*about\s*yourself|strengths?\s*and\s*weakness)/i.test(msg)) return 'interview_hr';
  if (/\b(aptitude|quant|logical\s*reasoning|verbal\s*ability|reasoning|number\s*series)/i.test(msg)) return 'interview_aptitude';
  if (/\b(interview|placement|prepare|preparation|crack|clear)\b/i.test(msg)) return 'interview_general';

  // Resume
  if (/\b(resume|cv|curriculum\s*vitae|ats|applicant\s*tracking)/i.test(msg)) return 'resume';
  if (/\b(project\s*description|describe\s*project|project\s*on\s*resume|project\s*bullet)/i.test(msg)) return 'resume_projects';

  // Skills & Learning
  if (/\b(frontend|front[\s-]*end|react|vue|angular|css|html|ui\s*develop)/i.test(msg)) return 'skills_frontend';
  if (/\b(backend|back[\s-]*end|node\.?js|express|django|flask|spring|api\s*develop)/i.test(msg)) return 'skills_backend';
  if (/\b(full[\s-]*stack|mern|pern|mean)/i.test(msg)) return 'skills_fullstack';
  if (/\b(data\s*scien|machine\s*learn|ml\b|deep\s*learn|ai\b|artificial\s*intel|nlp|neural|tensorflow|pytorch|pandas|numpy)/i.test(msg)) return 'skills_data';
  if (/\b(devops|docker|kubernetes|ci[\s/]*cd|jenkins|aws|cloud|azure|gcp|terraform|deployment)/i.test(msg)) return 'skills_devops';
  if (/\b(skill|learn|roadmap|path|how\s*to\s*(start|begin|learn)|what\s*should\s*i\s*(learn|study)|beginner|getting\s*started)/i.test(msg)) return 'skills_general';

  // Companies
  if (/\b(tcs|tata\s*consultancy)/i.test(msg)) return 'company_tcs';
  if (/\b(infosys|infy)/i.test(msg)) return 'company_infosys';
  if (/\b(wipro)/i.test(msg)) return 'company_wipro';
  if (/\b(google|alphabet)/i.test(msg)) return 'company_google';
  if (/\b(microsoft|msft)/i.test(msg)) return 'company_microsoft';
  if (/\b(amazon|aws\s*interview)/i.test(msg)) return 'company_amazon';
  if (/\b(faang|maang|big\s*tech|top\s*compan|dream\s*compan|product\s*compan|service\s*compan|mnc)/i.test(msg)) return 'company_general';

  // Coding Platforms
  if (/\b(leetcode|leet\s*code)/i.test(msg)) return 'platform_leetcode';
  if (/\b(hackerrank|hacker\s*rank)/i.test(msg)) return 'platform_hackerrank';
  if (/\b(codeforces|code\s*forces|competitive\s*programming|cp\b)/i.test(msg)) return 'platform_codeforces';
  if (/\b(codechef|code\s*chef)/i.test(msg)) return 'platform_codechef';

  // Career
  if (/\b(salary|package|compensation|ctc|offer|negotiat)/i.test(msg)) return 'career_salary';
  if (/\b(linkedin|profile\s*optim|network)/i.test(msg)) return 'career_linkedin';
  if (/\b(portfolio|personal\s*website|showcase)/i.test(msg)) return 'career_portfolio';
  if (/\b(fresher|graduate|first\s*job|entry\s*level|campus\s*placement|off[\s-]*campus|internship)/i.test(msg)) return 'career_fresher';

  // Motivational / Emotional
  if (/\b(motivation|motivate|feeling\s*(down|low|sad|depress|anxious|stressed|overwhelmed)|can'?t\s*do|i\s*give\s*up|too\s*hard|struggling|not\s*good\s*enough|imposter|impostor|difficult|frustrated|stuck|procrastinat)/i.test(msg)) return 'motivation';

  // Comparison / What vs What
  if (/\bvs\.?\b|\bversus\b|\bor\b.*\bbetter\b|\bcompare|comparison|difference\s*between|which\s*is\s*(better|best)/i.test(msg)) return 'comparison';

  // Time management / Study plan
  if (/\b(time\s*manag|study\s*plan|schedule|routine|how\s*many\s*hours|daily\s*plan|weekly\s*plan)/i.test(msg)) return 'study_plan';
  if (/\b(what\s*time|current\s*time|the\s*time)\b/i.test(msg)) return 'general';

  // CS Fundamentals
  if (/\b(oop|oops|object\s*orient|encapsulat|abstraction|inherit|polymorph|solid\s*principle|design\s*principle|class\s*and\s*object)/i.test(msg)) return 'cs_oop';
  if (/\b(operating\s*system|\bos\b|process\s*manag|thread|deadlock|semaphore|mutex|paging|virtual\s*memory|cpu\s*schedul|context\s*switch|page\s*replace)/i.test(msg)) return 'cs_os';
  if (/\b(dbms|database|normaliz|sql\s*join|acid|transaction|primary\s*key|foreign\s*key|relational|index|b[\s-]*tree)/i.test(msg)) return 'cs_dbms';
  if (/\b(network|osi\s*model|tcp|udp|http|https|dns|ip\s*address|subnet|protocol|port|firewall|proxy|load\s*balanc)/i.test(msg)) return 'cs_networking';
  if (/\b(computer\s*architecture|cpu|alu|cache|memory\s*hierarchy|pipeline|risc|cisc|register|von\s*neumann|boolean\s*algebra|logic\s*gate)/i.test(msg)) return 'cs_architecture';

  // Programming Languages
  if (/\b(python|pip|venv|django|flask|pandas|numpy)\b/i.test(msg) && !/machine\s*learn|data\s*scien/i.test(msg)) return 'prog_python';
  if (/\b(java\b|jvm|spring\s*boot|jdk|jre|collections\s*framework|maven|gradle)/i.test(msg) && !/javascript/i.test(msg)) return 'prog_java';
  if (/\b(javascript|js\b|es6|ecmascript|closure|promise|async\s*await|event\s*loop|hoisting|callback|dom\b)/i.test(msg)) return 'prog_javascript';
  if (/\b(c\+\+|cpp|stl|pointer|reference|template|virtual\s*function)/i.test(msg)) return 'prog_cpp';
  if (/\b(sql\b|select\s*from|join|group\s*by|having|where\s*clause|subquer|window\s*function|cte\b)/i.test(msg)) return 'prog_sql';
  if (/\b(git\b|github|version\s*control|commit|branch|merge|rebase|pull\s*request|pr\b|clone|fork)/i.test(msg)) return 'prog_git';

  // Web Development
  if (/\b(http\s*method|status\s*code|rest\s*api|get\s*request|post\s*request|api\s*design|endpoint|crud)/i.test(msg)) return 'webdev_http';
  if (/\b(auth|jwt|token|oauth|session|cookie|login\s*system|password\s*hash|bcrypt|signup)/i.test(msg)) return 'webdev_auth';
  if (/\b(security|xss|csrf|sql\s*injection|owasp|vulnerabilit|hack|penetration|encrypt)/i.test(msg)) return 'webdev_security';
  if (/\b(testing|test\s*case|unit\s*test|integration\s*test|e2e|tdd|jest|pytest|junit|mock|coverage)/i.test(msg)) return 'webdev_testing';

  // General Study
  if (/\b(time\s*complex|space\s*complex|big\s*o|O\(n|O\(1|O\(log|complex\s*analy)/i.test(msg)) return 'study_complexity';
  if (/\b(complexity)\b/i.test(msg)) return 'study_complexity';
  if (/\b(design\s*pattern|singleton|factory|observer|strategy|mvc|builder\s*pattern|decorator\s*pattern)/i.test(msg)) return 'study_design_patterns';
  if (/\b(agile|scrum|sprint|standup|kanban|waterfall|methodology|jira|retrospective)/i.test(msg)) return 'study_agile';
  if (/\b(open\s*source|contribute|contribution|pull\s*request|first\s*issue|github\s*profile)/i.test(msg)) return 'study_open_source';
  if (/\b(what\s*is|explain|define|meaning\s*of|concept\s*of|how\s*does|how\s*do|tell\s*me\s*about|describe|difference|what\s*are)/i.test(msg)) return 'explain_concept';

  return 'general';
}

// ─── Rule-Based Fallback Generator ───────────────────────────────────
function generateFallbackResponse(message, profile, conversationHistory) {
  const intent = classifyIntent(message);
  const name = profile?.name || 'there';
  const role = profile?.targetRole || 'a tech career';
  const skills = profile?.skills?.map(s => s.skill) || [];
  const msg = message.toLowerCase();

  switch (intent) {
    case 'greeting':
      if (conversationHistory.length > 0) {
        return `Hey ${name}! Welcome back. What would you like to discuss? I can help with DSA, interview prep, resume tips, or career guidance for ${role}. 🚀`;
      }
      return `Hello ${name}! 👋 I'm your AI Placement Mentor. I'm here to help you prepare for ${role}.\n\nHere's what I can help you with:\n• 📚 **DSA & Problem Solving** — Topic-wise guidance & LeetCode strategies\n• 🎯 **Interview Preparation** — Technical, HR, Behavioral, System Design\n• 📝 **Resume & Portfolio** — ATS-friendly resume tips, project descriptions\n• 🏢 **Company-specific prep** — TCS, Infosys, Google, Amazon, and more\n• 🛤️ **Learning Roadmaps** — Frontend, Backend, Full-Stack, Data Science, DevOps\n• 💪 **Motivation & Study Plans** — Stay on track with structured plans\n\nWhat would you like to start with?`;

    case 'farewell':
      return `You're welcome, ${name}! Remember, consistent practice beats cramming. Keep building projects, solving problems, and you'll ace your placement! Good luck! 🌟\n\nFeel free to come back anytime you need help.`;

    case 'about_self':
      return `I'm your **AI Placement Mentor** — an intelligent assistant built right into Skill Bridge Pro! 🤖\n\n**What I can do:**\n• Answer questions about Data Structures & Algorithms\n• Guide you through interview preparation strategies\n• Help optimize your resume and portfolio\n• Provide company-specific hiring insights\n• Create personalized learning roadmaps\n• Keep you motivated and on track\n\nI'm aware of your profile — I know ${skills.length > 0 ? `you're skilled in ${skills.slice(0, 5).join(', ')}` : 'you\'re just getting started'} and targeting ${role}. This helps me give you personalized advice!\n\nJust ask me anything. I'm here to help you crack your dream placement! 🎯`;

    // ── DSA Topics ──
    case 'dsa_arrays': return KNOWLEDGE.dsa.arrays;
    case 'dsa_strings': return KNOWLEDGE.dsa.strings;
    case 'dsa_linkedlist': return KNOWLEDGE.dsa.linkedlist;
    case 'dsa_trees': return KNOWLEDGE.dsa.trees;
    case 'dsa_graphs': return KNOWLEDGE.dsa.graphs;
    case 'dsa_dp': return KNOWLEDGE.dsa.dp;
    case 'dsa_sorting': return KNOWLEDGE.dsa.sorting;
    case 'dsa_stacks': return KNOWLEDGE.dsa.stacks;
    case 'dsa_recursion': return KNOWLEDGE.dsa.recursion;
    case 'dsa_hashing': return KNOWLEDGE.dsa.hashing;
    case 'dsa_general':
      return `**DSA Preparation Guide for ${role}:**\n\nHere's the recommended order to study Data Structures & Algorithms:\n\n1. **Arrays & Strings** — Foundation, most frequently asked\n2. **Hashing** — Speeds up many solutions\n3. **Linked Lists** — Pointer manipulation\n4. **Stacks & Queues** — Essential patterns\n5. **Trees** — Binary trees, BST, traversals\n6. **Graphs** — BFS, DFS, shortest path\n7. **Dynamic Programming** — The final boss!\n\n${skills.includes('Python') ? 'Since you know Python, use it for DSA — its syntax is concise and interview-friendly.' : skills.includes('Java') ? 'Java is excellent for DSA with its rich standard library (Collections framework).' : 'Pick one language (Python or Java is recommended) and stick with it for ALL problems.'}\n\nAsk me about any specific topic for detailed guidance with problem lists! 📚`;

    // ── Interview ──
    case 'interview_behavioral': return KNOWLEDGE.interview.behavioral;
    case 'interview_technical': return KNOWLEDGE.interview.technical;
    case 'interview_system_design': return KNOWLEDGE.interview.system_design;
    case 'interview_hr': return KNOWLEDGE.interview.hr;
    case 'interview_aptitude': return KNOWLEDGE.interview.aptitude;
    case 'interview_general':
      return `**Interview Preparation Strategy for ${name}:**\n\n${role.includes('Full Stack') || role.includes('Frontend') || role.includes('Backend') ? '**For SDE roles, focus on:**\n1. DSA — 60% of the preparation\n2. Projects — Be ready to deep-dive into your projects\n3. System Design basics — Even for freshers\n4. CS Fundamentals — OS, DBMS, Networking, OOPs' : role.includes('Data') ? '**For Data roles, focus on:**\n1. SQL & Database concepts — Very heavily tested\n2. Statistics & Probability\n3. Python (Pandas, NumPy)\n4. Machine Learning algorithms\n5. Case studies & business problems' : '**General preparation:**\n1. DSA & Problem Solving\n2. Core CS subjects\n3. Projects & practical experience\n4. Communication skills'}\n\n**Timeline:** Start 3-4 months before placement season.\n\nWant me to dive deeper into any particular round? (Technical / HR / Behavioral / System Design)`;

    // ── Resume ──
    case 'resume': return KNOWLEDGE.resume.general;
    case 'resume_projects': return KNOWLEDGE.resume.projects;

    // ── Skills ──
    case 'skills_frontend': return KNOWLEDGE.skills.frontend;
    case 'skills_backend': return KNOWLEDGE.skills.backend;
    case 'skills_fullstack': return KNOWLEDGE.skills.fullstack;
    case 'skills_data': return KNOWLEDGE.skills.data;
    case 'skills_devops': return KNOWLEDGE.skills.devops;
    case 'skills_general':
      return `**Personalized Learning Advice for ${name}:**\n\n${skills.length > 0 ? `You already know: **${skills.join(', ')}** — that's a great foundation!` : 'Let\'s build your skill set from scratch!'}\n\n**For ${role}, I recommend focusing on:**\n${role.includes('Frontend') ? '• React.js → TypeScript → Next.js → Testing' : role.includes('Backend') ? '• Node.js/Python → Databases → REST APIs → Docker' : role.includes('Full Stack') ? '• React → Node.js → PostgreSQL → Docker → CI/CD' : role.includes('Data') ? '• Python → Pandas → SQL → Machine Learning → Statistics' : role.includes('DevOps') ? '• Linux → Docker → Kubernetes → AWS → Terraform' : '• Pick a specialization first! Frontend, Backend, Full-Stack, Data, or DevOps?'}\n\nWould you like a detailed week-by-week roadmap for any of these paths?`;

    // ── Companies ──
    case 'company_tcs': return KNOWLEDGE.companies.tcs;
    case 'company_infosys': return KNOWLEDGE.companies.infosys;
    case 'company_wipro': return KNOWLEDGE.companies.wipro;
    case 'company_google': return KNOWLEDGE.companies.google;
    case 'company_microsoft': return KNOWLEDGE.companies.microsoft;
    case 'company_amazon': return KNOWLEDGE.companies.amazon;
    case 'company_general':
      return `**Company Targeting Strategy:**\n\n**Tier 1 — Service Companies (Easier to crack):**\n• TCS, Infosys, Wipro, Cognizant, HCL\n• Focus: Aptitude + Basic Coding + Communication\n• Package: ₹3-7 LPA\n\n**Tier 2 — Product Companies (Moderate):**\n• Zoho, Freshworks, Atlassian, PayPal, Adobe\n• Focus: Strong DSA + Projects + System Design basics\n• Package: ₹8-18 LPA\n\n**Tier 3 — FAANG/Top Companies (Competitive):**\n• Google, Amazon, Microsoft, Meta, Apple\n• Focus: Advanced DSA + System Design + Leadership\n• Package: ₹15-60 LPA\n\n**My recommendation for ${name}:** ${skills.length >= 5 ? 'With your skill set, you can aim for Tier 2-3 companies. Focus on DSA and system design.' : 'Start by securing Tier 1 offers as backup, then prepare hard for Tier 2-3.'}\n\nAsk me about any specific company for detailed prep guidance!`;

    // ── Platforms ──
    case 'platform_leetcode': return KNOWLEDGE.platforms.leetcode;
    case 'platform_hackerrank': return KNOWLEDGE.platforms.hackerrank;
    case 'platform_codeforces': return KNOWLEDGE.platforms.codeforces;
    case 'platform_codechef':
      return `**CodeChef for Placements:**\n\n• Great platform for beginners with Division-based contests\n• **Target:** 3★ rating (1600+) shows good problem-solving skills\n• Practice Long challenges (thinking time) and Cook-offs (speed)\n• CodeChef has excellent editorials and community solutions\n\n**Getting started:**\n1. Start with Beginner section problems\n2. Participate in every monthly Long challenge\n3. Solve problems rated 0-999 difficulty first\n4. Move to 1000-1499ificulty`;

    // ── Career ──
    case 'career_salary': return KNOWLEDGE.career.salary;
    case 'career_linkedin': return KNOWLEDGE.career.linkedin;
    case 'career_portfolio': return KNOWLEDGE.career.portfolio;
    case 'career_fresher': return KNOWLEDGE.career.fresher;

    // ── Motivation ──
    case 'motivation':
      return `Hey ${name}, I hear you. The preparation journey can feel overwhelming, but here's the truth:\n\n**Every expert was once a beginner.** 🌱\n\n**Here's what I want you to remember:**\n\n1. **Progress isn't linear** — Some days you'll solve 5 problems, other days 0. That's normal.\n2. **Comparison is the thief of joy** — Don't compare your chapter 1 to someone's chapter 20.\n3. **Consistency > Intensity** — 1 hour daily for 90 days > 12-hour sessions for a week.\n4. **You don't have to be perfect** — Companies hire people who can learn and grow.\n5. **Take breaks** — Rest is part of the process. Burnout helps nobody.\n\n**Action plan when you feel stuck:**\n• Solve one EASY problem — just to get a win\n• Review a concept you already know well — rebuild confidence\n• Talk to a friend or mentor about how you're feeling\n• Take a walk, exercise, or do something creative\n\nYou're on the right platform, preparing with a plan. That already puts you ahead of most people. Keep going, ${name}! 💪🔥`;

    // ── Comparison ──
    case 'comparison': {
      if (/react.*vue|vue.*react/i.test(msg)) {
        return `**React vs Vue.js:**\n\n| Aspect | React | Vue.js |\n|--------|-------|--------|\n| Learning Curve | Moderate | Easier |\n| Ecosystem | Massive | Growing |\n| Job Market | Very high demand | Growing demand |\n| Performance | Excellent | Excellent |\n| Community | Huge (Meta-backed) | Strong (community-driven) |\n| Flexibility | More flexible | More opinionated |\n\n**Recommendation for ${name}:** For placements in India, **React** has significantly more job opportunities. Learn React first, then Vue becomes easy to pick up later.`;
      }
      if (/python.*java|java.*python/i.test(msg)) {
        return `**Python vs Java for Placements:**\n\n| Aspect | Python | Java |\n|--------|--------|------|\n| Syntax | Simple, concise | Verbose but structured |\n| DSA Speed | Slower execution | Faster execution |\n| Interview Use | Great for quick solutions | Great for OOP questions |\n| Job Market | Data Science, ML, Web | Enterprise, Android, Backend |\n| Companies | Google, Netflix, Startups | Amazon, Banks, Large enterprises |\n\n**For DSA:** Python is faster to write, Java is more common in interviews\n**For ${role}:** ${role.includes('Data') ? 'Python is the clear choice' : role.includes('Android') || role.includes('Mobile') ? 'Java/Kotlin is essential' : 'Either works — pick one and master it'}`;
      }
      if (/leetcode.*hackerrank|hackerrank.*leetcode/i.test(msg)) {
        return `**LeetCode vs HackerRank:**\n\n| Aspect | LeetCode | HackerRank |\n|--------|----------|------------|\n| Best for | Interview prep | Company assessments |\n| Problem Quality | Excellent | Good |\n| Company Tags | Yes (very useful) | No |\n| Certifications | No | Yes |\n| Discussion | Great community | Limited |\n| Contests | Weekly + Biweekly | Occasional |\n\n**Verdict:** Use **both**! LeetCode for interview DSA practice, HackerRank for certifications and because many Indian companies use it for hiring assessments.`;
      }
      return `That's a great comparison question! Could you be more specific about what two things you'd like me to compare? For example:\n• React vs Vue.js\n• Python vs Java\n• LeetCode vs HackerRank\n• Frontend vs Backend career\n• Service vs Product companies\n\nI'll give you a detailed breakdown with a comparison table! 📊`;
    }

    // ── Study Plan ──
    case 'study_plan':
      return `**Daily Study Plan for Placement Preparation:**\n\n**Morning (2 hours) — DSA:**\n• 30 min: Revise concepts/patterns\n• 90 min: Solve 2-3 LeetCode problems\n\n**Afternoon (2 hours) — Projects & Skills:**\n• Work on your portfolio project\n• Learn new frameworks/tools for ${role}\n\n**Evening (1 hour) — Theory:**\n• CS fundamentals (OS, DBMS, Networks, OOPs)\n• Or company-specific preparation\n\n**Night (30 min) — Soft Skills:**\n• Practice one behavioral question (use STAR method)\n• Read about a company you're targeting\n\n**Weekly targets:**\n• 15-20 coding problems\n• 1 project milestone\n• 2 mock interviews (with friends or Pramp)\n• 1 competitive programming contest\n\n**Rest day:** Take one full day off per week. Recovery is important!\n\nWant me to customize this schedule for your specific target role?`;

    // ── CS Fundamentals ──
    case 'cs_oop': return KNOWLEDGE.cs.oop;
    case 'cs_os': return KNOWLEDGE.cs.os;
    case 'cs_dbms': return KNOWLEDGE.cs.dbms;
    case 'cs_networking': return KNOWLEDGE.cs.networking;
    case 'cs_architecture': return KNOWLEDGE.cs.architecture;

    // ── Programming Languages ──
    case 'prog_python': return KNOWLEDGE.programming.python;
    case 'prog_java': return KNOWLEDGE.programming.java;
    case 'prog_javascript': return KNOWLEDGE.programming.javascript;
    case 'prog_cpp': return KNOWLEDGE.programming.cpp;
    case 'prog_sql': return KNOWLEDGE.programming.sql;
    case 'prog_git': return KNOWLEDGE.programming.git;

    // ── Web Development ──
    case 'webdev_http': return KNOWLEDGE.webdev.http;
    case 'webdev_auth': return KNOWLEDGE.webdev.auth;
    case 'webdev_security': return KNOWLEDGE.webdev.security;
    case 'webdev_testing': return KNOWLEDGE.webdev.testing;

    // ── General Study ──
    case 'study_complexity': return KNOWLEDGE.general_study.time_complexity;
    case 'study_design_patterns': return KNOWLEDGE.general_study.design_patterns;
    case 'study_agile': return KNOWLEDGE.general_study.agile;
    case 'study_open_source': return KNOWLEDGE.general_study.open_source;

    // ── Explain Any Concept (smart lookup) ──
    case 'explain_concept': {
      // Search through all knowledge sections for the best match
      const allTopics = { ...KNOWLEDGE.dsa, ...KNOWLEDGE.cs, ...KNOWLEDGE.programming, ...KNOWLEDGE.webdev, ...KNOWLEDGE.general_study, ...KNOWLEDGE.interview, ...KNOWLEDGE.resume, ...KNOWLEDGE.career, ...KNOWLEDGE.platforms };
      const words = msg.split(/\s+/).filter(w => w.length > 3);
      let bestMatch = null;
      let bestScore = 0;
      for (const [key, content] of Object.entries(allTopics)) {
        let score = 0;
        for (const word of words) {
          if (key.includes(word)) score += 3;
          if (typeof content === 'string' && content.toLowerCase().includes(word)) score += 1;
        }
        if (score > bestScore) { bestScore = score; bestMatch = content; }
      }
      if (bestMatch && bestScore >= 2) return bestMatch;
      return `Great question, ${name}! Here's what I can explain in detail:\n\n**CS Fundamentals:** OOP, Operating Systems, DBMS, Networking, Computer Architecture\n**Programming:** Python, Java, JavaScript, C++, SQL, Git\n**Web Development:** HTTP/REST APIs, Authentication (JWT/OAuth), Security (XSS/CSRF), Testing\n**DSA Topics:** Arrays, Trees, Graphs, DP, Sorting, Hashing, Stacks, Recursion\n**Career:** Interview prep, Resume tips, Company guides, Study plans\n\nJust ask me about any specific topic! For example:\n• "Explain OOP concepts"\n• "What is dynamic programming?"\n• "How does TCP work?"\n• "Tell me about normalization in DBMS"`;
    }

    // ── General / Fallback ──
    default: {
      // Try to extract useful context from the message
      const recentContext = conversationHistory.slice(-4);
      const hasRecentDSA = recentContext.some(m => /dsa|algorithm|data\s*structure|leetcode|problem/i.test(m.content));
      const hasRecentInterview = recentContext.some(m => /interview|placement|company|resume/i.test(m.content));

      if (hasRecentDSA) {
        return `Great question, ${name}! Based on our conversation about DSA, here's my advice:\n\nThe key to mastering any topic is the **pattern recognition approach:**\n1. Learn the concept/pattern\n2. Solve 5 easy problems using that pattern\n3. Solve 5 medium problems\n4. Try 2-3 hard problems\n5. Move to the next pattern\n\nCommon patterns: Two Pointers, Sliding Window, BFS/DFS, Binary Search, DP, Greedy, Backtracking\n\nWould you like me to explain any specific pattern or topic in more detail? I can also suggest specific LeetCode problems for practice!`;
      }

      if (hasRecentInterview) {
        return `${name}, regarding your interview preparation — here's what I'd emphasize:\n\n**The 3 pillars of cracking interviews:**\n1. **Technical Skills** — DSA + CS fundamentals + your tech stack\n2. **Communication** — Explaining your thought process clearly\n3. **Cultural Fit** — Showing enthusiasm, teamwork, and growth mindset\n\nMost candidates focus only on #1 and neglect #2 and #3. But interviewers evaluate ALL three!\n\n**Quick action items:**\n• Practice explaining your solutions out loud while coding\n• Prepare 5 STAR stories for behavioral rounds\n• Research each company thoroughly before the interview\n\nWhat specific aspect would you like help with?`;
      }

      // True general fallback — still helpful
      return `That's a great question, ${name}! Let me help you with that.\n\nBased on your profile${skills.length > 0 ? ` (skilled in ${skills.slice(0, 3).join(', ')})` : ''} and your target of ${role}, here are some things I can help you with right now:\n\n🔹 **\"How should I prepare for interviews?\"** — I'll give you a complete strategy\n🔹 **\"Tell me about arrays/DP/graphs\"** — Deep dive into any DSA topic\n🔹 **\"How to improve my resume?\"** — ATS-friendly resume tips\n🔹 **\"Tell me about TCS/Google/Amazon\"** — Company-specific prep guide\n🔹 **\"React vs Vue\"** or any tech comparison\n🔹 **\"I'm feeling stuck\"** — Motivation and study plans\n🔹 **\"Give me a study plan\"** — Structured daily schedule\n\nJust ask me anything specific and I'll give you detailed, actionable advice! 🚀`;
    }
  }
}

// ─── Response Generator ───────────────────────────────────────────────
async function generateResponse(message, profile, conversationHistory) {
  const name = profile?.name || 'there';
  const role = profile?.targetRole || 'a tech career';
  const skills = profile?.skills?.map(s => s.skill) || [];

  // 1. Try Gemini AI first if configured
  if (genAI) {
    const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-pro"];

    for (const modelName of modelsToTry) {
      try {
        console.log(`[AI Mentor] Attempting Gemini (${modelName}) for user: ${name}`);
        const model = genAI.getGenerativeModel({ model: modelName });

        const systemContext = `You are a professional AI Placement Mentor for "Skill Bridge Pro". 
        User Profile: Name: ${name}, Target Role: ${role}, Skills: ${skills.join(', ')}.
        Your goal is to provide expert career advice, DSA guidance, and interview tips. 
        Be encouraging, professional, and use markdown for formatting. 
        Keep responses concise but thorough.`;

        const history = conversationHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({
          history: history,
          generationConfig: { maxOutputTokens: 1000 },
        });

        const result = await chat.sendMessage(`${systemContext}\n\nUser Question: ${message}`);
        const response = await result.response;
        const text = response.text();

        if (text) {
          console.log(`[AI Mentor] Gemini (${modelName}) response successful.`);
          return text;
        }
      } catch (error) {
        console.error(`[AI Mentor] Gemini (${modelName}) error:`, error.message || error);
        // Continue to next model
      }
    }
    console.warn("[AI Mentor] All Gemini models failed, falling back to rule-based system.");
  } else {
    console.log("[AI Mentor] Gemini client not initialized (check GEMINI_API_KEY), using rule-based fallback.");
  }

  // 2. Fallback to rule-based system
  return generateFallbackResponse(message, profile, conversationHistory);
}

module.exports = { generateResponse, classifyIntent };
