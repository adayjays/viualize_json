import json
from flask import Flask, jsonify, render_template

app = Flask(__name__)

with open('file.json', 'r') as f:
    data = json.load(f)

def filter_data(data):
    filtered = []
    for item in data:
        asset_info = item.get("assetInfo", {})
        if isinstance(asset_info, str):
            asset_info = {}  # Set asset_info to an empty dict if it's a string

        filtered_item = {
            "serviceOrderNumber": item.get("serviceOrderNumber"),
            "status": item.get("status"),
            "createdAt": item.get("createdAt"),
            "source": item.get("source"),
            "orderType": item.get("orderType"),
            "client": item.get("client"),
            "assetInfo": {
                "assetCatalogName": asset_info.get("assetCatalogName"),
                "assetMakeName": asset_info.get("assetMakeName"),
                "assetTypeName": asset_info.get("assetTypeName"),
                "attributes": asset_info.get("attributes", [])
            },
            "replacementOptions": item.get("replacementOptions", [])
        }
        filtered.append(filtered_item)
    return filtered

def filter_order_number(data):
    filtered = []
    for item in data:
        order_number = item.get("orderNumber")
        if order_number:
            asset_info = item.get("assetInfo", {})
            if isinstance(asset_info, str):
                asset_info = {}  # Set asset_info to an empty dict if it's a string

            replacement_options = item.get("replacementOptions") or []
            if isinstance(replacement_options, str):
                replacement_options = []  # Set replacement_options to an empty list if it's a string

            matching_options = [
                option for option in replacement_options 
                if isinstance(option, dict) and option.get("ModelNumber") == order_number
            ]

            filtered_item = {
                "serviceOrderNumber": item.get("serviceOrderNumber"),
                "orderNumber": item.get("orderNumber"),
                "status": item.get("status"),
                "createdAt": item.get("createdAt"),
                "source": item.get("source"),
                "orderType": item.get("orderType"),
                "client": item.get("client"),
                "assetInfo": {
                    "assetCatalogName": asset_info.get("assetCatalogName"),
                    "assetMakeName": asset_info.get("assetMakeName"),
                    "assetTypeName": asset_info.get("assetTypeName"),
                    "attributes": asset_info.get("attributes", [])
                },
                "matchingOptions": matching_options,
                "replacementOptions": replacement_options
            }
            filtered.append(filtered_item)
    return filtered


filtered_data = filter_data(data)
filtered_order_numbers = filter_order_number(data)

@app.route('/')
def home():
    return render_template('dashboard.html')

@app.route('/service_order')
def service_order():
    return render_template('ServiceOrder.html')

@app.route('/price-distribution')
def price_distribution():
    return render_template('price_distribution.html')

@app.route('/screen-size-distribution')
def screen_size_distribution():
    return render_template('screen_size_distribution.html')

@app.route('/brand-price-comparison')
def brand_price_comparison():
    return render_template('brand_price_comparison.html')

@app.route('/brandloyalty')
def brand_loyalty():
    return render_template('brand_loyalty.html')

@app.route('/customerpreferences')
def customer_preferences():
    return render_template('customer_preferences.html')

@app.route('/pricesensitivity')
def price_sensitivity():
    return render_template('price_sensitivity.html')

@app.route('/featuresimportance')
def features_importance():
    return render_template('features_importance.html')

@app.route('/customersatisfaction')
def customer_satisfaction():
    return render_template('customer_satisfaction.html')

@app.route('/marktrends')
def market_trends():
    return render_template('market_trends.html')

@app.route('/replacementeffectiveness')
def replacement_effectiveness():
    return render_template('replacement_effectiveness.html')

@app.route('/competitiveanalysis')
def competitive_analysis():
    return render_template('competitive_analysis.html')

@app.route('/api/data')
def get_data():
    return jsonify(filtered_data)


@app.route('/api/filtered_order_numbers')
def get_filtered_data():
    return jsonify(filtered_order_numbers)

@app.route('/api/dashboard-data')
def dashboard_data():
    # Load the data from your source (this is just an example)
    with open('file.json', 'r') as file:
        raw_data = json.load(file)

    # If raw_data is a string, try to parse it as JSON
    if isinstance(raw_data, str):
        try:
            raw_data = json.loads(raw_data)
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid data format"}), 400

    # Ensure raw_data is a list
    if not isinstance(raw_data, list):
        raw_data = [raw_data]

    processed_data = process_data(raw_data)
    return jsonify(processed_data)

def process_data(raw_data):
    brands = {}
    features = {"Screen Size": [], "Price": []}
    price_ranges = {"0-100": 0, "101-200": 0, "201-300": 0, "301+": 0}
    
    for order_data in raw_data:
        # If order_data is a string, try to parse it as JSON
        if isinstance(order_data, str):
            try:
                order = json.loads(order_data)
            except json.JSONDecodeError:
                continue  # Skip this order if it's not valid JSON
        else:
            order = order_data

        # Handle original device brand
        asset_info = order.get('assetInfo', {})
        if isinstance(asset_info, str):
            try:
                asset_info = json.loads(asset_info)
            except json.JSONDecodeError:
                asset_info = {}
        original_brand = asset_info.get('assetMakeName', 'Unknown')
        if original_brand not in brands:
            brands[original_brand] = {"original": 0, "replacement": 0}
        brands[original_brand]["original"] += 1
        
        # Handle replacement options
        replacement_options = order.get('replacementOptions', [])
        if replacement_options is None:
            replacement_options = []
        elif isinstance(replacement_options, str):
            try:
                replacement_options = json.loads(replacement_options)
            except json.JSONDecodeError:
                replacement_options = []

        for option in replacement_options:
            brand = option.get('Brand', 'Unknown')
            if brand not in brands:
                brands[brand] = {"original": 0, "replacement": 0}
            brands[brand]["replacement"] += 1
            
            size = option.get('Size')
            price = option.get('Price')
            
            if size is not None:
                features["Screen Size"].append(size)
            
            if price is not None:
                features["Price"].append(price)
                
                if price <= 100:
                    price_ranges["0-100"] += 1
                elif price <= 200:
                    price_ranges["101-200"] += 1
                elif price <= 300:
                    price_ranges["201-300"] += 1
                else:
                    price_ranges["301+"] += 1

    return {
        'brandComparison': {
            'labels': list(brands.keys()),
            'original': [brands[b]["original"] for b in brands],
            'replacement': [brands[b]["replacement"] for b in brands]
        },
        'featureDistribution': {
            'screenSize': {
                'labels': [f"{min(features['Screen Size'] or [0])}-{max(features['Screen Size'] or [0])}"],
                'data': features["Screen Size"]
            },
            'price': {
                'labels': list(price_ranges.keys()),
                'data': list(price_ranges.values())
            }
        }
    }


if __name__ == '__main__':
    app.run(debug=True)
