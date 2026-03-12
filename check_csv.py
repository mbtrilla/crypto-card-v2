import csv, urllib.request, io
url = "https://docs.google.com/spreadsheets/d/1pvYMus7GOKldh3c6iv99BKGb4vtPn_FpfmrEoy7LxmA/export?format=csv"
response = urllib.request.urlopen(url)
content = response.read().decode('utf-8')
reader = csv.reader(io.StringIO(content))
headers = next(reader)
print("HEADERS:")
for i, h in enumerate(headers):
    print(i, h)
