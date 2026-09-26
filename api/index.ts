import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY manquants. Définissez ces variables d'environnement avant de démarrer le serveur."
  );
}
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const app = express();
const PORT = 3000;

if (!process.env.JWT_SECRET) {
  throw new Error(
    "JWT_SECRET manquant. Définissez la variable d'environnement JWT_SECRET avant de démarrer le serveur."
  );
}
const JWT_SECRET = process.env.JWT_SECRET;

// 8 Mo : les images arrivent en base64 (≈ +33 % par rapport au fichier),
// la limite réelle par image est vérifiée dans /api/admin/upload.
app.use(express.json({ limit: "8mb" }));

// Request logging for debug
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

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

app.get("/api/projects/:slug", async (req, res) => {
  const { slug } = req.params;
  
  // Try slug first
  let { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();
  
  // If not found and slug is numeric, try ID as fallback
  if (error && /^\d+$/.test(slug)) {
    const { data: idData, error: idError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", parseInt(slug))
      .single();
    if (!idError) {
      data = idData;
      error = null;
    }
  }
  
  if (error) return res.status(404).json({ message: "Projet non trouvé" });
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
  const { title, slug, description, content, stack, github_url, image_url, category, status, pdf_url, published } = req.body;
  const { data, error } = await supabase
    .from("projects")
    .insert([{ title, slug, description, content, stack, github_url, image_url, category, status, pdf_url, published: published ?? 1 }])
    .select();
  
  if (error) return res.status(500).json(error);
  res.json({ id: data[0].id });
});

app.put("/api/projects/:id", authenticateToken, async (req, res) => {
  const { title, slug, description, content, stack, github_url, image_url, category, status, published, pdf_url } = req.body;
  const { error } = await supabase
    .from("projects")
    .update({ title, slug, description, content, stack, github_url, image_url, category, status, published, pdf_url })
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
  const { slug } = req.params;
  
  // Try slug first
  let { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();
  
  // If not found and slug is numeric, try ID as fallback
  if (error && /^\d+$/.test(slug)) {
    const { data: idData, error: idError } = await supabase
      .from("posts")
      .select("*")
      .eq("id", parseInt(slug))
      .single();
    if (!idError) {
      data = idData;
      error = null;
    }
  }
  
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
  const { title, slug, content, image_url, category, tags, pdf_url, published } = req.body;
  const { data, error } = await supabase
    .from("posts")
    .insert([{ title, slug, content, image_url, category, tags, pdf_url, published: published ?? 1 }])
    .select();
  
  if (error) return res.status(500).json(error);
  res.json({ id: data[0].id });
});

app.put("/api/posts/:id", authenticateToken, async (req, res) => {
  const { title, slug, content, image_url, category, tags, published, pdf_url } = req.body;
  const { error } = await supabase
    .from("posts")
    .update({ title, slug, content, image_url, category, tags, published, pdf_url })
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

// --- Parcours (timeline) ---
// Table créée par migrations/002_timeline.sql. Tant qu'elle n'existe pas,
// ces routes renvoient une liste vide et le site retombe sur ses entrées
// statiques : rien ne casse avant que la migration soit exécutée.

const TIMELINE_FIELDS =
  "id, slug, period_label, sort_order, title, institution, city, country, summary, cover_image_url, cover_image_alt, content, lessons, published, created_at, updated_at";

app.get("/api/timeline", async (req, res) => {
  const { data, error } = await supabase
    .from("timeline_entries")
    .select(TIMELINE_FIELDS)
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.warn("Table 'timeline_entries' absente ou inaccessible:", error.message);
    return res.json([]);
  }

  // has_photos permet à l'accueil de savoir si une étape mène à une vraie page.
  const { data: photoRows } = await supabase
    .from("timeline_photos")
    .select("entry_id");
  const withPhotos = new Set((photoRows ?? []).map((p: any) => p.entry_id));

  res.json((data ?? []).map((entry: any) => ({
    ...entry,
    has_photos: withPhotos.has(entry.id),
  })));
});

app.get("/api/timeline/:slug", async (req, res) => {
  const { slug } = req.params;

  const { data: entry, error } = await supabase
    .from("timeline_entries")
    .select(TIMELINE_FIELDS)
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !entry) return res.status(404).json({ message: "Étape non trouvée" });

  const { data: photos } = await supabase
    .from("timeline_photos")
    .select("id, image_url, alt, caption, sort_order")
    .eq("entry_id", entry.id)
    .order("sort_order", { ascending: true });

  res.json({ ...entry, photos: photos ?? [] });
});

app.get("/api/admin/timeline", authenticateToken, async (req, res) => {
  const { data, error } = await supabase
    .from("timeline_entries")
    .select(TIMELINE_FIELDS)
    .order("sort_order", { ascending: true });

  if (error) return res.status(500).json(error);
  res.json(data ?? []);
});

app.get("/api/admin/timeline/:id/photos", authenticateToken, async (req, res) => {
  const { data, error } = await supabase
    .from("timeline_photos")
    .select("id, entry_id, image_url, alt, caption, sort_order")
    .eq("entry_id", req.params.id)
    .order("sort_order", { ascending: true });

  if (error) return res.status(500).json(error);
  res.json(data ?? []);
});

function timelinePayload(body: any) {
  return {
    slug: body.slug,
    period_label: body.period_label,
    sort_order: Number(body.sort_order) || 0,
    title: body.title,
    institution: body.institution || null,
    city: body.city || null,
    country: body.country || null,
    summary: body.summary || null,
    cover_image_url: body.cover_image_url || null,
    cover_image_alt: body.cover_image_alt || null,
    content: body.content || null,
    lessons: Array.isArray(body.lessons) ? body.lessons.filter((l: unknown) => typeof l === "string" && l.trim()) : [],
    published: body.published === true || body.published === 1,
  };
}

app.post("/api/timeline", authenticateToken, async (req, res) => {
  const { data, error } = await supabase
    .from("timeline_entries")
    .insert([timelinePayload(req.body)])
    .select("id");

  if (error) return res.status(500).json(error);
  res.json({ id: data?.[0]?.id });
});

app.put("/api/timeline/:id", authenticateToken, async (req, res) => {
  const { error } = await supabase
    .from("timeline_entries")
    .update(timelinePayload(req.body))
    .eq("id", req.params.id);

  if (error) return res.status(500).json(error);
  res.json({ success: true });
});

app.delete("/api/timeline/:id", authenticateToken, async (req, res) => {
  const { error } = await supabase
    .from("timeline_entries")
    .delete()
    .eq("id", req.params.id);

  if (error) return res.status(500).json(error);
  res.json({ success: true });
});

// Galerie : remplace d'un bloc la liste des photos d'une étape (ordre inclus).
app.put("/api/timeline/:id/photos", authenticateToken, async (req, res) => {
  const entryId = Number(req.params.id);
  const photos = Array.isArray(req.body?.photos) ? req.body.photos : [];

  const invalid = photos.find((p: any) => !p?.image_url || !p?.alt?.trim());
  if (invalid) {
    return res.status(400).json({ message: "Chaque photo doit avoir une URL et un texte alternatif." });
  }

  const { error: deleteError } = await supabase
    .from("timeline_photos")
    .delete()
    .eq("entry_id", entryId);

  if (deleteError) return res.status(500).json(deleteError);

  if (photos.length === 0) return res.json({ success: true });

  const rows = photos.map((p: any, index: number) => ({
    entry_id: entryId,
    image_url: p.image_url,
    alt: p.alt.trim(),
    caption: p.caption?.trim() || null,
    sort_order: index,
  }));

  const { error } = await supabase.from("timeline_photos").insert(rows);
  if (error) return res.status(500).json(error);
  res.json({ success: true });
});

// --- Expériences ---
// Table créée par migrations/003_experiences.sql. Même principe que le
// parcours : tant qu'elle n'existe pas, ces routes renvoient une liste vide
// et le site retombe sur son entrée statique.

const EXPERIENCE_FIELDS =
  "id, slug, sort_order, period_label, role, organization, organization_url, type, location, remote, confidential, summary, technologies, cover_image_url, cover_image_alt, content, achievements, lessons, start_date, end_date, published, created_at, updated_at";

app.get("/api/experiences", async (req, res) => {
  const { data, error } = await supabase
    .from("experiences")
    .select(EXPERIENCE_FIELDS)
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.warn("Table 'experiences' absente ou inaccessible:", error.message);
    return res.json([]);
  }

  const { data: photoRows } = await supabase
    .from("experience_photos")
    .select("experience_id");
  const withPhotos = new Set((photoRows ?? []).map((p: any) => p.experience_id));

  res.json((data ?? []).map((entry: any) => ({
    ...entry,
    has_photos: withPhotos.has(entry.id),
  })));
});

app.get("/api/experiences/:slug", async (req, res) => {
  const { data: entry, error } = await supabase
    .from("experiences")
    .select(EXPERIENCE_FIELDS)
    .eq("slug", req.params.slug)
    .eq("published", true)
    .single();

  if (error || !entry) return res.status(404).json({ message: "Expérience non trouvée" });

  const { data: photos } = await supabase
    .from("experience_photos")
    .select("id, image_url, alt, caption, sort_order")
    .eq("experience_id", entry.id)
    .order("sort_order", { ascending: true });

  res.json({ ...entry, photos: photos ?? [] });
});

app.get("/api/admin/experiences", authenticateToken, async (req, res) => {
  const { data, error } = await supabase
    .from("experiences")
    .select(EXPERIENCE_FIELDS)
    .order("sort_order", { ascending: true });

  if (error) return res.status(500).json(error);
  res.json(data ?? []);
});

app.get("/api/admin/experiences/:id/photos", authenticateToken, async (req, res) => {
  const { data, error } = await supabase
    .from("experience_photos")
    .select("id, experience_id, image_url, alt, caption, sort_order")
    .eq("experience_id", req.params.id)
    .order("sort_order", { ascending: true });

  if (error) return res.status(500).json(error);
  res.json(data ?? []);
});

const EXPERIENCE_TYPES = ["Entreprise", "Stage", "Freelance", "Mission"];

function stringList(value: unknown) {
  return Array.isArray(value)
    ? value.filter((v: unknown): v is string => typeof v === "string" && v.trim().length > 0)
    : [];
}

function experiencePayload(body: any) {
  const confidential = body.confidential === true || body.confidential === 1;
  return {
    slug: body.slug,
    sort_order: Number(body.sort_order) || 0,
    period_label: body.period_label,
    role: body.role,
    // Mission confidentielle : le nom du client n'est jamais enregistré, même
    // si le formulaire en contenait un. La description générique du résumé
    // prend sa place à l'affichage.
    organization: confidential ? null : (body.organization || null),
    organization_url: confidential ? null : (body.organization_url || null),
    type: EXPERIENCE_TYPES.includes(body.type) ? body.type : "Entreprise",
    location: body.location || null,
    remote: body.remote === true || body.remote === 1,
    confidential,
    summary: body.summary || null,
    technologies: stringList(body.technologies),
    cover_image_url: body.cover_image_url || null,
    cover_image_alt: body.cover_image_alt || null,
    content: body.content || null,
    achievements: stringList(body.achievements),
    lessons: stringList(body.lessons),
    start_date: body.start_date || null,
    end_date: body.end_date || null,
    published: body.published === true || body.published === 1,
  };
}

app.post("/api/experiences", authenticateToken, async (req, res) => {
  const { data, error } = await supabase
    .from("experiences")
    .insert([experiencePayload(req.body)])
    .select("id");

  if (error) return res.status(500).json(error);
  res.json({ id: data?.[0]?.id });
});

app.put("/api/experiences/:id", authenticateToken, async (req, res) => {
  const { error } = await supabase
    .from("experiences")
    .update(experiencePayload(req.body))
    .eq("id", req.params.id);

  if (error) return res.status(500).json(error);
  res.json({ success: true });
});

app.delete("/api/experiences/:id", authenticateToken, async (req, res) => {
  const { error } = await supabase
    .from("experiences")
    .delete()
    .eq("id", req.params.id);

  if (error) return res.status(500).json(error);
  res.json({ success: true });
});

// Galerie : remplace d'un bloc la liste des photos d'une expérience.
app.put("/api/experiences/:id/photos", authenticateToken, async (req, res) => {
  const experienceId = Number(req.params.id);
  const photos = Array.isArray(req.body?.photos) ? req.body.photos : [];

  const invalid = photos.find((p: any) => !p?.image_url || !p?.alt?.trim());
  if (invalid) {
    return res.status(400).json({ message: "Chaque photo doit avoir une URL et un texte alternatif." });
  }

  const { error: deleteError } = await supabase
    .from("experience_photos")
    .delete()
    .eq("experience_id", experienceId);

  if (deleteError) return res.status(500).json(deleteError);

  if (photos.length === 0) return res.json({ success: true });

  const rows = photos.map((p: any, index: number) => ({
    experience_id: experienceId,
    image_url: p.image_url,
    alt: p.alt.trim(),
    caption: p.caption?.trim() || null,
    sort_order: index,
  }));

  const { error } = await supabase.from("experience_photos").insert(rows);
  if (error) return res.status(500).json(error);
  res.json({ success: true });
});

// Upload d'image vers le bucket `parcours` (redimensionnée côté navigateur).
app.post("/api/admin/upload", authenticateToken, async (req, res) => {
  try {
    const { dataUrl, filename } = req.body ?? {};
    if (typeof dataUrl !== "string") {
      return res.status(400).json({ message: "Image manquante." });
    }

    const match = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(dataUrl);
    if (!match) {
      return res.status(400).json({ message: "Format non accepté (JPEG, PNG ou WebP uniquement)." });
    }

    const contentType = match[1];
    const buffer = Buffer.from(match[2], "base64");

    if (buffer.byteLength > 5 * 1024 * 1024) {
      return res.status(400).json({ message: "Image trop lourde (5 Mo maximum)." });
    }

    const extension = contentType.split("/")[1].replace("jpeg", "jpg");
    const safeName = String(filename || "photo")
      .toLowerCase()
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "photo";
    const path = `${Date.now()}-${safeName}.${extension}`;

    const { error } = await supabase.storage
      .from("parcours")
      .upload(path, buffer, { contentType, upsert: false });

    if (error) {
      console.error("Upload échoué:", error.message);
      return res.status(500).json({ message: "Envoi impossible. Le bucket 'parcours' existe-t-il ?" });
    }

    const { data } = supabase.storage.from("parcours").getPublicUrl(path);
    res.json({ url: data.publicUrl });
  } catch (err: any) {
    console.error("Upload échoué:", err?.message);
    res.status(500).json({ message: "Envoi impossible." });
  }
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

// Visit Tracking
app.post("/api/track-visit", async (req, res) => {
  const { path, userAgent } = req.body;
  try {
    const { error } = await supabase
      .from("visits")
      .insert([{ path, user_agent: userAgent }]);
    
    if (error) {
      console.error("Error tracking visit:", error);
      return res.status(500).json(error);
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Visit tracking failed:", err);
    res.status(500).json({ message: "Visit tracking failed" });
  }
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

app.get("/api/admin/analytics", authenticateToken, async (req, res) => {
  try {
    console.log("Analytics endpoint hit (v1.2)");
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0)).toISOString();
    const sevenDaysAgo = new Date(new Date().setDate(now.getDate() - 7)).toISOString();
    const thirtyDaysAgo = new Date(new Date().setDate(now.getDate() - 30)).toISOString();

    const [today, last7, last30, allVisits] = await Promise.all([
      supabase.from("visits").select("*", { count: 'exact', head: true }).gte("created_at", todayStart),
      supabase.from("visits").select("*", { count: 'exact', head: true }).gte("created_at", sevenDaysAgo),
      supabase.from("visits").select("*", { count: 'exact', head: true }).gte("created_at", thirtyDaysAgo),
      supabase.from("visits").select("created_at").gte("created_at", thirtyDaysAgo)
    ]);

    // Handle potential errors (e.g. table doesn't exist yet)
    if (today.error || last7.error || last30.error || allVisits.error) {
      console.warn("Analytics table might be missing or inaccessible:", today.error || last7.error || last30.error || allVisits.error);
      return res.json({
        today: 0,
        last7Days: 0,
        last30Days: 0,
        chartData: [],
        error: "La table 'visits' n'existe pas encore. Veuillez l'ajouter dans Supabase."
      });
    }

    // Group by day for the chart
    const dailyStats: { [key: string]: number } = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dailyStats[dateStr] = 0;
    }

    if (allVisits.data) {
      allVisits.data.forEach((v: any) => {
        const dateStr = v.created_at.split('T')[0];
        if (dailyStats[dateStr] !== undefined) {
          dailyStats[dateStr]++;
        }
      });
    }

    const chartData = Object.keys(dailyStats).map(date => ({
      date: date.split('-').slice(1).reverse().join('/'), // Format DD/MM
      visits: dailyStats[date]
    }));

    res.json({
      today: today.count || 0,
      last7Days: last7.count || 0,
      last30Days: last30.count || 0,
      chartData
    });
  } catch (err) {
    console.error("Analytics fetch failed:", err);
    res.status(500).json({ message: "Analytics fetch failed" });
  }
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

// Toute route /api/* non reconnue ci-dessus doit renvoyer une vraie 404 JSON,
// quelle que soit la méthode HTTP — sinon le fallback SPA plus bas la sert
// avec un 200 (c'est ce qui masquait la suppression de l'ancienne route de
// reset admin).
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

// --- VITE MIDDLEWARE ---
async function startServer() {
  console.log("Starting server in environment:", process.env.NODE_ENV);
  try {
    // Vite middleware for development
    if (process.env.NODE_ENV !== "production" && process.env.VERCEL !== "1") {
      console.log("Loading Vite in middleware mode...");
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa"
      });
      app.use(vite.middlewares);
      console.log("Vite middleware attached.");
    } else {
      console.log("Production mode: Serving from /dist");
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    // Only listen if not on Vercel (Vercel handles listening)
    if (process.env.VERCEL !== "1") {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log("Ready to handle requests.");
      });
    }
  } catch (err) {
    console.error("CRITICAL: Failed to start server:", err);
  }
}

startServer();

export default app;
