const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_FILE = path.join(ROOT, 'data', 'portal-data.json');
const PORT = Number(process.env.PORT || 3000);

// ============================================================
// DATA
// ============================================================

function seedData() {
    return {
        students: [
            {
                id: 'stu-001',
                name: 'Aarav Sharma',
                course: 'B.Tech Computer Science',
                institute: 'National Institute of Technology',
                interests: ['Data Analytics', 'Digital Health'],
                skills: {
                    communication: 3,
                    teamwork: 4,
                    problemSolving: 4,
                    python: 4,
                    sql: 3,
                    dataAnalysis: 4,
                    webDevelopment: 2,
                    ayushDomain: 2
                },
                certifications: ['Python Foundations'],
                projects: 2
            },
            {
                id: 'stu-002',
                name: 'Meera Iyer',
                course: 'B.Pharm',
                institute: 'Institute of Pharmaceutical Sciences',
                interests: ['Clinical Research', 'Digital Health'],
                skills: {
                    communication: 4,
                    teamwork: 4,
                    problemSolving: 3,
                    python: 2,
                    sql: 2,
                    dataAnalysis: 3,
                    webDevelopment: 1,
                    ayushDomain: 4
                },
                certifications: ['Good Clinical Practice'],
                projects: 1
            }
        ],

        opportunities: [
            {
                id: 'opp-001',
                title: 'Health Data Analytics Intern',
                company: 'AyurData Labs',
                type: 'Internship',
                location: 'Bengaluru / Hybrid',
                duration: '12 weeks',
                stipend: '₹15,000/month',
                description:
                    'Analyse anonymised wellness datasets and create decision-ready dashboards.',
                skills: [
                    'python',
                    'sql',
                    'dataAnalysis',
                    'communication'
                ],
                domain: 'Digital Health',
                posted: '2026-08-28'
            },

            {
                id: 'opp-002',
                title: 'AYUSH Research Associate',
                company: 'Swasthya Research Foundation',
                type: 'Entry-level job',
                location: 'New Delhi',
                duration: 'Full-time',
                stipend: '₹4.8–6 LPA',
                description:
                    'Support evidence synthesis, documentation, and research operations.',
                skills: [
                    'ayushDomain',
                    'communication',
                    'problemSolving'
                ],
                domain: 'Clinical Research',
                posted: '2026-08-30'
            },

            {
                id: 'opp-003',
                title: 'Frontend Project Trainee',
                company: 'Nirog Digital',
                type: 'Apprenticeship',
                location: 'Remote',
                duration: '16 weeks',
                stipend: '₹12,000/month',
                description:
                    'Build accessible web experiences for preventive-care workflows.',
                skills: [
                    'webDevelopment',
                    'communication',
                    'teamwork'
                ],
                domain: 'Digital Health',
                posted: '2026-08-25'
            },

            {
                id: 'opp-004',
                title: 'Community Health Innovation Fellow',
                company: 'Arogya Collective',
                type: 'Project',
                location: 'Pune',
                duration: '8 weeks',
                stipend: '₹20,000 total',
                description:
                    'Design a field-ready health education intervention with mentors.',
                skills: [
                    'ayushDomain',
                    'teamwork',
                    'problemSolving',
                    'communication'
                ],
                domain: 'Public Health',
                posted: '2026-08-22'
            }
        ],

        assessments: []
    };
}


// ============================================================
// LOAD / SAVE DATA
// ============================================================

function loadData() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });

        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify(seedData(), null, 2),
            'utf8'
        );
    }

    return JSON.parse(
        fs.readFileSync(DATA_FILE, 'utf8')
    );
}


function saveData(data) {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(data, null, 2),
        'utf8'
    );
}


// ============================================================
// ASSESSMENT QUESTIONS
// ============================================================

const questions = [
    {
        id: 'communication',
        label: 'Communication',
        group: 'Soft skill',
        prompt:
            'I can explain my work clearly to technical and non-technical audiences.'
    },

    {
        id: 'teamwork',
        label: 'Teamwork',
        group: 'Soft skill',
        prompt:
            'I contribute constructively to a team with shared goals.'
    },

    {
        id: 'problemSolving',
        label: 'Problem solving',
        group: 'Soft skill',
        prompt:
            'I break down unfamiliar problems and test practical solutions.'
    },

    {
        id: 'python',
        label: 'Python',
        group: 'Technical skill',
        prompt:
            'I can use Python to clean, analyse, or automate data tasks.'
    },

    {
        id: 'sql',
        label: 'SQL',
        group: 'Technical skill',
        prompt:
            'I can query and join structured datasets using SQL.'
    },

    {
        id: 'dataAnalysis',
        label: 'Data analysis',
        group: 'Technical skill',
        prompt:
            'I can turn data into useful findings, charts, or dashboards.'
    },

    {
        id: 'webDevelopment',
        label: 'Web development',
        group: 'Technical skill',
        prompt:
            'I can build a responsive web page using HTML, CSS, and JavaScript.'
    },

    {
        id: 'ayushDomain',
        label: 'AYUSH domain knowledge',
        group: 'Domain skill',
        prompt:
            'I understand core AYUSH concepts, practices, and the health ecosystem.'
    }
];


