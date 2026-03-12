import os
import xml.etree.ElementTree as ET
from xml.dom import minidom

def update_sitemap():
    sitemap_file = 'sitemap.xml'
    cards_dir = 'cards'
    
    # Get all card slugs from directory names
    if os.path.exists(cards_dir):
        card_slugs = [d for d in os.listdir(cards_dir) if os.path.isdir(os.path.join(cards_dir, d))]
    else:
        card_slugs = []

    # Parse existing sitemap
    ET.register_namespace('', "http://www.sitemaps.org/schemas/sitemap/0.9")
    tree = ET.parse(sitemap_file)
    root = tree.getroot()
    ns = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}

    existing_locs = {}
    for url_node in root.findall('ns:url', ns):
        loc_node = url_node.find('ns:loc', ns)
        if loc_node is not None:
            existing_locs[loc_node.text] = url_node

    # Update or add homepage
    homepage = 'https://sweepbase.com/'
    if homepage in existing_locs:
        url_node = existing_locs[homepage]
    else:
        url_node = ET.SubElement(root, 'url')
        loc_node = ET.SubElement(url_node, 'loc')
        loc_node.text = homepage
    
    # Homepage format: monthly, prio 1.0, no lastmod
    lm = url_node.find('ns:lastmod', ns)
    if lm is not None: url_node.remove(lm)
    cf = url_node.find('ns:changefreq', ns)
    if cf is None: cf = ET.SubElement(url_node, 'changefreq')
    cf.text = 'monthly'
    pr = url_node.find('ns:priority', ns)
    if pr is None: pr = ET.SubElement(url_node, 'priority')
    pr.text = '1.0'
    
    # Update or add cards
    for slug in card_slugs:
        card_url = f"https://sweepbase.com/cards/{slug}"
        if card_url in existing_locs:
            url_node = existing_locs[card_url]
        else:
            url_node = ET.SubElement(root, 'url')
            loc_node = ET.SubElement(url_node, 'loc')
            loc_node.text = card_url

        # Card format: monthly, prio 0.8, no lastmod
        lm = url_node.find('ns:lastmod', ns)
        if lm is not None: url_node.remove(lm)
        cf = url_node.find('ns:changefreq', ns)
        if cf is None: cf = ET.SubElement(url_node, 'changefreq')
        cf.text = 'monthly'
        pr = url_node.find('ns:priority', ns)
        if pr is None: pr = ET.SubElement(url_node, 'priority')
        pr.text = '0.8'

    # Save and prettify
    xml_str = ET.tostring(root, encoding='utf-8')
    dom = minidom.parseString(xml_str)
    pretty_xml = dom.toprettyxml(indent="  ")
    # Clean up empty lines
    pretty_xml = "\n".join([line for line in pretty_xml.split("\n") if line.strip()])

    with open(sitemap_file, 'w', encoding='utf-8') as f:
        f.write(pretty_xml)
    
    print(f"Sitemap updated. Total card slugs: {len(card_slugs)}")

if __name__ == "__main__":
    update_sitemap()
