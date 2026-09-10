import os

replacements = {
    "'/chaos-data'": "'/mock-data'",
    '"/chaos-data"': '"/mock-data"',
    "'/jwt-inspector'": "'/jwt-decoder'",
    '"/jwt-inspector"': '"/jwt-decoder"',
    "'/chaos-templates'": "'/api-templates'",
    '"/chaos-templates"': '"/api-templates"',
    "'/background-removal'": "'/background-remover'",
    '"/background-removal"': '"/background-remover"',
    "devpantry.com/chaos-data": "devpantry.com/mock-data",
    "devpantry.com/jwt-inspector": "devpantry.com/jwt-decoder",
    "devpantry.com/chaos-templates": "devpantry.com/api-templates",
    "devpantry.com/background-removal": "devpantry.com/background-remover",
}

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()
            
            new_content = content
            for old, new in replacements.items():
                new_content = new_content.replace(old, new)
                
            if new_content != content:
                with open(path, 'w') as f:
                    f.write(new_content)
                print(f"Updated {path}")