// ============================================================
// LEARNING RECOMMENDATIONS
// ============================================================

const learning = {
    python: 'Python for Data Analysis',
    sql: 'SQL for Health Data',
    dataAnalysis: 'Data Visualisation & Dashboards',
    webDevelopment: 'Responsive Web Foundations',
    ayushDomain: 'Introduction to AYUSH Research',
    communication: 'Professional Communication',
    teamwork: 'Collaborative Project Practices',
    problemSolving: 'Design Thinking for Health'
};


// ============================================================
// PROFILE
// ============================================================

function profile(student) {
    const skills = student.skills || {};

    const strengths = Object.entries(skills)
        .filter(([key, value]) => value >= 4)
        .map(([key]) => {
            const question = questions.find(q => q.id === key);
            return question ? question.label : key;
        });

    const gaps = Object.entries(skills)
        .filter(([key, value]) => value <= 2)
        .map(([key]) => {
            const question = questions.find(q => q.id === key);

            return {
                id: key,
                label: question ? question.label : key,
                course: learning[key] || 'Recommended learning'
            };
        });

    const values = Object.values(skills);

    const score =
        values.length > 0
            ? Math.round(
                  (values.reduce((sum, value) => sum + value, 0) /
                      values.length) *
                      20
              )
            : 0;

    return {
        ...student,
        readiness: score,
        strengths,
        gaps
    };
}


// ============================================================
// OPPORTUNITY MATCHING
// ============================================================

function match(student, opportunity) {
    const skills = student.skills || {};

    const matched = opportunity.skills.filter(
        skill => (skills[skill] || 0) >= 3
    );

    const missing = opportunity.skills.filter(
        skill => (skills[skill] || 0) < 3
    );

    const interestBonus = student.interests.includes(opportunity.domain)
        ? 10
        : 0;

    const baseScore =
        (matched.length / opportunity.skills.length) * 90;

    const score = Math.min(
        100,
        Math.round(baseScore + interestBonus)
    );

    return {
        ...opportunity,
        score,
        matchedSkills: matched,
        missingSkills: missing
    };
}


// ============================================================
// JSON RESPONSE
// ============================================================

function json(res, status, body) {
    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
    });

    res.end(JSON.stringify(body));
}


// ============================================================
// PARSE POST BODY
// ============================================================

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';

        req.on('data', chunk => {
            body += chunk;

            // Prevent extremely large request bodies
            if (body.length > 1e6) {
                req.destroy();
                reject(new Error('Request body too large'));
            }
        });

        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (error) {
                reject(new Error('Invalid JSON'));
            }
        });

        req.on('error', reject);
    });
}


// ============================================================
// STATIC FILE SERVER
// ============================================================

