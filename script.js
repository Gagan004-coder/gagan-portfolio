document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. DYNAMIC LIGHT/DARK THEME SWITCHER
    // ----------------------------------------------------
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check system preference or localStorage
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        htmlElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        showToast(`Switched to ${newTheme.toUpperCase()} mode!`, 'info');
    });

    // ----------------------------------------------------
    // 2. SCROLL PROGRESS & NAVBAR SCROLL STYLE
    // ----------------------------------------------------
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        // Scroll height calculations
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';

        // Add/remove class to navbar on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ----------------------------------------------------
    // 3. MOBILE MENU TOGGLE
    // ----------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active Navigation Highlight on Scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - varHeaderHeightThreshold())) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    function varHeaderHeightThreshold() {
        return window.innerWidth > 992 ? 120 : 90;
    }

    // ----------------------------------------------------
    // 4. SCROLL REVEAL ANIMATIONS (Intersection Observer)
    // ----------------------------------------------------
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const skillFills = document.querySelectorAll('.skill-bar .fill');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                
                // If it is the skills section or a card, trigger progress bar animation
                if (entry.target.classList.contains('skills') || entry.target.contains(skillFills[0])) {
                    animateSkills();
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Animate skill bars
    function animateSkills() {
        skillFills.forEach(bar => {
            const width = bar.style.width;
            // Clear inline style and force reflow
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }

    // ----------------------------------------------------
    // 5. PROJECTS GRID FILTERING
    // ----------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active to current
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'flex';
                    // Trigger reflow for fade animation
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ----------------------------------------------------
    // 6. INTERACTIVE DEVELOPER CONSOLE (Terminal Simulator)
    // ----------------------------------------------------
    const terminalInput = document.getElementById('terminal-input');
    const terminalHistory = document.getElementById('terminal-history');
    const terminalBody = document.getElementById('terminal-body');
    const terminalContainer = document.getElementById('terminal-emulator-container');

    // Make clicking the terminal container focus the input
    if (terminalContainer) {
        terminalContainer.addEventListener('click', () => {
            terminalInput.focus();
        });
    }

    // Resume structure database
    const gaganResumeData = {
        bio: `Gagan - Computer Science Student (9.01 CGPA)\nLocation: Kolar, Karnataka, India\nEmail: gag903536@gmail.com | Phone: +91 9035362292\nLooking for: Jan-Jul 2027 Apprenticeship`,
        skills: `DATA ENGINEERING & DB:\n  - SQL, MySQL Query Optimization, ETL Pipelines\n  - Data Warehousing, exposure to PySpark & Databricks\n\nCLOUD PLATFORMS:\n  - Microsoft Azure (AI/ML Deployment, Fundamentals)\n  - GCP (Cloud Run, Pub/Sub, Cloud Modernization)\n\nDEVOPS & MONITORING:\n  - Docker, Kubernetes, Unix/Shell Scripting\n  - Prometheus, Grafana, AWS CloudWatch, CI/CD\n\nLANGUAGES & ANALYTICS:\n  - Python (Primary), Java, C, C++, JavaScript\n  - Generative AI, NLP, Predictive Modeling, Power BI`,
        projects: `1. SMART ICU: IoT Data Pipeline & Risk Prediction System (2025-2026)\n   - Real-time physiological streams ingestion using IoT sensors.\n   - Low-latency emergency alerting and Azure/GCP cloud storage.\n   - Predictive AI warning scores 12-24 hours in advance.\n\n2. SELF-HEALING CONTAINERIZED INFRASTRUCTURE (2026)\n   - Resilient multi-service architecture using Docker.\n   - System health metrics logging & Grafana/Prometheus dashboard.\n   - Automated SRE health checks and container restart scripts.\n\n3. AIRLINE DATA MANAGEMENT SYSTEM (2024)\n   - Optimized relational MySQL schemas & indices.\n   - Custom Java GUI interface for airline booking administrative tasks.`,
        experience: `AI & Azure Cloud Virtual Intern (May 2025 - June 2025)\nEdunet Foundation (Microsoft & AICTE Partnered)\n- Developed and deployed machine learning pipelines on Azure Cloud.\n- Solidified understanding of Neural Networks, GenAI, and unstructured data handling.`,
        certifications: `- Google Career Launchpad Certification\n- Google Cloud: Arcade Facilitator Program (Data Cloud, Cloud Security, Infra)\n- Infosys Springboard: Python Fundamentals & Front-End Development`,
        contact: `Email: gag903536@gmail.com\nPhone: +91 9035362292\nGitHub: github.com/gagan\nLinkedIn: linkedin.com/in/gagan`
    };

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const commandText = terminalInput.value.trim();
                const commandLower = commandText.toLowerCase();

                if (commandText === '') return;

                // Add prompt and command to history
                appendTerminalLine(`guest@gagan.dev:$ ${commandText}`, 'terminal-output-command');
                
                // Clear input
                terminalInput.value = '';

                // Process command
                processTerminalCommand(commandLower);
            }
        });
    }

    function appendTerminalLine(text, className = '') {
        const line = document.createElement('div');
        line.className = className ? `terminal-line ${className}` : 'terminal-line';
        
        if (className === 'terminal-output-command') {
            line.innerHTML = text;
        } else {
            const pre = document.createElement('pre');
            pre.className = 'terminal-response';
            pre.innerHTML = text;
            line.appendChild(pre);
        }

        terminalHistory.appendChild(line);
        // Scroll terminal to bottom
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function processTerminalCommand(cmd) {
        const parts = cmd.split(' ');
        const mainCmd = parts[0];

        switch(mainCmd) {
            case 'help':
                appendTerminalLine(
                    `Available Commands:\n` +
                    `  <span class="term-info">about</span>          - Print academic bio and location\n` +
                    `  <span class="term-info">skills</span>         - List technical skills categorized\n` +
                    `  <span class="term-info">projects</span>       - View details of key engineering projects\n` +
                    `  <span class="term-info">experience</span>     - Show internships and professional background\n` +
                    `  <span class="term-info">certifications</span> - Display cloud and software certifications\n` +
                    `  <span class="term-info">contact</span>        - Get direct email, phone and social media links\n` +
                    `  <span class="term-info">clear</span>          - Clear the terminal logs\n` +
                    `  <span class="term-info">theme</span>          - Toggle dark/light theme stylesheet`
                );
                break;
            case 'about':
                appendTerminalLine(`Retrieving Gagan's profile from cloud database...`, 'term-highlight');
                setTimeout(() => {
                    appendTerminalLine(gaganResumeData.bio);
                }, 250);
                break;
            case 'skills':
                appendTerminalLine(`Loading skills matrix...`, 'term-highlight');
                setTimeout(() => {
                    appendTerminalLine(gaganResumeData.skills);
                }, 250);
                break;
            case 'projects':
                appendTerminalLine(`Querying project repositories...`, 'term-highlight');
                setTimeout(() => {
                    appendTerminalLine(gaganResumeData.projects);
                }, 300);
                break;
            case 'experience':
                appendTerminalLine(`Reading professional timeline...`, 'term-highlight');
                setTimeout(() => {
                    appendTerminalLine(gaganResumeData.experience);
                }, 250);
                break;
            case 'certifications':
                appendTerminalLine(`Verifying certificates against Google and Infosys vaults...`, 'term-highlight');
                setTimeout(() => {
                    appendTerminalLine(gaganResumeData.certifications);
                }, 350);
                break;
            case 'contact':
                appendTerminalLine(gaganResumeData.contact);
                break;
            case 'clear':
                terminalHistory.innerHTML = '';
                break;
            case 'theme':
                themeToggle.click();
                break;
            default:
                appendTerminalLine(
                    `gsh: command not found: <span class="term-error">${escapeHtml(mainCmd)}</span>. Type <span class="term-highlight">help</span> for a list of available commands.`,
                    'term-error'
                );
        }
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // ----------------------------------------------------
    // 7. CONTACT FORM SUBMISSION SIMULATION
    // ----------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const subject = subjectInput.value.trim();
            const message = messageInput.value.trim();

            if (!name || !email || !subject || !message) {
                showToast("Please fill in all form fields.", "error");
                return;
            }

            // Simulate form submission
            const btnSubmit = document.getElementById('btn-submit-form');
            const originalText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = `Sending... <span class="status-dot"></span>`;
            btnSubmit.disabled = true;

            setTimeout(() => {
                // Success actions
                showToast(`Thank you, ${name}! Your simulated message was received.`, "success");
                contactForm.reset();
                btnSubmit.innerHTML = originalText;
                btnSubmit.disabled = false;

                // Log contact message to the terminal console if user wants to check!
                appendTerminalLine(
                    `[SYSTEM] Incoming mock contact message queued:\n` +
                    `  Name: ${name}\n` +
                    `  Email: ${email}\n` +
                    `  Subject: ${subject}\n` +
                    `  Message: "${message.substring(0, 30)}..."`,
                    'term-success'
                );
            }, 1200);
        });
    }

    // ----------------------------------------------------
    // 8. CERTIFICATES & ATTACHMENT CLICKS TOAST SIMULATOR
    // ----------------------------------------------------
    const interactiveLinks = [
        { id: 'link-internship-certificate', name: 'AI & Azure Cloud Internship Certificate' },
        { id: 'link-cert-google-launchpad', name: 'Google Career Launchpad Certificate' }
    ];

    interactiveLinks.forEach(linkInfo => {
        const el = document.getElementById(linkInfo.id);
        if (el) {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                showToast(`Credential for '${linkInfo.name}' is verified under GCP/Azure directory.`, 'success');
            });
        }
    });

    // ----------------------------------------------------
    // 9. TOAST NOTIFICATIONS HELPER
    // ----------------------------------------------------
    const toastContainer = document.getElementById('toast-container');

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        
        let typeSymbol = '✓';
        if (type === 'info') {
            typeSymbol = 'ℹ';
            toast.style.borderColor = 'var(--accent-color)';
            toast.style.borderLeftColor = 'var(--accent-color)';
        } else if (type === 'error') {
            typeSymbol = '✕';
            toast.style.borderColor = '#ef4444';
            toast.style.borderLeftColor = '#ef4444';
        }

        toast.innerHTML = `<span class="toast-symbol">${typeSymbol}</span> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        // Auto remove toast
        setTimeout(() => {
            toast.classList.add('removing');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3500);
    }
});
