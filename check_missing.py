import csv, io, urllib.request

def check_missing_data():
    url = "https://docs.google.com/spreadsheets/d/1pvYMus7GOKldh3c6iv99BKGb4vtPn_FpfmrEoy7LxmA/export?format=csv"
    remote_rows = list(csv.reader(io.StringIO(urllib.request.urlopen(url).read().decode('utf-8'))))
    missing = ["Card", "Exa Card", "Kem Card", "Kraken Card", "Kripi Card", "imToken Card (Fiat24)"]
    
    for name in missing:
        for r in remote_rows:
            if r[0].strip() == name:
                print(f"--- {name} ---")
                print(f"Cashback (Col 11): {r[11]}")
                print(f"Main Cashback (Col 26): {r[26] if len(r)>26 else 'NONE'}")
                print(f"Row: {r}")
                break

if __name__ == "__main__":
    check_missing_data()
