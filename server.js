require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json({ limit: "1mb" }));

const PORT = Number(process.env.PORT) || 8080;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

if (!ADMIN_TOKEN) {
    console.error("❌ ADMIN_TOKEN is missing from .env");
    process.exit(1);
}

// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, DELETE, OPTIONS"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

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

    if (!auth) {
        return false;
    }

    return (
        auth === ADMIN_TOKEN ||
        auth === `Bearer ${ADMIN_TOKEN}`
    );
}

// POST
app.post("/api/system-info", (req, res) => {
    console.log("📥 POST /api/system-info");

    if (!checkAuth(req)) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized"
        });
    }

    try {
        data = {
            ...req.body,
            received_at: new Date().toISOString()
        };

        console.log("✅ تم استقبال البيانات");

        return res.json({
            success: true,
            data
        });

    } catch (err) {
        console.error("❌ Error:", err);

        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
});

// GET
app.get("/api/system-info", (req, res) => {
    console.log("📤 GET /api/system-info");

    res.json(data);
});

// DELETE
app.delete("/api/system-info", (req, res) => {
    if (!checkAuth(req)) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized"
        });
    }

    data = {
        username: "تم المسح",
        pc_name: "",
        os: "",
        cpu: "",
        ram: "",
        mac: "",
        public_ip: "",
        hwid: "",
        is_vm: false
    };

    console.log("🗑️ تم مسح البيانات");

    res.json({
        success: true,
        message: "Data cleared"
    });
});

// Home
app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="ar">
        <head>
            <meta charset="UTF-8">
            <title>Integrity Server</title>
        </head>
        <body>
            <h1>🚀 Integrity Server</h1>
            <p>✅ السيرفر شغال!</p>

            <ul>
                <li><a href="/api/system-info">📡 API</a></li>
                <li><a href="/test">🧪 Test</a></li>
            </ul>

            <p>🔒 Authentication Enabled</p>
        </body>
        </html>
    `);
});

// Test
app.get("/test", (req, res) => {
    res.json({
        status: "ok",
        message: "السيرفر يعمل! 🚀",
        time: new Date().toISOString()
    });
});

// Start
const server = app.listen(PORT, "0.0.0.0", () => {
    console.log("");
    console.log("=================================");
    console.log("🚀 Integrity Server Started");
    console.log(`🌐 Port: ${PORT}`);
    console.log("📡 /api/system-info");
    console.log("🧪 /test");
    console.log("=================================");
    console.log("");
});

server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use.`);
        console.error(`💡 Stop the process using port ${PORT}, then restart.`);
        process.exit(1);
    }

    console.error("❌ Server error:", err);
    process.exit(1);
});
