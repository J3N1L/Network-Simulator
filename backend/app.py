from flask import Flask, request, jsonify
from flask_cors import CORS
from simulator.network_simulator import NetworkSimulator

app = Flask(__name__)
CORS(app)

simulator = NetworkSimulator()

@app.route('/api/nodes', methods=['POST'])
def add_node():
    data = request.json
    node_id = data.get('nodeId')
    simulator.add_node(node_id)
    return jsonify({'status': 'success'})

@app.route('/api/connections', methods=['POST'])
def add_connection():
    data = request.json
    source = data.get('source')
    target = data.get('target')
    latency = data.get('latency')
    simulator.add_connection(source, target, float(latency))
    return jsonify({'status': 'success'})

@app.route('/api/simulate', methods=['POST'])
def simulate():
    data = request.json
    duration = data.get('duration', 1.0)
    logs = simulator.run_simulation(float(duration))
    return jsonify({'logs': logs})

if __name__ == '__main__':
    app.run(debug=True, port=5000)