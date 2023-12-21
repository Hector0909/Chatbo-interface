import { API_KEY } from './config.js';
const submitBtn = document.getElementById('submitbtn');
const conversation = []; // Initialize the conversation chain

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createChatBubble(text, className) {
    const div = document.createElement('div');
    const chatBubble = document.createElement('p');
    const chatbox = document.getElementById('chatbox');

    chatbox.appendChild(div);
    div.appendChild(chatBubble);
    chatBubble.textContent = text;
    chatBubble.className = className;
    chatbox.scrollTop = chatbox.scrollHeight;
}

async function getCompletion(usertxt) {
    try {
        // Add the current user input to the conversation
        conversation.push({ role: 'user', content: usertxt });

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + API_KEY
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: conversation, // Include the entire conversation history
                max_tokens: 500,
                temperature: 0.9,
            })
        });

        if (!res.ok) {
            throw new Error(res.statusText);
        }

        const data = await res.json();
        createChatBubble(data.choices[0].message.content, 'chatbubble');
    } catch (error) {
        createChatBubble("Something went wrong. Please check your code and try again.", 'chatbubble');
    }
}

sleep(3000).then(() => {
    createChatBubble("Have any questions? I'm here to help!", "chatbubble");
});

submitBtn.addEventListener('click', () => {
    const usertxt = document.getElementById("input").value;
    createChatBubble(usertxt, "chatbubble2");
    getCompletion(usertxt);
});
