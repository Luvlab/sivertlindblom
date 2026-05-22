#!/usr/bin/env python3
"""
Clean up sivertlindblom.se references from exhibitions-data.ts.

Rules:
1. Exhibition-level `url:` lines (4-space indent) pointing to sivertlindblom.se
   → replace with url: "",
2. Link objects containing sivertlindblom.se → delete entirely
   a) Single-line: { prefix: '...', ... url: '...sivertlindblom.se/...', ... },
   b) Multi-line: {        (6-space indent, on its own line)
                    prefix: "...",
                    url: "...sivertlindblom.se/...",
                    external: true,
                  },
3. After removing link entries, remove now-empty links arrays
4. Never touch comment lines or image URLs (supabase)
"""

import re

INPUT_FILE = "/Users/gordoncyrus/Documents/dev/SIVERTLINDBLOM/src/lib/exhibitions-data.ts"

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split("\n")

stats = {
    "url_blanked": 0,
    "link_single_deleted": 0,
    "link_multi_deleted": 0,
    "links_array_removed": 0,
}

# -----------------------------------------------------------------------
# Pass 1: process line by line
# -----------------------------------------------------------------------
# Indentation guide (from reading the file):
#   2 spaces  → exhibition object opening brace: `  {`
#   4 spaces  → exhibition-level properties: `    url: "..."`, `    slug:`, etc.
#   4 spaces  → `    links: [`
#   6 spaces  → link objects: `      { prefix: ... }` (single-line)
#              or `      {` alone (multi-line start)
#   8 spaces  → properties inside multi-line link objects

sivert_domain = re.compile(r'https?://sivertlindblom\.se/')

# Exhibition-level url line: exactly 4-space indent, url: "...", no { prefix before it
exh_url_re = re.compile(
    r'^    url:\s*["\']https?://sivertlindblom\.se/[^"\']*["\'],\s*$'
)

# Single-line link object (6-space indent, starts with `{`, ends with `},`)
single_link_re = re.compile(
    r'^\s{6}\{[^}]*url:\s*["\']https?://sivertlindblom\.se/[^"\']*["\'][^}]*\},?\s*$'
)

# Multi-line link opening: exactly 6 spaces then `{` alone
multi_link_open_re = re.compile(r'^\s{6}\{\s*$')
# Multi-line link closing: 6 spaces then `},` or `}`
multi_link_close_re = re.compile(r'^\s{6}\},?\s*$')

output_lines = []
i = 0

while i < len(lines):
    line = lines[i]

    # --- Exhibition-level url: field ---
    if exh_url_re.match(line):
        output_lines.append('    url: "",')
        stats["url_blanked"] += 1
        i += 1
        continue

    # --- Single-line link object with sivertlindblom.se ---
    if single_link_re.match(line):
        stats["link_single_deleted"] += 1
        i += 1
        continue

    # --- Multi-line link object opening ---
    if multi_link_open_re.match(line):
        # Scan ahead to find the matching close and check if it's a sivert URL
        block = [line]
        j = i + 1
        found_sivert = False
        while j < len(lines):
            block.append(lines[j])
            if sivert_domain.search(lines[j]):
                found_sivert = True
            if multi_link_close_re.match(lines[j]):
                break
            j += 1

        if found_sivert:
            stats["link_multi_deleted"] += 1
            i = j + 1  # skip past the closing brace line
            continue
        else:
            # Keep block as-is
            output_lines.extend(block)
            i = j + 1
            continue

    output_lines.append(line)
    i += 1

# -----------------------------------------------------------------------
# Pass 2: remove empty links arrays using regex on the joined result
# -----------------------------------------------------------------------
result = "\n".join(output_lines)

# Empty single-line links array:   links: [],
# (possibly with trailing whitespace/comma)
n_before = len(result)
result, n1 = re.subn(r'\n    links: \[\],', '', result)
stats["links_array_removed"] += n1

# Empty multi-line links array:
#     links: [
#     ],
result, n2 = re.subn(r'\n    links: \[\n    \],', '', result)
stats["links_array_removed"] += n2

with open(INPUT_FILE, "w", encoding="utf-8") as f:
    f.write(result)

print("Done!")
print(f"  Exhibition-level url: fields blanked:  {stats['url_blanked']}")
print(f"  Single-line link objects deleted:       {stats['link_single_deleted']}")
print(f"  Multi-line link objects deleted:        {stats['link_multi_deleted']}")
print(f"  Empty links arrays removed:             {stats['links_array_removed']}")
