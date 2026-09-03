// ============================================================
// APPLICATION STATE
// ============================================================

const state = {
    studentId: 'stu-001',
    profile: null,
    matches: [],
    filter: 'All',
    questions: []
};


// ============================================================
// API HELPER
// ============================================================

async function api(path, options = {}) {
    const response = await fetch(path, {
        ...options,
        headers: {
            ...(options.headers || {})
        }
    });

    // Read response as text first.
    // This prevents "Unexpected token '<'" when the server
    // accidentally returns HTML instead of JSON.
    const text = await response.text();

    let payload;

    try {
        payload = text ? JSON.parse(text) : {};
    } catch (error) {
        console.error('Invalid JSON response:', {
            url: path,
            status: response.status,
            response: text.substring(0, 500)
        });

        throw new Error(
            `Server returned invalid JSON for ${path}. ` +
            `Status: ${response.status}`
        );
    }

    if (!response.ok) {
        throw new Error(
            payload.error ||
            `Request failed with status ${response.status}`
        );
    }

    return payload;
}


// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function label(id) {
    const question = state.questions.find(
        q => q.id === id
    );

    return question?.label || id;
}


function escapeHtml(value) {
    return String(value).replace(
        /[&<>'"]/g,
        c => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[c])
    );
}


// ============================================================
// UI HELPERS
// ============================================================

function showToast(message) {
    const toast = document.querySelector('#toast');

    if (!toast) {
        console.error(message);
        return;
    }

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3600);
}


function showSection(id) {
    const section = document.querySelector(`#${id}`);

    if (!section) {
        console.warn(`Section #${id} not found`);
        return;
    }

    section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}


// ============================================================
// RENDER STATISTICS
// ============================================================

function renderStats(stats) {
    const target = document.querySelector('#stats');

    if (!target) return;

    target.innerHTML = [
        {
            value: `${stats.opportunities}+`,
            label: 'live opportunities'
        },
        {
            value: `${stats.companies}+`,
            label: 'industry partners'
        },
        {
            value: `${stats.placements}%`,
            label: 'placement readiness'
        }
    ]
        .map(
            stat => `
                <div class="stat">
                    <strong>${escapeHtml(stat.value)}</strong>
                    <span>${escapeHtml(stat.label)}</span>
                </div>
            `
        )
        .join('');
}


// ============================================================
// RENDER STUDENT PROFILE
// ============================================================

function renderProfile(profile) {
    state.profile = profile;

    const heroReadiness =
        document.querySelector('#heroReadiness');

    if (heroReadiness) {
        heroReadiness.textContent =
            `${profile.readiness}%`;
    }

    const profileGrid =
        document.querySelector('#profileGrid');

    if (!profileGrid) return;

    profileGrid.innerHTML = `
        <article class="panel readiness">

            <p class="eyebrow">
                YOUR READINESS SCORE
            </p>

            <div class="score">
                ${escapeHtml(profile.readiness)}%
            </div>

            <strong>
                Career-ready foundation
            </strong>

            <p>
                Your profile reflects a promising mix of
                transferable and industry-relevant skills.
            </p>

        </article>


        <article class="panel">

            <h3>
                Skills you can lead with
            </h3>

            <div class="tag-list">

                ${
                    profile.strengths?.length
                        ? profile.strengths
                            .map(
                                skill => `
                                    <span class="tag">
                                        ${escapeHtml(skill)}
                                    </span>
                                `
                            )
                            .join('')
                        : `
                            <span class="tag">
                                Complete assessment to find strengths
                            </span>
                        `
                }

            </div>


            <h3 style="margin-top:25px">
                Career interests
            </h3>

            <div class="tag-list">

                ${
                    profile.interests?.length
                        ? profile.interests
                            .map(
                                interest => `
                                    <span class="tag">
                                        ${escapeHtml(interest)}
                                    </span>
                                `
                            )
                            .join('')
                        : `
                            <span class="tag">
                                No interests added
                            </span>
                        `
                }

            </div>

        </article>


        <article class="panel">

            <h3>
                High-impact learning next
            </h3>

            ${
                profile.gaps?.length
                    ? profile.gaps
                        .slice(0, 3)
                        .map(
                            gap => `
                                <div class="gap-item">

                                    <span>

                                        <b>
                                            ${escapeHtml(gap.label)}
                                        </b>

                                        <br>

                                        <small>
                                            ${escapeHtml(gap.course)}
                                        </small>

                                    </span>

                                    <a href="#assessment">
                                        Explore →
                                    </a>

                                </div>
                            `
                        )
                        .join('')
                    : `
                        <p style="font-size:12px;color:var(--muted)">
                            Excellent—your profile has no immediate
                            skill gaps.
                        </p>
                    `
            }

        </article>
    `;
}


// ============================================================
// RENDER ASSESSMENT QUESTIONS
// ============================================================

