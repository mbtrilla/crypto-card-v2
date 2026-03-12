import glob

files = glob.glob('cards/*/*.html')
count = 0
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<script src="/script.js"></script>' in content:
        new_content = content.replace('<script src="/script.js"></script>', '<script src="/script.js?v=3"></script>')
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        count += 1

print(f"Updated {count} HTML files in cards/")
