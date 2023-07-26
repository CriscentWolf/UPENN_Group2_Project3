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
        f"/api/population_density<br/>"
        f"/api/population<br/>"
        f"/api/all_gdps<br/>"
        f"/api/top10_gdps<br/>"
        f"/api/top10_population_density<br/>"
        f"/api/top10_population<br/>"
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

@app.route('/api/all_gdps')
def all_gdps():
    conn = connect_db()
    cur = conn.cursor(cursor_factory = psycopg2.extras.DictCursor)
    cur.execute("SELECT country, gdp FROM world_data")
    rows = cur.fetchall()

    cur.close()
    conn.close()

    gdps = [{'country': row['country'], 'gdp': row['gdp']} for row in rows]

    return jsonify(gdps)

@app.route('/api/population_density')
def population_density():
    conn = connect_db()
    cur = conn.cursor(cursor_factory = psycopg2.extras.DictCursor)
    cur.execute("SELECT country, density_p_km2 FROM world_data")
    rows = cur.fetchall()

    cur.close()
    conn.close()

    density_p_km2 = [{'country': row['country'], 'density_p_km2': row['density_p_km2']} for row in rows]

    return jsonify(density_p_km2)

@app.route('/api/population')
def population():
    conn = connect_db()
    cur = conn.cursor(cursor_factory = psycopg2.extras.DictCursor)
    cur.execute("SELECT country, population FROM world_data")
    rows = cur.fetchall()

    cur.close()
    conn.close()
    
    population = [{'country': row['country'], 'population': row['population']} for row in rows]

    return jsonify(population)

@app.route('/api/top10_gdps')
def top10_gdps():
    conn = connect_db()
    cur = conn.cursor(cursor_factory = psycopg2.extras.DictCursor)
    cur.execute("SELECT country, gdp FROM world_data ORDER BY gdp DESC LIMIT 10")
    rows = cur.fetchall()

    cur.close()
    conn.close()

    gdps = [{'country': row['country'], 'gdp': row['gdp']} for row in rows]

    return jsonify(gdps)

@app.route('/api/top10_population_density')
def top10_population_density():
    conn = connect_db()
    cur = conn.cursor(cursor_factory = psycopg2.extras.DictCursor)
    cur.execute("SELECT country, density_p_km2 FROM world_data ORDER BY density_p_km2 DESC LIMIT 10")
    rows = cur.fetchall()

    cur.close()
    conn.close()

    density_p_km2 = [{'country': row['country'], 'density_p_km2': row['density_p_km2']} for row in rows]

    return jsonify(density_p_km2)

@app.route('/api/top10_population')
def top10_population():
    conn = connect_db()
    cur = conn.cursor(cursor_factory = psycopg2.extras.DictCursor)
    cur.execute("SELECT country, population FROM world_data ORDER BY population DESC LIMIT 10")
    rows = cur.fetchall()

    cur.close()
    conn.close()

    population = [{'country': row['country'], 'population': row['population']} for row in rows]

    return jsonify(population)


if __name__ == '__main__':
    app.run(debug = True)
    