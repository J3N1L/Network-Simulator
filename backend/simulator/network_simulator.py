from dataclasses import dataclass
from typing import Dict, List, Optional, Set
import heapq
from enum import Enum
import random

class RoutingProtocol(Enum):
    SHORTEST_PATH = "shortest_path"
    DISTANCE_VECTOR = "distance_vector"
    LINK_STATE = "link_state"

@dataclass
class Packet:
    id: int
    source: str
    destination: str
    payload: str
    hop_count: int = 0
    timestamp: float = 0.0

class NetworkNode:
    def __init__(self, node_id: str, processing_delay: float = 0.1):
        self.node_id = node_id
        self.processing_delay = processing_delay
        self.routing_table: Dict[str, str] = {}  # destination -> next_hop
        self.connections: Dict[str, float] = {}  # neighbor -> latency
        self.buffer: List[Packet] = []
        self.received_packets: Set[int] = set()

    def add_connection(self, neighbor: str, latency: float):
        self.connections[neighbor] = latency

    def update_routing_table(self, destination: str, next_hop: str):
        self.routing_table[destination] = next_hop

class NetworkSimulator:
    def __init__(self, protocol: RoutingProtocol = RoutingProtocol.SHORTEST_PATH):
        self.nodes: Dict[str, NetworkNode] = {}
        self.protocol = protocol
        self.current_time = 0.0
        self.packet_counter = 0
        self.event_queue = []  # Priority queue for events
        
    def add_node(self, node_id: str, processing_delay: float = 0.1) -> None:
        self.nodes[node_id] = NetworkNode(node_id, processing_delay)
        
    def add_connection(self, node1: str, node2: str, latency: float) -> None:
        """Add bidirectional connection between nodes"""
        if node1 in self.nodes and node2 in self.nodes:
            self.nodes[node1].add_connection(node2, latency)
            self.nodes[node2].add_connection(node1, latency)
            self._update_routing_tables()

    def _calculate_shortest_paths(self, source: str) -> Dict[str, str]:
        """Dijkstra's algorithm for routing table calculation"""
        distances = {node: float('infinity') for node in self.nodes}
        next_hops = {node: None for node in self.nodes}
        distances[source] = 0
        pq = [(0, source)]
        visited = set()

        while pq:
            current_distance, current = heapq.heappop(pq)
            if current in visited:
                continue
            visited.add(current)

            for neighbor, latency in self.nodes[current].connections.items():
                distance = current_distance + latency
                if distance < distances[neighbor]:
                    distances[neighbor] = distance
                    next_hops[neighbor] = current if current == source else next_hops[current]
                    heapq.heappush(pq, (distance, neighbor))

        return {dest: next_hops[dest] for dest in self.nodes if next_hops[dest] is not None}

    def _update_routing_tables(self) -> None:
        """Update routing tables based on selected protocol"""
        if self.protocol == RoutingProtocol.SHORTEST_PATH:
            for node_id in self.nodes:
                routes = self._calculate_shortest_paths(node_id)
                for dest, next_hop in routes.items():
                    if dest != node_id:
                        self.nodes[node_id].update_routing_table(dest, next_hop)

    def create_packet(self, source: str, destination: str, payload: str) -> Optional[Packet]:
        """Create and schedule a new packet"""
        if source not in self.nodes or destination not in self.nodes:
            return None
            
        packet = Packet(
            id=self.packet_counter,
            source=source,
            destination=destination,
            payload=payload,
            timestamp=self.current_time
        )
        self.packet_counter += 1
        
        # Schedule initial packet processing
        heapq.heappush(self.event_queue, (
            self.current_time,
            "process_packet",
            source,
            packet
        ))
        return packet

    def run_simulation(self, duration: float) -> List[Dict]:
        """Run simulation for specified duration and return packet statistics"""
        simulation_log = []
        end_time = self.current_time + duration

        while self.event_queue and self.current_time <= end_time:
            time, event_type, node_id, packet = heapq.heappop(self.event_queue)
            self.current_time = time

            if event_type == "process_packet":
                node = self.nodes[node_id]
                
                # Log packet movement
                log_entry = {
                    "time": self.current_time,
                    "packet_id": packet.id,
                    "event": "arrived",
                    "node": node_id,
                    "hops": packet.hop_count
                }
                simulation_log.append(log_entry)

                # Check if packet reached destination
                if node_id == packet.destination:
                    node.received_packets.add(packet.id)
                    continue

                # Forward packet to next hop
                packet.hop_count += 1
                next_hop = node.routing_table.get(packet.destination)
                
                if next_hop:
                    # Calculate delay for next hop
                    transmission_delay = node.connections[next_hop]
                    total_delay = node.processing_delay + transmission_delay
                    
                    # Schedule packet arrival at next node
                    heapq.heappush(self.event_queue, (
                        self.current_time + total_delay,
                        "process_packet",
                        next_hop,
                        packet
                    ))

        return simulation_log