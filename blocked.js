document.addEventListener('DOMContentLoaded', () => {
    const quotes = [
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
        { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
        { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
        { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quote').textContent = `"${randomQuote.text}"`;
    document.getElementById('author').textContent = `- ${randomQuote.author}`;
});