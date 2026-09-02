const express = require("express");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8080;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

if (!ADMIN_TOKEN) {
    console.error("❌ ADMIN_TOKEN is missing");
    process.exit(1);
}

function checkAuth(req) {
    const auth = req.headers.authorization;

    return (
        auth === ADMIN_TOKEN ||
        auth === `Bearer ${ADMIN_TOKEN}`
    );
}

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

app.post("/api/system-info", (req, res) => {
    if (!checkAuth(req)) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized"
        });
    }

    data = {
        ...req.body,
        received_at: new Date().toISOString()
    };

    res.json({
        success: true,
        data
    });
});

app.get("/api/system-info", (req, res) => {
    res.json(data);
});

app.delete("/api/system-info", (req, res) => {
    if (!checkAuth(req)) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized"
        });
    }

    data = {
        username: "تم المسح"
    };

    res.json({ success: true });
});

app.get("/", (req, res) => {
    res.send(`
        <h1>🚀 Integrity Server</h1>
        <p>Server is running!</p>
        <a href="/test">Test API</a>
    `);
});

app.get("/test", (req, res) => {
    res.json({
        status: "ok",
        time: new Date().toISOString()
    });
});

const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

server.on("error", (err) => {
    console.error("❌ Server error:", err);
});
