const http = require('http');
const https = require('https');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PORT = 1584;

const server = http.createServer((req, res) => {
    // Collect body
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
        try {
            const data = JSON.parse(body);
            console.log(`[Bridge] Proxying request to Gemini for model: ${data.model}`);

            // Map Anthropic to Gemini OpenAI-Compatible logic
            const openaiData = {
                model: 'gemini-1.5-flash', // Or map from data.model
                messages: data.messages.map(m => ({
                    role: m.role,
                    content: m.content[0].text // Simple mapping
                })),
                stream: data.stream
            };

            const options = {
                hostname: 'generativelanguage.googleapis.com',
                path: '/v1beta/openai/chat/completions',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GEMINI_API_KEY}`
                }
            };

            const proxyReq = https.request(options, (proxyRes) => {
                res.writeHead(proxyRes.statusCode, proxyRes.headers);
                proxyRes.pipe(res);
            });

            proxyReq.on('error', (e) => {
                console.error(e);
                res.statusCode = 500;
                res.end(e.message);
            });

            proxyReq.write(JSON.stringify(openaiData));
            proxyReq.end();
            
        } catch (e) {
            res.statusCode = 400;
            res.end("Bridge Error: " + e.message);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Gemini Bridge listening on http://localhost:${PORT}`);
});
