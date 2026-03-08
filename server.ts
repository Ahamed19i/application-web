
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.warn("Supabase credentials missing. API will fail.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

app.use(express.json());

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- API ROUTES ---

// Auth
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username } });
  } else {
    res.status(401).json({ message: "Identifiants invalides" });
  }
});

app.get("/api/auth/me", authenticateToken, (req: any, res) => {
  res.json(req.user);
});

// Projects
app.get("/api/projects", async (req, res) => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("id", { ascending: false });
  
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.get("/api/admin/projects", authenticateToken, async (req, res) => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("id", { ascending: false });
  
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.post("/api/projects", authenticateToken, async (req, res) => {
  const { title, description, content, stack, github_url, image_url, category, status } = req.body;
  const { data, error } = await supabase
    .from("projects")
    .insert([{ title, description, content, stack, github_url, image_url, category, status }])
    .select();
  
  if (error) return res.status(500).json(error);
  res.json({ id: data[0].id });
});

app.put("/api/projects/:id", authenticateToken, async (req, res) => {
  const { title, description, content, stack, github_url, image_url, category, status, published } = req.body;
  const { error } = await supabase
    .from("projects")
    .update({ title, description, content, stack, github_url, image_url, category, status, published })
    .eq("id", req.params.id);
  
  if (error) return res.status(500).json(error);
  res.json({ success: true });
});

app.delete("/api/projects/:id", authenticateToken, async (req, res) => {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", req.params.id);
  
  if (error) return res.status(500).json(error);
  res.json({ success: true });
});

// Posts
app.get("/api/posts", async (req, res) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.get("/api/posts/:slug", async (req, res) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", req.params.slug)
    .single();
  
  if (error) return res.status(404).json({ message: "Article non trouvé" });
  res.json(data);
});

app.get("/api/admin/posts", authenticateToken, async (req, res) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.post("/api/posts", authenticateToken, async (req, res) => {
  const { title, slug, content, image_url, category, tags } = req.body;
  const { data, error } = await supabase
    .from("posts")
    .insert([{ title, slug, content, image_url, category, tags }])
    .select();
  
  if (error) return res.status(500).json(error);
  res.json({ id: data[0].id });
});

app.put("/api/posts/:id", authenticateToken, async (req, res) => {
  const { title, slug, content, image_url, category, tags, published } = req.body;
  const { error } = await supabase
    .from("posts")
    .update({ title, slug, content, image_url, category, tags, published })
    .eq("id", req.params.id);
  
  if (error) return res.status(500).json(error);
  res.json({ success: true });
});

app.delete("/api/posts/:id", authenticateToken, async (req, res) => {
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", req.params.id);
  
  if (error) return res.status(500).json(error);
  res.json({ success: true });
});

// Messages
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;
  const { error } = await supabase
    .from("messages")
    .insert([{ name, email, subject, message }]);
  
  if (error) return res.status(500).json(error);
  res.json({ success: true });
});

app.get("/api/messages", authenticateToken, async (req, res) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.put("/api/messages/:id/read", authenticateToken, async (req, res) => {
  const { error } = await supabase
    .from("messages")
    .update({ read: 1 })
    .eq("id", req.params.id);
  
  if (error) return res.status(500).json(error);
  res.json({ success: true });
});

app.delete("/api/messages/:id", authenticateToken, async (req, res) => {
  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", req.params.id);
  
  if (error) return res.status(500).json(error);
  res.json({ success: true });
});

// Stats
app.get("/api/admin/stats", authenticateToken, async (req, res) => {
  const [projects, posts, messages] = await Promise.all([
    supabase.from("projects").select("*", { count: 'exact', head: true }),
    supabase.from("posts").select("*", { count: 'exact', head: true }),
    supabase.from("messages").select("*", { count: 'exact', head: true }).eq("read", 0)
  ]);

  res.json({
    projects: projects.count || 0,
    posts: posts.count || 0,
    unreadMessages: messages.count || 0
  });
});

app.get("/api/test", (req, res) => {
  res.json({ 
    message: "API is working", 
    env: { 
      hasUrl: !!process.env.SUPABASE_URL,
      hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY 
    }
  });
});

// --- VITE MIDDLEWARE ---
async function startServer() {
  // Only use Vite middleware in local development
  if (process.env.NODE_ENV !== "production" && process.env.VERCEL !== "1") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  // Only listen if not on Vercel (Vercel handles listening)
  if (process.env.VERCEL !== "1") {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