function renderQuestions() {
    const target =
        document.querySelector('#questions');

    if (!target) return;

    target.innerHTML = state.questions
        .map(
            (question, index) => `
                <div class="question">

                    <div>

                        <small>
                            ${escapeHtml(question.group)}
                        </small>

                        <h3>
                            ${index + 1}.
                            ${escapeHtml(question.label)}
                        </h3>

                        <p>
                            ${escapeHtml(question.prompt)}
                        </p>

                    </div>


                    <div
                        class="scale"
                        aria-label="Rate ${escapeHtml(question.label)}"
                    >

                        ${[1, 2, 3, 4, 5]
                            .map(
                                number => `
                                    <label>

                                        <input
                                            type="radio"
                                            name="${escapeHtml(question.id)}"
                                            value="${number}"
                                            ${
                                                state.profile?.skills?.[
                                                    question.id
                                                ] === number
                                                    ? 'checked'
                                                    : ''
                                            }
                                            required
                                        >

                                        <span>
                                            ${number}
                                        </span>

                                    </label>
                                `
                            )
                            .join('')}

                    </div>

                </div>
            `
        )
        .join('');
}


// ============================================================
// RENDER OPPORTUNITY MATCHES
// ============================================================

function renderMatches() {
    const target =
        document.querySelector('#matches');

    if (!target) return;

    const visible =
        state.matches.filter(
            item =>
                state.filter === 'All' ||
                item.type === state.filter
        );

    if (!visible.length) {
        target.innerHTML = `
            <div class="loading">
                No opportunities in this category just yet.
            </div>
        `;

        return;
    }

    target.innerHTML = visible
        .map(
            item => `
                <article class="opportunity">

                    <div class="match-score">
                        ${escapeHtml(item.score)}%
                    </div>


                    <p class="company">

                        ${escapeHtml(item.company)}

                        ·

                        ${escapeHtml(item.type)}

                    </p>


                    <h3>
                        ${escapeHtml(item.title)}
                    </h3>


                    <p class="meta">

                        ${escapeHtml(item.location)}

                        ·

                        ${escapeHtml(item.duration)}

                        ·

                        ${escapeHtml(item.stipend)}

                    </p>


                    <p class="desc">
                        ${escapeHtml(item.description)}
                    </p>


                    <div class="tag-list">

                        ${
                            item.matchedSkills?.length
                                ? item.matchedSkills
                                    .map(
                                        skill => `
                                            <span class="tag">
                                                ${escapeHtml(
                                                    label(skill)
                                                )}
                                            </span>
                                        `
                                    )
                                    .join('')
                                : ''
                        }

                    </div>


                    <div class="opportunity-footer">

                        <small>

                            ${
                                item.missingSkills?.length
                                    ? `Grow: ${item.missingSkills
                                        .map(skill => label(skill))
                                        .join(', ')}`
                                    : 'You meet the core skills for this role.'
                            }

                        </small>


                        <button
                            class="apply"
                            data-apply="${escapeHtml(item.title)}"
                        >
                            Express interest →
                        </button>

                    </div>

                </article>
            `
        )
        .join('');


    // Apply button events
    document
        .querySelectorAll('[data-apply]')
        .forEach(button => {

            button.addEventListener(
                'click',
                () => {

                    showToast(
                        `Interest recorded for ${button.dataset.apply}. ` +
                        `In a production release this opens an application workflow.`
                    );

                }
            );

        });
}


// ============================================================
// REFRESH APPLICATION DATA
// ============================================================

async function refresh() {

    try {

        const [
            profile,
            matches,
            stats
        ] = await Promise.all([

            api(
                `/api/profile?studentId=${encodeURIComponent(
                    state.studentId
                )}`
            ),

            api(
                `/api/matches?studentId=${encodeURIComponent(
                    state.studentId
                )}`
            ),

            api(
                '/api/overview'
            )

        ]);


        // Profile
        renderProfile(profile);


        // Matches
        state.matches = Array.isArray(matches)
            ? matches
            : [];

        renderMatches();


        // Statistics
        renderStats(stats);


        // Questions
        renderQuestions();

    } catch (error) {

        console.error(
            'Refresh failed:',
            error
        );

        showToast(
            error.message
        );

        throw error;
    }
}


// ============================================================
// INITIALIZATION
// ============================================================

