import glob

files = ['index.html']
files.extend(glob.glob('cards/*/*.html'))

count = 0
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    old_text = "Compare the world's best crypto debit and credit cards with **Sweepbase**. Find"
    new_text = "Compare the world's best crypto debit and credit cards with Sweepbase. Find"
    
    if old_text in content:
        new_content = content.replace(old_text, new_text)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        count += 1

print(f"Updated {count} HTML files.")
