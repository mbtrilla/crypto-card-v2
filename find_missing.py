import csv, io, urllib.request

def find_missing():
    url = "https://docs.google.com/spreadsheets/d/1pvYMus7GOKldh3c6iv99BKGb4vtPn_FpfmrEoy7LxmA/export?format=csv"
    remote_content = urllib.request.urlopen(url).read().decode('utf-8')
    remote_rows = list(csv.reader(io.StringIO(remote_content)))
    remote_names = set(r[0].strip() for r in remote_rows[1:] if r[0].strip())
    
    with open('data.csv', 'r', encoding='utf-8') as f:
        local_rows = list(csv.reader(f))
    local_names = set(r[0].strip() for r in local_rows[1:] if r[0].strip())

    missing_in_local = remote_names - local_names
    print(f"Cards in Sheet but not in local CSV ({len(missing_in_local)}):")
    for name in sorted(missing_in_local):
        print(f"- {name}")

if __name__ == "__main__":
    find_missing()
