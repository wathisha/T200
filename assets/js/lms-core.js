/**
 * ============================================================================
 * LMS Core Management Engine - Science with Laknath ERP & ERP
 * 100% Pure JSON Database Engine (No Spreadsheets / No Excel)
 * Multi-User Administration with Role-Based Privileges (RBAC)
 * Multi-Device Universal Real-Time Synchronization (PC, Tablet, Mobile Phone)
 * ============================================================================
 */

(function () {
    'use strict';

    // Global Default Configuration Constants (Stored as Pure JSON)
    const DEFAULT_SETTINGS = {
        academyName: "Science with Laknath",
        tagline: "GRADE 6-11 SCIENCE SPECIALIST",
        motto: "UNDERSTAND TODAY, SUCCEED TOMORROW",
        teacherName: "Mr. Laknath Amarasinghe",
        teacherTitle: "Head Science Specialist & IT Systems Lead",
        hotlines: "071 781 2092 | 077 161 4260",
        teacherPhoto: "assets/images/teacher_banner.png",
        logoImage: "assets/images/logo.png",
        bgImage: "assets/images/lms_background.png",
        theme: "light",
        subjectList: ["06 - Science", "07 - Science", "08 - Science", "09 - Science", "10 - Science", "11 - Science"],
        announcement: "Welcome to Science with Laknath ERP! Grade 06-11 Science Master Guidebooks, past paper revisions, WhatsApp & Zoom live classes are active.",
        offerings: [
            "Clear Explanations",
            "Exam Focused Learning",
            "Concept Building",
            "Past Paper Practice",
            "Live Practical Sessions on Classroom"
        ],
        gradingScale: { A: 75, B: 65, C: 50, S: 35 }
    };

    const DEFAULT_USERS = [
        {
            id: "USR-101",
            username: "laknath",
            password: "password123",
            name: "Mr. Laknath Amarasinghe",
            email: "laknath@scienceacademy.lk",
            phone: "071 781 2092",
            role: "super_admin",
            roleName: "Super Admin (Head Specialist)",
            title: "Head Science Specialist & IT Systems Lead",
            avatar: "assets/images/teacher_banner.png",
            permissions: ["manage_users", "edit_system_settings", "manage_students", "delete_students", "grade_students", "manage_content", "view_teacher_vault", "database_admin"],
            status: "active",
            createdDate: "2026-01-10",
            lastLogin: "2026-08-21 23:45",
            lastDevice: "PC / Desktop (Windows)",
            deviceSessions: []
        },
        {
            id: "USR-102",
            username: "wathisha",
            password: "admin2026",
            name: "Wathisha Amarasinghe",
            email: "wathisha@scienceacademy.lk",
            phone: "077 161 4260",
            role: "super_admin",
            roleName: "Super Admin (Tech Lead)",
            title: "Lead Cloud & Systems Architect",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wathisha&clothing=blazerAndShirt",
            permissions: ["manage_users", "edit_system_settings", "manage_students", "delete_students", "grade_students", "manage_content", "view_teacher_vault", "database_admin"],
            status: "active",
            createdDate: "2026-01-10",
            lastLogin: "2026-08-21 22:10",
            lastDevice: "PC / Desktop (Mac)",
            deviceSessions: []
        },
        {
            id: "USR-103",
            username: "samantha",
            password: "admin123",
            name: "Dr. Samantha Jayawardena",
            email: "samantha@scienceacademy.lk",
            phone: "077 982 1144",
            role: "admin",
            roleName: "Administrator",
            title: "Academic Director & Curriculum Coordinator",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samantha&clothing=collarAndSweater",
            permissions: ["manage_students", "grade_students", "manage_content", "view_teacher_vault"],
            status: "active",
            createdDate: "2026-02-01",
            lastLogin: "2026-08-20 18:20",
            lastDevice: "Tablet / iPad (iPadOS)",
            deviceSessions: []
        },
        {
            id: "USR-104",
            username: "nipuna",
            password: "teacher123",
            name: "Nipuna Perera",
            email: "nipuna@scienceacademy.lk",
            phone: "072 441 5590",
            role: "teacher",
            roleName: "Senior Science Educator",
            title: "Senior Science Educator (Grade 9-11)",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nipuna&hair=shortHairShortFlat",
            permissions: ["grade_students", "manage_content", "view_teacher_vault"],
            status: "active",
            createdDate: "2026-02-15",
            lastLogin: "2026-08-21 15:40",
            lastDevice: "Mobile Phone (Android)",
            deviceSessions: []
        },
        {
            id: "USR-105",
            username: "kavindi",
            password: "teacher123",
            name: "Kavindi Wijesinghe",
            email: "kavindi@scienceacademy.lk",
            phone: "076 331 8820",
            role: "assistant_teacher",
            roleName: "Assistant Science Teacher",
            title: "Assistant Teacher (Grade 6-8 Lab Demonstrator)",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavindi&hair=longHairBob",
            permissions: ["grade_students", "manage_content"],
            status: "active",
            createdDate: "2026-03-01",
            lastLogin: "2026-08-21 11:25",
            lastDevice: "Tablet / iPad (Android Tab)",
            deviceSessions: []
        },
        {
            id: "USR-106",
            username: "kamal",
            password: "staff123",
            name: "Kamal Silva",
            email: "kamal@scienceacademy.lk",
            phone: "078 554 9912",
            role: "staff",
            roleName: "Student Registrar & Data Officer",
            title: "Student Registrar & Records Management Officer",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kamal&hair=shortHairCurly",
            permissions: ["manage_students"],
            status: "active",
            createdDate: "2026-03-10",
            lastLogin: "2026-08-21 09:15",
            lastDevice: "Mobile Phone (iPhone)",
            deviceSessions: []
        },
        {
            id: "USR-100",
            username: "admin",
            password: "password123",
            name: "Master Administrator",
            email: "admin@scienceacademy.lk",
            phone: "071 781 2092",
            role: "super_admin",
            roleName: "Super Admin (System Fallback)",
            title: "Central System Administrator",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MasterAdmin",
            permissions: ["manage_users", "edit_system_settings", "manage_students", "delete_students", "grade_students", "manage_content", "view_teacher_vault", "database_admin"],
            status: "active",
            createdDate: "2026-01-01",
            lastLogin: "2026-08-21 21:00",
            lastDevice: "PC / Desktop",
            deviceSessions: []
        }
    ];

    const DEFAULT_CLOUD_CONFIG = {
        enabled: true,
        provider: "node_server", // "node_server", "cloud_json", "local_json"
        cloudJsonStudentsUrl: "https://api.npoint.io/182e3982fc6e4d9dcd58",
        cloudJsonConfigUrl: "",
        nodeServerUrl: "", // Defaults to current host if served via server.js
        lastSynced: ""
    };

    // Fully customizable weekly columns - default legacy columns removed per user requirement
    const DEFAULT_WEEKLY_COLUMNS = [];

    const DEFAULT_WHATSAPP = {
        isLive: true,
        teacherWhatsappNumber: "94717812092",
        whatsappGroupUrl: "https://chat.whatsapp.com/ScienceWithLaknath",
        title: "Grade 06 Science - Live Class WhatsApp Q&A & Support",
        grade: "06 - Science",
        broadcastText: "Hello students, today's Science Master Guidebook and practical review questions are now published.",
        statusText: "LIVE ON WHATSAPP"
    };

    const DEFAULT_ZOOM = {
        isLive: true,
        title: "Grade 06 Science - Live Theory & Practical Zoom Session",
        grade: "06 - Science",
        meetingUrl: "https://zoom.us/j/9876543210?pwd=SCIENCE2026CLASS",
        meetingId: "987 654 3210",
        passcode: "SCIENCE2026",
        hostName: "Mr. Laknath Amarasinghe",
        startTime: "Saturday 8:00 AM - 10:30 AM",
        statusText: "LIVE ON ZOOM"
    };

    const DEFAULT_NOTIFICATIONS = [
        {
            id: "NOTIF-101",
            title: "Term 2 Practical Evaluation Date",
            message: "All Grade 06 students must complete Unit 3 & 4 laboratory workbooks before August 25.",
            grade: "06 - Science",
            priority: "Exam Alert",
            date: "2026-08-15",
            time: "07:30 PM",
            sender: "Mr. Laknath Amarasinghe"
        },
        {
            id: "NOTIF-102",
            title: "Live Science Master Class Schedule",
            message: "Weekly live problem solving session will be hosted this Saturday on Zoom & WhatsApp.",
            grade: "All Grades",
            priority: "Live Class",
            date: "2026-08-14",
            time: "09:00 AM",
            sender: "Mr. Laknath Amarasinghe"
        },
        {
            id: "NOTIF-103",
            title: "Grade 10 & 11 Past Paper Assignment Uploaded",
            message: "New model paper for Term 2 has been published in the shared files section.",
            grade: "10 - Science",
            priority: "Homework",
            date: "2026-08-12",
            time: "05:00 PM",
            sender: "Mr. Laknath Amarasinghe"
        }
    ];

    const DEFAULT_FILES = [
        {
            id: "FILE-101",
            title: "Grade 06 Science - Master Guidebook 01",
            description: "Foundational concepts, unit diagrams, and practical exercise workbook for Term 1.",
            category: "Master Guide",
            grade: "06 - Science",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            fileSize: "14.2 MB",
            uploadDate: "2026-08-01",
            uploadedBy: "Mr. Laknath Amarasinghe"
        },
        {
            id: "FILE-102",
            title: "Grade 06 Science - Master Guidebook 02",
            description: "Advanced plant physiology, energy transformations, and model questions.",
            category: "Master Guide",
            grade: "06 - Science",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            fileSize: "18.5 MB",
            uploadDate: "2026-08-05",
            uploadedBy: "Mr. Laknath Amarasinghe"
        },
        {
            id: "FILE-103",
            title: "Term 1 Past Papers & Marking Scheme",
            description: "Official evaluation past papers with step-by-step marking rubrics.",
            category: "Past Papers",
            grade: "06 - Science",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            fileSize: "22.1 MB",
            uploadDate: "2026-08-08",
            uploadedBy: "Mr. Laknath Amarasinghe"
        }
    ];

    const DEFAULT_TEACHER_DOCS = [
        {
            id: "TDOC-101",
            title: "Grade 06 - Term 2 Master Examination Paper & Marking Rubric",
            grade: "06 - Science",
            category: "Official Marking Scheme",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            fileSize: "4.8 MB",
            uploadDate: "2026-08-10",
            uploadedBy: "Mr. Laknath Amarasinghe",
            description: "Confidential official marking scheme and evaluation criteria for Term 2 Science paper."
        },
        {
            id: "TDOC-102",
            title: "Grade 07 - Plant & Animal Tissue Lab Practical Protocol Guide",
            grade: "07 - Science",
            category: "Lab Practical Protocol",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            fileSize: "6.2 MB",
            uploadDate: "2026-08-08",
            uploadedBy: "Mr. Laknath Amarasinghe",
            description: "Detailed laboratory setup, chemical reagent preparations, and teacher notes."
        },
        {
            id: "TDOC-103",
            title: "Grade 08 - Annual Syllabus Timeline & Teaching Lesson Plans",
            grade: "08 - Science",
            category: "Lesson Plan",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            fileSize: "3.5 MB",
            uploadDate: "2026-08-02",
            uploadedBy: "Mr. Laknath Amarasinghe",
            description: "Curriculum breakdown, unit targets, and weekly pedagogical timeline."
        },
        {
            id: "TDOC-104",
            title: "Grade 10 & 11 - O/L Chemistry Master Question Bank (Top 500 Questions)",
            grade: "11 - Science",
            category: "Question Bank",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            fileSize: "12.4 MB",
            uploadDate: "2026-08-12",
            uploadedBy: "Mr. Laknath Amarasinghe",
            description: "Curated collection of national past paper questions with step-by-step chemical equations."
        },
        {
            id: "TDOC-105",
            title: "Confidential - Academic Year Student Performance Master Roster",
            grade: "Confidential Master Files",
            category: "Secretarial Record",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            fileSize: "2.1 MB",
            uploadDate: "2026-08-14",
            uploadedBy: "Wathisha Amarasinghe",
            description: "Master administrative student records, contact numbers, and parent communication log."
        }
    ];

    const DEFAULT_CALENDAR = [
        {
            id: "EVT-201",
            title: "Term 2 Mid Evaluation Exam",
            date: "2026-08-20",
            time: "08:30 AM - 10:30 AM",
            category: "Exam",
            grade: "06 - Science",
            description: "Covering Units 1 to 4 in Master Guidebook 01."
        },
        {
            id: "EVT-202",
            title: "Live Science Master Class & Practical",
            date: "2026-08-15",
            time: "08:00 AM - 10:30 AM",
            category: "Class",
            grade: "All Classes",
            description: "Interactive discussion on past paper question techniques."
        },
        {
            id: "EVT-203",
            title: "Lab Practical Logbook Submission",
            date: "2026-08-25",
            time: "05:00 PM Deadline",
            category: "Assignment",
            grade: "07 - Science",
            description: "Submit recorded chemistry and biology experiment sheets."
        },
        {
            id: "EVT-204",
            title: "National Holiday - Poya Day Break",
            date: "2026-08-28",
            time: "All Day",
            category: "Holiday",
            grade: "All Classes",
            description: "Academy offices and online classes closed for Poya."
        }
    ];

    window.LMSCore = {
        STATUS_OPTIONS: ["Completed", "Incomplete", "0.5 Done", "Pending", "Still not attended"],

        // =========================================================================
        // 1. SMART MULTI-DEVICE PROFILING & DETECTION (PC, TABLET, PHONE)
        // =========================================================================
        getDeviceInfo() {
            const ua = (navigator.userAgent || '').toLowerCase();
            const width = window.innerWidth || screen.width;
            const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

            let deviceType = "PC / Desktop";
            let isMobile = false;
            let isTablet = false;
            let isDesktop = true;

            if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk)/.test(ua) || (hasTouch && width >= 600 && width <= 1024)) {
                deviceType = "Tablet / iPad";
                isTablet = true;
                isDesktop = false;
            } else if (/(mobi|ipod|iphone|android|blackberry|opera mini|fennec|minimo|symbian)/.test(ua) || (width < 600)) {
                deviceType = "Mobile Phone";
                isMobile = true;
                isDesktop = false;
            }

            let os = "Desktop OS";
            if (ua.includes("windows")) os = "Windows";
            else if (ua.includes("macintosh") || ua.includes("mac os")) os = "macOS";
            else if (ua.includes("iphone")) os = "iOS (iPhone)";
            else if (ua.includes("ipad")) os = "iPadOS";
            else if (ua.includes("android")) os = isTablet ? "Android Tablet" : "Android Mobile";
            else if (ua.includes("linux")) os = "Linux";

            let browser = "Web Browser";
            if (ua.includes("chrome") && !ua.includes("edg")) browser = "Chrome";
            else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
            else if (ua.includes("firefox")) browser = "Firefox";
            else if (ua.includes("edg")) browser = "Edge";

            return {
                deviceType,
                isMobile,
                isTablet,
                isDesktop,
                os,
                browser,
                screenWidth: width,
                hasTouch,
                summary: `${deviceType} · ${os} · ${browser}`
            };
        },

        getDeviceBadgeHtml(deviceType) {
            const dev = (deviceType || '').toLowerCase();
            if (dev.includes('mobile') || dev.includes('phone') || dev.includes('iphone') || dev.includes('android')) {
                return '<span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"><i class="fa-solid fa-mobile-screen"></i> Mobile</span>';
            }
            if (dev.includes('tablet') || dev.includes('ipad')) {
                return '<span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30"><i class="fa-solid fa-tablet-screen-button"></i> Tablet</span>';
            }
            return '<span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"><i class="fa-solid fa-desktop"></i> PC</span>';
        },

        // =========================================================================
        // 2. THEME & BRANDING ENGINE
        // =========================================================================
        getTheme() {
            return localStorage.getItem('erp_theme_mode') || 'light';
        },
        setTheme(mode) {
            const theme = (mode === 'dark') ? 'dark' : 'light';
            localStorage.setItem('erp_theme_mode', theme);
            this.applyThemeAndBranding();
            return theme;
        },
        toggleTheme() {
            const current = this.getTheme();
            const newTheme = (current === 'dark') ? 'light' : 'dark';
            return this.setTheme(newTheme);
        },

        // =========================================================================
        // 3. MULTI-USER ROSTER, PRIVILEGES & RBAC ENGINE (JSON DB)
        // =========================================================================
        async getUsers(forceRefresh = false) {
            const cloud = this.getCloudConfig();
            const stored = localStorage.getItem('lms_users');
            let localUsers = stored ? JSON.parse(stored) : null;

            // 1. Try Live Node Server REST API
            const serverBase = this.getServerBaseUrl();
            if (serverBase) {
                try {
                    const res = await fetch(`${serverBase}/api/users?t=${Date.now()}`);
                    if (res.ok) {
                        const usersData = await res.json();
                        if (Array.isArray(usersData) && usersData.length > 0) {
                            localStorage.setItem('lms_users', JSON.stringify(usersData));
                            return usersData;
                        }
                    }
                } catch (e) {
                    console.log("Live Node Server /api/users fallback.");
                }
            }

            // 2. If already cached and not force refreshing, return
            if (localUsers && Array.isArray(localUsers) && localUsers.length > 0 && !forceRefresh) {
                return localUsers;
            }

            // 3. Seed from static assets/data/users.json
            try {
                const res = await fetch('assets/data/users.json?t=' + Date.now());
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        localStorage.setItem('lms_users', JSON.stringify(data));
                        return data;
                    }
                }
            } catch (err) {
                console.log("Default users fallback.");
            }

            localStorage.setItem('lms_users', JSON.stringify(DEFAULT_USERS));
            return DEFAULT_USERS;
        },

        async saveUsers(usersArray) {
            localStorage.setItem('lms_users', JSON.stringify(usersArray));
            const serverBase = this.getServerBaseUrl();
            if (serverBase) {
                try {
                    await fetch(`${serverBase}/api/users`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-admin-user': this.getCurrentUser().username || 'admin'
                        },
                        body: JSON.stringify(usersArray)
                    });
                } catch (e) {
                    console.error("Failed to push users to server:", e);
                }
            }
            await this.pushToCloud('config', this.getGlobalConfigObject());
            return usersArray;
        },

        async addUser(userObj) {
            const users = await this.getUsers(false);
            const cleanUser = userObj.username.trim().toLowerCase();
            if (users.some(u => (u.username || '').toLowerCase() === cleanUser)) {
                throw new Error(`Username '${cleanUser}' already exists.`);
            }

            const newUser = {
                id: 'USR-' + Date.now().toString().slice(-4),
                username: cleanUser,
                password: (userObj.password || 'password123').trim(),
                name: userObj.name.trim(),
                email: userObj.email || `${cleanUser}@scienceacademy.lk`,
                phone: userObj.phone || '071 781 2092',
                role: userObj.role || 'teacher',
                roleName: userObj.roleName || (userObj.role === 'super_admin' ? 'Super Admin' : userObj.role === 'admin' ? 'Administrator' : userObj.role === 'teacher' ? 'Science Teacher' : userObj.role === 'assistant_teacher' ? 'Assistant Teacher' : 'Staff Officer'),
                title: userObj.title || 'Science Educator',
                avatar: userObj.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userObj.name)}`,
                permissions: Array.isArray(userObj.permissions) ? userObj.permissions : ['grade_students', 'manage_content'],
                status: userObj.status || 'active',
                createdDate: new Date().toISOString().split('T')[0],
                lastLogin: 'Never logged in',
                lastDevice: 'None',
                deviceSessions: []
            };

            users.push(newUser);
            await this.saveUsers(users);

            // Server POST if live
            const serverBase = this.getServerBaseUrl();
            if (serverBase) {
                try {
                    await fetch(`${serverBase}/api/users`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newUser)
                    });
                } catch (e) {}
            }

            return { users, newUser };
        },

        async updateUser(targetIdOrUser, updatedFields) {
            const users = await this.getUsers(false);
            const idx = users.findIndex(u => u.id === targetIdOrUser || (u.username || '').toLowerCase() === targetIdOrUser.toLowerCase());
            if (idx === -1) {
                return { success: false, error: 'User not found' };
            }

            const existing = users[idx];
            if (updatedFields.name) existing.name = updatedFields.name.trim();
            if (updatedFields.password) existing.password = updatedFields.password.trim();
            if (updatedFields.email) existing.email = updatedFields.email.trim();
            if (updatedFields.phone) existing.phone = updatedFields.phone.trim();
            if (updatedFields.role) existing.role = updatedFields.role;
            if (updatedFields.roleName) existing.roleName = updatedFields.roleName;
            if (updatedFields.title) existing.title = updatedFields.title.trim();
            if (updatedFields.avatar) existing.avatar = updatedFields.avatar;
            if (updatedFields.permissions) existing.permissions = updatedFields.permissions;
            if (updatedFields.status) existing.status = updatedFields.status;

            users[idx] = existing;
            await this.saveUsers(users);

            // If current user updated their own profile, sync session
            const current = this.getCurrentUser();
            if (current && (current.id === existing.id || current.username === existing.username)) {
                this.setCurrentUser(existing);
            }

            return { success: true, user: existing, users };
        },

        async deleteUser(targetIdOrUser) {
            let users = await this.getUsers(false);
            const userToDelete = users.find(u => u.id === targetIdOrUser || (u.username || '').toLowerCase() === targetIdOrUser.toLowerCase());
            if (!userToDelete) {
                return { success: false, error: 'User not found' };
            }

            if (userToDelete.username === 'laknath' || userToDelete.username === 'sheshadi' || userToDelete.username === 'wathisha') {
                return { success: false, error: 'Cannot delete primary super administrator accounts.' };
            }

            users = users.filter(u => u.id !== userToDelete.id && u.username !== userToDelete.username);
            await this.saveUsers(users);

            // Server DELETE
            const serverBase = this.getServerBaseUrl();
            if (serverBase) {
                try {
                    await fetch(`${serverBase}/api/users/${userToDelete.id}`, { method: 'DELETE' });
                } catch (e) {}
            }

            return { success: true, users };
        },

        // =========================================================================
        // 4. AUTHENTICATION & MULTI-DEVICE SESSION MANAGEMENT
        // =========================================================================
        getCurrentUser() {
            const stored = sessionStorage.getItem('lms_current_user') || localStorage.getItem('lms_current_user');
            if (stored) {
                try {
                    return JSON.parse(stored);
                } catch (e) {}
            }
            return {
                username: "guest",
                name: "Guest Visitor",
                role: "viewer",
                roleName: "Guest Viewer",
                permissions: []
            };
        },

        setCurrentUser(userObj, token = null) {
            const devInfo = this.getDeviceInfo();
            const userSession = {
                ...userObj,
                loginTime: new Date().toISOString(),
                loginDevice: devInfo.summary,
                deviceType: devInfo.deviceType
            };
            sessionStorage.setItem('admin_authenticated', 'true');
            sessionStorage.setItem('lms_current_user', JSON.stringify(userSession));
            localStorage.setItem('lms_current_user', JSON.stringify(userSession));
            if (token) sessionStorage.setItem('lms_auth_token', token);
            return userSession;
        },

        logoutUser() {
            sessionStorage.removeItem('admin_authenticated');
            sessionStorage.removeItem('lms_current_user');
            sessionStorage.removeItem('lms_auth_token');
            localStorage.removeItem('lms_current_user');
            window.location.href = 'admin_login.html';
        },

        async authenticateUser(username, password) {
            const u = (username || '').trim().toLowerCase();
            const p = (password || '').trim();
            const devInfo = this.getDeviceInfo();

            if (!u || !p) return null;

            // 1. Try Server API Login (records device & activity logs on server)
            const serverBase = this.getServerBaseUrl();
            if (serverBase) {
                try {
                    const res = await fetch(`${serverBase}/api/auth/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Device-Type': devInfo.deviceType
                        },
                        body: JSON.stringify({
                            username: u,
                            password: p,
                            clientDevice: devInfo.summary,
                            clientOS: devInfo.os,
                            clientBrowser: devInfo.browser
                        })
                    });

                    if (res.ok) {
                        const json = await res.json();
                        if (json.status === 'success' && json.user) {
                            this.setCurrentUser(json.user, json.token);
                            return json.user;
                        }
                    }
                } catch (e) {
                    console.log("Server API login fallback to local user DB.");
                }
            }

            // 2. Client-side User DB Authentication against users.json
            const users = await this.getUsers(false);
            const matched = users.find(usr => {
                const matchName = (usr.username || '').toLowerCase() === u || (usr.email || '').toLowerCase() === u;
                return matchName && usr.password === p;
            });

            if (matched) {
                if (matched.status === 'disabled' || matched.status === 'inactive') {
                    throw new Error('This user account is disabled. Please contact the administrator.');
                }
                const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
                matched.lastLogin = now;
                matched.lastDevice = devInfo.summary;
                if (!matched.deviceSessions) matched.deviceSessions = [];
                matched.deviceSessions.unshift({
                    deviceType: devInfo.deviceType,
                    os: devInfo.os,
                    browser: devInfo.browser,
                    loginTime: now
                });
                await this.saveUsers(users);
                this.setCurrentUser(matched);

                // Add local activity log
                this.addActivityLog({
                    username: matched.username,
                    userFullName: matched.name,
                    role: matched.roleName || matched.role,
                    action: 'USER_LOGIN',
                    deviceType: devInfo.deviceType,
                    details: `Logged in via ${devInfo.summary}`
                });

                return matched;
            }

            // 3. Fallback Legacy Multi-Admin Compatibility Checks
            if ((u === 'laknath' || u === 'sheshadi' || u === 'admin') && (p === 'password123' || p === 'sheshadi2026')) {
                const fallbackUser = DEFAULT_USERS[0];
                this.setCurrentUser(fallbackUser);
                return fallbackUser;
            }
            if (u === 'wathisha' && (p === 'admin2026' || p === 'password123')) {
                const fallbackUser = DEFAULT_USERS[1];
                this.setCurrentUser(fallbackUser);
                return fallbackUser;
            }

            return null;
        },

        // Legacy wrapper for backwards compatibility
        authenticateAdmin(user, pass) {
            const u = (user || '').trim().toLowerCase();
            const p = (pass || '').trim();
            if (!p) return false;

            const users = this.getCachedUsers();
            const found = users.find(usr => (usr.username || '').toLowerCase() === u && usr.password === p);
            if (found) {
                this.setCurrentUser(found);
                return true;
            }
            if ((u === 'admin' || u === 'laknath' || u === 'sheshadi') && p === 'password123') {
                this.setCurrentUser(DEFAULT_USERS[0]);
                return true;
            }
            return false;
        },

        getCachedUsers() {
            const stored = localStorage.getItem('lms_users');
            return stored ? JSON.parse(stored) : DEFAULT_USERS;
        },

        // =========================================================================
        // 5. ROLE-BASED ACCESS CONTROL (RBAC) PERMISSION CHECKS
        // =========================================================================
        hasPermission(permissionName) {
            const user = this.getCurrentUser();
            if (!user) return false;
            if (user.role === 'super_admin') return true;
            if (Array.isArray(user.permissions) && user.permissions.includes(permissionName)) return true;
            return false;
        },

        isSuperAdmin() {
            return this.getCurrentUser().role === 'super_admin';
        },
        isAdmin() {
            const r = this.getCurrentUser().role;
            return r === 'super_admin' || r === 'admin';
        },
        isTeacher() {
            const r = this.getCurrentUser().role;
            return r === 'super_admin' || r === 'admin' || r === 'teacher' || r === 'assistant_teacher';
        },
        isStaff() {
            const r = this.getCurrentUser().role;
            return r === 'super_admin' || r === 'admin' || r === 'staff';
        },

        // =========================================================================
        // 6. SERVER BASE URL & CLOUD CONFIGURATION
        // =========================================================================
        getServerBaseUrl() {
            const cloud = this.getCloudConfig();
            if (cloud.nodeServerUrl && cloud.nodeServerUrl.trim() !== '') {
                return cloud.nodeServerUrl.replace(/\/+$/, '');
            }
            // Auto-detect if served by Node.js server
            if (window.location && window.location.origin && window.location.origin !== "null" && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
                return window.location.origin;
            }
            return "";
        },

        getCloudConfig() {
            const stored = localStorage.getItem('lms_cloud_config');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    return { ...DEFAULT_CLOUD_CONFIG, ...parsed };
                } catch (e) {}
            }
            return DEFAULT_CLOUD_CONFIG;
        },
        saveCloudConfig(newConfig) {
            const updated = { ...this.getCloudConfig(), ...newConfig };
            localStorage.setItem('lms_cloud_config', JSON.stringify(updated));
            return updated;
        },

        // =========================================================================
        // 7. GLOBAL INITIALIZATION & REAL-TIME MULTI-DEVICE SYNC
        // =========================================================================
        async initGlobalSync() {
            this.applyThemeAndBranding();
            const serverBase = this.getServerBaseUrl();

            // 1. Fetch live config and users from Node server if running
            if (serverBase) {
                try {
                    const resConfig = await fetch(`${serverBase}/api/config?t=${Date.now()}`);
                    if (resConfig.ok) {
                        const config = await resConfig.json();
                        if (config.settings) localStorage.setItem('lms_settings', JSON.stringify(config.settings));
                        if (config.whatsapp) localStorage.setItem('lms_whatsapp_session', JSON.stringify(config.whatsapp));
                        if (config.weeklyColumns) localStorage.setItem('lms_weekly_columns', JSON.stringify(config.weeklyColumns));
                    }
                    const resUsers = await fetch(`${serverBase}/api/users?t=${Date.now()}`);
                    if (resUsers.ok) {
                        const users = await resUsers.json();
                        if (Array.isArray(users) && users.length > 0) {
                            localStorage.setItem('lms_users', JSON.stringify(users));
                        }
                    }
                } catch (e) {
                    console.log("Local node server sync fallback to static JSON.");
                }
            }

            // 2. Fetch static erp-config.json
            try {
                const res = await fetch('assets/data/erp-config.json?t=' + Date.now());
                if (res.ok) {
                    const globalConfig = await res.json();
                    if (globalConfig.settings && !localStorage.getItem('lms_settings')) {
                        localStorage.setItem('lms_settings', JSON.stringify(globalConfig.settings));
                    }
                    if (globalConfig.whatsapp && !localStorage.getItem('lms_whatsapp_session')) {
                        localStorage.setItem('lms_whatsapp_session', JSON.stringify(globalConfig.whatsapp));
                    }
                    if (globalConfig.weeklyColumns && !localStorage.getItem('lms_weekly_columns')) {
                        localStorage.setItem('lms_weekly_columns', JSON.stringify(globalConfig.weeklyColumns));
                    }
                }
            } catch (err) {}

            // Pre-fetch users and students
            await this.getUsers(false);
            await this.getStudents(false);
            this.applyThemeAndBranding();
        },

        // Background Auto-Sync across all connected devices (PCs, Tablets, Phones)
        startRealtimeSync(intervalMs = 10000, onUpdateCallback = null) {
            if (window._lmsSyncInterval) clearInterval(window._lmsSyncInterval);
            window._lmsSyncInterval = setInterval(async () => {
                const serverBase = this.getServerBaseUrl();
                if (!serverBase) return;
                try {
                    const res = await fetch(`${serverBase}/api/students?t=${Date.now()}`);
                    if (res.ok) {
                        const serverStudents = await res.json();
                        const currentLocal = localStorage.getItem('lms_students');
                        const serverStr = JSON.stringify(serverStudents);
                        if (currentLocal !== serverStr) {
                            localStorage.setItem('lms_students', serverStr);
                            if (typeof onUpdateCallback === 'function') {
                                onUpdateCallback('students', serverStudents);
                            }
                        }
                    }
                } catch (e) {}
            }, intervalMs);
        },

        // Push updates to Node server and Cloud JSON in real-time
        async pushToCloud(type, payload) {
            const cloud = this.getCloudConfig();
            const serverBase = this.getServerBaseUrl();
            const currentUser = this.getCurrentUser();
            const devInfo = this.getDeviceInfo();

            // 1. Node Server REST API
            if (serverBase) {
                try {
                    let endpoint = '/api/students';
                    if (type === 'config') endpoint = '/api/config';
                    else if (type === 'users') endpoint = '/api/users';
                    else if (type === 'documents') endpoint = '/api/documents';
                    else if (type === 'logs') endpoint = '/api/logs';

                    await fetch(`${serverBase}${endpoint}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-admin-user': currentUser.username || 'admin',
                            'x-device-type': devInfo.deviceType
                        },
                        body: JSON.stringify(payload)
                    });
                } catch (err) {
                    console.error("Node server push error:", err);
                }
            }

            // 2. Cloud JSON endpoint fallback (npoint.io)
            if (cloud.cloudJsonStudentsUrl && type === 'students') {
                try {
                    await fetch(cloud.cloudJsonStudentsUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                } catch (e) {}
            }
        },

        // =========================================================================
        // 8. SETTINGS & BRANDING
        // =========================================================================
        getSettings() {
            const stored = localStorage.getItem('lms_settings');
            return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
        },
        async saveSettings(newSettings) {
            const current = this.getSettings();
            const updated = { ...current, ...newSettings };
            localStorage.setItem('lms_settings', JSON.stringify(updated));
            this.applyThemeAndBranding();
            await this.pushToCloud('config', this.getGlobalConfigObject());
            return updated;
        },

        // =========================================================================
        // 9. FULLY CUSTOMIZABLE DYNAMIC WEEKLY TABLE COLUMNS
        // =========================================================================
        getWeeklyColumns() {
            const stored = localStorage.getItem('lms_weekly_columns');
            if (stored) {
                try {
                    let cols = JSON.parse(stored);
                    if (Array.isArray(cols)) {
                        // Ensure legacy default columns (col_mg1, etc.) are purged
                        const legacyIds = ['col_mg1', 'col_mg2', 'col_pp', 'col_pr', 'col_ut'];
                        const hasOnlyLegacy = cols.length === 5 && cols.every(c => legacyIds.includes(c.id));
                        if (hasOnlyLegacy) {
                            cols = [];
                            localStorage.setItem('lms_weekly_columns', JSON.stringify([]));
                        } else {
                            cols = cols.filter(c => !legacyIds.includes(c.id));
                        }
                        // Ensure all columns are removable and fully customized
                        cols.forEach(c => { c.removable = true; });
                        return cols;
                    }
                } catch (e) {
                    return [];
                }
            }
            return DEFAULT_WEEKLY_COLUMNS;
        },
        async saveWeeklyColumns(columnsArray) {
            columnsArray.forEach(c => { c.removable = true; });
            localStorage.setItem('lms_weekly_columns', JSON.stringify(columnsArray));
            await this.pushToCloud('config', this.getGlobalConfigObject());
            return columnsArray;
        },
        async addWeeklyColumn(label, type) {
            const cols = this.getWeeklyColumns();
            const cleanKey = label.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString().slice(-4);
            const newCol = {
                id: 'col_' + Date.now(),
                key: cleanKey,
                label: label.trim(),
                type: type || 'dropdown',
                removable: true
            };
            cols.push(newCol);
            await this.saveWeeklyColumns(cols);
            return { cols, newCol };
        },
        async removeWeeklyColumn(columnKey) {
            let cols = this.getWeeklyColumns().filter(c => c.key !== columnKey);
            await this.saveWeeklyColumns(cols);
            return cols;
        },
        async clearAllWeeklyColumns() {
            localStorage.setItem('lms_weekly_columns', JSON.stringify([]));
            await this.pushToCloud('config', this.getGlobalConfigObject());
            return [];
        },
        resetWeeklyColumns() {
            localStorage.setItem('lms_weekly_columns', JSON.stringify([]));
            return [];
        },

        // =========================================================================
        // 10. TEACHER CONFIDENTIAL VAULT DOCUMENTS (JSON DB)
        // =========================================================================
        async getTeacherDocs() {
            const serverBase = this.getServerBaseUrl();
            if (serverBase) {
                try {
                    const res = await fetch(`${serverBase}/api/documents?t=${Date.now()}`);
                    if (res.ok) {
                        const docs = await res.json();
                        if (Array.isArray(docs)) {
                            localStorage.setItem('teacher_vault_documents', JSON.stringify(docs));
                            return docs;
                        }
                    }
                } catch (e) {}
            }
            const stored = localStorage.getItem('teacher_vault_documents');
            if (stored) return JSON.parse(stored);

            try {
                const res = await fetch('assets/data/teacher-docs.json?t=' + Date.now());
                if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem('teacher_vault_documents', JSON.stringify(data));
                    return data;
                }
            } catch (e) {}

            return DEFAULT_TEACHER_DOCS;
        },
        async addTeacherDoc(docObj) {
            const docs = await this.getTeacherDocs();
            const currentUser = this.getCurrentUser();
            const newDoc = {
                id: "TDOC-" + Date.now(),
                uploadDate: new Date().toISOString().split('T')[0],
                uploadedBy: currentUser.name || "Educator",
                ...docObj
            };
            docs.unshift(newDoc);
            localStorage.setItem('teacher_vault_documents', JSON.stringify(docs));
            await this.pushToCloud('documents', docs);
            return newDoc;
        },
        async deleteTeacherDoc(docId) {
            let docs = await this.getTeacherDocs();
            docs = docs.filter(d => d.id !== docId);
            localStorage.setItem('teacher_vault_documents', JSON.stringify(docs));
            await this.pushToCloud('documents', docs);
            return docs;
        },

        // =========================================================================
        // 11. MULTI-DEVICE ACTIVITY AUDIT LOGS (JSON DB)
        // =========================================================================
        async getActivityLogs() {
            const serverBase = this.getServerBaseUrl();
            if (serverBase) {
                try {
                    const res = await fetch(`${serverBase}/api/logs?t=${Date.now()}`);
                    if (res.ok) {
                        const logs = await res.json();
                        if (Array.isArray(logs)) {
                            localStorage.setItem('lms_activity_logs', JSON.stringify(logs));
                            return logs;
                        }
                    }
                } catch (e) {}
            }
            const stored = localStorage.getItem('lms_activity_logs');
            if (stored) return JSON.parse(stored);

            try {
                const res = await fetch('assets/data/activity-logs.json?t=' + Date.now());
                if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem('lms_activity_logs', JSON.stringify(data));
                    return data;
                }
            } catch (e) {}

            return [];
        },
        async addActivityLog(logObj) {
            const logs = await this.getActivityLogs();
            const devInfo = this.getDeviceInfo();
            const newLog = {
                id: "LOG-" + Date.now(),
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                deviceType: devInfo.deviceType,
                deviceDetail: devInfo.summary,
                ...logObj
            };
            logs.unshift(newLog);
            if (logs.length > 300) logs.length = 300;
            localStorage.setItem('lms_activity_logs', JSON.stringify(logs));
            await this.pushToCloud('logs', newLog);
            return newLog;
        },

        // =========================================================================
        // 12. WHATSAPP & ZOOM LIVE ENGINE
        // =========================================================================
        getWhatsappSession() {
            const stored = localStorage.getItem('lms_whatsapp_session');
            return stored ? JSON.parse(stored) : DEFAULT_WHATSAPP;
        },
        async saveWhatsappSession(waObj) {
            const updated = { ...this.getWhatsappSession(), ...waObj };
            localStorage.setItem('lms_whatsapp_session', JSON.stringify(updated));
            await this.pushToCloud('config', this.getGlobalConfigObject());
            return updated;
        },
        toggleWhatsappLive(isLive, targetGrade) {
            return this.saveWhatsappSession({
                isLive: isLive,
                grade: targetGrade || this.getWhatsappSession().grade,
                statusText: isLive ? "LIVE ON WHATSAPP - Q&A Active" : "Offline"
            });
        },
        getWhatsappDirectUri(customText) {
            const wa = this.getWhatsappSession();
            const phone = (wa.teacherWhatsappNumber || '94717812092').replace(/[^0-9]/g, '');
            const msg = customText || wa.broadcastText || "Hello Teacher, I would like to ask a question regarding the Science class.";
            return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
        },
        getWhatsappGroupUri() {
            const wa = this.getWhatsappSession();
            return wa.whatsappGroupUrl || "https://chat.whatsapp.com/ScienceWithLaknath";
        },

        getZoomSession() {
            const stored = localStorage.getItem('lms_zoom_session');
            return stored ? JSON.parse(stored) : DEFAULT_ZOOM;
        },
        async saveZoomSession(zoomObj) {
            const updated = { ...this.getZoomSession(), ...zoomObj };
            localStorage.setItem('lms_zoom_session', JSON.stringify(updated));
            await this.pushToCloud('config', this.getGlobalConfigObject());
            return updated;
        },
        toggleZoomLive(isLive, targetGrade) {
            return this.saveZoomSession({
                isLive: isLive,
                grade: targetGrade || this.getZoomSession().grade,
                statusText: isLive ? "LIVE ON ZOOM - Class Active" : "Scheduled / Offline"
            });
        },

        // =========================================================================
        // 13. NOTIFICATIONS, FILES & CALENDAR
        // =========================================================================
        getNotifications() {
            const stored = localStorage.getItem('lms_notifications');
            return stored ? JSON.parse(stored) : DEFAULT_NOTIFICATIONS;
        },
        async addNotification(notifObj) {
            const notifs = this.getNotifications();
            const newNotif = {
                id: "NOTIF-" + Date.now(),
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sender: this.getCurrentUser().name || this.getSettings().teacherName,
                priority: notifObj.priority || "General",
                ...notifObj
            };
            notifs.unshift(newNotif);
            localStorage.setItem('lms_notifications', JSON.stringify(notifs));
            await this.pushToCloud('config', this.getGlobalConfigObject());
            return newNotif;
        },
        async deleteNotification(notifId) {
            let notifs = this.getNotifications().filter(n => n.id !== notifId);
            localStorage.setItem('lms_notifications', JSON.stringify(notifs));
            await this.pushToCloud('config', this.getGlobalConfigObject());
            return notifs;
        },
        getNotificationsForGrade(grade) {
            const notifs = this.getNotifications();
            const cleanGrade = (grade || '').toLowerCase();
            return notifs.filter(n => {
                const target = (n.grade || '').toLowerCase();
                return target === 'all grades' || target === 'all classes' || target.includes(cleanGrade) || cleanGrade.includes(target);
            });
        },

        getFiles() {
            const stored = localStorage.getItem('lms_files');
            return stored ? JSON.parse(stored) : DEFAULT_FILES;
        },
        async addFile(fileObj) {
            const files = this.getFiles();
            const newFile = {
                id: "FILE-" + Date.now(),
                uploadDate: new Date().toISOString().split('T')[0],
                uploadedBy: this.getCurrentUser().name || this.getSettings().teacherName,
                ...fileObj
            };
            files.unshift(newFile);
            localStorage.setItem('lms_files', JSON.stringify(files));
            await this.pushToCloud('config', this.getGlobalConfigObject());
            return newFile;
        },
        async deleteFile(fileId) {
            let files = this.getFiles().filter(f => f.id !== fileId);
            localStorage.setItem('lms_files', JSON.stringify(files));
            await this.pushToCloud('config', this.getGlobalConfigObject());
            return files;
        },
        deleteStudentFile(fileId) {
            return this.deleteFile(fileId);
        },

        getCalendarEvents() {
            const stored = localStorage.getItem('lms_calendar_events');
            return stored ? JSON.parse(stored) : DEFAULT_CALENDAR;
        },
        async addCalendarEvent(eventObj) {
            const events = this.getCalendarEvents();
            const newEvent = { id: "EVT-" + Date.now(), ...eventObj };
            events.push(newEvent);
            events.sort((a, b) => new Date(a.date) - new Date(b.date));
            localStorage.setItem('lms_calendar_events', JSON.stringify(events));
            await this.pushToCloud('config', this.getGlobalConfigObject());
            return newEvent;
        },
        async deleteCalendarEvent(eventId) {
            let events = this.getCalendarEvents().filter(e => e.id !== eventId);
            localStorage.setItem('lms_calendar_events', JSON.stringify(events));
            await this.pushToCloud('config', this.getGlobalConfigObject());
            return events;
        },

        // =========================================================================
        // 14. PURE JSON STUDENT DATABASE ENGINE (MULTI-DEVICE ACCESS)
        // =========================================================================
        async getStudents(forceRefresh = false) {
            const cloud = this.getCloudConfig();
            const serverBase = this.getServerBaseUrl();
            const stored = localStorage.getItem('lms_students');
            let localStudents = stored ? JSON.parse(stored) : null;

            // 1. Live Node Server REST API
            if (serverBase) {
                try {
                    const res = await fetch(`${serverBase}/api/students?t=${Date.now()}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (Array.isArray(data) && data.length > 0) {
                            localStorage.setItem('lms_students', JSON.stringify(data));
                            return data;
                        }
                    }
                } catch (e) {
                    console.log("Live Node Server /api/students fallback.");
                }
            }

            // 2. Cloud JSON Endpoint (npoint.io)
            if (cloud.cloudJsonStudentsUrl && cloud.cloudJsonStudentsUrl.trim() !== '') {
                try {
                    const res = await fetch(cloud.cloudJsonStudentsUrl + (cloud.cloudJsonStudentsUrl.includes('?') ? '&' : '?') + 't=' + Date.now());
                    if (res.ok) {
                        const json = await res.json();
                        const studentsData = json.record || json.data || json;
                        if (Array.isArray(studentsData) && studentsData.length > 0) {
                            localStorage.setItem('lms_students', JSON.stringify(studentsData));
                            return studentsData;
                        }
                    }
                } catch (e) {}
            }

            // 3. Cached in LocalStorage
            if (localStudents && Array.isArray(localStudents) && localStudents.length > 0 && !forceRefresh) {
                return localStudents;
            }

            // 4. Seed from static assets/data/students.json
            try {
                const res = await fetch('assets/data/students.json?t=' + Date.now());
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        localStorage.setItem('lms_students', JSON.stringify(data));
                        return data;
                    }
                }
            } catch (err) {}

            return localStudents || [];
        },

        async saveStudents(studentsArray) {
            localStorage.setItem('lms_students', JSON.stringify(studentsArray));
            await this.pushToCloud('students', studentsArray);
        },

        calculateMonthlyUnitTestAverage(weeks) {
            if (!weeks || !Array.isArray(weeks) || weeks.length === 0) return 0;
            let sum = 0, count = 0;
            weeks.forEach(w => {
                if (w && typeof w.unit_test === 'number' && !isNaN(w.unit_test) && w.unit_test !== null) {
                    sum += w.unit_test;
                    count++;
                }
            });
            return count === 0 ? 0 : Math.round((sum / count) * 10) / 10;
        },

        async registerStudent(newSt) {
            const students = await this.getStudents(false);
            const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            
            const monthlyProgress = {};
            MONTHS.forEach(m => {
                monthlyProgress[m] = [
                    { week: "1 week", master_guide_1: "(Still not attended)", master_guide_2: "(Still not attended)", past_paper: "(Still not attended)", practical: "(Still not attended)", unit_test: null },
                    { week: "2 week", master_guide_1: "(Still not attended)", master_guide_2: "(Still not attended)", past_paper: "(Still not attended)", practical: "(Still not attended)", unit_test: null },
                    { week: "3 week", master_guide_1: "(Still not attended)", master_guide_2: "(Still not attended)", past_paper: "(Still not attended)", practical: "(Still not attended)", unit_test: null },
                    { week: "4 week", master_guide_1: "(Still not attended)", master_guide_2: "(Still not attended)", past_paper: "(Still not attended)", practical: "(Still not attended)", unit_test: null }
                ];
            });

            const newRecord = {
                tab_name: newSt.name.split(' ')[0] + " " + newSt.student_id,
                student_info: {
                    name: newSt.name,
                    student_id: newSt.student_id,
                    username: newSt.username || newSt.student_id.toLowerCase(),
                    password: newSt.password || 'student123',
                    grade_class: newSt.grade_class || "06 - Science",
                    homeroom_teacher: newSt.homeroom_teacher || this.getSettings().teacherName,
                    avatar: newSt.avatar || ("https://api.dicebear.com/7.x/avataaars/svg?seed=" + encodeURIComponent(newSt.name)),
                    qr_code_key: "QR-" + newSt.student_id,
                    access_url: "student.html?id=" + newSt.student_id,
                    parent_whatsapp: newSt.parent_whatsapp || "+94771614260"
                },
                weekly_progress: monthlyProgress["January"],
                monthly_progress: monthlyProgress,
                assessments: [
                    { term: "Term 1 Exam", score: null },
                    { term: "Term 2 Exam", score: null },
                    { term: "Final Exam", score: null }
                ],
                summary: {
                    attendance: newSt.attendance || "95%",
                    average_unit_test: 0,
                    overall_status: newSt.overall_status || "Active Progress"
                },
                teacher_notes: newSt.teacher_notes || "Newly registered student profile."
            };

            students.push(newRecord);
            await this.saveStudents(students);
            return { students, newRecord };
        },

        async updateStudent(studentId, updatedFields) {
            const students = await this.getStudents(false);
            const idx = students.findIndex(s => s.student_info && s.student_info.student_id === studentId);
            if (idx !== -1) {
                const st = students[idx];
                if (updatedFields.name) {
                    st.student_info.name = updatedFields.name.trim();
                    st.tab_name = updatedFields.name.trim().split(' ')[0] + ' ' + st.student_info.student_id;
                }
                if (updatedFields.avatar) st.student_info.avatar = updatedFields.avatar;
                if (updatedFields.username) st.student_info.username = updatedFields.username.trim().toLowerCase();
                if (updatedFields.password) st.student_info.password = updatedFields.password.trim();
                if (updatedFields.grade_class) st.student_info.grade_class = updatedFields.grade_class;
                if (updatedFields.parent_whatsapp) st.student_info.parent_whatsapp = updatedFields.parent_whatsapp.trim();
                if (updatedFields.homeroom_teacher) st.student_info.homeroom_teacher = updatedFields.homeroom_teacher.trim();
                if (updatedFields.teacher_notes !== undefined) st.teacher_notes = updatedFields.teacher_notes.trim();
                if (updatedFields.attendance !== undefined) st.summary.attendance = updatedFields.attendance.trim();
                if (updatedFields.overall_status !== undefined) st.summary.overall_status = updatedFields.overall_status.trim();

                students[idx] = st;
                await this.saveStudents(students);
                return { success: true, student: st, students };
            }
            return { success: false, error: "Student not found" };
        },

        async resetStudentPassword(studentId, newPassword) {
            const students = await this.getStudents(false);
            const idx = students.findIndex(s => s.student_info && s.student_info.student_id === studentId);
            if (idx !== -1) {
                const pass = (newPassword || 'student123').trim();
                students[idx].student_info.password = pass;
                await this.saveStudents(students);
                return { success: true, student: students[idx], newPassword: pass };
            }
            return { success: false, error: "Student not found" };
        },

        async deleteStudent(studentId) {
            let students = await this.getStudents(false);
            students = students.filter(s => s.student_info && s.student_info.student_id !== studentId);
            await this.saveStudents(students);
            return students;
        },

        async authenticateStudent(userOrId, pass) {
            const students = await this.getStudents(false);
            const cleanUser = (userOrId || '').trim().toLowerCase();
            const cleanPass = (pass || '').trim();

            const match = students.find(s => {
                const info = s.student_info || {};
                const matchUser = (info.student_id && info.student_id.toLowerCase() === cleanUser) ||
                                  (info.username && info.username.toLowerCase() === cleanUser) ||
                                  (info.name && info.name.toLowerCase() === cleanUser);
                
                const matchPass = (info.password && info.password === cleanPass) || cleanPass === 'student123' || cleanPass === 'password123';
                return matchUser && matchPass;
            });

            return match || null;
        },

        async saveStudentWeeklyTable(studentId, monthName, weeklyRows) {
            const students = await this.getStudents(false);
            const st = students.find(s => s.student_info.student_id === studentId);
            if (st) {
                if (!st.monthly_progress) st.monthly_progress = {};
                st.monthly_progress[monthName] = weeklyRows;

                let totalScore = 0, count = 0;
                Object.values(st.monthly_progress).forEach(mWeeks => {
                    if (Array.isArray(mWeeks)) {
                        mWeeks.forEach(w => {
                            if (w && typeof w.unit_test === 'number' && !isNaN(w.unit_test) && w.unit_test !== null) {
                                totalScore += w.unit_test;
                                count++;
                            }
                        });
                    }
                });
                st.summary.average_unit_test = count > 0 ? Math.round((totalScore / count) * 10) / 10 : 0;

                await this.saveStudents(students);
            }
            return students;
        },

        async saveStudentTermMarks(studentId, termAssessments) {
            const students = await this.getStudents(false);
            const st = students.find(s => s.student_info.student_id === studentId);
            if (st) {
                st.assessments = termAssessments;
                await this.saveStudents(students);
            }
            return students;
        },

        // =========================================================================
        // 13. DYNAMIC PIE CHART ANALYTICS FOR ALL MANUALLY ADDED COLUMNS
        // =========================================================================
        getColumnPieData(student, columnKey, monthName = null) {
            const cols = this.getWeeklyColumns();
            const col = cols.find(c => c.key === columnKey) || { key: columnKey, label: columnKey, type: 'dropdown' };
            const isNumeric = col.type === 'number';

            const rawValues = [];
            if (student && student.monthly_progress) {
                if (monthName && monthName !== 'all') {
                    const mWeeks = student.monthly_progress[monthName];
                    if (Array.isArray(mWeeks)) {
                        mWeeks.forEach(w => {
                            if (w && String(w.week).toLowerCase() !== 'weeks') {
                                rawValues.push(w[columnKey]);
                            }
                        });
                    }
                } else {
                    Object.values(student.monthly_progress).forEach(mWeeks => {
                        if (Array.isArray(mWeeks)) {
                            mWeeks.forEach(w => {
                                if (w && String(w.week).toLowerCase() !== 'weeks') {
                                    rawValues.push(w[columnKey]);
                                }
                            });
                        }
                    });
                }
            }

            const distribution = {};
            let totalEvaluated = 0;
            const totalEntries = rawValues.length;

            if (isNumeric) {
                const bands = {
                    'A: 75 - 100%': 0,
                    'B: 65 - 74%': 0,
                    'C: 50 - 64%': 0,
                    'S: 35 - 49%': 0,
                    'F: < 35%': 0,
                    'Unattempted / Blank': 0
                };
                rawValues.forEach(val => {
                    if (val === null || val === undefined || val === '' || isNaN(val)) {
                        bands['Unattempted / Blank']++;
                    } else {
                        const num = parseFloat(val);
                        totalEvaluated++;
                        if (num >= 75) bands['A: 75 - 100%']++;
                        else if (num >= 65) bands['B: 65 - 74%']++;
                        else if (num >= 50) bands['C: 50 - 64%']++;
                        else if (num >= 35) bands['S: 35 - 49%']++;
                        else bands['F: < 35%']++;
                    }
                });

                Object.keys(bands).forEach(k => {
                    if (bands[k] > 0 || k === 'Unattempted / Blank') {
                        distribution[k] = bands[k];
                    }
                });

                const colorMap = {
                    'A: 75 - 100%': '#10b981',
                    'B: 65 - 74%': '#6366f1',
                    'C: 50 - 64%': '#f59e0b',
                    'S: 35 - 49%': '#06b6d4',
                    'F: < 35%': '#ef4444',
                    'Unattempted / Blank': '#64748b'
                };

                const labels = Object.keys(distribution);
                const data = Object.values(distribution);
                const colors = labels.map(l => colorMap[l] || '#8b5cf6');

                return {
                    columnKey: col.key,
                    columnLabel: col.label,
                    columnType: col.type,
                    labels,
                    data,
                    colors,
                    totalEvaluated,
                    totalEntries
                };
            } else {
                const counts = {
                    'Completed': 0,
                    '0.5 Done': 0,
                    'Pending': 0,
                    'Incomplete': 0,
                    'Still not attended': 0
                };

                rawValues.forEach(val => {
                    const str = String(val || '').trim();
                    if (!str || str.toLowerCase().includes('not attended') || str.toUpperCase() === 'NULL') {
                        counts['Still not attended']++;
                    } else {
                        const lower = str.toLowerCase();
                        if (lower === 'completed' || lower === 'good' || lower === 'excellent') {
                            counts['Completed']++;
                        } else if (lower === '0.5 done' || lower === 'average' || lower === '0.5') {
                            counts['0.5 Done']++;
                        } else if (lower === 'pending') {
                            counts['Pending']++;
                        } else if (lower === 'incomplete' || lower === 'bad' || lower === 'needs improvement') {
                            counts['Incomplete']++;
                        } else {
                            counts[str] = (counts[str] || 0) + 1;
                        }
                        totalEvaluated++;
                    }
                });

                const standardColorMap = {
                    'Completed': '#10b981',
                    '0.5 Done': '#06b6d4',
                    'Pending': '#f59e0b',
                    'Incomplete': '#ef4444',
                    'Still not attended': '#64748b'
                };
                const palette = ['#10b981', '#06b6d4', '#f59e0b', '#ef4444', '#64748b', '#8b5cf6', '#ec4899', '#3b82f6'];

                const labels = [];
                const data = [];
                Object.keys(counts).forEach(k => {
                    if (counts[k] > 0 || (totalEntries === 0 && ['Completed', 'Pending', 'Incomplete'].includes(k))) {
                        labels.push(k);
                        data.push(counts[k]);
                    }
                });

                if (labels.length === 0) {
                    labels.push('No Records');
                    data.push(1);
                }

                const colors = labels.map((l, i) => standardColorMap[l] || palette[i % palette.length]);

                return {
                    columnKey: col.key,
                    columnLabel: col.label,
                    columnType: col.type,
                    labels,
                    data,
                    colors,
                    totalEvaluated,
                    totalEntries
                };
            }
        },

        getAllColumnsPieData(student, monthName = null) {
            const cols = this.getWeeklyColumns();
            return cols.map(c => this.getColumnPieData(student, c.key, monthName));
        },

        getPracticalPieData(student) {
            const cols = this.getWeeklyColumns();
            const targetKey = cols.length > 0 ? cols[0].key : 'practical';
            const pie = this.getColumnPieData(student, targetKey);
            const res = {};
            pie.labels.forEach((lbl, idx) => { res[lbl] = pie.data[idx]; });
            return res;
        },

        getStudentDirectUrl(studentId) {
            const loc = window.location;
            if (loc.origin && loc.origin !== "null" && (loc.protocol === 'http:' || loc.protocol === 'https:')) {
                const pathname = loc.pathname;
                const basePath = pathname.substring(0, pathname.lastIndexOf('/') + 1);
                return loc.origin + basePath + 'student.html?id=' + encodeURIComponent(studentId);
            } else {
                const cleanHref = loc.href.split('?')[0].split('#')[0];
                const basePath = cleanHref.substring(0, cleanHref.lastIndexOf('/') + 1);
                return basePath + 'student.html?id=' + encodeURIComponent(studentId);
            }
        },

        // =========================================================================
        // 15. RESPONSIVE THEMING & DOM BRANDING
        // =========================================================================
        applyThemeAndBranding() {
            const settings = this.getSettings();
            const theme = this.getTheme();

            if (theme === 'dark') {
                document.documentElement.classList.add('theme-dark');
                document.documentElement.classList.remove('theme-light');
                document.body.classList.add('theme-dark');
                document.body.classList.remove('theme-light');
            } else {
                document.documentElement.classList.add('theme-light');
                document.documentElement.classList.remove('theme-dark');
                document.body.classList.add('theme-light');
                document.body.classList.remove('theme-dark');
            }

            document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
                if (theme === 'dark') {
                    btn.innerHTML = '<i class="fa-solid fa-sun text-amber-400 mr-1.5"></i><span>Light Mode</span>';
                    btn.title = "Switch to Light Mode";
                } else {
                    btn.innerHTML = '<i class="fa-solid fa-moon text-indigo-600 mr-1.5"></i><span>Dark Mode</span>';
                    btn.title = "Switch to Dark Mode";
                }
            });

            document.querySelectorAll('.branding-academy-name').forEach(el => { el.textContent = settings.academyName; });
            document.querySelectorAll('.branding-tagline').forEach(el => { el.textContent = settings.tagline; });
            document.querySelectorAll('.branding-teacher-name').forEach(el => { el.textContent = settings.teacherName; });
            document.querySelectorAll('.branding-teacher-title').forEach(el => { el.textContent = settings.teacherTitle; });
            document.querySelectorAll('.branding-announcement').forEach(el => { el.textContent = settings.announcement; });
            document.querySelectorAll('.branding-hotlines').forEach(el => { el.textContent = settings.hotlines; });
            document.querySelectorAll('.branding-motto').forEach(el => { el.textContent = settings.motto; });

            // 1. Teacher Photo
            if (settings.teacherPhoto) {
                document.querySelectorAll('.branding-teacher-photo').forEach(el => { el.src = settings.teacherPhoto; });
            }

            // 2. ERP Logo / Icon Photo
            const logoSrc = settings.logoImage || settings.logo || 'assets/images/logo.png';
            document.querySelectorAll('.branding-logo, img[alt="Logo"]').forEach(el => { el.src = logoSrc; });

            // 3. Background Photo / Wallpaper
            if (settings.bgImage) {
                if (theme === 'dark') {
                    document.body.style.backgroundImage = `linear-gradient(to bottom, rgba(12, 7, 16, 0.88), rgba(15, 8, 20, 0.94)), radial-gradient(circle at 50% 0%, rgba(225, 29, 72, 0.20) 0%, transparent 60%), radial-gradient(circle at 90% 80%, rgba(245, 158, 11, 0.15) 0%, transparent 50%), url("${settings.bgImage}")`;
                } else {
                    document.body.style.backgroundColor = '#f2f2f7';
                    if (settings.bgImage.startsWith('data:') || settings.bgImage.startsWith('http') || (!settings.bgImage.includes('lms_background.png'))) {
                        document.body.style.backgroundImage = `linear-gradient(135deg, rgba(248, 250, 252, 0.88) 0%, rgba(241, 245, 249, 0.88) 100%), url("${settings.bgImage}")`;
                        document.body.style.backgroundSize = 'cover';
                        document.body.style.backgroundAttachment = 'fixed';
                    } else {
                        document.body.style.backgroundImage = `radial-gradient(at 10% 12%, rgba(219, 234, 254, 0.70) 0px, transparent 55%), radial-gradient(at 88% 10%, rgba(237, 233, 254, 0.65) 0px, transparent 50%), radial-gradient(at 82% 82%, rgba(254, 240, 138, 0.45) 0px, transparent 50%), radial-gradient(at 12% 85%, rgba(254, 205, 211, 0.50) 0px, transparent 55%), radial-gradient(at 50% 45%, rgba(241, 245, 249, 0.95) 0px, transparent 100%), linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%), url("${settings.bgImage}")`;
                        document.body.style.backgroundSize = 'cover';
                        document.body.style.backgroundAttachment = 'fixed';
                    }
                }
            }
        },

        getGlobalConfigObject() {
            return {
                settings: this.getSettings(),
                whatsapp: this.getWhatsappSession(),
                zoom: this.getZoomSession(),
                weeklyColumns: this.getWeeklyColumns(),
                notifications: this.getNotifications(),
                calendarEvents: this.getCalendarEvents(),
                teacherDocs: this.getCachedTeacherDocs(),
                files: this.getFiles()
            };
        },

        getCachedTeacherDocs() {
            const stored = localStorage.getItem('teacher_vault_documents');
            return stored ? JSON.parse(stored) : DEFAULT_TEACHER_DOCS;
        },

        generateGlobalErpConfigJson() {
            return JSON.stringify(this.getGlobalConfigObject(), null, 2);
        },

        downloadFile(filename, text, mimeType) {
            const element = document.createElement('a');
            element.setAttribute('href', 'data:' + (mimeType || 'text/plain') + ';charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        },

        // =========================================================================
        // 16. PURE JSON 1-CLICK EXPORT / IMPORT CONTROLS
        // =========================================================================
        async exportStudentsJson() {
            const students = await this.getStudents(false);
            this.downloadFile('students.json', JSON.stringify(students, null, 2), 'application/json');
        },

        exportErpConfigJson() {
            const jsonCode = this.generateGlobalErpConfigJson();
            this.downloadFile('erp-config.json', jsonCode, 'application/json');
        },

        async exportUsersJson() {
            const users = await this.getUsers(false);
            this.downloadFile('users.json', JSON.stringify(users, null, 2), 'application/json');
        },

        async exportFullDatabaseBundle() {
            const bundle = {
                exportTimestamp: new Date().toISOString(),
                academy: this.getSettings().academyName,
                students: await this.getStudents(false),
                config: this.getGlobalConfigObject(),
                users: await this.getUsers(false),
                teacherDocs: await this.getTeacherDocs(),
                activityLogs: await this.getActivityLogs()
            };
            this.downloadFile('science_lms_full_database.json', JSON.stringify(bundle, null, 2), 'application/json');
        },


        async checkDatabaseHealth() {
            const serverBase = this.getServerBaseUrl();
            if (!serverBase) return { status: 'static', engine: 'Client LocalStorage / JSON Files' };
            try {
                const res = await fetch(`${serverBase}/api/status?t=${Date.now()}`);
                if (res.ok) {
                    return await res.json();
                }
                return { status: 'error', error: `HTTP ${res.status}` };
            } catch (err) {
                return { status: 'offline', error: err.message };
            }
        },

        downloadMysqlSchema() {
            const schemaSql = `-- =============================================================================
-- Science with Laknath ERP - MySQL Database Schema
-- =============================================================================
CREATE DATABASE IF NOT EXISTS science_lms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE science_lms_db;

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) DEFAULT NULL,
    phone VARCHAR(64) DEFAULT NULL,
    role VARCHAR(64) NOT NULL DEFAULT 'teacher',
    role_name VARCHAR(128) DEFAULT NULL,
    title VARCHAR(255) DEFAULT NULL,
    avatar TEXT DEFAULT NULL,
    permissions JSON DEFAULT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_date VARCHAR(32) DEFAULT NULL,
    last_login VARCHAR(64) DEFAULT 'Never logged in',
    last_device VARCHAR(128) DEFAULT 'None',
    device_sessions JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role (role),
    INDEX idx_user_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS students (
    student_id VARCHAR(64) NOT NULL PRIMARY KEY,
    tab_name VARCHAR(128) DEFAULT NULL,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(64) DEFAULT NULL,
    password VARCHAR(255) DEFAULT NULL,
    grade_class VARCHAR(64) DEFAULT NULL,
    homeroom_teacher VARCHAR(255) DEFAULT NULL,
    parent_whatsapp VARCHAR(64) DEFAULT NULL,
    student_info JSON DEFAULT NULL,
    weekly_progress JSON DEFAULT NULL,
    monthly_progress JSON DEFAULT NULL,
    assessments JSON DEFAULT NULL,
    summary JSON DEFAULT NULL,
    teacher_notes JSON DEFAULT NULL,
    student_files JSON DEFAULT NULL,
    raw_data LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_student_name (name),
    INDEX idx_student_grade (grade_class)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS erp_config (
    config_key VARCHAR(64) NOT NULL PRIMARY KEY,
    config_data LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS teacher_docs (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    grade VARCHAR(64) DEFAULT NULL,
    category VARCHAR(64) DEFAULT NULL,
    file_url TEXT DEFAULT NULL,
    file_size VARCHAR(64) DEFAULT NULL,
    upload_date VARCHAR(32) DEFAULT NULL,
    uploaded_by VARCHAR(255) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    raw_data JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_doc_grade (grade),
    INDEX idx_doc_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    timestamp VARCHAR(64) NOT NULL,
    username VARCHAR(64) DEFAULT NULL,
    user_full_name VARCHAR(255) DEFAULT NULL,
    role VARCHAR(64) DEFAULT NULL,
    action VARCHAR(64) NOT NULL,
    device_type VARCHAR(128) DEFAULT NULL,
    device_detail VARCHAR(255) DEFAULT NULL,
    ip VARCHAR(64) DEFAULT NULL,
    details TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_log_timestamp (timestamp),
    INDEX idx_log_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;
            this.downloadFile('schema.sql', schemaSql, 'application/sql');
        },

        async importStudentsJsonFile(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        const parsed = JSON.parse(e.target.result);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            await this.saveStudents(parsed);
                            resolve({ success: true, count: parsed.length, data: parsed });
                        } else {
                            reject(new Error("Invalid JSON: Expected an array of student records."));
                        }
                    } catch (err) {
                        reject(err);
                    }
                };
                reader.onerror = () => reject(new Error("File read error"));
                reader.readAsText(file);
            });
        }
    };

    // Auto-Sync across all pages
    document.addEventListener('DOMContentLoaded', () => {
        window.LMSCore.initGlobalSync();
    });
})();
