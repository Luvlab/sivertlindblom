-- Sivert Lindblom CMS Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- WORKS (portfolio items, public works, etc.)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS works (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  title_sv    TEXT,
  category    TEXT NOT NULL CHECK (category IN (
                'exhibition','public_exterior','public_interior',
                'scenography','watercolor','sculpture','graphic'
              )),
  subcategory TEXT,
  year_start  INTEGER,
  year_end    INTEGER,
  description TEXT,
  location    TEXT,
  source_url  TEXT,
  published   BOOLEAN DEFAULT true,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────
-- IMAGES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_id     UUID REFERENCES works(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt         TEXT,
  caption     TEXT,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────
-- TEXTS (essays, reviews, interviews, writings)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS texts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  author      TEXT,
  text_type   TEXT NOT NULL CHECK (text_type IN (
                'essay','review','interview','own_writing','translated','preface'
              )),
  publication TEXT,
  year        INTEGER,
  language    TEXT DEFAULT 'sv',
  content     TEXT,
  source_url  TEXT,
  published   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────
-- BIOGRAPHY ENTRIES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS biography_entries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entry_type  TEXT NOT NULL CHECK (entry_type IN (
                'education','position','award','public_commission',
                'group_exhibition','publication','personal'
              )),
  year_start  INTEGER,
  year_end    INTEGER,
  title       TEXT NOT NULL,
  description TEXT,
  location    TEXT,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────
-- SITE SETTINGS (key/value CMS config)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  key         TEXT PRIMARY KEY,
  value       TEXT,
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_works_category    ON works(category);
CREATE INDEX IF NOT EXISTS idx_works_published   ON works(published);
CREATE INDEX IF NOT EXISTS idx_works_year        ON works(year_start);
CREATE INDEX IF NOT EXISTS idx_images_work_id    ON images(work_id);
CREATE INDEX IF NOT EXISTS idx_texts_type        ON texts(text_type);
CREATE INDEX IF NOT EXISTS idx_texts_published   ON texts(published);
CREATE INDEX IF NOT EXISTS idx_bio_type          ON biography_entries(entry_type);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
ALTER TABLE works             ENABLE ROW LEVEL SECURITY;
ALTER TABLE images            ENABLE ROW LEVEL SECURITY;
ALTER TABLE texts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE biography_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings          ENABLE ROW LEVEL SECURITY;

-- Public can read published content
CREATE POLICY "public_read_works"   ON works             FOR SELECT USING (published = true);
CREATE POLICY "public_read_images"  ON images            FOR SELECT USING (true);
CREATE POLICY "public_read_texts"   ON texts             FOR SELECT USING (published = true);
CREATE POLICY "public_read_bio"     ON biography_entries FOR SELECT USING (true);
CREATE POLICY "public_read_settings" ON settings         FOR SELECT USING (true);

-- Authenticated users (admins) can do everything
CREATE POLICY "admin_all_works"   ON works             FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_images"  ON images            FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_texts"   ON texts             FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_bio"     ON biography_entries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_settings" ON settings         FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────
-- UPDATED_AT TRIGGER
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER works_updated_at  BEFORE UPDATE ON works  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER texts_updated_at  BEFORE UPDATE ON texts  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
