# Dependencies
import numpy as np 
import pandas as pd
import math
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, desc
from flask import Flask, jsonify, render_template, request, json, redirect, url_for

# Create App
app = Flask(__name__)

weatherdata=pd.read_csv('data/stations_data.csv')
weatherloc=pd.read_csv('data/stat_loc.csv')

# Connect to sqlite database
engine = create_engine("sqlite:///data/WWII.sqlite")
Base = automap_base()
Base.prepare(engine, reflect=True)
session = Session(engine)

# Storing tables
bombarded_targets = Base.classes.bombarded_targets

# Returns the dashboard homepage
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/index.html")
def index():
    return render_template("index.html")

@app.route('/bombarded_locations.html')
def bombarded_locations():
    return render_template('bombarded_locations.html')

@app.route('/bombed_location_dashboard.html')
def bombed_location_dashboard():
    return render_template('bombed_location_dashboard.html')

@app.route('/map.html')
def map():
    return render_template('map.html')

@app.route('/dash.html')
def dash():
    return render_template('dash.html')

@app.route('/population.html')
def population():
    return render_template('population.html')

# Returns a list of sample names in list format
@app.route("/bombarded_countries")
def countries():

   # Empty list for country infos
    targeted_data = []

    # Grab metadata table
    results = session.query(bombarded_targets.TGT_COUNTRY, func.count(bombarded_targets.TGT_LOCATION)).\
                group_by(bombarded_targets.TGT_COUNTRY).\
                order_by(func.count(bombarded_targets.TGT_LOCATION).desc()).all()

    # Loop through query & grab country name
    for result in results:
        targeted_country = {}
        targeted_country['name'] = result[0]
        targeted_country['locations'] = result[1]
        targeted_data.append(targeted_country)

    #print(targeted_countries)

    return jsonify(targeted_data)

@app.route("/metadata/<sample>")
def metadata(sample):

    print(sample)
    
    # Grab input
    sample_id = str(country)

    # Empty dictionary for data
    sample_metadata = {}

    # Grab metadata table
    samples = session.query(bombarded_targets.TGT_COUNTRY, func.count(bombarded_targets.TGT_LOCATION)).\
                group_by(bombarded_targets.TGT_COUNTRY).\
                order_by(func.count(bombarded_targets.TGT_LOCATION).desc()).all()

    # Loop through query & grab info
    for info in samples:
        if (sample_id == info.COUNTRY):
            sample_metadata["COUNTRY"] = info.COUNTRY
            sample_metadata["# Targeted Locations"] = info.TGT_LOCATION

    return jsonify(sample_metadata)

@app.route("/bombed_locations")
def locations():

    # Empty list for longlat infos
    targeted_locations_langlot = []

    # Grab metadata table
    results = session.query(bombarded_targets.TGT_COUNTRY, bombarded_targets.TGT_LOCATION,bombarded_targets.LATITUDE, \
                            bombarded_targets.LONGITUDE).all()
                #.filter(bombarded_targets.TGT_LOCATION.isnot(None).all()

                #.filter(bombarded_targets.TGT_LOCATION.isnot(None).all()
                        
    print(results[0:50])

    # Loop through query & grab country name
    for result in results:
        if result[0] != 'UNKNOWN':
            if result[0] != 'UNKNOWN OR NOT INDICATED':
                targeted_locations = {}
                targeted_locations['country'] = result[0]
                targeted_locations['location_name'] = result[1]
                targeted_locations['coordinates'] = [result[2],result[3]]
                targeted_locations_langlot.append(targeted_locations)

    return jsonify(targeted_locations_langlot)

@app.route("/bombed_locations_info/<country>")
def tgt_countries(country):

    print(country)

    #grab input
    tgt_country = str(country)

    # Empty dictionary for data
    tgt_country_info = []

    # Grab metadata table
    results = session.query(bombarded_targets.COUNTRY_FLYING_MISSION, bombarded_targets.TGT_COUNTRY, bombarded_targets.TGT_LOCATION, \
                            bombarded_targets.TGT_TYPE, bombarded_targets.TGT_INDUSTRY, bombarded_targets.TGT_PRIORITY_EXPLANATION).all()
                #.filter(bombarded_targets.TGT_LOCATION.isnot(None).all()

                #.filter(bombarded_targets.TGT_LOCATION.isnot(None).all()
                        
    print(results[0:50])

    # Loop through query & grab country name
    for result in results:
        tgt_country_loc_info = {}
        tgt_country_loc_info['Country'] = result[1]
        tgt_country_loc_info['Location'] = result[2]
        tgt_country_loc_info['Loc_Type'] = result[3]
        tgt_country_loc_info['Industry'] = result[4]
        tgt_country_loc_info['Priority'] = result[5]
        tgt_country_loc_info['Country_Flying_Mission'] = result[0]  
        tgt_country_info.append(tgt_country_loc_info)          

    return jsonify(tgt_country_info)


@app.route('/stations')
def stations():
    stations=list(weatherdata['name'].unique())
    stat_sort=sorted(stations)
    return jsonify(stat_sort)

@app.route('/dates')
def dates():
    dates=list(weatherdata['Date'].unique())
    dates_sort=sorted(dates)
    return jsonify(dates_sort)

@app.route('/data/<station>/<date>')
def meteodata(station,date):
    try: 
     mean_t=weatherdata[(weatherdata['name'] == station) & (weatherdata['Date']==date)]['MeanTemp'][0]
    except:
        mean_t='no data'
    # print(weatherdata[(weatherdata['name']==station)&(weatherdata['Date']==date)]['MeanTemp'])
    try:
        prec=weatherdata[(weatherdata['name']==station)&(weatherdata['Date']==date)]['Precip'][0]
    except:
        prec='no data'
    try:
        wind_s_series = weatherdata[(weatherdata['name']==station)&(weatherdata['Date']==date)]['WindGustSpd']
        print(wind_s_series[0])    
        if (not math.isnan(wind_s_series[0])):
            wind_s=wind_s_series[0]
        else:
            wind_s='no data'
    except:
        wind_s='no data'
    daydata={}
   #if wind_s==NaN:
    #    wind_s='no data'
    daydata['Mean T']=mean_t
    daydata['Prcpt']=prec
    daydata['Wind Sp']=wind_s
    # print(daydata)
    return jsonify(daydata)
    # return str(list(weatherdata[(weatherdata['name'] == station) & (weatherdata['Date']==date)]['MeanTemp'])[0])
    # weatherdata[(weatherdata['name'] == station) & (weatherdata['Date']==date)]['MeanTemp']

@app.route('/location/<station>')
def location(station):
    stat_geo={}
    lat=str(weatherloc[weatherloc['name']==station]['lat'].item())
    lon=str(weatherloc[weatherloc['name']==station]['long'].item())
    stat_geo['name']=station
    stat_geo['lat']=lat
    stat_geo['long']=lon
    return jsonify(stat_geo)
    
if __name__ == "__main__":
    app.run(debug=True)