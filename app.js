/**
 * Main Application Engine for Science with Sheshadi Student Portal
 */

document.addEventListener('DOMContentLoaded', () => {
    let studentData = [];
    let currentStudentIndex = 0;
    let unitTestChartInstance = null;
    let termChartInstance = null;

    // UI Elements
    const studentTabsContainer = document.getElementById('studentTabsContainer');
    const studentNameEl = document.getElementById('studentName');
    const studentIdEl = document.getElementById('studentId');
    const gradeClassEl = document.getElementById('gradeClass');
    const homeroomTeacherEl = document.getElementById('homeroomTeacher');
    const studentAvatarEl = document.getElementById('studentAvatar');
    const avgScoreEl = document.getElementById('avgScore');
    const attendanceEl = document.getElementById('attendanceRate');
    const statusBadgeEl = document.getElementById('statusBadge');
    const weeklyTableBody = document.getElementById('weeklyTableBody');
    const searchInput = document.getElementById('studentSearchInput');
    const excelFileInput = document.getElementById('excelFileInput');
    const syncSheetsBtn = document.getElementById('syncSheetsBtn');

    // 1. Load Initial Data (from assets/data/students.json)
    async function initPortal() {
        try {
            const response = await fetch('assets/data/students.json');
            if (!response.ok) throw new Error("Could not load local students.json");
            studentData = await response.json();
            renderStudentTabs();
            selectStudent(0);
        } catch (error) {
            console.error("Error loading students.json:", error);
            // Fallback default dataset
            studentData = getFallbackData();
            renderStudentTabs();
            selectStudent(0);
        }
    }

    // Render Tab Navigation for Student Tabs
    function renderStudentTabs(filteredList = null) {
        studentTabsContainer.innerHTML = '';
        const listToRender = filteredList || studentData;

        listToRender.forEach((student, index) => {
            const originalIndex = studentData.indexOf(student);
            const btn = document.createElement('button');
            btn.className = `student-tab-btn flex items-center space-x-2 px-5 py-3 text-sm font-semibold rounded-t-lg focus:outline-none ${originalIndex === currentStudentIndex ? 'active text-cyan-400' : 'text-slate-400'}`;
            btn.innerHTML = `
                <i class="fa-solid fa-user-graduate text-xs"></i>
                <span>${student.tab_name} (${student.student_info.name})</span>
            `;
            btn.addEventListener('click', () => selectStudent(originalIndex));
            studentTabsContainer.appendChild(btn);
        });
    }

    // Select and display a specific student tab
    function selectStudent(index) {
        if (!studentData[index]) return;
        currentStudentIndex = index;
        const student = studentData[index];

        // Update Tab Active UI
        renderStudentTabs();

        // Populate Student Header Profile
        studentNameEl.textContent = student.student_info.name;
        studentIdEl.textContent = student.student_info.student_id;
        gradeClassEl.textContent = student.student_info.grade_class;
        homeroomTeacherEl.textContent = student.student_info.homeroom_teacher;
        studentAvatarEl.src = student.student_info.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.student_info.name}`;

        // Populate Summary Stats
        avgScoreEl.textContent = student.summary.average_unit_test + ' / 100';
        attendanceEl.textContent = student.summary.attendance || '95%';
        statusBadgeEl.textContent = student.summary.overall_status || 'Active Progress';

        // Render Weekly Table
        renderWeeklyTable(student.weekly_progress);

        // Render Charts
        renderUnitTestChart(student.weekly_progress);
        renderTermChart(student.assessments);
    }

    // Render Weekly Progress Table with Status Badges
    function renderWeeklyTable(weeklyList) {
        weeklyTableBody.innerHTML = '';

        if (!weeklyList || weeklyList.length === 0) {
            weeklyTableBody.innerHTML = `<tr><td colspan="6" class="px-6 py-4 text-center text-slate-400">No weekly records available for this tab.</td></tr>`;
            return;
        }

        weeklyList.forEach((row, idx) => {
            const tr = document.createElement('tr');
            tr.className = idx % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-800/20';

            const getBadgeClass = (val) => {
                const s = String(val).toLowerCase();
                if (s.includes('complete') || s.includes('good') || s.includes('excellent')) return 'badge-completed';
                if (s.includes('incomplete') || s.includes('bad')) return 'badge-incomplete';
                return 'badge-progress';
            };

            tr.innerHTML = `
                <td class="px-6 py-4 font-bold text-cyan-400">${row.week}</td>
                <td class="px-6 py-4"><span class="px-3 py-1 rounded-full text-xs font-semibold ${getBadgeClass(row.master_guide_1)}">${row.master_guide_1}</span></td>
                <td class="px-6 py-4"><span class="px-3 py-1 rounded-full text-xs font-semibold ${getBadgeClass(row.master_guide_2)}">${row.master_guide_2}</span></td>
                <td class="px-6 py-4"><span class="px-3 py-1 rounded-full text-xs font-semibold ${getBadgeClass(row.past_paper)}">${row.past_paper}</span></td>
                <td class="px-6 py-4"><span class="px-3 py-1 rounded-full text-xs font-semibold ${getBadgeClass(row.practical)}">${row.practical}</span></td>
                <td class="px-6 py-4 font-bold text-emerald-400">${row.unit_test} / 100</td>
            `;
            weeklyTableBody.appendChild(tr);
        });
    }

    // Render Unit Test Performance Chart
    function renderUnitTestChart(weeklyList) {
        const ctx = document.getElementById('unitTestChart').getContext('2d');
        if (unitTestChartInstance) unitTestChartInstance.destroy();

        const labels = weeklyList.map(w => w.week);
        const data = weeklyList.map(w => w.unit_test);

        unitTestChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Unit Test Score',
                    data: data,
                    borderColor: '#00d2ff',
                    backgroundColor: 'rgba(0, 210, 255, 0.15)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.35,
                    pointBackgroundColor: '#d4af37',
                    pointRadius: 6,
                    pointHoverRadius: 9
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#cbd5e1', font: { family: 'Rajdhani', size: 14 } } }
                },
                scales: {
                    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                    y: { min: 0, max: 100, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } }
                }
            }
        });
    }

    // Render Term Assessments Bar Chart
    function renderTermChart(assessmentsList) {
        const ctx = document.getElementById('termChart').getContext('2d');
        if (termChartInstance) termChartInstance.destroy();

        const labels = assessmentsList.map(a => a.term);
        const data = assessmentsList.map(a => a.score);

        termChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Assessment Score',
                    data: data,
                    backgroundColor: ['rgba(79, 70, 229, 0.8)', 'rgba(14, 165, 233, 0.8)', 'rgba(212, 175, 55, 0.8)'],
                    borderColor: ['#4f46e5', '#0ea5e9', '#d4af37'],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#cbd5e1', font: { family: 'Rajdhani', size: 14 } } }
                },
                scales: {
                    x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
                    y: { min: 0, max: 100, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } }
                }
            }
        });
    }

    // Search and Filter Students
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
            renderStudentTabs();
            return;
        }
        const filtered = studentData.filter(st => 
            st.student_info.name.toLowerCase().includes(query) ||
            st.student_info.student_id.toLowerCase().includes(query) ||
            st.tab_name.toLowerCase().includes(query)
        );
        renderStudentTabs(filtered);
    });

    // Excel File Upload Listener
    excelFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            if (window.ExcelParser) {
                const parsedStudents = window.ExcelParser.parseWorkbook(data);
                if (parsedStudents.length > 0) {
                    studentData = parsedStudents;
                    renderStudentTabs();
                    selectStudent(0);
                    alert(`Successfully imported ${parsedStudents.length} student tabs from Excel!`);
                } else {
                    alert("No valid student sheets found in the uploaded file.");
                }
            }
        };
        reader.readAsArrayBuffer(file);
    });

    // Sync Live Google Sheets
    syncSheetsBtn.addEventListener('click', async () => {
        if (!window.GoogleSheetsSync) return;
        syncSheetsBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Syncing...`;
        
        // Attempt fetch for Student 1, Student 2, Student 3
        const tabs = ['Student 1', 'Student 2', 'Student 3', 'Student 4'];
        const syncedList = [];
        
        for (const t of tabs) {
            const res = await window.GoogleSheetsSync.fetchStudentTab(t);
            if (res) syncedList.push(res);
        }

        syncSheetsBtn.innerHTML = `<i class="fa-solid fa-rotate-right"></i> Live Sync Sheet`;

        if (syncedList.length > 0) {
            studentData = syncedList;
            renderStudentTabs();
            selectStudent(0);
            alert(`Live Google Sheet Sync completed! Loaded ${syncedList.length} student tabs.`);
        } else {
            alert("Could not pull live sheet (Check CORS/Permissions). Showing local cached data.");
        }
    });

    // Fallback Data
    function getFallbackData() {
        return [{
            tab_name: "Student 1",
            student_info: { name: "Alex Johnson", student_id: "ST-84092", grade_class: "06 - Science", homeroom_teacher: "Mrs. Sheshadi Sathsarani" },
            weekly_progress: [
                { week: "1 week", master_guide_1: "completed", master_guide_2: "completed", past_paper: "Incomplete", practical: "Good", unit_test: 50 },
                { week: "2 week", master_guide_1: "Incomplete", master_guide_2: "Incomplete", past_paper: "Incomplete", practical: "Good", unit_test: 20 },
                { week: "3 week", master_guide_1: "completed", master_guide_2: "0.5 Done", past_paper: "completed", practical: "Bad", unit_test: 80 },
                { week: "4 week", master_guide_1: "completed", master_guide_2: "completed", past_paper: "completed", practical: "Good", unit_test: 100 }
            ],
            assessments: [{ term: "Term 1", score: 80 }, { term: "Term 2", score: 68 }, { term: "Final Exam", score: 100 }],
            summary: { attendance: "95%", average_unit_test: 62.5, overall_status: "Excellent Progress" }
        }];
    }

    // Initialize App
    initPortal();
});
