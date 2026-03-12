import csv, io, urllib.request

def debug_match():
    url = "https://docs.google.com/spreadsheets/d/1pvYMus7GOKldh3c6iv99BKGb4vtPn_FpfmrEoy7LxmA/export?format=csv"
    remote_content = urllib.request.urlopen(url).read().decode('utf-8')
    remote_rows = list(csv.reader(io.StringIO(remote_content)))
    
    with open('data.csv', 'r', encoding='utf-8') as f:
        local_rows = list(csv.reader(f))

    card_to_cb = {r[0].strip(): r[26].strip() for r in remote_rows[1:] if len(r) > 26}
    
    name = "1inch Debit Card"
    print(f"Remote value for '{name}': '{card_to_cb.get(name)}'")
    
    local_1inch = local_rows[1][0].strip()
    print(f"Local name from file: '{local_1inch}'")
    print(f"Match? {local_1inch == name}")
    print(f"In card_to_cb? {local_1inch in card_to_cb}")
    
    print(f"Local data length for 1inch row: {len(local_rows[1])}")
    print(f"Headers: {local_rows[0]}")
    print(f"Index 29 header: {local_rows[0][29] if len(local_rows[0]) > 29 else 'NONE'}")
    print(f"Index 29 value: '{local_rows[1][29]}' if len > 29 else 'NONE'")

if __name__ == "__main__":
    debug_match()
