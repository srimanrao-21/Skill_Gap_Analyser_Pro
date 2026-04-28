
export interface Module {
  id: string;
  skill: string;
  icon: string;
  color: string;
  description: string;
  tutorial: string;
  codeExample: string;
  youtubeId: string;
  resources: Array<{ name: string; url: string; type: string }>;
  assignments: string[];
  mcqs: Array<{ q: string; options: string[]; answer: number }>;
}

export const MODULES: Module[] = [
  {
    id: "html", skill: "HTML", icon: "🌐", color: "from-orange-400 to-red-500",
    description: "Learn HTML5 — the backbone of all web pages. Build semantic, accessible websites.",
    tutorial: `HTML (HyperText Markup Language) is the standard markup language for creating web pages.

Key concepts:
- Tags: <h1>, <p>, <div>, <span>
- Attributes: id, class, href, src
- Semantic HTML5: <header>, <nav>, <main>, <section>, <footer>
- Forms: <form>, <input>, <button>, <select>
- Media: <img>, <video>, <audio>`,
    codeExample: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My First Page</title>
  </head>
  <body>
    <header>
      <h1>Welcome to My Website</h1>
      <nav>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
    <main>
      <section id="about">
        <h2>About Me</h2>
        <p>I am learning web development!</p>
      </section>
    </main>
    <footer>
      <p>&copy; 2024 My Website</p>
    </footer>
  </body>
</html>`,
    youtubeId: "pQN-pnXPaVg",
    resources: [
      { name: "MDN HTML Docs", url: "https://developer.mozilla.org/en-US/docs/Web/HTML", type: "docs" },
      { name: "W3Schools HTML", url: "https://www.w3schools.com/html/", type: "tutorial" },
    ],
    assignments: ["Build a personal portfolio webpage", "Create a multi-page website with navigation", "Build a contact form with validation"],
    mcqs: [
      { q: "What does HTML stand for?", options: ["HyperText Markup Language", "HighText Machine Language", "HyperText Machine Language", "None"], answer: 0 },
      { q: "Which tag creates a hyperlink?", options: ["<link>", "<href>", "<a>", "<url>"], answer: 2 },
      { q: "Which HTML element defines the title of a document?", options: ["<head>", "<title>", "<meta>", "<header>"], answer: 1 },
      { q: "Which HTML attribute specifies an alternate text for an image?", options: ["title", "src", "alt", "href"], answer: 2 },
      { q: "Which is the correct HTML element for the largest heading?", options: ["<h6>", "<head>", "<heading>", "<h1>"], answer: 3 },
    ],
  },
  {
    id: "css", skill: "CSS", icon: "🎨", color: "from-blue-400 to-cyan-500",
    description: "Master CSS3 — style web pages with animations, Flexbox, Grid, and modern design.",
    tutorial: `CSS (Cascading Style Sheets) controls the visual presentation of HTML.

Key concepts:
- Selectors: element, class (.class), id (#id), pseudo-classes
- Box model: margin, border, padding, content
- Flexbox: display:flex, justify-content, align-items
- Grid: display:grid, grid-template-columns
- Animations & transitions
- Media queries for responsive design`,
    codeExample: `/* Flexbox layout */
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

/* Card with hover effect */
.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 40px rgba(0,0,0,0.15);
}

/* CSS Grid */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}`,
    youtubeId: "OXGznpKZ_sA",
    resources: [
      { name: "MDN CSS Docs", url: "https://developer.mozilla.org/en-US/docs/Web/CSS", type: "docs" },
      { name: "CSS Tricks", url: "https://css-tricks.com/", type: "tutorial" },
    ],
    assignments: ["Style a portfolio with Flexbox", "Create a responsive grid layout", "Build animated navigation menu"],
    mcqs: [
      { q: "Which CSS property controls text size?", options: ["font-weight", "text-size", "font-size", "text-style"], answer: 2 },
      { q: "How do you center a div with Flexbox?", options: ["align: center", "text-align: center", "justify-content: center + align-items: center", "margin: auto"], answer: 2 },
      { q: "What does 'z-index' control?", options: ["Size", "Color", "Stacking order", "Opacity"], answer: 2 },
      { q: "Which unit is relative to viewport width?", options: ["px", "em", "rem", "vw"], answer: 3 },
      { q: "Which property creates a CSS transition?", options: ["animation", "transform", "transition", "keyframes"], answer: 2 },
    ],
  },
  {
    id: "javascript", skill: "JavaScript", icon: "⚡", color: "from-yellow-400 to-orange-500",
    description: "Learn JavaScript — the language of the web. DOM, async, ES6+ features.",
    tutorial: `JavaScript is the programming language of the web — it makes pages interactive.

Key concepts:
- Variables: let, const, var
- Functions: regular, arrow functions, closures
- Arrays & Objects
- DOM manipulation: getElementById, querySelector, events
- Async programming: Promises, async/await, fetch API
- ES6+: destructuring, spread, template literals, modules`,
    codeExample: `// Modern JavaScript (ES6+)
const fetchUsers = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// DOM Manipulation
const button = document.querySelector('#btn');
button.addEventListener('click', async () => {
  const users = await fetchUsers('/api/users');
  users.forEach(user => {
    const card = document.createElement('div');
    card.className = 'user-card';
    card.innerHTML = \`<h3>\${user.name}</h3><p>\${user.email}</p>\`;
    document.body.appendChild(card);
  });
});

// Destructuring & Spread
const { name, age, ...rest } = userObject;
const newArray = [...arr1, ...arr2];`,
    youtubeId: "W6NZfCO5SIk",
    resources: [
      { name: "MDN JavaScript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", type: "docs" },
      { name: "JavaScript.info", url: "https://javascript.info/", type: "tutorial" },
    ],
    assignments: ["Build a form validator", "Create a todo list app", "Fetch & display data from an API"],
    mcqs: [
      { q: "Which keyword declares a block-scoped variable?", options: ["var", "let", "function", "type"], answer: 1 },
      { q: "What does 'typeof null' return?", options: ["null", "undefined", "object", "number"], answer: 2 },
      { q: "Which method adds an element to the end of an array?", options: ["push()", "pop()", "shift()", "unshift()"], answer: 0 },
      { q: "What is a Promise?", options: ["A loop", "An async operation result", "A variable type", "A CSS rule"], answer: 1 },
      { q: "What does '===' compare?", options: ["Only value", "Only type", "Value AND type", "Reference"], answer: 2 },
    ],
  },
  {
    id: "react", skill: "React", icon: "⚛️", color: "from-cyan-400 to-blue-500",
    description: "Build modern UIs with React — components, hooks, state management.",
    tutorial: `React is a JavaScript library for building user interfaces.

Key concepts:
- Components: functional components
- JSX: JavaScript + XML syntax
- Props & State
- Hooks: useState, useEffect, useContext, useRef
- Event handling
- Conditional rendering
- Lists & Keys
- React Router for navigation`,
    codeExample: `import { useState, useEffect } from 'react';

// Custom Hook
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Todo App Component
function TodoApp() {
  const [todos, setTodos] = useLocalStorage('todos', []);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input, done: false }]);
    setInput('');
  };

  return (
    <div className="app">
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      {todos.map(todo => (
        <div key={todo.id}>{todo.text}</div>
      ))}
    </div>
  );
}`,
    youtubeId: "bMknfKXIFA8",
    resources: [
      { name: "React Official Docs", url: "https://react.dev", type: "docs" },
      { name: "React Tutorial", url: "https://react.dev/learn", type: "tutorial" },
    ],
    assignments: ["Build a Todo App with hooks", "Create a weather app using API", "Build a multi-page app with React Router"],
    mcqs: [
      { q: "What hook is used for side effects?", options: ["useState", "useRef", "useEffect", "useMemo"], answer: 2 },
      { q: "What is JSX?", options: ["A CSS framework", "JavaScript XML", "A database", "A server"], answer: 1 },
      { q: "How do you pass data to a child component?", options: ["state", "props", "context", "refs"], answer: 1 },
      { q: "Which hook manages local state?", options: ["useEffect", "useContext", "useState", "useReducer"], answer: 2 },
      { q: "What does the 'key' prop do in lists?", options: ["Style elements", "Help React identify changes", "Set focus", "Store data"], answer: 1 },
    ],
  },
  {
    id: "python", skill: "Python", icon: "🐍", color: "from-yellow-400 to-blue-500",
    description: "Learn Python — the versatile language for Backend, Data Science, and Automation.",
    tutorial: `Python is a high-level, interpreted programming language known for its readability.

Key concepts:
- Variables & Data Types: strings, ints, floats, lists, dicts
- Control Flow: if/else, for loops, while loops
- Functions & Modules: def keyword, import
- File I/O: open(), read(), write()
- Object-Oriented Programming: classes, self, inheritance
- Standard Library: os, sys, datetime, json`,
    codeExample: `def greet(name):
    return f"Hello, {name}!"

# List comprehension
numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers]

# Simple Class
class Developer:
    def __init__(self, name, skills):
        self.name = name
        self.skills = skills
    
    def add_skill(self, skill):
        self.skills.append(skill)

dev = Developer("John", ["Python", "SQL"])
print(greet(dev.name))`,
    youtubeId: "rfscVS0vtbw",
    resources: [
      { name: "Python.org Docs", url: "https://docs.python.org/3/", type: "docs" },
      { name: "Real Python", url: "https://realpython.com/", type: "tutorial" },
    ],
    assignments: ["Build a basic calculator", "Create a script to organize files", "Develop a simple web scraper"],
    mcqs: [
      { q: "Which keyword is used to define a function?", options: ["function", "def", "method", "class"], answer: 1 },
      { q: "Which data type is immutable?", options: ["List", "Dictionary", "Tuple", "Set"], answer: 2 },
      { q: "How do you start a for loop in Python?", options: ["for x in y:", "for(x=0; x<y; x++)", "foreach(x in y)", "while x in y"], answer: 0 },
      { q: "Which method adds an item to a list?", options: ["add()", "insert()", "append()", "extend()"], answer: 2 },
      { q: "What does pip stand for?", options: ["Python Install Package", "Preferred Installer Program", "Python Input Program", "None"], answer: 1 },
    ],
  },
  {
    id: "sql", skill: "SQL", icon: "📊", color: "from-blue-500 to-indigo-600",
    description: "Master SQL — query and manage relational databases like PostgreSQL and MySQL.",
    tutorial: `SQL (Structured Query Language) is used to communicate with relational databases.

Key concepts:
- SELECT: retrieving data
- WHERE: filtering records
- JOINs: Inner, Left, Right, Full
- Group By & Aggregations: COUNT, SUM, AVG
- INSERT, UPDATE, DELETE
- Create Table & Constraints`,
    codeExample: `-- Get high performing employees
SELECT 
    e.name, 
    d.department_name, 
    e.salary
FROM employees e
JOIN departments d ON e.dept_id = d.id
WHERE e.performance_rating > 4
ORDER BY e.salary DESC;

-- Update record
UPDATE users 
SET last_login = CURRENT_TIMESTAMP 
WHERE id = 123;`,
    youtubeId: "HXV3zeQKqGY",
    resources: [
      { name: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/", type: "tutorial" },
      { name: "SQLBolt", url: "https://sqlbolt.com/", type: "tutorial" },
    ],
    assignments: ["Write a complex JOIN query", "Design a database schema for a store", "Create views and stored procedures"],
    mcqs: [
      { q: "What does SQL stand for?", options: ["System Query Language", "Structured Query Language", "Simple Query List", "None"], answer: 1 },
      { q: "Which clause is used to filter results?", options: ["WHERE", "GROUP BY", "ORDER BY", "HAVING"], answer: 0 },
      { q: "Which JOIN returns all records from the left table?", options: ["INNER JOIN", "RIGHT JOIN", "LEFT JOIN", "FULL JOIN"], answer: 2 },
      { q: "How do you select all columns from a table?", options: ["SELECT all", "SELECT *", "GET *", "FETCH all"], answer: 1 },
      { q: "Which statement is used to add data?", options: ["ADD", "UPDATE", "INSERT", "CREATE"], answer: 2 },
    ],
  },
  {
    id: "docker", skill: "Docker", icon: "🐳", color: "from-blue-400 to-blue-700",
    description: "Learn Containerization with Docker — build, ship, and run any app anywhere.",
    tutorial: `Docker is a platform for developing, shipping, and running applications in containers.

Key concepts:
- Containers vs Virtual Machines
- Images & Dockerfiles
- Docker Hub
- Volumes for persistence
- Networking in Docker
- Docker Compose for multi-container apps`,
    codeExample: `# Dockerfile for a Node.js app
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]

# docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    ports: ["3000:3000"]
    depends_on: [db]
  db:
    image: postgres:15-alpine`,
    youtubeId: "pg19Z840I4c",
    resources: [
      { name: "Docker Official Docs", url: "https://docs.docker.com/", type: "docs" },
      { name: "Docker Curriculum", url: "https://docker-curriculum.com/", type: "tutorial" },
    ],
    assignments: ["Containerize a simple web app", "Create a Docker Compose setup", "Push an image to Docker Hub"],
    mcqs: [
      { q: "What is a Docker image?", options: ["A running container", "A template for containers", "A cloud server", "A piece of code"], answer: 1 },
      { q: "Which command builds an image from a Dockerfile?", options: ["docker run", "docker create", "docker build", "docker push"], answer: 2 },
      { q: "What does 'EXPOSE' do in a Dockerfile?", options: ["Starts the app", "Opens a port", "Copies files", "Installs deps"], answer: 1 },
      { q: "What is Docker Compose for?", options: ["Editing code", "Running multi-container apps", "Monitoring logs", "Security"], answer: 1 },
      { q: "Which command stops a container?", options: ["docker delete", "docker pause", "docker stop", "docker remove"], answer: 2 },
    ],
  },
  {
    id: "git", skill: "Git", icon: "🔀", color: "from-orange-500 to-red-600",
    description: "Master Version Control with Git — branches, commits, merges, and collaboration.",
    tutorial: `Git is a distributed version control system for tracking changes in source code.

Key concepts:
- Repositories: Local & Remote
- Commits & History
- Branching & Merging
- Pull Requests & Code Reviews
- Stashing & Reverting
- Resolving Merge Conflicts`,
    codeExample: `# Common Git workflow
git checkout -b feature/new-logic
git add .
git commit -m "feat: implement new logic"
git push origin feature/new-logic

# Rebase feature branch
git checkout main
git pull origin main
git checkout feature/new-logic
git rebase main`,
    youtubeId: "RGOj5yH7evk",
    resources: [
      { name: "Git Documentation", url: "https://git-scm.com/doc", type: "docs" },
      { name: "GitHub Skills", url: "https://skills.github.com/", type: "tutorial" },
    ],
    assignments: ["Initialize a repo & push to GitHub", "Resolve a merge conflict", "Practice interactive rebasing"],
    mcqs: [
      { q: "Which command saves changes locally?", options: ["git push", "git save", "git commit", "git add"], answer: 2 },
      { q: "How do you create a new branch?", options: ["git branch new", "git checkout -b new", "git new-branch", "Both A & B"], answer: 3 },
      { q: "What does 'git pull' do?", options: ["Sends local data", "Fetches & merges remote data", "Deletes a branch", "Shows status"], answer: 1 },
      { q: "Which command lists commit history?", options: ["git show", "git list", "git log", "git status"], answer: 2 },
      { q: "What is a 'HEAD' in Git?", options: ["The first commit", "A special branch", "Last commit in current branch", "None"], answer: 2 },
    ],
  },
  {
    id: "rest-api", skill: "REST APIs", icon: "🔌", color: "from-indigo-400 to-blue-600",
    description: "Learn to design and consume RESTful APIs — the standard for modern web communication.",
    tutorial: `REST (Representational State Transfer) is an architectural style for network applications.

Key concepts:
- HTTP Methods: GET, POST, PUT, DELETE, PATCH
- Status Codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error)
- Resource-based URLs
- JSON for data exchange
- Statelessness
- Authentication: Headers, API Keys, Bearer Tokens`,
    codeExample: `// Fetching data from a REST API
const getProducts = async () => {
  const res = await fetch('https://api.example.com/v1/products', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json'
    }
  });
  
  if (!res.ok) throw new Error('API request failed');
  return await res.json();
};

// Creating a resource
const createProduct = async (data) => {
  const res = await fetch('/api/products', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return await res.json();
};`,
    youtubeId: "lsMQRaeKNDk",
    resources: [
      { name: "RESTful API Tutorial", url: "https://restfulapi.net/", type: "tutorial" },
      { name: "MDN Fetch API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API", type: "docs" },
    ],
    assignments: ["Design API endpoints for a blog", "Perform CRUD operations with Fetch API", "Add error handling to API calls"],
    mcqs: [
      { q: "Which HTTP method is used to retrieve data?", options: ["POST", "PUT", "GET", "DELETE"], answer: 2 },
      { q: "What does status code 404 mean?", options: ["Success", "Forbidden", "Not Found", "Created"], answer: 2 },
      { q: "Which header is used for JSON data?", options: ["Accept", "Content-Type", "Host", "Cookie"], answer: 1 },
      { q: "Is REST stateful or stateless?", options: ["Stateful", "Stateless", "Both", "None"], answer: 1 },
      { q: "What does 'IDEMPOTENT' mean in REST?", options: ["Always returns error", "Same result for multiple calls", "Slows down server", "Increases security"], answer: 1 },
    ],
  },
  {
    id: "typescript", skill: "TypeScript", icon: "🔷", color: "from-blue-500 to-blue-800",
    description: "Master TypeScript — bring type safety and better developer experience to JavaScript.",
    tutorial: `TypeScript is a strongly typed superset of JavaScript that compiles to plain JavaScript.

Key concepts:
- Basic Types: string, number, boolean, any, void
- Interfaces & Types
- Optional & Readonly properties
- Union & Intersection types
- Generics
- Enums
- Type assertions`,
    codeExample: `interface User {
  id: number;
  name: string;
  email: string;
  role?: 'admin' | 'user';
}

function processUser<T extends User>(user: T): string {
  return \`Processing \${user.name} (\${user.id})\`;
}

const newUser: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

console.log(processUser(newUser));`,
    youtubeId: "gieEQFIfg7w",
    resources: [
      { name: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html", type: "docs" },
      { name: "Total TypeScript", url: "https://www.totaltypescript.com/", type: "tutorial" },
    ],
    assignments: ["Migrate a JS file to TS", "Define complex interfaces for products", "Use Generics in a helper function"],
    mcqs: [
      { q: "What is TypeScript?", options: ["A browser", "A superset of JS", "A database", "A CSS framework"], answer: 1 },
      { q: "How do you define an optional property?", options: ["prop!", "prop?", "prop*", "prop_opt"], answer: 1 },
      { q: "Which type allows ANY value?", options: ["string", "unknown", "any", "void"], answer: 2 },
      { q: "What command compiles TS to JS?", options: ["tsc", "ts-compile", "node", "npm start"], answer: 0 },
      { q: "Can interfaces be extended?", options: ["No", "Yes", "Only in JS", "Only with classes"], answer: 1 },
    ],
  },
  {
    id: "flutter", skill: "Flutter", icon: "💙", color: "from-blue-400 to-cyan-600",
    description: "Build cross-platform mobile apps with Flutter and Dart.",
    tutorial: `Flutter is Google's UI toolkit for building natively compiled applications.

Key concepts:
- Widgets: Everything is a widget!
- State Management: Provider, Bloc, Riverpod
- Dart language basics
- Hot Reload & Hot Restart
- Navigator and Routing`,
    codeExample: `import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Hello Flutter')),
        body: Center(child: Text('Building for Mobile')),
      ),
    );
  }
}`,
    youtubeId: "vBOnY3_AWC4",
    resources: [
      { name: "Flutter Docs", url: "https://docs.flutter.dev/", type: "docs" },
      { name: "Dart Tour", url: "https://dart.dev/guides/language/language-tour", type: "tutorial" },
    ],
    assignments: ["Create a simple counter app", "Build a multi-screen layout", "Integrate a public API"],
    mcqs: [
      { q: "What language is Flutter based on?", options: ["Kotlin", "Swift", "Dart", "JavaScript"], answer: 2 },
      { q: "What is a 'StatelessWidget'?", options: ["A widget that never changes", "A widget that has state", "A database connector", "A CSS style"], answer: 0 },
      { q: "Which command runs the app?", options: ["flutter start", "flutter run", "flutter build", "flutter go"], answer: 1 },
    ],
  },
  {
    id: "tensorflow", skill: "TensorFlow", icon: "🧠", color: "from-orange-500 to-yellow-600",
    description: "Learn Machine Learning and Deep Learning with TensorFlow.",
    tutorial: `TensorFlow is an open-source library for machine learning.

Key concepts:
- Tensors & Operations
- Neural Network Layers
- Compiling & Training Models
- Keras API
- Data Preprocessing with tf.data`,
    codeExample: `import tensorflow as tf
from tensorflow import keras

# Simple linear model
model = keras.Sequential([
    keras.layers.Dense(units=1, input_shape=[1])
])

model.compile(optimizer='sgd', loss='mean_squared_error')

xs = [1, 2, 3, 4]
ys = [2, 4, 6, 8]

model.fit(xs, ys, epochs=500)`,
    youtubeId: "tpCFfeUEGs8",
    resources: [
      { name: "TensorFlow Guide", url: "https://www.tensorflow.org/guide", type: "docs" },
      { name: "Keras Docs", url: "https://keras.io/", type: "docs" },
    ],
    assignments: ["Build a regression model", "Classify images from MNIST", "Save and export a model"],
    mcqs: [
      { q: "What is a Tensor?", options: ["A type of neuron", "A multi-dimensional array", "A training loop", "A loss function"], answer: 1 },
      { q: "Which API is most used in TensorFlow?", options: ["Keras", "Flask", "React", "Pandas"], answer: 0 },
      { q: "What does 'fit' do?", options: ["Compiles the model", "Trains the model", "Evaluates the model", "Predicts values"], answer: 1 },
    ],
  },
  {
    id: "hacking", skill: "Ethical Hacking", icon: "🛡️", color: "from-gray-700 to-black",
    description: "Learn the fundamentals of cybersecurity and ethical hacking.",
    tutorial: `Ethical Hacking involves identifying and fixing security vulnerabilities.

Key concepts:
- Footprinting & Reconnaissance
- Scanning Networks
- System Hacking
- Web Application Security (OWASP Top 10)
- SQL Injection & XSS`,
    codeExample: `# Simple Nmap scan command
nmap -sV -p- 192.168.1.1

# Example of a secure password check in Python
import bcrypt
password = b"super_secret"
hashed = bcrypt.hashpw(password, bcrypt.gensalt())`,
    youtubeId: "2TIDm_V_f8g",
    resources: [
      { name: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/", type: "docs" },
      { name: "TryHackMe", url: "https://tryhackme.com/", type: "tutorial" },
    ],
    assignments: ["Perform a network scan", "Identify common XSS vulnerabilities", "Set up a secure firewall"],
    mcqs: [
      { q: "What is a 'White Hat' hacker?", options: ["A criminal", "An ethical security professional", "A government spy", "A script kiddie"], answer: 1 },
      { q: "Which tool is used for network scanning?", options: ["Nmap", "Figma", "Docker", "Pandas"], answer: 0 },
      { q: "What does 'SQLi' stand for?", options: ["SQL Interaction", "SQL Injection", "SQL Integration", "SQL Inspection"], answer: 1 },
    ],
  },
  {
    id: "figma", skill: "Figma", icon: "🎨", color: "from-purple-500 to-pink-500",
    description: "Design stunning user interfaces and prototypes with Figma.",
    tutorial: `Figma is a collaborative web-based design tool.

Key concepts:
- Frames & Layers
- Components & Variants
- Auto Layout
- Prototyping Interactions
- Design Systems`,
    codeExample: `/* No code required for Figma, but you can export CSS! */
.button {
  background: #6366F1;
  border-radius: 8px;
  padding: 12px 24px;
  color: white;
  font-weight: 600;
}`,
    youtubeId: "jk1T0CdLxwU",
    resources: [
      { name: "Figma Help Center", url: "https://help.figma.com/", type: "docs" },
      { name: "Figmademy", url: "https://www.figmademy.com/", type: "tutorial" },
    ],
    assignments: ["Design a login screen", "Create a clickable prototype", "Build a small design system"],
    mcqs: [
      { q: "What is Auto Layout?", options: ["Automatic code generation", "A way to create dynamic resizing UI", "A 3D modeling tool", "A cloud storage feature"], answer: 1 },
      { q: "What is a component?", options: ["A reusable design element", "A software library", "A server endpoint", "A testing tool"], answer: 0 },
      { q: "How do you share designs?", options: ["Email files", "Send a link", "Print them", "None"], answer: 1 },
    ],
  },
  {
    id: "linux", skill: "Linux", icon: "🐧", color: "from-gray-600 to-gray-900",
    description: "Master the Linux command line and system administration.",
    tutorial: `Linux is an open-source operating system used widely in servers.

Key concepts:
- File System Hierarchy
- Basic Commands: ls, cd, mkdir, rm
- Permissions: chmod, chown
- Package Management: apt, yum
- Shell Scripting`,
    codeExample: `#!/bin/bash
# A simple backup script
SOURCE="/var/www/html"
DEST="/backups"
DATE=$(date +%Y-%m-%d)

tar -czf $DEST/backup-$DATE.tar.gz $SOURCE
echo "Backup completed!"`,
    youtubeId: "wBp0Rb-ZJak",
    resources: [
      { name: "Linux Journey", url: "https://linuxjourney.com/", type: "tutorial" },
      { name: "Arch Wiki", url: "https://wiki.archlinux.org/", type: "docs" },
    ],
    assignments: ["Set up a local server", "Write a process monitor script", "Manage user groups"],
    mcqs: [
      { q: "Which command shows the current directory?", options: ["dir", "pwd", "ls", "where"], answer: 1 },
      { q: "How do you change file permissions?", options: ["perm", "chmod", "change", "set-acl"], answer: 1 },
      { q: "What is 'root'?", options: ["A folder", "The superuser", "A programming language", "A brand of PC"], answer: 1 },
    ],
  },
  {
    id: "selenium", skill: "Selenium", icon: "🧪", color: "from-green-600 to-green-800",
    description: "Automate web browsers for testing and scraping with Selenium.",
    tutorial: `Selenium is a powerful tool for automating web applications.

Key concepts:
- WebDriver
- Locators: CSS, XPath, ID
- Wait Strategies: Explicit vs Implicit
- Page Object Model (POM)
- Action Chains`,
    codeExample: `from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("https://google.com")

search_box = driver.find_element(By.NAME, "q")
search_box.send_keys("Selenium automation")
search_box.submit()`,
    youtubeId: "Xjv1sY630uc",
    resources: [
      { name: "Selenium Docs", url: "https://www.selenium.dev/documentation/", type: "docs" },
      { name: "TestAutomationU", url: "https://testautomationu.applitools.com/", type: "tutorial" },
    ],
    assignments: ["Automate a login flow", "Extract data from a table", "Implement a simple POM structure"],
    mcqs: [
      { q: "Which command starts the browser in Selenium?", options: ["start()", "get()", "open()", "driver = webdriver.Chrome()"], answer: 3 },
      { q: "What is XPath?", options: ["A styling language", "A syntax for navigating XML/HTML", "A database query", "A cloud provider"], answer: 1 },
      { q: "What is a 'locator'?", options: ["A GPS tool", "A way to find elements on a page", "A testing framework", "A browser type"], answer: 1 },
    ],
  },
];
