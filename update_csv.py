import csv
import urllib.request
import io
import os

def update_csv():
    url = "https://docs.google.com/spreadsheets/d/1pvYMus7GOKldh3c6iv99BKGb4vtPn_FpfmrEoy7LxmA/export?format=csv"
    local_file = r"c:\Users\Ms\.gemini\antigravity\scratch\crypto-card-aggregator\data.csv"
    
    try:
        response = urllib.request.urlopen(url)
        content = response.read().decode('utf-8')
    except Exception as e:
        print(f"Failed to fetch CSV: {e}")
        return

    # Parse external CSV
    reader = csv.reader(io.StringIO(content))
    ext_headers = next(reader)
    
    # Find indices
    try:
        ext_card_idx = ext_headers.index("Card Service")
        # In Google Sheets, P is the 16th column (index 15)
        ext_country_idx = 15
        # In Google Sheets, AA is the 27th column (index 26)
        ext_main_cashback_idx = 26
        
        # SEO columns from Google Sheets
        ext_h1_idx = 28
        ext_meta_title_idx = 29
        ext_meta_desc_idx = 31
    except ValueError:
        print("Couldn't find required columns in external CSV")
        return

    card_to_countries = {}
    card_to_main_cashback = {}
    card_to_seo = {}
    for row in reader:
        card_name = row[ext_card_idx].strip()
        if not card_name:
            continue
            
        if len(row) > ext_country_idx:
            val = row[ext_country_idx].strip()
            if val or card_name not in card_to_countries:
                card_to_countries[card_name] = val
                
        if len(row) > ext_main_cashback_idx:
            val = row[ext_main_cashback_idx].strip()
            # Only store if it's not empty, or if we don't have a value yet
            if val or card_name not in card_to_main_cashback:
                card_to_main_cashback[card_name] = val
                
        h1 = row[ext_h1_idx].strip() if len(row) > ext_h1_idx else ""
        meta_title = row[ext_meta_title_idx].strip() if len(row) > ext_meta_title_idx else ""
        meta_desc = row[ext_meta_desc_idx].strip() if len(row) > ext_meta_desc_idx else ""
        
        if card_name not in card_to_seo:
            card_to_seo[card_name] = {'H1': h1, 'Meta_title': meta_title, 'Meta_description': meta_desc}
        else:
            if h1 and not card_to_seo[card_name]['H1']:
                card_to_seo[card_name]['H1'] = h1
            if meta_title and not card_to_seo[card_name]['Meta_title']:
                card_to_seo[card_name]['Meta_title'] = meta_title
            if meta_desc and not card_to_seo[card_name]['Meta_description']:
                card_to_seo[card_name]['Meta_description'] = meta_desc

    # Read local CSV
    with open(local_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        local_data = list(reader)

    if not local_data:
        print("Local CSV is empty")
        return

    local_headers = local_data[0]
    
    # In local_data.csv, the column is currently called "Counties Available" (index 15)
    try:
        local_card_idx = local_headers.index("Card Service")
        local_country_idx = local_headers.index("Counties Available")
    except ValueError:
        try:
            local_country_idx = local_headers.index("Countries Available")
        except ValueError as e:
            print(f"Couldn't find required columns in local CSV: {e}")
            return

    # Add Main Page Cashback column if it doesn't exist
    if "Main Page Cashback" not in local_headers:
        local_headers.append("Main Page Cashback")
    local_main_cashback_idx = local_headers.index("Main Page Cashback")
    
    if "H1" not in local_headers:
        local_headers.append("H1")
    local_h1_idx = local_headers.index("H1")
    
    if "Meta_title" not in local_headers:
        local_headers.append("Meta_title")
    local_meta_title_idx = local_headers.index("Meta_title")
    
    if "Meta_description" not in local_headers:
        local_headers.append("Meta_description")
    local_meta_desc_idx = local_headers.index("Meta_description")

    # Update data
    updated_count = 0
    for i in range(1, len(local_data)):
        row = local_data[i]
        card_name = row[local_card_idx].strip()
        
        # Ensure row has all columns
        while len(row) < len(local_headers):
            row.append("")
            
        if card_name in card_to_countries:
            new_countries = card_to_countries[card_name]
            row[local_country_idx] = new_countries
        
        if card_name in card_to_main_cashback:
            new_main_cashback = card_to_main_cashback[card_name]
            row[local_main_cashback_idx] = new_main_cashback
            updated_count += 1
            
        if card_name in card_to_seo:
            seo_data = card_to_seo[card_name]
            row[local_h1_idx] = seo_data['H1']
            row[local_meta_title_idx] = seo_data['Meta_title']
            row[local_meta_desc_idx] = seo_data['Meta_description']

    # Rename the column to 'Countries Available' to fix the typo
    local_data[0][local_country_idx] = "Countries Available"

    # Write back
    with open(local_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(local_data)

    print(f"Successfully updated {updated_count} rows.")

if __name__ == "__main__":
    update_csv()
