// Use localhost during development and the hosted API for GitHub Pages clients.
const isGitHubPages = window.location.hostname.endsWith('.github.io');
window.NEXATILL_API_URL = isGitHubPages
	? 'https://nexatill-api.onrender.com'
	: 'http://localhost:3000';