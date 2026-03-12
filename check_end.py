import csv, io, urllib.request

def check_end():
    url = "https://docs.google.com/spreadsheets/d/1pvYMus7GOKldh3c6iv99BKGb4vtPn_FpfmrEoy7LxmA/export?format=csv"
    remote_rows = list(csv.reader(io.StringIO(urllib.request.urlopen(url).read().decode('utf-8'))))
    print(f"Total rows: {len(remote_rows)}")
    for i in range(len(remote_rows)-20, len(remote_rows)):
        r = remote_rows[i]
        print(f"{i}: Name: '{r[0]}' | Col 26 (AA): '{r[26] if len(r)>26 else 'NONE'}'")

if __name__ == "__main__":
    check_end()
