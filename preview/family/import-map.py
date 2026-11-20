"""Extract a small ODbL street/building layer from an OpenStreetMap XML export."""
import json
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
root = ET.parse(sys.argv[1]).getroot()
nodes = {n.get("id"): [round(float(n.get(k)), 6) for k in ("lat", "lon")] for n in root.findall("node")}
features = []
for way in root.findall("way"):
    tags = {t.get("k"): t.get("v") for t in way.findall("tag")}
    kind = "path" if tags.get("highway") in ("path","footway","pedestrian","steps") else "road" if "highway" in tags else "building" if "building" in tags else None
    if kind:
        line = [nodes[n.get("ref")] for n in way.findall("nd") if n.get("ref") in nodes]
        if len(line)>1:
            features.append([kind, line])
Path(sys.argv[2]).write_text(json.dumps(features,separators=(",",":")))
