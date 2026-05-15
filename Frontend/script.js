document.addEventListener('DOMContentLoaded', () => {
    // Main App Elements
    const mainApp = document.getElementById('main-app');
    const symptomSearch = document.getElementById('symptom-search');
    const addSymptomBtn = document.getElementById('add-symptom-btn');
    const selectedTagsContainer = document.getElementById('selected-tags');
    const predictBtn = document.getElementById('predict-btn');
    const loadingOverlay = document.getElementById('loading-overlay');

    // Result Page Elements
    const resultPage = document.getElementById('result-page');
    const riskBadgeFull = document.getElementById('risk-badge-full');
    const resultTitleMain = document.getElementById('result-title-main');
    const resultSubtitle = document.getElementById('result-subtitle');
    const remediesGrid = document.getElementById('remedies-grid');
    const restartBtnFull = document.getElementById('restart-btn-full');

    // State
    const allWorldSymptoms = [
        "Abdominal Pain", "Acidity", "Anxiety", "Back Pain", "Blisters", "Body Ache",
        "Breathlessness", "Burning Micturition", "Chest Pain", "Chills", "Cold", "Constipation",
        "Cough", "Depression", "Diarrhea", "Dizziness", "Fatigue", "Fever", "Headache",
        "Heartburn", "High Fever", "Hypoglycemia", "Indigestion", "Insomnia", "Itching",
        "Joint Pain", "Loss of Appetite", "Muscle Pain", "Nausea", "Neck Pain", "Palpitations",
        "Rash", "Redness", "Runny Nose", "Shivering", "Shortness of Breath", "Skin Rash",
        "Sneezing", "Sore Throat", "Stiffness", "Stomach Pain", "Sweating", "Swelling",
        "Throat Irritation", "Vomiting", "Watery Eyes", "Weakness", "Weight Loss"
    ].sort();

    let selectedSymptoms = [];

    // Initialization
    function init() {
        renderSymptomsGrid();
        updateUI();
        setupDropdowns();
    }

    // Dropdown Logic
    function setupDropdowns() {
        const triggers = [
            { trigger: 'notif-trigger-main', menu: 'notif-dropdown-main' },
            { trigger: 'profile-trigger-main', menu: 'profile-dropdown-main' },
            { trigger: 'notif-trigger-result', menu: 'notif-dropdown-result' },
            { trigger: 'profile-trigger-result', menu: 'profile-dropdown-result' },
            { trigger: 'notif-trigger-loading', menu: 'notif-dropdown-loading' }
        ];

        triggers.forEach(({ trigger, menu }) => {
            const triggerEl = document.getElementById(trigger);
            const menuEl = document.getElementById(menu);

            if (triggerEl && menuEl) {
                triggerEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Close other menus
                    document.querySelectorAll('.dropdown-menu').forEach(m => {
                        if (m !== menuEl) m.classList.remove('active');
                    });
                    menuEl.classList.toggle('active');
                });
            }
        });

        // Close on outside click
        document.addEventListener('click', () => {
            document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('active'));
        });

        // Settings Modal Logic
        const settingsModal = document.getElementById('settings-modal');
        const openSettingsBtns = ['open-settings-main', 'open-settings-result'];
        const closeSettingsBtn = document.getElementById('close-settings');
        const cancelSettingsBtn = document.getElementById('cancel-settings');
        const saveSettingsBtn = document.getElementById('save-settings');

        openSettingsBtns.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    settingsModal.classList.remove('hidden');
                    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('active'));
                };
            }
        });

        const closeSettings = () => settingsModal.classList.add('hidden');
        if (closeSettingsBtn) closeSettingsBtn.onclick = closeSettings;
        if (cancelSettingsBtn) cancelSettingsBtn.onclick = closeSettings;
        if (saveSettingsBtn) {
            saveSettingsBtn.onclick = () => {
                alert('Settings saved successfully!');
                closeSettings();
            };
        }

        // Close modal if clicking on backdrop
        settingsModal.onclick = (e) => {
            if (e.target === settingsModal) closeSettings();
        };

        // Notification Detail Modal Logic
        const notifModal = document.getElementById('notif-modal');
        const notifModalTitle = document.getElementById('notif-modal-title');
        const notifModalBody = document.getElementById('notif-modal-body');
        const notifModalIcon = document.getElementById('notif-modal-icon');
        const closeNotifBtn = document.getElementById('close-notif-modal');
        const markReadBtn = document.getElementById('notif-modal-action');

        document.querySelectorAll('.notification-item').forEach(item => {
            item.onclick = (e) => {
                e.stopPropagation();
                const title = item.getAttribute('data-notif-title');
                const body = item.getAttribute('data-notif-body');
                const icon = item.getAttribute('data-notif-icon');
                const color = item.getAttribute('data-notif-color');

                notifModalTitle.textContent = title;
                notifModalBody.textContent = body;

                // Set Icon
                const iconI = notifModalIcon.querySelector('i');
                iconI.className = `fa-solid ${icon}`;
                notifModalIcon.className = `notif-icon large-notif-icon ${color}`;

                notifModal.classList.remove('hidden');
                document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('active'));
            };
        });

        const closeNotif = () => notifModal.classList.add('hidden');
        if (closeNotifBtn) closeNotifBtn.onclick = closeNotif;
        if (markReadBtn) markReadBtn.onclick = closeNotif;

        notifModal.onclick = (e) => {
            if (e.target === notifModal) closeNotif();
        };

        // Analysis History Logic
        const historyModal = document.getElementById('history-modal');
        const openHistoryMain = document.getElementById('open-history-main');
        const closeHistoryBtn = document.getElementById('close-history-modal');
        const clearHistoryBtn = document.getElementById('clear-history');
        const historyList = document.getElementById('history-list');

        const saveToHistory = (data, symptoms) => {
            let history = JSON.parse(localStorage.getItem('health_history') || '[]');
            const entry = {
                id: Date.now(),
                date: new Date().toLocaleString(),
                disease: data.disease,
                risk: data.risk_level,
                symptoms: symptoms
            };
            history.unshift(entry);
            localStorage.setItem('health_history', JSON.stringify(history));
        };

        const renderHistory = () => {
            let history = JSON.parse(localStorage.getItem('health_history') || '[]');
            if (history.length === 0) {
                historyList.innerHTML = `
                    <div class="empty-history">
                        <i class="fa-solid fa-folder-open"></i>
                        <p>No past reports found.</p>
                    </div>`;
                return;
            }

            historyList.innerHTML = history.map(item => `
                <div class="history-item">
                    <div class="hist-main">
                        <h4>${item.disease}</h4>
                        <p>${item.date} • ${item.symptoms.length} Symptoms</p>
                    </div>
                    <div class="hist-badge badge-${item.risk.toLowerCase().substring(0, 3)}">${item.risk.toUpperCase()}</div>
                </div>
            `).join('');
        };

        const openHistoryBtns = ['open-history-main', 'open-history-result'];

        openHistoryBtns.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    renderHistory();
                    historyModal.classList.remove('hidden');
                    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('active'));
                };
            }
        });

        const closeHistory = () => historyModal.classList.add('hidden');
        if (closeHistoryBtn) closeHistoryBtn.onclick = closeHistory;
        if (clearHistoryBtn) {
            clearHistoryBtn.onclick = () => {
                if (confirm('Are you sure you want to clear all history?')) {
                    localStorage.removeItem('health_history');
                    renderHistory();
                }
            };
        }
        historyModal.onclick = (e) => {
            if (e.target === historyModal) closeHistory();
        };

        // Live AI Chat Logic
        const chatBubble = document.getElementById('chat-bubble');
        const chatWindow = document.getElementById('chat-window');
        const closeChatBtn = document.getElementById('close-chat');
        const chatInput = document.getElementById('chat-input');
        const sendChatBtn = document.getElementById('send-chat-btn');
        const chatMessages = document.getElementById('chat-messages');

        const toggleChat = () => {
            chatWindow.classList.toggle('hidden');
            chatBubble.querySelector('.bubble-notif')?.remove();
        };

        chatBubble.onclick = toggleChat;
        closeChatBtn.onclick = toggleChat;

        const addMessage = (text, type) => {
            const msg = document.createElement('div');
            msg.className = `message ${type}-msg`;
            msg.innerHTML = `<div class="msg-bubble">${text}</div>`;
            chatMessages.appendChild(msg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        const handleChat = () => {
            const text = chatInput.value.trim();
            if (!text) return;

            addMessage(text, 'user');
            chatInput.value = '';

            // Simulated AI Response
            setTimeout(() => {
                let response = "I'm analyzing your question. Please remember I'm an AI, and for serious concerns, you should consult a doctor.";
                const lowText = text.toLowerCase();

                // Detect Hindi text (Devanagari script)
                const isHindiScript = /[\u0900-\u097F]/.test(text);
                
                // Detect Gujarati text (Gujarati script)
                const isGujaratiScript = /[\u0A80-\u0AFF]/.test(text);
                
                // Detect Hinglish (Hindi in Roman script)
                const hinglishWords = ['kya', 'kaise', 'hai', 'hain', 'mujhe', 'mera', 'bukhar', 'dard', 'dawae', 'karo', 'namaste', 'shukriya', 'batao', 'koi', 'bimari', 'kuch', 'raha'];
                const isHinglish = hinglishWords.some(word => lowText.match(new RegExp('\\b' + word + '\\b')));

                if (isHindiScript) {
                    response = "मैं आपके सवाल का विश्लेषण कर रहा हूँ। कृपया याद रखें कि मैं एक एआई (AI) हूँ, और गंभीर चिंताओं के लिए, आपको डॉक्टर से परामर्श करना चाहिए।";
                    
                    if (text.includes('बुखार')) response = "बुखार अक्सर इस बात का संकेत होता है कि आपका शरीर संक्रमण से लड़ रहा है। खूब पानी पिएं और आराम करें।";
                    else if (text.includes('दर्द') || text.includes('सिरदर्द')) response = "सिरदर्द तनाव, पानी की कमी, या आंखों के तनाव के कारण हो सकता है। थोड़ा आराम करने की कोशिश करें।";
                    else if (text.includes('नमस्ते') || text.includes('हेलो')) response = "नमस्ते! मैं आज आपकी स्वास्थ्य संबंधी चिंताओं में कैसे मदद कर सकता हूँ?";
                    else if (text.includes('धन्यवाद') || text.includes('शुक्रिया')) response = "आपका स्वागत है! स्वस्थ रहें।";
                } else if (isGujaratiScript) {
                    response = "હું તમારા પ્રશ્નનું વિશ્લેષણ કરી રહ્યો છું. કૃપા કરીને યાદ રાખો કે હું એક AI છું, અને ગંભીર ચિંતાઓ માટે, તમારે ડૉક્ટરની સલાહ લેવી જોઈએ.";
                    
                    if (text.includes('તાવ')) response = "તાવ વારંવાર એ વાતનો સંકેત છે કે તમારું શરીર ચેપ સામે લડી રહ્યું છે. ખૂબ પાણી પીવો અને આરામ કરો.";
                    else if (text.includes('દુખાવો') || text.includes('માથું')) response = "માથાનો દુખાવો તણાવ, પાણીની કમી અથવા આંખના તાણને કારણે થઈ શકે છે. થોડો આરામ કરવાનો પ્રયાસ કરો.";
                    else if (text.includes('નમસ્તે') || text.includes('હેલો')) response = "નમસ્તે! આજે હું તમારી સ્વાસ્થ્ય સમસ્યાઓમાં કેવી રીતે મદદ કરી શકું?";
                    else if (text.includes('આભાર')) response = "તમારું સ્વાગત છે! સ્વસ્થ રહો.";
                } else if (isHinglish) {
                    response = "Main aapke sawal ko samajh raha hu. Kripya dhyan de ki main ek AI hu, aur gambhir samasya ke liye aapko kisi doctor se salah leni chahiye.";
                    
                    if (lowText.includes('bukhar') || lowText.includes('fever')) response = "Bukhar aksar is baat ka sanket hota hai ki aapka sharir infection se lad raha hai. Khub pani piyein aur aaram karein.";
                    else if (lowText.includes('dard') || lowText.includes('sir')) response = "Sir dard stress ya pani ki kami se ho sakta hai. Thoda aaram karne ki koshish karein.";
                    else if (lowText.includes('namaste') || lowText.includes('hello')) response = "Namaste! Main aaj aapki health ke baare mein kaise madad kar sakta hu?";
                    else if (lowText.includes('shukriya') || lowText.includes('dhanyawad') || lowText.includes('thank')) response = "Aapka swagat hai! Swasth rahein.";
                } else {
                    response = "I'm analyzing your question. Please remember I'm an AI, and for serious concerns, you should consult a doctor.";
                    
                    if (lowText.includes('fever')) response = "A fever is often a sign that your body is fighting an infection. Make sure to stay hydrated and rest.";
                    else if (lowText.includes('headache')) response = "Headaches can be caused by stress, dehydration, or eye strain. Try resting in a dark room.";
                    else if (lowText.includes('hello') || lowText.includes('hi')) response = "Hello! How can I assist you with your health concerns today?";
                    else if (lowText.includes('thank')) response = "You're welcome! Stay healthy.";
                }

                addMessage(response, 'ai');
            }, 1000);
        };

        sendChatBtn.onclick = handleChat;
        chatInput.onkeypress = (e) => { if (e.key === 'Enter') handleChat(); };

        // Expose saveToHistory for use in prediction
        window.saveToHistory = saveToHistory;
    }

    // Render Browse Grid
    function renderSymptomsGrid() {
        const grid = document.getElementById('symptoms-grid');
        if (!grid) return;

        grid.innerHTML = '';
        allWorldSymptoms.forEach(symptom => {
            const chip = document.createElement('div');
            chip.className = `quick-chip ${selectedSymptoms.includes(symptom) ? 'selected' : ''}`;
            chip.textContent = symptom;
            chip.onclick = () => toggleSymptom(symptom);
            grid.appendChild(chip);
        });
    }

    // Toggle Symptom Selection
    function toggleSymptom(symptom) {
        if (selectedSymptoms.includes(symptom)) {
            selectedSymptoms = selectedSymptoms.filter(s => s !== symptom);
        } else {
            selectedSymptoms.push(symptom);
        }
        updateUI();
        renderSymptomsGrid();
    }

    // Add Symptom Logic (Search)
    function addSymptom() {
        const value = symptomSearch.value.trim();
        if (value) {
            // Find closest match or add as new
            const match = allWorldSymptoms.find(s => s.toLowerCase() === value.toLowerCase());
            const finalValue = match || value;

            if (!selectedSymptoms.includes(finalValue)) {
                selectedSymptoms.push(finalValue);
                symptomSearch.value = '';
                updateUI();
                renderSymptomsGrid();
            }
        }
    }

    if (addSymptomBtn) addSymptomBtn.onclick = addSymptom;
    symptomSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addSymptom();
    });

    // Remove Symptom
    function removeSymptom(symptom) {
        selectedSymptoms = selectedSymptoms.filter(s => s !== symptom);
        updateUI();
        renderSymptomsGrid();
    }

    // Update UI Elements
    function updateUI() {
        if (!selectedTagsContainer) return;

        selectedTagsContainer.innerHTML = '';
        if (selectedSymptoms.length === 0) {
            selectedTagsContainer.innerHTML = '<div class="placeholder-text">No symptoms added yet.</div>';
        } else {
            selectedSymptoms.forEach(symptom => {
                const token = document.createElement('div');
                token.className = 'symptom-token';
                token.innerHTML = `${symptom} <i class="fa-solid fa-xmark"></i>`;
                token.querySelector('i').onclick = () => removeSymptom(symptom);
                selectedTagsContainer.appendChild(token);
            });
        }

        if (predictBtn) predictBtn.disabled = selectedSymptoms.length === 0;
    }

    // API Prediction
    if (predictBtn) {
        predictBtn.addEventListener('click', async () => {
            if (selectedSymptoms.length === 0) return;

            loadingOverlay.classList.remove('hidden');

            // Animation Stages Logic
            const progressBar = document.getElementById('loading-progress-bar');
            const progressText = document.getElementById('loading-percentage');
            const stages = [
                document.getElementById('stage-1'),
                document.getElementById('stage-2'),
                document.getElementById('stage-3')
            ];

            // Start Animation
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 5;
                if (progress > 100) progress = 100;

                progressBar.style.width = `${progress}%`;
                progressText.textContent = `${Math.floor(progress)}%`;

                // Update Stage Cards
                if (progress > 30) {
                    stages[0].className = 'status-tile complete';
                    stages[1].className = 'status-tile in-progress';
                }
                if (progress > 70) {
                    stages[1].className = 'status-tile complete';
                    stages[2].className = 'status-tile in-progress';
                }
                if (progress >= 100) {
                    stages[2].className = 'status-tile complete';
                    clearInterval(interval);
                }
            }, 100);

            try {
                const response = await fetch('http://localhost:5000/api/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ symptoms: selectedSymptoms })
                });

                const data = await response.json();

                if (response.ok) {
                    setTimeout(() => {
                        showResult(data);

                        // Save to history
                        if (window.saveToHistory) {
                            window.saveToHistory(data, selectedSymptoms);
                        }

                        loadingOverlay.classList.add('hidden');
                        // Reset progress for next use
                        progressBar.style.width = '0%';
                        progressText.textContent = '0%';
                        stages[0].className = 'stage-card complete';
                        stages[1].className = 'stage-card pending';
                        stages[2].className = 'stage-card pending';
                    }, 2500); // Wait for animation to finish
                } else {
                    throw new Error(data.error || 'Prediction failed');
                }

            } catch (error) {
                console.error('Error:', error);
                alert('Connection Error: Please ensure the backend server is running on port 5000.');
                loadingOverlay.classList.add('hidden');
                clearInterval(interval);
            }
        });
    }

    // Display Results Full Page
    function showResult(data) {
        const { disease, risk_level, predictions, remedies, tips } = data;

        // Hide Main App and Navbar, Show Result Page
        mainApp.classList.add('hidden');
        document.querySelector('.navbar').classList.add('hidden');
        resultPage.classList.remove('hidden');
        window.scrollTo(0, 0);

        // Update Title and Subtitle based on Risk
        if (risk_level === 'Danger' || risk_level === 'High') {
            riskBadgeFull.textContent = 'HIGH RISK LEVEL';
            riskBadgeFull.className = 'status-badge risk-high-alt';
            resultTitleMain.textContent = `Alert: Potential ${disease}`;
            resultSubtitle.textContent = "Your symptoms indicate a high-risk condition. Immediate medical consultation is required.";
            riskBadgeFull.style.background = '#ffebe6';
            riskBadgeFull.style.color = '#bf2600';
        } else if (risk_level === 'Medium' || risk_level === 'Moderate') {
            riskBadgeFull.textContent = 'MODERATE RISK LEVEL';
            riskBadgeFull.className = 'status-badge risk-medium-alt';
            resultTitleMain.textContent = `Caution: ${disease} Symptoms`;
            resultSubtitle.textContent = "Your symptoms suggest a moderate health risk. We recommend scheduling a check-up soon.";
            riskBadgeFull.style.background = '#fffadc';
            riskBadgeFull.style.color = '#856600';
        } else {
            riskBadgeFull.textContent = 'LOW RISK LEVEL';
            riskBadgeFull.className = 'status-badge risk-low-alt';
            resultTitleMain.textContent = "Your Health Risk is Low";
            resultSubtitle.textContent = "Based on your reported metrics and AI analysis, your current health status appears stable.";
            riskBadgeFull.style.background = '#e3fcef';
            riskBadgeFull.style.color = '#006644';
        }

        // Populate Remedies Grid (Real-time from Model)
        remediesGrid.innerHTML = '';
        if (remedies && remedies.length > 0) {
            remedies.forEach((remedy, index) => {
                // Keyword-based Icon Selection
                let icon = 'fa-circle-info';
                let color = 'blue-bg';
                const lowerRem = remedy.toLowerCase();

                if (lowerRem.includes('water') || lowerRem.includes('paani') || lowerRem.includes('hydrate') || lowerRem.includes('liquid')) {
                    icon = 'fa-droplet';
                    color = 'blue-bg';
                } else if (lowerRem.includes('sleep') || lowerRem.includes('rest') || lowerRem.includes('soyein') || lowerRem.includes('aaraam')) {
                    icon = 'fa-moon';
                    color = 'purple-bg';
                } else if (lowerRem.includes('eat') || lowerRem.includes('food') || lowerRem.includes('khana') || lowerRem.includes('diet') || lowerRem.includes('doodh') || lowerRem.includes('juice')) {
                    icon = 'fa-utensils';
                    color = 'orange-bg';
                } else if (lowerRem.includes('exercise') || lowerRem.includes('walk') || lowerRem.includes('yoga') || lowerRem.includes('chalein')) {
                    icon = 'fa-heart-pulse';
                    color = 'blue-bg';
                } else if (lowerRem.includes('steam') || lowerRem.includes('bhaap') || lowerRem.includes('tea') || lowerRem.includes('chai') || lowerRem.includes('garam')) {
                    icon = 'fa-mug-hot';
                    color = 'orange-bg';
                } else if (lowerRem.includes('wash') || lowerRem.includes('saaf') || lowerRem.includes('clean')) {
                    icon = 'fa-soap';
                    color = 'purple-bg';
                }

                const card = document.createElement('div');
                card.className = 'info-card';
                card.innerHTML = `
                    <div class="info-icon ${color}"><i class="fa-solid ${icon}"></i></div>
                    <h4>Recommendation ${index + 1}</h4>
                    <p>${remedy}</p>
                `;
                remediesGrid.appendChild(card);
            });
        } else {
            remediesGrid.innerHTML = '<div class="info-card"><p>No specific home care found for this condition. Please consult a doctor.</p></div>';
        }

        // Setup Download Feature with current data
        const downloadBtnFull = document.getElementById('download-btn-full');
        if (downloadBtnFull) {
            downloadBtnFull.onclick = () => downloadReport(data, selectedSymptoms);
        }
    }

    // Download Report Functionality (High Reliability PDF)
    function downloadReport(data, symptomsUsed) {
        console.log("Starting PDF Download Process");

        const { disease, risk_level, predictions, remedies, tips } = data;
        const date = new Date().toLocaleDateString();
        const filename = `Health_Report_${disease.replace(/\s+/g, '_')}.pdf`;

        // UI Feedback
        const btn = document.getElementById('download-btn-full');
        const oldText = btn.innerHTML;
        btn.innerHTML = '🕒 Creating PDF...';
        btn.disabled = true;

        try {
            // Check if jsPDF is available (more reliable for text)
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Set Title
            doc.setFontSize(22);
            doc.setTextColor(0, 82, 204);
            doc.text("HealthAI Diagnostic Report", 105, 20, { align: 'center' });

            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Generated on: ${date}`, 105, 28, { align: 'center' });

            // Horizontal Line
            doc.setDrawColor(0, 82, 204);
            doc.line(20, 35, 190, 35);

            // Diagnosis section
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text(`Primary Diagnosis: ${disease}`, 20, 50);

            doc.setFontSize(12);
            doc.text(`Risk Assessment: ${risk_level}`, 20, 60);

            // Symptoms
            doc.setFontSize(14);
            doc.setTextColor(0, 82, 204);
            doc.text("Symptoms Evaluated:", 20, 85);
            doc.setFontSize(11);
            doc.setTextColor(50, 50, 50);
            const symptomsText = symptomsUsed && symptomsUsed.length > 0 ? symptomsUsed.join(', ') : 'None provided';
            const splitSymptoms = doc.splitTextToSize(symptomsText, 170);
            doc.text(splitSymptoms, 20, 92);

            // Recommendations
            doc.setFontSize(14);
            doc.setTextColor(0, 82, 204);
            doc.text("Recommendations:", 20, 120);
            doc.setFontSize(11);
            doc.setTextColor(50, 50, 50);
            let yPos = 127;
            if (remedies && remedies.length > 0) {
                remedies.forEach(rem => {
                    doc.text(`• ${rem}`, 25, yPos);
                    yPos += 8;
                });
            } else {
                doc.text("• Consult a doctor for professional advice.", 25, yPos);
            }

            // AI Note
            if (tips) {
                yPos += 10;
                doc.setFontSize(12);
                doc.setTextColor(133, 100, 0);
                doc.text("AI Physician's Notes:", 20, yPos);
                doc.setFontSize(10);
                const splitTips = doc.splitTextToSize(tips, 170);
                doc.text(splitTips, 20, yPos + 7);
            }

            // Footer
            doc.setFontSize(9);
            doc.setTextColor(150, 150, 150);
            const disclaimer = "DISCLAIMER: This report is for informational purposes only and is not a clinical medical diagnosis. Please consult with a healthcare professional.";
            const splitDisclaimer = doc.splitTextToSize(disclaimer, 170);
            doc.text(splitDisclaimer, 105, 280, { align: 'center' });

            // Save the PDF
            doc.save(filename);

            // Success reset
            btn.innerHTML = oldText;
            btn.disabled = false;
            console.log("PDF generated and saved.");

        } catch (error) {
            console.error("jsPDF failed, trying html2pdf fallback:", error);

            // Fallback to html2pdf if jsPDF fails
            if (typeof html2pdf !== 'undefined') {
                const element = document.getElementById('result-page');
                html2pdf().from(element).save(filename).then(() => {
                    btn.innerHTML = oldText;
                    btn.disabled = false;
                });
            } else {
                alert("PDF generation failed. Please use your browser's Print feature (Ctrl+P) to save as PDF.");
                btn.innerHTML = oldText;
                btn.disabled = false;
            }
        }
    }

    // Restart Logic
    if (restartBtnFull) {
        restartBtnFull.onclick = () => {
            resultPage.classList.add('hidden');
            mainApp.classList.remove('hidden');
            document.querySelector('.navbar').classList.remove('hidden');
            selectedSymptoms = [];
            updateUI();
            renderSymptomsGrid();
            window.scrollTo(0, 0);
        };
    }

    // Maps Functionality
    document.querySelectorAll('.maps-btn').forEach(btn => {
        btn.onclick = () => {
            window.open('https://www.google.com/maps/search/hospitals+near+me', '_blank');
        };
    });

    init();
});
