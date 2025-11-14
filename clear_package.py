import sqlite3
import os

db_path = os.path.expanduser('~/.n8n/database.sqlite')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Delete from installed_packages
cursor.execute("DELETE FROM installed_packages WHERE packageName = 'n8n-nodes-microsoft365-copilot'")
print(f"Deleted {cursor.rowcount} rows from installed_packages")

# Delete from installed_nodes
cursor.execute("DELETE FROM installed_nodes WHERE package = 'n8n-nodes-microsoft365-copilot'")
print(f"Deleted {cursor.rowcount} rows from installed_nodes")

conn.commit()
conn.close()
print("Database cleaned successfully")
