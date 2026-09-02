const express = require("express");
const app = express();

// ===== CORS =====
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== استخدام PORT من البيئة =====
const PORT = process.env.PORT || 10000;

const ADMIN_TOKEN = "medo123";

// ===== التخزين المؤقت =====
let lastSystemInfo = {
    username: "في انتظار البيانات",
    pc_name: "في انتظار البيانات",
    os: "في انتظار البيانات",
    cpu: "في انتظار البيانات",
    ram: "في انتظار البيانات",
    mac: "في انتظار البيانات",
    public_ip: "في انتظار البيانات",
    hwid: "في انتظار البيانات",
    is_vm: false,
    received_at: new Date().toISOString()
};

// ===== التحقق من التوكن =====
const checkAuth = (req) => {
    const auth = req.get("Authorization");
    return (auth === ADMIN_TOKEN || auth === `Bearer ${ADMIN_TOKEN}`);
};

// ============================================================
// ====== مسارات API ======
// ============================================================

app.post("/api/system-info", (req, res) => {
    console.log("📥 POST /api/system-info");
    
    if (!checkAuth(req)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const data = req.body;
        lastSystemInfo = {
            ...data,
            received_at: new Date().toISOString(),
            ip: req.ip || req.connection?.remoteAddress || 'unknown'
        };

        console.log(`✅ تم استقبال من: ${data.username || 'مجهول'}`);
        res.json({ 
            success: true, 
            message: "تم استقبال معلومات النظام",
            data: lastSystemInfo
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get("/api/system-info", (req, res) => {
    console.log("📤 GET /api/system-info");
    res.json(lastSystemInfo);
});

app.delete("/api/system-info", (req, res) => {
    if (!checkAuth(req)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    lastSystemInfo = {
        username: "تم مسح البيانات",
        pc_name: "تم مسح البيانات",
        os: "تم مسح البيانات",
        cpu: "تم مسح البيانات",
        ram: "تم مسح البيانات",
        mac: "تم مسح البيانات",
        public_ip: "تم مسح البيانات",
        hwid: "تم مسح البيانات",
        is_vm: false,
        received_at: new Date().toISOString()
    };
    
    res.json({ success: true, message: "Data cleared" });
});

// ============================================================
// ====== مسارات الصفحات ======
// ============================================================

app.get("/", (req, res) => {
    res.send(`
        <h1>🚀 Integrity Server</h1>
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

// ============================================================
// ====== تشغيل السيرفر ======
// ============================================================
app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🚀 السيرفر يعمل على port ${PORT}`);
    console.log(`📡 /api/system-info`);
    console.log(`🧪 /test\n`);
});