function serveStatic(res, pathname) {
    // Convert URL path to local file inside /public
    const requestedPath =
        pathname === '/'
            ? 'index.html'
            : decodeURIComponent(pathname.replace(/^\/+/, ''));

    const file = path.resolve(
        PUBLIC_DIR,
        requestedPath
    );

    // Security check:
    // Make sure requested file is actually inside /public
    const relativePath = path.relative(
        PUBLIC_DIR,
        file
    );

    if (
        relativePath.startsWith('..') ||
        path.isAbsolute(relativePath)
    ) {
        return false;
    }

    if (
        !fs.existsSync(file) ||
        fs.statSync(file).isDirectory()
    ) {
        return false;
    }

    const types = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.csv': 'text/csv',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.webp': 'image/webp'
    };

    const extension = path.extname(file).toLowerCase();

    const contentType =
        types[extension] || 'application/octet-stream';

    res.writeHead(200, {
        'Content-Type': `${contentType}; charset=utf-8`,
        'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(file);

    stream.on('error', error => {
        console.error('Static file error:', error);

        if (!res.headersSent) {
            res.writeHead(500);
        }

        res.end('Internal server error');
    });

    stream.pipe(res);

    return true;
}


// ============================================================
// CREATE SERVER
// ============================================================

const server = http.createServer(async (req, res) => {
    try {
        const requestUrl = new URL(
            req.url,
            `http://${req.headers.host || 'localhost'}`
        );

        const route = requestUrl.pathname;

        const data = loadData();


        // ----------------------------------------------------
        // HEALTH CHECK
        // ----------------------------------------------------

        if (
            route === '/api/health' &&
            req.method === 'GET'
        ) {
            return json(res, 200, {
                status: 'ok'
            });
        }


        // ----------------------------------------------------
        // QUESTIONS
        // ----------------------------------------------------

        if (
            route === '/api/questions' &&
            req.method === 'GET'
        ) {
            return json(res, 200, questions);
        }


        // ----------------------------------------------------
        // STUDENTS
        // ----------------------------------------------------

        if (
            route === '/api/students' &&
            req.method === 'GET'
        ) {
            return json(
                res,
                200,
                data.students.map(profile)
            );
        }


        // ----------------------------------------------------
        // PROFILE
        // ----------------------------------------------------

        if (
            route === '/api/profile' &&
            req.method === 'GET'
        ) {
            const studentId =
                requestUrl.searchParams.get('studentId') ||
                'stu-001';

            const student = data.students.find(
                s => s.id === studentId
            );

            if (!student) {
                return json(res, 404, {
                    error: 'Student not found'
                });
            }

            return json(
                res,
                200,
                profile(student)
            );
        }


        // ----------------------------------------------------
        // OPPORTUNITIES - GET
        // ----------------------------------------------------

        if (
            route === '/api/opportunities' &&
            req.method === 'GET'
        ) {
            return json(
                res,
                200,
                data.opportunities
            );
        }


        // ----------------------------------------------------
        // MATCHES
        // ----------------------------------------------------

        if (
            route === '/api/matches' &&
            req.method === 'GET'
        ) {
            const studentId =
                requestUrl.searchParams.get('studentId') ||
                'stu-001';

            const student = data.students.find(
                s => s.id === studentId
            );

            if (!student) {
                return json(res, 404, {
                    error: 'Student not found'
                });
            }

            const matches = data.opportunities
                .map(item => match(student, item))
                .sort((a, b) => b.score - a.score);

            return json(res, 200, matches);
        }


        // ----------------------------------------------------
        // OVERVIEW
        // ----------------------------------------------------

        if (
            route === '/api/overview' &&
            req.method === 'GET'
        ) {
            return json(res, 200, {
                students: data.students.length,
                opportunities: data.opportunities.length,
                companies: new Set(
                    data.opportunities.map(o => o.company)
                ).size,
                placements: 86
            });
        }


        // ----------------------------------------------------
        // ASSESSMENT - POST
        // ----------------------------------------------------

        if (
            route === '/api/assessment' &&
            req.method === 'POST'
        ) {
            const body = await parseBody(req);

            const studentId =
                body.studentId || 'stu-001';

            const student = data.students.find(
                s => s.id === studentId
            );

            if (
                !student ||
                !body.skills ||
                Object.keys(body.skills).length !== questions.length
            ) {
                return json(res, 400, {
                    error:
                        'Please complete every assessment question.'
                });
            }

            student.skills = Object.fromEntries(
                questions.map(question => [
                    question.id,
                    Math.max(
                        1,
                        Math.min(
                            5,
                            Number(body.skills[question.id]) || 1
                        )
                    )
                ])
            );

            data.assessments.push({
                id: `ass-${Date.now()}`,
                studentId: student.id,
                completedAt: new Date().toISOString(),
                skills: student.skills
            });

            saveData(data);

            const matches = data.opportunities
                .map(item => match(student, item))
                .sort((a, b) => b.score - a.score);

            return json(res, 201, {
                profile: profile(student),
                matches
            });
        }


        // ----------------------------------------------------
        // OPPORTUNITY - POST
        // ----------------------------------------------------

        if (
            route === '/api/opportunities' &&
            req.method === 'POST'
        ) {
            const body = await parseBody(req);

            const required = [
                'title',
                'company',
                'type',
                'location',
                'duration',
                'description',
                'skills',
                'domain'
            ];

            const missingRequiredField =
                required.some(
                    key =>
                        body[key] === undefined ||
                        body[key] === null ||
                        body[key] === ''
                );

            if (
                missingRequiredField ||
                !Array.isArray(body.skills)
            ) {
                return json(res, 400, {
                    error:
                        'Please provide all opportunity details.'
                });
            }

            const opportunity = {
                id: `opp-${Date.now()}`,
                ...body,
                stipend:
                    body.stipend || 'Not specified',
                posted:
                    new Date()
                        .toISOString()
                        .slice(0, 10)
            };

            data.opportunities.unshift(
                opportunity
            );

            saveData(data);

            return json(
                res,
                201,
                opportunity
            );
        }


        // ----------------------------------------------------
        // UNKNOWN API ROUTE
        // ----------------------------------------------------

        if (route.startsWith('/api/')) {
            return json(res, 404, {
                error: 'Endpoint not found'
            });
        }


        // ----------------------------------------------------
        // STATIC FILES
        // ----------------------------------------------------

        if (serveStatic(res, route)) {
            return;
        }


        // ----------------------------------------------------
        // 404
        // ----------------------------------------------------

        res.writeHead(404, {
            'Content-Type': 'text/plain; charset=utf-8'
        });

        res.end('Not found');

    } catch (error) {
        console.error('Server error:', error);

        if (!res.headersSent) {
            json(res, 500, {
                error:
                    error.message ||
                    'Server error'
            });
        } else {
            res.end();
        }
    }
});


// ============================================================
// START SERVER
// ============================================================

server.listen(PORT, () => {
    console.log(
        `Academia portal running at http://localhost:${PORT}`
    );
});


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    server,
    profile,
    match,
    questions
};