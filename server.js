const express = require("express");
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

const ADMIN_TOKEN = "medo123";
const PORT = process.env.PORT ||  8080;

let data = {
    username: "في انتظار البيانات",
    pc_name: "في انتظار البيانات",
    os: "في انتظار البيانات",
    cpu: "في انتظار البيانات",
    ram: "في انتظار البيانات",
    mac: "في انتظار البيانات",
    public_ip: "في انتظار البيانات",
    hwid: "في انتظار البيانات",
    is_vm: false
};

function checkAuth(req) {
    const auth = req.headers.authorization;
    return auth === ADMIN_TOKEN || auth === `Bearer ${ADMIN_TOKEN}`;
}

app.post("/api/system-info", (req, res) => {
    console.log("📥 POST /api/system-info");
    if (!checkAuth(req)) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        data = {
            ...req.body,
            received_at: new Date().toISOString()
        };
        console.log("✅ تم الاستقبال");
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/system-info", (req, res) => {
    console.log("📤 GET /api/system-info");
    res.json(data);
});

app.delete("/api/system-info", (req, res) => {
    if (!checkAuth(req)) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    data = { username: "تم المسح" };
    res.json({ success: true });
});

app.get("/", (req, res) => {
    res.send(`
        <h1>🚀 Integrity Server</h1>
        <p>✅ السيرفر شغال!</p>
        <ul>
            <li><a href="/api/system-info">📡 API</a></li>
            <li><a href="/test">🧪 Test</a></li>
        </ul>
        <p>🔑 Token: <code>medo123</code></p>
    `);
});

app.get("/test", (req, res) => {
    res.json({ 
        status: "ok", 
        message: "السيرفر يعمل! 🚀",
        time: new Date().toISOString()
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📡 /api/system-info`);
    console.log(`🧪 /test`);
});
