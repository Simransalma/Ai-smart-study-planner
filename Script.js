const API_KEY = "AIzaSyB8BaMoltJanATB3x83eKis6qqQP_f5GEs"; // Replace with your actual API key

document.getElementById("plannerForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const subject = document.getElementById("subject").value.trim();
    const time = document.getElementById("time").value.trim();
    const level = document.getElementById("level").value;

    if (!subject || !time || !level) {
        alert("Please fill in all fields!");
        return;
    }

    const userPrompt = Learn ${subject} in ${time} as a ${level};
    generateStudyPlan(userPrompt);
});

document.getElementById("userInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        handleUserInput();
    }
});

function handleUserInput() {
    const input = document.getElementById("userInput").value.trim();
    if (!input) return;

    addMessage(input, "user");
    generateStudyPlan(input);
    document.getElementById("userInput").value = "";
}

function addMessage(text, sender = "bot") {
    const chatBox = document.getElementById("chatBox");
    const msg = document.createElement("div");
    msg.className = sender === "bot" ? "bot-msg" : "user-msg";
    msg.innerText = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function generateStudyPlan(userPrompt) {
    addMessage("Thinking... 🧠", "bot");

    const prompt = `
Given the user's selected study topic, available study time, and experience level:
- *Break down* the learning process into *structured milestones* with clear progress markers.
- *Provide concise yet effective* learning steps that improve understanding and retention.
- *Highlight key concepts*, essential resources, and practical exercises for mastery.
- *Format content using lists* for readability and easy reference.
- *Incorporate quizzes* to reinforce learning at each stage.
- *Include motivational messages* to keep the user engaged and confident.
- *Ensure adaptability so the study plan adjusts based on user progress and evolving learning goals.*
- *Keep the content under 250 words.*
"${userPrompt}"
    `;

    try {
        const response = await fetch(https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn’t generate a plan.";

        addMessage(reply, "bot");
    } catch (error) {
        console.error("Error:", error);
        addMessage("Oops! Something went wrong. Please try again.", "bot");
    }
}
