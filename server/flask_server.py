from flask import Flask, request, jsonify
from flask_cors import CORS
import pyodbc

app = Flask(__name__)
CORS(app)

server = 'hidden'
database = 'hidden'
username = 'hidden'
password = 'hidden'
driver = '{ODBC Driver 17 for SQL Server}'
cnxn = pyodbc.connect('DRIVER=' + driver + ';SERVER=' + server + ';PORT=1433;DATABASE=' + database + ';UID=' + username + ';PWD=' + password)

@app.route('/api/table', methods=['GET'])
def get_data():
    cursor = cnxn.cursor()
    cursor.execute('SELECT * FROM myTable')
    rows = cursor.fetchall()
    data = []
    for row in rows:
        data.append({'column1': row[0], 'column2': row[1], 'column3': row[2]})
    return jsonify(data)

@app.route('/api/table', methods=['POST'])
def insert_data():
    data = request.json['data']
    cursor = cnxn.cursor()
    for row in data:
        cursor.execute('INSERT INTO myTable (column1, column2, column3) VALUES (?, ?, ?)', row['column1'], row['column2'], row['column3'])
    cnxn.commit()
    return 'Data inserted successfully!'

if __name__ == '__main__':
    app.run(debug=True, port=3001)
