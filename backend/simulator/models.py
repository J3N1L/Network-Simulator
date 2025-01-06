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