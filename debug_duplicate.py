import csv, io, urllib.request

def debug_duplicate():
    url = "https://docs.google.com/spreadsheets/d/1pvYMus7GOKldh3c6iv99BKGb4vtPn_FpfmrEoy7LxmA/export?format=csv"
    r = list(csv.reader(io.StringIO(urllib.request.urlopen(url).read().decode('utf-8'))))
    print(f"Row 1 Name: '{r[1][0]}' | cashback: '{r[1][26]}'")
    print(f"Row 121 Name: '{r[121][0]}' | cashback: '{r[121][26]}'")
    
    # Check if there's a hidden row or something odd
    # Let's peek at row 0 headers too
    print(f"Row 0 Col 26 header: '{r[0][26]}'")

if __name__ == "__main__":
    debug_duplicate()
