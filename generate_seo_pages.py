import csv
import os
import re
from datetime import datetime

def get_slug(text):
    text = text.lower()
    text = re.sub(r'\s+', '-', text)
    text = re.sub(r'[^\w\-]+', '', text)
    text = re.sub(r'\-\-+', '-', text)
    return text.strip('-')

def generate_seo_assets():
    csv_path = 'data.csv'
    template_path = 'index.html'
    output_dir = 'cards'
    domain = 'https://sweepbase.com' # Replace with actual domain if known, using placeholder if not

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    with open(template_path, 'r', encoding='utf-8') as f:
        template = f.read()

    # Ensure assets are root-relative
    template = template.replace('href="index.css', 'href="/index.css')
    template = template.replace('src="logo.png', 'src="/logo.png')
    template = template.replace('src="script.js', 'src="/script.js')

    sitemap_urls = []
    sitemap_urls.append(f"{domain}/")

    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = row.get('Card Service')
            if not name:
                continue
            
            slug = get_slug(name)
            card_dir = os.path.join(output_dir, slug)
            if not os.path.exists(card_dir):
                os.makedirs(card_dir)

            h1 = row.get('H1', '').strip() or f"{name}"
            title = row.get('Meta_title', '').strip() or f"{name} | Sweepbase Crypto Card Review"
            description = row.get('Meta_description', '').strip() or row.get('Marketing Description', 'Compare and find the best crypto card.')
            
            # Specialized meta tags for SEO
            card_html = template
            
            # Replace Title
            card_html = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', card_html, flags=re.IGNORECASE | re.DOTALL)
            
            # Replace H1
            card_html = re.sub(r'<h1 class="hero-title">.*?</h1>', f'<h1 class="hero-title">{h1}</h1>', card_html, flags=re.IGNORECASE | re.DOTALL)
            
            # Insert meta tags
            meta_tags = f'''
    <meta name="description" content="{description[:160]}">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{description[:160]}">
    <meta property="og:type" content="website">
    <link rel="canonical" href="{domain}/cards/{slug}">
'''
            if '<meta charset' in card_html:
                card_html = card_html.replace('<meta charset="UTF-8">', f'<meta charset="UTF-8">{meta_tags}')
            
            # Also inject card data as JSON-LD for rich snippets
            json_ld = f'''
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": "{name}",
      "description": "{description}",
      "brand": {{
        "@type": "Brand",
        "name": "{name}"
      }}
    }}
    </script>
'''
            card_html = card_html.replace('</head>', f'{json_ld}\n</head>')

            with open(os.path.join(card_dir, 'index.html'), 'w', encoding='utf-8') as out:
                out.write(card_html)
            
            sitemap_urls.append(f"{domain}/cards/{slug}")
            print(f"Generated: {slug}")

    # Generate sitemap.xml
    sitemap_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
'''
    for url in sitemap_urls:
        sitemap_content += f'''  <url>
    <loc>{url}</loc>
    <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>{'1.0' if url == f"{domain}/" else '0.8'}</priority>
  </url>
'''
    sitemap_content += '</urlset>'
    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(sitemap_content)

    # Generate robots.txt
    robots_content = f'''User-agent: *
Allow: /

Sitemap: {domain}/sitemap.xml
'''
    with open('robots.txt', 'w', encoding='utf-8') as f:
        f.write(robots_content)

if __name__ == "__main__":
    generate_seo_assets()
