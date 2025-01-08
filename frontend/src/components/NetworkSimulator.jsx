import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Send, Search, PlayCircle, Trash } from "lucide-react";

const NetworkSimulatorUI = () => {
  const [nodes, setNodes] = useState(new Map());
  const [connections, setConnections] = useState([]);
  const [packets, setPackets] = useState([]);
  const [newNodeId, setNewNodeId] = useState("");
  const [selectedNodes, setSelectedNodes] = useState({ source: "", target: "" });
  const [latency, setLatency] = useState("1");
  const [shortestPath, setShortestPath] = useState([]);
  const [packetMessage, setPacketMessage] = useState("");
  const [gridSizeX, setGridSizeX] = useState(10); // Default grid size (X-axis)
  const [gridSizeY, setGridSizeY] = useState(10); // Default grid size (Y-axis)
  const [nodeX, setNodeX] = useState(""); // X-coordinate input
  const [nodeY, setNodeY] = useState(""); // Y-coordinate input



  // Calculate node positions in grid
  // Calculate node positions in a fixed 10x10 grid
  // Calculate node positions in grid
  const getNodePositionGrid = (x, y) => {
    const gridSize = 10; // Fixed grid size
    const spacing = 20 * 2; // 1 unit = 5 cm = 20 pixels, so spacing = 100 pixels
  
    // Ensure the coordinates are within bounds
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
      throw new Error("Coordinates must be within the range of 0 to 9.");
    }
  
    return {
      x: x * spacing + spacing / 2, // X-coordinate with padding
      y: y * spacing + spacing / 2, // Y-coordinate with padding
    };
  };
  
  // Add a new node with specified X and Y coordinates
  const handleAddNode = () => {
    if (!newNodeId || nodes.has(newNodeId) || nodeX === "" || nodeY === "") {
      alert("Please provide a unique node ID and valid coordinates.");
      return;
    }
  
    const x = parseInt(nodeX, 10);
    const y = parseInt(nodeY, 10);
  
    // Validate coordinates
    if (isNaN(x) || isNaN(y) || x < 0 || x > 9 || y < 0 || y > 9) {
      alert("Coordinates must be integers between 0 and 9.");
      return;
    }
  
    const nodePositions = new Map(nodes);
    try {
      nodePositions.set(newNodeId, getNodePositionGrid(x, y));
      setNodes(nodePositions);
      setNewNodeId("");
      setNodeX("");
      setNodeY("");
    } catch (error) {
      alert(error.message);
    }
  };
  

  // Add a connection between nodes
  const handleAddConnection = () => {
    const { source, target } = selectedNodes;
    if (!source || !target || source === target) return;

    const newConnection = { source, target, latency: parseFloat(latency) };
    setConnections([...connections, newConnection]);
    setSelectedNodes({ source: "", target: "" });
    setLatency("1");
  };

  // Remove a connection
  const handleRemoveConnection = (index) => {
    const updatedConnections = [...connections];
    updatedConnections.splice(index, 1);
    setConnections(updatedConnections);
  };

  // Dijkstra's Algorithm to find the shortest path based on latency
  const findShortestPath = (start, end) => {
    const distances = {};
    const previous = {};
    const unvisited = new Set(nodes.keys());

    // Initialize distances to Infinity and previous to undefined
    nodes.forEach((_, node) => {
      distances[node] = Infinity;
    });
    distances[start] = 0;

    while (unvisited.size) {
      const currentNode = Array.from(unvisited).reduce((closest, node) =>
        distances[node] < distances[closest] ? node : closest
      );

      if (currentNode === end) break;

      unvisited.delete(currentNode);

      connections.forEach((conn) => {
        if (conn.source === currentNode || conn.target === currentNode) {
          const neighbor = conn.source === currentNode ? conn.target : conn.source;

          if (unvisited.has(neighbor)) {
            const newDistance = distances[currentNode] + conn.latency;

            if (newDistance < distances[neighbor]) {
              distances[neighbor] = newDistance;
              previous[neighbor] = currentNode;
            }
          }
        }
      });
    }

    const path = [];
    let currentNode = end;
    while (currentNode !== undefined) {
      path.unshift(currentNode);
      currentNode = previous[currentNode];
    }

    return path;
  };

  // Handle finding the shortest path
  const handleFindShortestPath = () => {
    if (!selectedNodes.source || !selectedNodes.target) {
      alert("Please select both source and target nodes.");
      return;
    }

    const path = findShortestPath(selectedNodes.source, selectedNodes.target);
    if (path.length > 1) {
      setShortestPath(path);
    } else {
      alert("No path found between the selected nodes.");
    }
  };

  // Simulate packet traveling along the shortest path
  const handleSimulatePacket = () => {
    if (shortestPath.length < 2) {
      alert("No shortest path to simulate.");
      return;
    }

    let i = 0;
    setPackets([{ message: packetMessage, position: shortestPath[i] }]);

    const interval = setInterval(() => {
      i += 1;
      if (i < shortestPath.length) {
        setPackets([{ message: packetMessage, position: shortestPath[i] }]);
      } else {
        clearInterval(interval);
        setPackets([]);
      }
    }, 1000);
  };

  // Render connections with shortest path highlighted
  const renderConnections = () => {
    return connections.map((conn, i) => {
      const source = nodes.get(conn.source);
      const target = nodes.get(conn.target);
  
      return (
        <g key={i}>
          <line
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            stroke="#666" // Regular color for connections
            strokeWidth="2"
          />
          <text
            x={(source.x + target.x) / 2}
            y={(source.y + target.y) / 2 - 5}
            fontSize="12"
            fill="#000"
          >
            {conn.latency}
          </text>
        </g>
      );
    });
  };
  
  // Highlight only the shortest path connections
