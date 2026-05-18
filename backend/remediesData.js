const remediesData = {
    "Flu": {
        "remedies": [
            "Garam paani aur adrak ki chai pijiye (Hot ginger tea).",
            "Din mein 2 baar bhaap (Steam) lijiye.",
            "Poora aaraam karein aur thanda paani bilkul na piyein."
        ],
        "tips": "AC se bachein aur hamesha garam kapde pehnein."
    },
    "Common Cold": {
        "remedies": [
            "Garam paani mein namak dalkar garare (Saltwater gargles) karein.",
            "Raat ko sone se pehle Haldi wala doodh (Golden milk) pijiye.",
            "Tulsi aur shahad (Honey) ka sevan karein."
        ],
        "tips": "Naak aur gale ko thand se bachayein."
    },
    "Typhoid": {
        "remedies": [
            "Halka khana khayein jaise Moong dal ki khichdi ya Daliya.",
            "Paani ko ubaal kar (Boiled water) hi piyein.",
            "Kishmish aur khoob sara saaf paani pijiye."
        ],
        "tips": "Bahar ka khana aur khuli hui cheezein bilkul na khayein."
    },
    "Malaria": {
        "remedies": [
            "Khane mein adrak aur dalchini (Cinnamon) ka use karein.",
            "Papeeta aur seb (Apple) jaise phal khayein.",
            "Sharir mein paani ki kami na hone dein."
        ],
        "tips": "Machhardani (Mosquito net) ka use karein aur ghar ke paas paani jama na hone dein."
    },
    "Dengue": {
        "remedies": [
            "Papeete ke patto ka ras (Papaya leaf juice) platelets ke liye accha hai.",
            "Nariyal paani (Coconut water) aur Bakri ka doodh pijiye.",
            "Khoob sara aaraam (Complete rest) karein."
        ],
        "tips": "Platelets count par dhyan dein aur turant doctor se milein."
    },
    "Migraine": {
        "remedies": [
            "Sir par thande paani ki patti (Cold compress) rakhein.",
            "Andhere aur shant kamre mein thodi der so jayein.",
            "Zada paani piyein aur stress kam karein."
        ],
        "tips": "Tez roshni (Bright lights) aur mobile screen se bachein."
    },
    "Food Poisoning": {
        "remedies": [
            "ORS ka ghol pijiye taaki kamzori na aaye.",
            "Kela (Banana) aur dahi-chawal khayein.",
            "Nimbu paani mein thoda namak dalkar piyein."
        ],
        "tips": "Spicy aur tel wala khana (Oily food) kuch din band rakhein."
    },
    "Acidity": {
        "remedies": [
            "Khane ke baad thodi Saunf (Fennel seeds) chabayein.",
            "Thanda doodh (Cold milk) ya nariyal paani pijiye.",
            "Thoda sa Gud (Jaggery) khane ke baad lein."
        ],
        "tips": "Khana khate hi turant na soyein, thodi der taheliye."
    },
    "Diabetes": {
        "remedies": [
            "Methi dana (Fenugreek) ka paani subah khali pet piyein.",
            "Jamun aur Karele ka juice sugar control mein madad karta hai.",
            "Khane mein fibre zada lein jaise hari sabziyan."
        ],
        "tips": "Rozana 30 minute paidal chalein (Morning walk)."
    },
    "Fungal infection": {
        "remedies": [
            "Infected jagah ko saaf aur sookha (Dry) rakhein.",
            "Neem ke patto ko paani mein ubaal kar usse nahayein.",
            "Dheele aur sooti (Cotton) kapde pehnein."
        ],
        "tips": "Dusro ke kapde ya towel use na karein."
    },
    "Healthy": {
        "remedies": [
            "Rozana exercise aur yoga karein.",
            "Har din 8-10 glass paani pijiye.",
            "Hari sabziyan aur phal khayein."
        ],
        "tips": "Sahi waqt par soyein aur stress se bachein."
    }
};

function getRemedies(disease, symptoms = []) {
    let defaultRemedies = [];
    let customTips = "Saaf-safai ka dhyan rakhein aur bheed wali jagah se bachein.";

    // Generate dynamic remedies based on custom symptoms
    let lowerSymptoms = [];
    if (Array.isArray(symptoms)) {
        lowerSymptoms = symptoms.map(s => s ? s.toLowerCase() : "");
    }

    const symptomText = lowerSymptoms.join(" ");

    if (symptomText.includes("fever") || symptomText.includes("bukhar") || symptomText.includes("hot")) {
        defaultRemedies.push("Thande paani ki patti sir par rakhein aur aaraam karein.");
    }
    if (symptomText.includes("pain") || symptomText.includes("ache") || symptomText.includes("dard")) {
        defaultRemedies.push("Dard wali jagah par garm sikaai (warm compress) karein.");
    }
    if (symptomText.includes("stomach") || symptomText.includes("nausea") || symptomText.includes("vomit") || symptomText.includes("pet")) {
        defaultRemedies.push("Halka khana khayein aur nimbu paani pijiye.");
    }
    if (symptomText.includes("cough") || symptomText.includes("throat") || symptomText.includes("khasi")) {
        defaultRemedies.push("Garam paani mein namak daalkar garare karein aur adrak lein.");
    }
    if (symptomText.includes("weak") || symptomText.includes("fatigue") || symptomText.includes("kamzori")) {
        defaultRemedies.push("Khoob saara paani piyein, juice lein aur poora aaraam karein.");
    }
    if (symptomText.includes("skin") || symptomText.includes("rash") || symptomText.includes("itch")) {
        defaultRemedies.push("Infected jagah ko saaf rakhein aur thande paani se dhoye.");
    }
    if (symptomText.includes("breath") || symptomText.includes("chest") || symptomText.includes("saans")) {
        defaultRemedies.push("Bhaap (Steam) lijiye aur sidhe baithne ki koshish karein. Agar takleef bade to turant doctor ko dikhayein.");
        customTips = "Saans lene mein takleef ko ignore na karein, emergency help lein.";
    }

    if (defaultRemedies.length === 0) {
        defaultRemedies = [
            "Khoob sara paani piyein aur aaraam karein.",
            "Halka aur ghar ka bana khana hi khayein.",
            "Agar takleef zada ho toh turant doctor ko dikhayein."
        ];
    } else {
        // Add a general one to complete the list
        defaultRemedies.push("Agar symptoms 2-3 din mein theek na ho, toh doctor se salaah lein.");
        // Limit to 3 remedies
        defaultRemedies = defaultRemedies.slice(0, 3);
    }

    const defaultRemedyObj = {
        "remedies": defaultRemedies,
        "tips": customTips
    };

    // If it's a perfectly matched known disease, we can return its specific data, 
    // BUT we also want to blend in the dynamic remedies if it's generic.
    if (remediesData[disease] && !symptomText.includes("none")) {
        return remediesData[disease];
    }

    return defaultRemedyObj;
}

module.exports = getRemedies;
