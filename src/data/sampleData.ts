/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { University, Course, DegreeProgram } from '../types';

export const SAMPLE_UNIVERSITIES: University[] = [
  {
    id: 'univ_pacific_tech',
    name: 'Pacific Technological University',
    location: 'San Jose, CA (USA)',
    color: 'indigo',
  },
  {
    id: 'univ_metro_state',
    name: 'Metro State University',
    location: 'Minneapolis, MN (USA)',
    color: 'emerald',
  },
  {
    id: 'univ_unilag',
    name: 'University of Lagos (UNILAG)',
    location: 'Akoka, Lagos (Nigeria)',
    color: 'amber',
  },
  {
    id: 'univ_uibadan',
    name: 'University of Ibadan (UI)',
    location: 'Ibadan, Oyo State (Nigeria)',
    color: 'purple',
  },
];

export const SAMPLE_COURSES: Record<string, Course[]> = {
  univ_pacific_tech: [
    {
      id: 'pt_cs110',
      code: 'CS 110',
      title: 'Introduction to Computer Science & Python',
      credits: 4,
      department: 'Computer Science',
      description: 'Introductory course in computer science. Covers problem-solving, algorithms, and modular design. Emphasizes basic syntax, data structures (lists, dicts, tuples), loop mechanics, control flow, functions, testing, and standard software engineering practices using Python.',
      syllabusExcerpt: 'Topics covered: \n- Algorithmic Thinking & Flowcharts\n- Python Variables, Operators, Expressive Typing\n- Conditional Statements & Complex Switch Mechanics\n- Loops: For and While Loops with Break/Continue\n- List Comprehensions & Multi-dimensional Arrays\n- File I/O (Read/Write text & JSON formatting)\n- Introduction to Recursion & Sorting (Bubble, Selection)\n- Basic Object-Oriented Principles: Classes, Attributes, Methods',
    },
    {
      id: 'pt_cs220',
      code: 'CS 220',
      title: 'Data Structures and Complex Algorithms',
      credits: 4,
      department: 'Computer Science',
      description: 'Prerequisite of CS 110. Comprehensive focus on linear and non-linear data structures, asymptotic notation, and sorting of materials. Explores linked lists, stacks, queues, hash tables, binary search trees, and basic graph traversal techniques.',
      syllabusExcerpt: 'Topics covered: \n- Big O notation: Time & Space complexity analysis\n- Linked Lists: Singly, Doubly, and Circular structural design\n- Stacks & Queues: Array-based and pointer-based implementations\n- Hash tables: Hash functions, collision resolution (chaining, probing)\n- Trees: Binary Trees, Binary Search Trees (BST), AVL trees, balancing mechanisms\n- Heaps: Min/Max heaps and Heap Sort execution\n- Graphs: Adjacency list/matrix representation, Breadth-First (BFS) & Depth-First (DFS) search\n- Search/Sort: Quick Sort, Merge Sort, and Binary Search analysis',
    },
    {
      id: 'pt_math101',
      code: 'MATH 101',
      title: 'Calculus I: Limits and Derivatives',
      credits: 4,
      department: 'Mathematics',
      description: 'Foundations of single-variable calculus. Explores dynamic limits of functions, continuous properties, exact definitions of derivative equations, dynamic rates of change, differentiation rules, and local extrema optimization scenarios.',
      syllabusExcerpt: 'Topics covered: \n- Functions, graphs, and piecewise equations\n- Limits: Numerical, graphical, and dynamic limit laws\n- Continuity and the Intermediate Value Theorem\n- Definition of the Derivative: Instantaneous Rate of Change\n- Differentiation rules: Power, Product, Quotient, and Chain rule calculations\n- Implicit differentiation and related academic rates of change\n- L\'Hopital\'s Rule for indeterminate limits\n- Extrema optimization and Mean Value Theorem application',
    },
    {
      id: 'pt_eng150',
      code: 'ENG 150',
      title: 'Technical Academic Correspondence',
      credits: 3,
      department: 'English',
      description: 'Covers technical composition styles. Prepares students for resume writing, professional project reporting, scientific research summarization, and clear rhetorical formatting tailored to modern corporate technology teams.',
      syllabusExcerpt: 'Topics covered: \n- Rhetorical analysis and design of scientific reports\n- Professional resume, cover letter, and engineering portfolio creation\n- Technical manual draftsmanship and user instruction design\n- Researching, documenting, referencing, and citations (APA format)\n- Executive summary drafting and persuasive project proposals\n- Peer editing processes and academic peer-review mechanics',
    },
    {
      id: 'pt_cs340',
      code: 'CS 340',
      title: 'Modern Database & Information Systems',
      credits: 3,
      department: 'Computer Science',
      description: 'Study of relational database systems. Includes relational schema design, SQL scripting, Normal forms (1NF, 2NF, 3NF, BCNF), transaction handling, ACID characteristics, indexing, and overview of NoSQL environments like document databases.',
      syllabusExcerpt: 'Topics covered:\n- Relational Model: Relations, Attributes, Keys (Primary, Foreign, Candidate)\n- Entity-Relationship (ER) modeling and schema translation\n- Structured Query Language (SQL): DDL (CREATE, ALTER), DML (SELECT, JOINs, Subqueries, Aggregations)\n- Database Normalization: Dependency checking, functional dependency analysis up to Boyce-Codd Normal Form\n- Transaction Management: ACID properties, Concurrency Control (locking, deadlocks)\n- Database Tuning: Index structures (B-Trees) and Query Plan Analysis\n- Unstructured/NoSQL Overview: Key-Value, Document store (MongoDB), Graph store',
    }
  ],
  univ_metro_state: [
    {
      id: 'ms_csci141',
      code: 'CSCI 141',
      title: 'Introduction to Computer Programming with Java',
      credits: 4,
      department: 'Computer Science',
      description: 'Beginning course in modular application development. Integrates object-oriented thinking using the Java language. Direct instructions on variables, loop construction, helper methods, elementary list structures, encapsulation, and basic class designs.',
      syllabusExcerpt: 'Topics covered:\n- Structure of a Java Class: main method, import declarations\n- Primitive data types, numeric precision, and variables\n- Expressions, calculations, and local scope rules\n- Flow controls: if/else, nested conditionals, while loops, nested for loops\n- Methods: Parameters, return mechanics, and static qualifiers\n- Single-dimensional Arrays: creation, iteration, copying, and passing to methods\n- Object-Oriented Principles: Objects, class files, getters/setters, constructors, toString methods\n- Exception handling, try/catch blocks, and debugging protocols',
    },
    {
      id: 'ms_csci241',
      code: 'CSCI 241',
      title: 'Intermediate Data Structures',
      credits: 4,
      department: 'Computer Science',
      description: 'Comprehensive study of non-primitive data formats. Building abstract data structures, analysis of sorting routines, implementation of dynamic list references, trees, priority lists, hashing tables, and recursion paradigms.',
      syllabusExcerpt: 'Topics covered:\n- Algorithm Analysis: asymptotic growth rates, Big-O metrics\n- Abstract Data Types (ADTs) and Java interface design\n- Recursion: design, termination checking, call-stack visualization\n- Singly and Doubly Linked list structures\n- Stacks & Queues: FIFO, LIFO, circular array implementations\n- Hash Tables: Separate chaining and open addressing mechanisms\n- Trees: Binary Trees, Binary Search Tree structures, Tree Traversals (Inorder, Preorder, Postorder)\n- Priority Queues and Heap implementation',
    },
    {
      id: 'ms_math211',
      code: 'MATH 211',
      title: 'Mathematical Analysis & Calculus I',
      credits: 4,
      department: 'Mathematics',
      description: 'Single variable calculation principles. Deals with limits of functions, continuity rules, derivation processes, chain optimization policies, and introduction to integration of geometric surfaces (Riemann sums).',
      syllabusExcerpt: 'Topics covered:\n- Limits of algebraic, trigonometric, and logarithmic entities\n- Definition and application of continuous functions\n- The Derivative formula and tangent slope approximations\n- Differentiation rules: power, exponential, chain, implicit rules\n- Extremum theorems, concavity checking, curve sketching\n- Applied modeling: optimize area, volume, and cost scales\n- Integration: Riemann sums, introductory indefinite and definite integrals\n- Fundamental Theorem of Calculus (FTC)',
    },
    {
      id: 'ms_comm201',
      code: 'COMM 201',
      title: 'Communication in Technical Professions',
      credits: 3,
      department: 'Communication',
      description: 'Teaches professional information exchange across technical landscapes. Fosters practical portfolio writing, scientific manuals, audience-specific instruction kits, formal reporting, and collaboration techniques.',
      syllabusExcerpt: 'Topics covered:\n- Professional workplace communication and formatting standards\n- Designing technical descriptions, specifications, and project reports\n- Drafting action-oriented user guides and software quick-starts\n- Visual elements in tech layout: drawing, captioning, chart selection\n- Designing scientific project proposal decks and corporate emails\n- Oral correspondence: delivering clear, logical technical briefings',
    },
    {
      id: 'ms_csci351',
      code: 'CSCI 351',
      title: 'Relational Database Design',
      credits: 4,
      department: 'Computer Science',
      description: 'In-depth study of structural data systems. Designing relational schema configurations, crafting advanced SQL statements, understanding normalization paradigms (1NF through BCNF), and managing concurrent executions safely.',
      syllabusExcerpt: 'Topics covered:\n- Evolution of database systems and DBMS architecture\n- Relational modeling, relational databases, primary keys, and indices\n- Advanced SQL: complex JOIN conditions, aggregation, window functions, and nested views\n- Multi-table database normalization concepts: functional dependencies and BCNF\n- Transaction boundaries and concurrency: strict locks, MVCC, and dirty read preventions\n- Basic performance tuning: indexing strategies, indexing overheads, and index scans\n- Schema creation and migration lifecycle',
    }
  ],
  univ_unilag: [
    {
      id: 'unilag_csc111',
      code: 'CSC 111',
      title: 'Introduction to Computer & Web Technologies',
      credits: 3,
      department: 'Computer Science',
      description: 'Foundational overview of computer architectures, generations, and web-centric development frameworks. Students learn core HTML5/CSS3 styled layouts, basic computation constructs, variable scoping, and introductory algorithmic flowcharts.',
      syllabusExcerpt: 'Topics covered:\n- History, evolution, and classes of modern computer networks\n- HTML5 tag structuring, attribute validations, semantic layout blocks\n- CSS3 flexbox layouts, media query grid scaling, basic typography\n- Intro to logical flow: control branches, condition nesting, loops\n- Core computer operations, binary math conversions, and memory units',
    },
    {
      id: 'unilag_csc211',
      code: 'CSC 211',
      title: 'Object-Oriented Programming & Data Structures',
      credits: 3,
      department: 'Computer Science',
      description: 'Comprehensive analysis of programming paradigms utilizing structured class systems. Analyzes linear/non-linear data formats, linked list items, memory referencing, stack arrays, queue structures, and standard object design patterns using Java or C++.',
      syllabusExcerpt: 'Topics covered:\n- Object-Oriented principles: inheritance, polymorphism, abstract headers\n- Collection framework mechanics: vectors, list models, pointer iterations\n- Stack operations, push-pop validations, circular queues\n- BST trees, hashing addresses, and quick sort paradigms\n- Runtime evaluations: Big O notation standards with search loops',
    },
    {
      id: 'unilag_mat112',
      code: 'MAT 112',
      title: 'Calculus & Algebra for Sciences',
      credits: 4,
      department: 'Mathematics',
      description: 'Standard foundational mathematics. Integrates set theories, piecewise coordinates, explicit definition of functional limit structures, derivation rules, rates of changes, and basic calculus calculations.',
      syllabusExcerpt: 'Topics covered:\n- Set logic, Venn diagrams, complex numbers, quadratic formulas\n- Limits and derivatives from first principles\n- Tangent derivations, power rules, product/quotient calculus\n- Extrema optimization, concavity analysis, graphical sketching\n- Introduction to integration and indefinite integrals',
    },
    {
      id: 'unilag_gst111',
      code: 'GST 111',
      title: 'Communication in English & General Studies',
      credits: 2,
      department: 'General Studies',
      description: 'Compulsory Nigerian National Universities Commission (NUC) benchmark program. Direct guidelines on academic study habits, citation indexes (APA/MLA), sentence mechanics, technical correspondences, and public speaking formats for professional careers.',
      syllabusExcerpt: 'Topics covered:\n- Reading comprehension, vocabulary buildings, note-taking frameworks\n- Essay formats, thesis developments, technical correspondences\n- Scientific citation formats, academic integrity codes, reference listings\n- English syntax: parts of speech, tense agreements, active vs passive voices\n- Professional presentation delivery, rhetorical techniques',
    }
  ],
  univ_uibadan: [
    {
      id: 'ui_cs101',
      code: 'CS 101',
      title: 'Foundation of Informatics & Python',
      credits: 3,
      department: 'Computer Science',
      description: 'Beginning software development focusing on structured modular program patterns. Integrates Python logic structures. Hands-on training with primitive datatypes, list methods, loop algorithms, and mathematical plotting templates.',
      syllabusExcerpt: 'Topics covered:\n- Introduction to command terminals, script file compilations\n- Python basic properties: conditional flow, logical checks, string structures\n- Infinite and definite iteration mechanisms (while/for loops)\n- List arrays, dictionary maps, search metrics\n- Custom helper functions, parameters, local scope states',
    },
    {
      id: 'ui_cs201',
      code: 'CS 201',
      title: 'Structural Program Engineering & Algorithms',
      credits: 3,
      department: 'Computer Science',
      description: 'Prerequisite of CS 101. Solid grasp of complex non-primitive structural arrays. Explores linked structures, recursion trees, memory addresses, queue structures, bubble/merge sorting routines, and algorithm performance metrics.',
      syllabusExcerpt: 'Topics covered:\n- Algorithmic evaluation: Time/Space Big-O metrics\n- Singly/doubly linked sequences and list nodes\n- Stack mechanics, FIFO/LIFO, circular arrays\n- Hash tables: collision checks, hash functions\n- Tree structures, tree traversals, recursion models\n- Priority queues, heap sort mechanics',
    }
  ]
};

