const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Task = require('../models/Task');
const PlacementDrive = require('../models/PlacementDrive');
const Application = require('../models/Application');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edupulse';

const seedDatabase = async () => {
  try {
    console.log(`[Seed] Connecting to database at ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('[Seed] Database connected successfully.');

    // Clear old data
    await User.deleteMany();
    await Task.deleteMany();
    await PlacementDrive.deleteMany();
    await Application.deleteMany();
    console.log('[Seed] Cleared existing records.');

    // 1. Create Default Student User (Vishal Ellure)
    const studentUser = await User.create({
      name: 'Vishal Ellure',
      email: 'vishal797577@gmail.com',
      password: 'student123',
      usn: '1RV23CS001',
      role: 'student',
      branch: 'Computer Science & Engineering',
      semester: 3,
      cgpa: 9.28,
      phone: '+91 9380421476',
      college: 'RV College of Engineering (RVCE), Bengaluru',
      github: 'https://github.com/ellurecodes',
      linkedin: 'https://linkedin.com/in/vishal-ellure',
      skills: ['JavaScript (ES6+)', 'React 18', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Git', 'REST APIs'],
      bio: 'Pre-final year CSE student at RVCE Bengaluru. Passionate full-stack engineer building scalable web applications with MERN stack.',
    });
    console.log('[Seed] Created default student user: Vishal Ellure (vishal797577@gmail.com)');

    // 2. Create Default Admin/Coordinator User
    const adminUser = await User.create({
      name: 'Placement & Training Officer',
      email: 'placement@rvce.edu.in',
      password: 'admin123',
      usn: '1RV00AD001',
      role: 'admin',
      branch: 'Department of Placement & Training',
      semester: 8,
      cgpa: 10.0,
      phone: '+91 80 6717 8000',
      college: 'RV College of Engineering (RVCE), Bengaluru',
      github: 'https://github.com/rvce-placement',
      linkedin: 'https://linkedin.com/school/rv-college-of-engineering',
      skills: ['Campus Recruitment', 'Industry Relations', 'Talent Evaluation', 'Full Stack Mentorship'],
      bio: 'Official placement department portal manager coordinating on-campus and virtual hiring drives for engineering students.',
    });
    console.log('[Seed] Created default admin/coordinator user (placement@rvce.edu.in)');

    // 3. Create Sample Academic Tasks (Semester 3 Full Stack Development)
    const tasksData = [
      {
        user: studentUser._id,
        title: 'FSD Unit 1: Responsive Portfolio Website & GitHub Branching',
        category: 'Lab Experiment',
        priority: 'High',
        status: 'Completed',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        subject: 'Full Stack Development',
        notes: 'Create semantic HTML5 structure, CSS3 Flexbox/Grid responsive portfolio, and push with at least 3 Git commits.',
        completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        user: studentUser._id,
        title: 'FSD Unit 2: Interactive Task Manager with DOM & LocalStorage',
        category: 'Lab Experiment',
        priority: 'High',
        status: 'Completed',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        subject: 'Full Stack Development',
        notes: 'Implement task CRUD, filter by status, search query, regex validation, and LocalStorage JSON persistence.',
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        user: studentUser._id,
        title: 'FSD Unit 3: Build Node.js & Express REST API with Postman Testing',
        category: 'Lab Experiment',
        priority: 'High',
        status: 'In Progress',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        subject: 'Full Stack Development',
        notes: 'Create Express routes for GET, POST, PUT, DELETE. Test all endpoints via Postman and export collection.',
      },
      {
        user: studentUser._id,
        title: 'MongoDB Integration & Mongoose Schema Validation',
        category: 'Lab Experiment',
        priority: 'Medium',
        status: 'In Progress',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        subject: 'Full Stack Development',
        notes: 'Connect Node server to local MongoDB instance. Implement indexes, timestamps, and error-handling middleware.',
      },
      {
        user: studentUser._id,
        title: 'Full-Stack Capstone Project Viva & Skill Demonstration',
        category: 'Project Work',
        priority: 'High',
        status: 'Pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        subject: 'Full Stack Development',
        notes: 'Final capstone demonstration covering end-to-end user stories, database persistence, responsive UI, and GitHub pull requests.',
      },
      {
        user: studentUser._id,
        title: 'DSA: Implement Dijkstra Shortest Path & Prim MST Algorithm',
        category: 'Assignment',
        priority: 'Medium',
        status: 'Pending',
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        subject: 'Data Structures and Algorithms',
        notes: 'Prepare C++ implementation with adjacency list and priority queue min-heap.',
      },
      {
        user: studentUser._id,
        title: 'DBMS: SQL Normalization (1NF, 2NF, 3NF, BCNF) Case Studies',
        category: 'Exam Prep',
        priority: 'Low',
        status: 'Pending',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        subject: 'Database Management Systems',
        notes: 'Review dependency diagrams and lossless join decomposition proofs for CIE test.',
      },
    ];

    const insertedTasks = await Task.insertMany(tasksData);
    console.log(`[Seed] Seeded ${insertedTasks.length} academic tasks.`);

    // 4. Create Placement Drives
    const drivesData = [
      {
        companyName: 'Google',
        role: 'Software Development Engineer - Campus 2026',
        ctc: 34.0,
        minCgpa: 8.5,
        eligibleBranches: ['CSE', 'ISE', 'ECE', 'AI&ML'],
        jobType: 'Full Time',
        location: 'Bengaluru / Hyderabad',
        driveDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        selectionRounds: ['Online Coding Challenge', 'Technical Interview 1', 'Technical Interview 2', 'Googleyness & Leadership'],
        description: 'Join Google core engineering teams building scalable cloud infrastructure, AI models, and Android platforms.',
        status: 'Upcoming',
        createdBy: adminUser._id,
      },
      {
        companyName: 'Microsoft',
        role: 'Software Engineer (Azure & AI Cloud)',
        ctc: 28.5,
        minCgpa: 8.0,
        eligibleBranches: ['CSE', 'ISE', 'ECE'],
        jobType: 'Full Time',
        location: 'Bengaluru',
        driveDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        selectionRounds: ['Online Assessment', 'System Design Round', 'Coding & Problem Solving', 'Director Interview'],
        description: 'Opportunity to work on Microsoft Azure distributed microservices, Copilot integrations, and high-throughput systems.',
        status: 'Ongoing',
        createdBy: adminUser._id,
      },
      {
        companyName: 'Amazon',
        role: 'SDE Intern (Summer 2026)',
        ctc: 22.0,
        minCgpa: 7.5,
        eligibleBranches: ['CSE', 'ISE', 'ECE', 'ME', 'EEE'],
        jobType: 'Internship',
        location: 'Bengaluru / Chennai',
        driveDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        deadline: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        selectionRounds: ['Hackerrank OA', 'Work Style Simulation', 'Technical Deep Dive 1', 'Technical Deep Dive 2'],
        description: 'Fast-paced internship working directly with Amazon retail, AWS, and Prime Video engineering teams.',
        status: 'Upcoming',
        createdBy: adminUser._id,
      },
      {
        companyName: 'Cisco Systems',
        role: 'Network Software Engineer',
        ctc: 18.0,
        minCgpa: 7.0,
        eligibleBranches: ['CSE', 'ISE', 'ECE', 'ETE'],
        jobType: 'Full Time',
        location: 'Bengaluru',
        driveDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        selectionRounds: ['Aptitude & Coding OA', 'Technical Round', 'Managerial Round', 'HR'],
        description: 'Pioneering next-generation SDN, cloud networking protocols, and cybersecurity solutions.',
        status: 'Ongoing',
        createdBy: adminUser._id,
      },
      {
        companyName: 'Goldman Sachs',
        role: 'Engineering Analyst',
        ctc: 25.0,
        minCgpa: 8.0,
        eligibleBranches: ['CSE', 'ISE', 'ECE', 'EEE'],
        jobType: 'Full Time',
        location: 'Bengaluru',
        driveDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        deadline: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
        selectionRounds: ['Aptitude + CS Fundamentals OA', 'Technical Interview 1', 'Technical Interview 2', 'MD Round'],
        description: 'Build mission-critical quantitative trading algorithms, financial microservices, and enterprise risk systems.',
        status: 'Upcoming',
        createdBy: adminUser._id,
      },
      {
        companyName: 'Atlassian',
        role: 'Associate Software Engineer',
        ctc: 32.0,
        minCgpa: 8.0,
        eligibleBranches: ['CSE', 'ISE'],
        jobType: 'Full Time',
        location: 'Remote / Bengaluru',
        driveDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        deadline: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
        selectionRounds: ['OA', 'Values Interview', 'Coding Round', 'System Architecture'],
        description: 'Create the tools used by millions of software teams around the world: Jira, Confluence, Bitbucket.',
        status: 'Upcoming',
        createdBy: adminUser._id,
      },
    ];

    const insertedDrives = await PlacementDrive.insertMany(drivesData);
    console.log(`[Seed] Seeded ${insertedDrives.length} placement drives.`);

    // 5. Create Sample Applications for Student (Vishal Ellure)
    const applicationsData = [
      {
        student: studentUser._id,
        drive: insertedDrives[0]._id, // Google
        status: 'Applied',
        currentRound: 'Online Coding Challenge',
        notes: 'Submitted resume and portfolio link. Awaiting test slot invitation.',
      },
      {
        student: studentUser._id,
        drive: insertedDrives[1]._id, // Microsoft
        status: 'OA Cleared',
        currentRound: 'Technical Interview 1',
        interviewDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        notes: 'Scored 100% on OA (2 DSA problems solved). Interview scheduled for next Monday.',
      },
      {
        student: studentUser._id,
        drive: insertedDrives[3]._id, // Cisco
        status: 'Interview Scheduled',
        currentRound: 'Managerial Round',
        interviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        notes: 'Technical round cleared with positive feedback on networking and REST API concepts.',
      },
    ];

    const insertedApps = await Application.insertMany(applicationsData);
    console.log(`[Seed] Seeded ${insertedApps.length} student placement applications.`);

    console.log('[Seed] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error);
    process.exit(1);
  }
};

seedDatabase();
