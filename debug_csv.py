import csv
import io
import urllib.request

def debug_csv():
    url = "https://docs.google.com/spreadsheets/d/1pvYMus7GOKldh3c6iv99BKGb4vtPn_FpfmrEoy7LxmA/export?format=csv"
    response = urllib.request.urlopen(url)
    remote_content = response.read().decode('utf-8')
    remote_rows = list(csv.reader(io.StringIO(remote_content)))
    
    with open('data.csv', 'r', encoding='utf-8') as f:
        local_rows = list(csv.reader(f))

    print(f"Remote Row Count: {len(remote_rows)}")
    print(f"Local Row Count: {len(local_rows)}")
    
    if len(remote_rows) > 1 and len(local_rows) > 1:
        remote_card = remote_rows[1][0]
        local_card = local_rows[1][0]
        print(f"Remote Card Name [0]: '{remote_card}'")
        print(f"Local Card Name [0]: '{local_card}'")
        
        # Look for the card in remote
        remote_match = None
        for r_row in remote_rows[1:]:
            if r_row[0].strip() == local_card.strip():
                remote_match = r_row
                break
        
        if remote_match:
            print(f"MATCH FOUND for '{local_card}'")
            print(f"Remote Col 26 (AA) Value: '{remote_match[26]}' if len > 26 else 'NONE'")
            print(f"Remote Row Length: {len(remote_match)}")
            # Show all columns for this card to see which one is the cashback
            for idx, val in enumerate(remote_match):
                print(f"{idx}: {val}")
        else:
            print(f"NO MATCH for '{local_card}'")

if __name__ == "__main__":
    debug_csv()
