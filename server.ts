
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DATABASE_PATH || "database.sqlite";

// Ensure the directory for the database exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(DB_PATH);

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    content TEXT,
    stack TEXT,
    github_url TEXT,
    image_url TEXT,
    category TEXT,
    status TEXT,
    published INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    slug TEXT UNIQUE,
    content TEXT,
    image_url TEXT,
    category TEXT,
    tags TEXT,
    published INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed admin user if not exists
const adminExists = db.prepare("SELECT * FROM users WHERE username = ?").get("admin");
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run("admin", hashedPassword);
}

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// Seed initial data
const projectsCount: any = db.prepare("SELECT COUNT(*) as count FROM projects").get();
if (projectsCount.count === 0) {
  const seedProjects = [
    {
      title: "Infrastructure Virtualisée (DHCP, DNS, AD)",
      description: "Mise en place d'une infrastructure complète sous Windows Server et Linux.",
      content: "Ce projet consistait à déployer un contrôleur de domaine Active Directory, des serveurs DHCP et DNS redondants, ainsi que l'intégration de clients Windows et Linux dans un environnement virtualisé sécurisé.",
      stack: "Windows Server 2022, Ubuntu Server, VMware, Active Directory",
      github_url: "https://github.com/ahamed19i",
      image_url: "https://picsum.photos/seed/infra/800/450",
      category: "Réseau",
      status: "Terminé"
    },
    {
      title: "Pipeline CI/CD & Docker",
      description: "Automatisation du déploiement d'une application web avec Jenkins et Docker.",
      content: "Création d'un pipeline complet : de la validation du code sur GitHub au déploiement automatique dans des conteneurs Docker via Jenkins, avec tests unitaires automatisés.",
      stack: "Docker, Jenkins, GitHub Actions, Node.js",
      github_url: "https://github.com/ahamed19i",
      image_url: "https://picsum.photos/seed/devops/800/450",
      category: "Cloud/DevOps",
      status: "Terminé"
    },
    {
      title: "Architecture Multi-sites GNS3",
      description: "Simulation d'un réseau d'entreprise multi-sites avec routage OSPF et VPN.",
      content: "Conception et simulation d'une architecture réseau complexe reliant trois sites distants. Utilisation du protocole OSPF pour le routage dynamique et mise en place de tunnels VPN IPsec pour la sécurité.",
      stack: "Cisco IOS, GNS3, OSPF, VPN IPsec",
      github_url: "https://github.com/ahamed19i",
      image_url: "https://picsum.photos/seed/network/800/450",
      category: "Réseau",
      status: "Terminé"
    },
    {
      title: "Lab Cybersécurité Hardening",
      description: "Sécurisation avancée de serveurs Linux et Windows contre les attaques courantes.",
      content: "Audit de sécurité et application de mesures de durcissement (Hardening) : désactivation des services inutiles, configuration de pare-feu avancés, gestion stricte des privilèges et mise en place de logs centralisés.",
      stack: "Kali Linux, pfSense, Suricata, Fail2Ban",
      github_url: "https://github.com/ahamed19i",
      image_url: "https://picsum.photos/seed/cyber/800/450",
      category: "Cybersécurité",
      status: "En cours"
    }
  ];

  const insertProject = db.prepare(`
    INSERT INTO projects (title, description, content, stack, github_url, image_url, category, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  seedProjects.forEach(p => {
    insertProject.run(p.title, p.description, p.content, p.stack, p.github_url, p.image_url, p.category, p.status);
  });
}

const postsCount: any = db.prepare("SELECT COUNT(*) as count FROM posts").get();
if (postsCount.count === 0) {
  const seedPosts = [
    {
      title: "Introduction à Docker pour les Administrateurs Systèmes",
      slug: "intro-docker-admin-sys",
      content: "Docker a révolutionné la façon dont nous déployons des applications. Dans cet article, nous verrons comment passer de la virtualisation classique à la conteneurisation...\n\n### Pourquoi Docker ?\nDocker permet d'isoler les applications dans des environnements légers et portables.",
      image_url: "https://picsum.photos/seed/docker-post/1200/600",
      category: "Cloud/DevOps",
      tags: "Docker, Conteneurisation, DevOps"
    },
    {
      title: "Sécuriser son infrastructure avec pfSense",
      slug: "securiser-infra-pfsense",
      content: "pfSense est l'un des pare-feu open-source les plus puissants. Voici un guide étape par étape pour configurer vos règles de filtrage et votre IDS/IPS.\n\n1. Installation\n2. Configuration des interfaces\n3. Mise en place de Snort",
      image_url: "https://picsum.photos/seed/pfsense-post/1200/600",
      category: "Cybersécurité",
      tags: "pfSense, Firewall, Sécurité"
    }
  ];

  const insertPost = db.prepare(`
    INSERT INTO posts (title, slug, content, image_url, category, tags)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  seedPosts.forEach(p => {
    insertPost.run(p.title, p.slug, p.content, p.image_url, p.category, p.tags);
  });
}

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
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const user: any = db.prepare("SELECT * FROM users WHERE username = ?").get(username);

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
app.get("/api/projects", (req, res) => {
  const projects = db.prepare("SELECT * FROM projects WHERE published = 1").all();
  res.json(projects);
});

app.get("/api/admin/projects", authenticateToken, (req, res) => {
  const projects = db.prepare("SELECT * FROM projects").all();
  res.json(projects);
});

app.post("/api/projects", authenticateToken, (req, res) => {
  const { title, description, content, stack, github_url, image_url, category, status } = req.body;
  const result = db.prepare(`
    INSERT INTO projects (title, description, content, stack, github_url, image_url, category, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(title, description, content, stack, github_url, image_url, category, status);
  res.json({ id: result.lastInsertRowid });
});

app.put("/api/projects/:id", authenticateToken, (req, res) => {
  const { title, description, content, stack, github_url, image_url, category, status, published } = req.body;
  db.prepare(`
    UPDATE projects 
    SET title = ?, description = ?, content = ?, stack = ?, github_url = ?, image_url = ?, category = ?, status = ?, published = ?
    WHERE id = ?
  `).run(title, description, content, stack, github_url, image_url, category, status, published, req.params.id);
  res.json({ success: true });
});

app.delete("/api/projects/:id", authenticateToken, (req, res) => {
  db.prepare("DELETE FROM projects WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Posts
app.get("/api/posts", (req, res) => {
  const posts = db.prepare("SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC").all();
  res.json(posts);
});

app.get("/api/posts/:slug", (req, res) => {
  const post = db.prepare("SELECT * FROM posts WHERE slug = ?").get(req.params.slug);
  if (post) res.json(post);
  else res.status(404).json({ message: "Article non trouvé" });
});

app.get("/api/admin/posts", authenticateToken, (req, res) => {
  const posts = db.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
  res.json(posts);
});

app.post("/api/posts", authenticateToken, (req, res) => {
  const { title, slug, content, image_url, category, tags } = req.body;
  const result = db.prepare(`
    INSERT INTO posts (title, slug, content, image_url, category, tags)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(title, slug, content, image_url, category, tags);
  res.json({ id: result.lastInsertRowid });
});

app.put("/api/posts/:id", authenticateToken, (req, res) => {
  const { title, slug, content, image_url, category, tags, published } = req.body;
  db.prepare(`
    UPDATE posts 
    SET title = ?, slug = ?, content = ?, image_url = ?, category = ?, tags = ?, published = ?
    WHERE id = ?
  `).run(title, slug, content, image_url, category, tags, published, req.params.id);
  res.json({ success: true });
});

app.delete("/api/posts/:id", authenticateToken, (req, res) => {
  db.prepare("DELETE FROM posts WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Messages
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  db.prepare(`
    INSERT INTO messages (name, email, subject, message)
    VALUES (?, ?, ?, ?)
  `).run(name, email, subject, message);
  res.json({ success: true });
});

app.get("/api/messages", authenticateToken, (req, res) => {
  const messages = db.prepare("SELECT * FROM messages ORDER BY created_at DESC").all();
  res.json(messages);
});

app.put("/api/messages/:id/read", authenticateToken, (req, res) => {
  db.prepare("UPDATE messages SET read = 1 WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

app.delete("/api/messages/:id", authenticateToken, (req, res) => {
  db.prepare("DELETE FROM messages WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Stats
app.get("/api/admin/stats", authenticateToken, (req, res) => {
  const projectsCount = db.prepare("SELECT COUNT(*) as count FROM projects").get() as any;
  const postsCount = db.prepare("SELECT COUNT(*) as count FROM posts").get() as any;
  const messagesCount = db.prepare("SELECT COUNT(*) as count FROM messages WHERE read = 0").get() as any;
  res.json({
    projects: projectsCount.count,
    posts: postsCount.count,
    unreadMessages: messagesCount.count
  });
});

// --- VITE MIDDLEWARE ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
