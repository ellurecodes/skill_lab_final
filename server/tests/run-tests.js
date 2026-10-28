/**
 * EduPulse Automated API Integration Test Suite
 * Tests all endpoints: Health, Auth, Tasks, Placements, Stats, Error Handling.
 */

const http = require('http');
const net = require('net');

const BASE_URL = 'http://127.0.0.1:5000';

function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(800);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      resolve(false);
    });
    socket.connect(port, '127.0.0.1');
  });
}

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

async function runTestSuite() {
  console.log('\n========================================');
  console.log('   EduPulse Automated API Test Suite   ');
  console.log('========================================\n');

  let serverInstance = null;
  const running = await isPortOpen(5000);
  if (!running) {
    console.log('[Test Setup] Starting local test server on port 5000...');
    const app = require('../server');
    // Allow brief moment for mongo connection
    await new Promise((r) => setTimeout(r, 1200));
  }

  try {
    // 1. Health Check
    console.log('[Group 1: Health & System Diagnostics]');
    const health = await request('GET', '/api/health');
    assert(health.status === 200, 'GET /api/health returns 200 OK');
    assert(health.body.status === 'OK', 'Database status is OK');
    assert(health.body.service === 'EduPulse Full Stack API', 'Service identity matches');

    // 2. Authentication: Demo Login
    console.log('\n[Group 2: Authentication & Authorization]');
    const demoLoginRes = await request('POST', '/api/auth/demo-login', { role: 'student' });
    assert(demoLoginRes.status === 200, 'POST /api/auth/demo-login returns 200');
    assert(demoLoginRes.body.token != null, 'JWT token returned on demo login');
    const studentToken = demoLoginRes.body.token;

    // Login with valid credentials
    const loginRes = await request('POST', '/api/auth/login', {
      email: 'vishal797577@gmail.com',
      password: 'student123',
    });
    assert(loginRes.status === 200, 'POST /api/auth/login with valid credentials returns 200');
    assert(loginRes.body.user.name === 'Vishal Ellure', 'User profile populated');

    // Login with invalid credentials
    const badLoginRes = await request('POST', '/api/auth/login', {
      email: 'vishal797577@gmail.com',
      password: 'wrongpassword',
    });
    assert(badLoginRes.status === 401, 'POST /api/auth/login with wrong password returns 401 Unauthorized');

    // Access protected route with token
    const meRes = await request('GET', '/api/auth/me', null, studentToken);
    assert(meRes.status === 200, 'GET /api/auth/me returns 200 with Bearer token');
    assert(meRes.body.user.usn === '1RV23CS001', 'Current user USN matches');

    // Access protected route WITHOUT token
    const unauthRes = await request('GET', '/api/auth/me');
    assert(unauthRes.status === 401, 'GET /api/auth/me without token returns 401');

    // 3. Task Management (CRUD)
    console.log('\n[Group 3: Academic Task Management CRUD]');
    const tasksRes = await request('GET', '/api/tasks', null, studentToken);
    assert(tasksRes.status === 200, 'GET /api/tasks returns 200');
    assert(Array.isArray(tasksRes.body.tasks), 'Returns array of tasks');
    const initialCount = tasksRes.body.tasks.length;

    // Create a new task
    const newTaskPayload = {
      title: 'Automated Test Task: Verify Jest & Supertest Integration',
      category: 'Lab Experiment',
      priority: 'High',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      subject: 'Full Stack Development',
      notes: 'Created via automated integration test runner.',
    };
    const createTaskRes = await request('POST', '/api/tasks', newTaskPayload, studentToken);
    assert(createTaskRes.status === 201, 'POST /api/tasks returns 201 Created');
    assert(createTaskRes.body.task.title === newTaskPayload.title, 'Created task title matches');
    const createdTaskId = createTaskRes.body.task._id;

    // Get task by ID
    const getTaskRes = await request('GET', `/api/tasks/${createdTaskId}`, null, studentToken);
    assert(getTaskRes.status === 200, 'GET /api/tasks/:id returns 200');
    assert(getTaskRes.body.task.status === 'Pending', 'Initial task status is Pending');

    // Toggle task status
    const toggleRes = await request('PATCH', `/api/tasks/${createdTaskId}/status`, { status: 'Completed' }, studentToken);
    assert(toggleRes.status === 200, 'PATCH /api/tasks/:id/status returns 200');
    assert(toggleRes.body.task.status === 'Completed', 'Task status updated to Completed');

    // Filter tasks
    const filterRes = await request('GET', '/api/tasks?status=Completed', null, studentToken);
    assert(filterRes.status === 200, 'GET /api/tasks?status=Completed returns 200');
    assert(filterRes.body.tasks.every(t => t.status === 'Completed'), 'Filtered results contain only Completed tasks');

    // Delete task
    const deleteRes = await request('DELETE', `/api/tasks/${createdTaskId}`, null, studentToken);
    assert(deleteRes.status === 200, 'DELETE /api/tasks/:id returns 200 OK');

    // Verify deleted
    const verifyDelRes = await request('GET', `/api/tasks/${createdTaskId}`, null, studentToken);
    assert(verifyDelRes.status === 404, 'GET deleted task returns 404 Not Found');

    // 4. Placement Drives & Applications
    console.log('\n[Group 4: Placement Drives & Applications]');
    const drivesRes = await request('GET', '/api/placements');
    assert(drivesRes.status === 200, 'GET /api/placements returns 200');
    assert(drivesRes.body.drives.length > 0, 'Drives list is populated');
    const firstDrive = drivesRes.body.drives[0];

    const singleDriveRes = await request('GET', `/api/placements/${firstDrive._id}`);
    assert(singleDriveRes.status === 200, 'GET /api/placements/:id returns 200');
    assert(singleDriveRes.body.drive.companyName === firstDrive.companyName, 'Drive details match');

    // My Applications
    const myAppsRes = await request('GET', '/api/placements/my/applications', null, studentToken);
    assert(myAppsRes.status === 200, 'GET /api/placements/my/applications returns 200');
    assert(Array.isArray(myAppsRes.body.applications), 'Returns student applications');

    // 5. Dashboard Aggregations
    console.log('\n[Group 5: Dashboard Analytics & Statistics]');
    const statsRes = await request('GET', '/api/stats/dashboard', null, studentToken);
    assert(statsRes.status === 200, 'GET /api/stats/dashboard returns 200');
    assert(typeof statsRes.body.stats.academic.completionRate === 'number', 'Academic completion rate calculated');
    assert(typeof statsRes.body.stats.placement.totalDrives === 'number', 'Placement total drives counted');

    // 6. Error Handling & Boundary Cases
    console.log('\n[Group 6: Robust Error Handling & Boundaries]');
    const invalidIdRes = await request('GET', '/api/tasks/not-a-valid-object-id', null, studentToken);
    assert(invalidIdRes.status === 404, 'Invalid ObjectId handled with 404');

    const missingFieldRes = await request('POST', '/api/tasks', { notes: 'No title' }, studentToken);
    assert(missingFieldRes.status === 400, 'Missing required fields returns 400 Validation Error');

    console.log('\n========================================');
    console.log(`  Tests Completed: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
    console.log('========================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTestSuite();