// Target graduation requirement programs (usually for destination university)
export const DEGRADUATION_PROGRAMS: Record<string, DegreeProgram[]> = {
  univ_pacific_tech: [
    {
      id: 'prog_pt_cs',
      name: 'B.S. in Computer Science',
      universityId: 'univ_pacific_tech',
      totalCreditsRequired: 120,
      courses: SAMPLE_COURSES.univ_pacific_tech,
      requirements: [
        {
          id: 'req_pt_cs_core',
          category: 'major_core',
          title: 'Computer Science Core',
          requiredCredits: 20,
          mappedCourses: ['CS 110', 'CS 220', 'CS 340'],
        },
        {
          id: 'req_pt_cs_el',
          category: 'major_elective',
          title: 'Computer Science Advanced Electives',
          requiredCredits: 12,
          mappedCourses: [],
        },
        {
          id: 'req_pt_gen_ed',
          category: 'general_education',
          title: 'General Education & Writing Requirements',
          requiredCredits: 30,
          mappedCourses: ['ENG 150', 'MATH 101'],
        },
        {
          id: 'req_pt_free_el',
          category: 'free_elective',
          title: 'Free Electives',
          requiredCredits: 58,
          mappedCourses: [],
        }
      ]
    }
  ],
  univ_metro_state: [
    {
      id: 'prog_ms_cs',
      name: 'Bachelor of Computer Science (B.C.S.)',
      universityId: 'univ_metro_state',
      totalCreditsRequired: 120,
      courses: SAMPLE_COURSES.univ_metro_state,
      requirements: [
        {
          id: 'req_ms_cs_core',
          category: 'major_core',
          title: 'CS Mainline Requirements',
          requiredCredits: 24,
          mappedCourses: ['CSCI 141', 'CSCI 241', 'CSCI 351'],
        },
        {
          id: 'req_ms_cs_el',
          category: 'major_elective',
          title: 'CS High-Level Electives',
          requiredCredits: 16,
          mappedCourses: [],
        },
        {
          id: 'req_ms_gen_ed',
          category: 'general_education',
          title: 'General Liberal Studies',
          requiredCredits: 32,
          mappedCourses: ['COMM 201', 'MATH 211'],
        },
        {
          id: 'req_ms_free_el',
          category: 'free_elective',
          title: 'General Free Electives',
          requiredCredits: 48,
          mappedCourses: [],
        }
      ]
    }
  ],
  univ_unilag: [
    {
      id: 'prog_unilag_cs',
      name: 'B.Sc. in Computer Science (Hons) [NUC Approved]',
      universityId: 'univ_unilag',
      totalCreditsRequired: 144,
      courses: SAMPLE_COURSES.univ_unilag || [],
      requirements: [
        {
          id: 'req_unilag_cs_core',
          category: 'major_core',
          title: 'NUC CS Core Modules (e.g. CSC 111, CSC 211)',
          requiredCredits: 40,
          mappedCourses: ['CSC 111', 'CSC 211'],
        },
        {
          id: 'req_unilag_cs_el',
          category: 'major_elective',
          title: 'CS Specialized Electives',
          requiredCredits: 24,
          mappedCourses: [],
        },
        {
          id: 'req_unilag_gen_ed',
          category: 'general_education',
          title: 'NUC GenEd Requirements & Mathematics (e.g. GST 111, MAT 112)',
          requiredCredits: 30,
          mappedCourses: ['GST 111', 'MAT 112'],
        },
        {
          id: 'req_unilag_free_el',
          category: 'free_elective',
          title: 'Optional Non-Departmental Units',
          requiredCredits: 50,
          mappedCourses: [],
        }
      ]
    }
  ],
  univ_uibadan: []
};