async function init() {

    try {

        console.log(
            'Academia portal initializing...'
        );


        // ----------------------------------------------------
        // Load questions
        // ----------------------------------------------------

        state.questions =
            await api('/api/questions');


        if (!Array.isArray(state.questions)) {

            throw new Error(
                'Invalid questions response from server.'
            );

        }


        // ----------------------------------------------------
        // Create skill checkbox list
        // ----------------------------------------------------

        const skillChecks =
            document.querySelector('#skillChecks');

        if (skillChecks) {

            skillChecks.innerHTML =
                state.questions
                    .map(
                        question => `
                            <label>

                                <input
                                    type="checkbox"
                                    name="skills"
                                    value="${escapeHtml(
                                        question.id
                                    )}"
                                >

                                ${escapeHtml(
                                    question.label
                                )}

                            </label>
                        `
                    )
                    .join('');

        }


        // ----------------------------------------------------
        // Load profile, matches and statistics
        // ----------------------------------------------------

        await refresh();


        console.log(
            'Academia portal loaded successfully.'
        );

    } catch (error) {

        console.error(
            'Initialization failed:',
            error
        );

        showToast(
            error.message ||
            'Failed to load application.'
        );
    }
}


// ============================================================
// ASSESSMENT FORM
// ============================================================

function setupAssessmentForm() {

    const form =
        document.querySelector('#assessmentForm');

    if (!form) return;

    form.addEventListener(
        'submit',
        async event => {

            event.preventDefault();

            const formData =
                new FormData(event.currentTarget);


            const skills =
                Object.fromEntries(
                    state.questions.map(
                        question => [
                            question.id,
                            Number(
                                formData.get(
                                    question.id
                                )
                            )
                        ]
                    )
                );


            // Check that every question has an answer
            const incomplete =
                state.questions.some(
                    question =>
                        !formData.get(question.id)
                );


            if (incomplete) {

                showToast(
                    'Please answer every assessment question.'
                );

                return;
            }


            try {

                const result =
                    await api(
                        '/api/assessment',
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            body: JSON.stringify({
                                studentId:
                                    state.studentId,

                                skills
                            })
                        }
                    );


                renderProfile(
                    result.profile
                );


                state.matches =
                    result.matches || [];


                renderMatches();

                renderQuestions();


                showToast(
                    'Your skill profile and recommendations are updated.'
                );


                const dashboard =
                    document.querySelector(
                        '#dashboard'
                    );

                if (dashboard) {

                    dashboard.scrollIntoView({
                        behavior: 'smooth'
                    });

                }

            } catch (error) {

                console.error(
                    'Assessment submission failed:',
                    error
                );

                showToast(
                    error.message
                );

            }

        }
    );
}


// ============================================================
// OPPORTUNITY FORM
// ============================================================

function setupOpportunityForm() {

    const form =
        document.querySelector(
            '#opportunityForm'
        );

    if (!form) return;

    form.addEventListener(
        'submit',
        async event => {

            event.preventDefault();

            const formData =
                new FormData(
                    event.currentTarget
                );


            const skills =
                formData.getAll('skills');


            if (!skills.length) {

                showToast(
                    'Choose at least one required skill.'
                );

                return;
            }


            const body =
                Object.fromEntries(
                    formData.entries()
                );


            body.skills = skills;


            try {

                await api(
                    '/api/opportunities',
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body: JSON.stringify(body)
                    }
                );


                event.currentTarget.reset();


                const message =
                    document.querySelector(
                        '#publishMessage'
                    );

                if (message) {

                    message.textContent =
                        'Published. Relevant students can now discover this role.';

                }


                await refresh();


                showToast(
                    'Opportunity published successfully.'
                );

            } catch (error) {

                console.error(
                    'Opportunity submission failed:',
                    error
                );

                showToast(
                    error.message
                );

            }

        }
    );
}


// ============================================================
// FILTER BUTTONS
// ============================================================

function setupFilters() {

    document
        .querySelectorAll('.filter')
        .forEach(button => {

            button.addEventListener(
                'click',
                () => {

                    document
                        .querySelectorAll('.filter')
                        .forEach(
                            item =>
                                item.classList.remove(
                                    'active'
                                )
                        );


                    button.classList.add(
                        'active'
                    );


                    state.filter =
                        button.dataset.filter ||
                        'All';


                    renderMatches();

                }
            );

        });
}


// ============================================================
// PROFILE SWITCH
// ============================================================

function setupProfileSwitch() {

    const button =
        document.querySelector(
            '#profileSwitch'
        );

    if (!button) return;

    button.addEventListener(
        'click',
        async () => {

            state.studentId =
                state.studentId === 'stu-001'
                    ? 'stu-002'
                    : 'stu-001';


            button.innerHTML =
                state.studentId === 'stu-001'
                    ? 'AS <span>Aarav Sharma</span>'
                    : 'MI <span>Meera Iyer</span>';


            try {

                await refresh();

                showToast(
                    'Switched to demo profile.'
                );

            } catch (error) {

                console.error(
                    'Profile switch failed:',
                    error
                );

            }

        }
    );
}


// ============================================================
// START APPLICATION
// ============================================================

// Important:
// Wait until the entire HTML document is loaded before
// accessing elements.

document.addEventListener(
    'DOMContentLoaded',
    () => {

        setupAssessmentForm();

        setupOpportunityForm();

        setupFilters();

        setupProfileSwitch();

        init();

    }
);