const highlightShortestPath = () => {
  return connections.map((conn, i) => {
    const source = nodes.get(conn.source);
    const target = nodes.get(conn.target);

    // Check if this connection is part of the shortest path
    const isShortestPath =
      shortestPath.includes(conn.source) &&
      shortestPath.includes(conn.target) &&
      (shortestPath.indexOf(conn.source) < shortestPath.indexOf(conn.target) ||
        shortestPath.indexOf(conn.target) < shortestPath.indexOf(conn.source));

    // Render only the highlighted connections for shortest path
    if (isShortestPath) {
      return (
        <g key={i}>
          <line
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            stroke={isShortestPath ? "red" : "#666"}
            strokeWidth={isShortestPath ? "4" : "2"}
          />
          <text
            x={(source.x + target.x) / 2}
            y={(source.y + target.y) / 2 - 5}
            fontSize="12"
            fill="#000"
          >
            {conn.latency}
          </text>
        </g>
      );
    }
    return NULL; // Skip rendering if not part of the shortest path
  });
};

  return (
    <div className="p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Network Simulator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">            
          <div>
              <Label>Node ID and Coordinates</Label>
              <div className="flex gap-2">
                <Input
                  value={newNodeId}
                  onChange={(e) => setNewNodeId(e.target.value)}
                  placeholder="Enter node ID"
                />
                <Input
                  type="number"
                  value={nodeX}
                  onChange={(e) => setNodeX(e.target.value)}
                  placeholder="X (0-9)"
                  className="w-24"
                />
                <Input
                  type="number"
                  value={nodeY}
                  onChange={(e) => setNodeY(e.target.value)}
                  placeholder="Y (0-9)"
                  className="w-24"
                />
                <Button onClick={handleAddNode}>
                  <Plus className="mr-2" /> Add Node
                </Button>
              </div>
            </div>            
            <div>
              <Label>Connection</Label>
              <div className="flex gap-2">
                <select
                  className="p-2 border rounded w-32"
                  value={selectedNodes.source}
                  onChange={(e) =>
                    setSelectedNodes((prev) => ({ ...prev, source: e.target.value }))
                  }
                >
                  <option value="">Source</option>
                  {Array.from(nodes.keys()).map((node) => (
                    <option key={node} value={node}>
                      {node}
                    </option>
                  ))}
                </select>
                <select
                  className="p-2 border rounded w-32"
                  value={selectedNodes.target}
                  onChange={(e) =>
                    setSelectedNodes((prev) => ({ ...prev, target: e.target.value }))
                  }
                >
                  <option value="">Target</option>
                  {Array.from(nodes.keys()).map((node) => (
                    <option key={node} value={node}>
                      {node}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  value={latency}
                  onChange={(e) => setLatency(e.target.value)}
                  placeholder="Latency"
                  className="w-24"
                  step="0.1"
                  min="0.1"
                />
                <Button onClick={handleAddConnection}>
                  <Send className="mr-2" /> Connect
                </Button>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mb-4">
            <Button onClick={handleFindShortestPath}>
              <Search className="mr-2" /> Find Shortest Path
            </Button>
            <Input
              value={packetMessage}
              onChange={(e) => setPacketMessage(e.target.value)}
              placeholder="Packet Message"
            />
            <Button onClick={handleSimulatePacket}>
              <PlayCircle className="mr-2" /> Simulate Packet
            </Button>
          </div>

          <div className="border rounded p-4" style={{ height: "400px", position: "relative" }}>
            <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
              {renderConnections()}
            </svg>

            {Array.from(nodes.entries()).map(([id, pos]) => (
              <div
                key={id}
                className="absolute w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center"
                style={{
                  left: pos.x - 24,
                  top: pos.y - 24,
                }}
              >
                {id}
              </div>
            ))}

            {packets.map((packet, i) => {
              const position = nodes.get(packet.position);
              return (
                <div
                  key={i}
                  className="absolute w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center"
                  style={{
                    left: position.x - 16,
                    top: position.y - 16,
                  }}
                >
                  {packet.message}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Connections</CardTitle>
        </CardHeader>
        <CardContent>
          {connections.length ? (
            <ul>
              {connections.map((conn, i) => (
                <li key={i} className="flex justify-between items-center mb-2">
                  <span>
                    {conn.source} ↔ {conn.target} (Latency: {conn.latency})
                  </span>
                  <Button variant="destructive" onClick={() => handleRemoveConnection(i)}>
                    <Trash className="mr-2" /> Remove
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No connections available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkSimulatorUI;
