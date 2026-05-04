import fs from 'fs'
import path from 'path'

export function loadCmsData<T>(resourceName: string, staticData: T[]): T[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'cms-data', `${resourceName}.json`)
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(raw) as T[]
    }
  } catch {}
  return staticData
}

export function saveCmsData<T>(resourceName: string, data: T[]): { ok: boolean; message?: string } {
  if (process.env.NODE_ENV !== 'development') {
    return { ok: false, message: 'Redigering av filer kräver lokal miljö. Ladda ner JSON och lägg till i public/cms-data/' }
  }
  try {
    const dir = path.join(process.cwd(), 'public', 'cms-data')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, `${resourceName}.json`), JSON.stringify(data, null, 2))
    return { ok: true }
  } catch (e) {
    return { ok: false, message: String(e) }
  }
}

export function loadCmsObject<T>(resourceName: string, staticData: T): T {
  try {
    const filePath = path.join(process.cwd(), 'public', 'cms-data', `${resourceName}.json`)
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(raw) as T
    }
  } catch {}
  return staticData
}

export function saveCmsObject<T>(resourceName: string, data: T): { ok: boolean; message?: string } {
  if (process.env.NODE_ENV !== 'development') {
    return { ok: false, message: 'Redigering av filer kräver lokal miljö. Ladda ner JSON och lägg till i public/cms-data/' }
  }
  try {
    const dir = path.join(process.cwd(), 'public', 'cms-data')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, `${resourceName}.json`), JSON.stringify(data, null, 2))
    return { ok: true }
  } catch (e) {
    return { ok: false, message: String(e) }
  }
}
