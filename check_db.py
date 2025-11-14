import sqlite3
import os

db_path = os.path.expanduser('~/.n8n/database.sqlite')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Check installed_packages table
cursor.execute('SELECT * FROM installed_packages')
rows = cursor.fetchall()
columns = [desc[0] for desc in cursor.description]

print('Columns:', columns)
print('\nRows:')
for row in rows:
    print(row)

# Check installed_nodes table
print('\n\n=== installed_nodes table ===')
cursor.execute('SELECT * FROM installed_nodes')
rows2 = cursor.fetchall()
columns2 = [desc[0] for desc in cursor.description]

print('Columns:', columns2)
print('\nRows:')
for row in rows2:
    print(row)

conn.close()
