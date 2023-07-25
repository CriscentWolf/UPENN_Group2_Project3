from flask import Flask, jsonify
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv
import os

app = Flask(__name__)

load_dotenv('cred.env')  # replace '.env' with 'cred.env'

def connect_db():
    conn = psycopg2.connect(database=os.environ.get("DB_NAME"), 
                            user=os.environ.get("DB_USER"), 
                            password=os.environ.get("DB_PASSWORD"), 
                            host=os.environ.get("DB_HOST"), 
                            port=os.environ.get("DB_PORT"))
    return conn

@app.route('/')
def home():
    """Welcome to Project 3 here are the Available API routes."""
    return (
        f"Available Routes:<br/>"        
        f"/api/countries/<country_name><br/>"   
        # add other routes here as you develop them     
    )

@app.route('/api/countries/<string:country_name>')
def country_data(country_name):
    conn = connect_db()
    cur = conn.cursor(cursor_factory = psycopg2.extras.DictCursor)
    cur.execute("Select * FROM world_data WHERE country = %s", (country_name,))
    row = cur.fetchone()


    cur.close()
    conn.close()

    if row is None:
        return jsonify({"error": "Country not found"}), 404

    return jsonify(dict(row))

if __name__ == '__main__':
    app.run(debug = True)
    