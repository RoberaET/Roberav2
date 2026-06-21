Multi-Branch Enterprise Network — WAN, BGP, OSPF, VPNs

A multi-site enterprise network built in Cisco Packet Tracer connecting a central HQ campus to two remote branch offices over simulated WAN links. This project goes beyond simple inter-VLAN routing to demonstrate a realistic hub-and-spoke WAN design with centralized services, per-branch segmentation, and consistent policy enforcement across sites.

Topology Overview

HQ (Central Campus)
└── HQ-Router  ←→  Internet (ISP uplink)
    ├── HQ-SW (core distribution)
    │   ├── Switch5 (access layer A)
    │   │   └── HQ-SRV0, HQ-SRV1 (file/auth servers)
    │   ├── Switch6 (access layer B)
    │   │   └── HQ-SRV2 (backup/monitoring server)
    │   └── [cross-links between all HQ switches for redundancy]
Branch 1 (B1)
└── B1-Router  ←→  HQ-Router (WAN link / VPN tunnel)
    └── B1-Switch
        ├── Laptop0 (end user)
        └── B1-SRV (branch local server)
Branch 2 (B2)
└── B2-Router  ←→  HQ-Router (WAN link / VPN tunnel)
    └── B2-Switch
        ├── Laptop1 (end user)
        └── B2-SRV (branch local server)

Design Decisions

Hub-and-Spoke WAN via VPN tunnels
All branch-to-branch traffic is hairpinned through HQ rather than direct branch-to-branch links. This centralizes firewall inspection and policy at HQ, avoids the complexity of full-mesh VPNs across many branches, and mirrors how most real SME multi-branch networks actually operate — spoke sites rarely have the budget or need for direct site-to-site links.

Centralized DHCP and DNS at HQ
DHCP pools for Branch 1 and Branch 2 subnets live on HQ-Router with ip helper-address forwarding over the VPN tunnel. This means branches never lose DHCP even if local config drifts, all leases are centrally visible, and adding a new branch only requires one pool addition at HQ rather than configuring each branch separately.

Per-site VLANs with consistent numbering
VLAN 10 = Users at every site (different subnets, same VLAN ID). VLAN 20 = Servers at every site. This makes policy templates reusable — ACLs, QoS maps, and monitoring templates are identical across sites because the logical structure is identical; only the IP ranges differ.

HQ switching mesh with redundant uplinks
HQ-SW, Switch5, and Switch6 are cross-linked in a partial mesh rather than a simple star. This ensures that losing any single switch or uplink does not isolate any HQ server group. STP (Rapid-PVST) manages the loop, with HQ-SW designated as root bridge.

Internet-facing design
HQ-Router has a dedicated internet-facing interface for outbound NAT. Branches reach the internet through the VPN tunnel to HQ, which then NATs on their behalf — a common design that keeps branch routers simple and lets HQ enforce outbound policy for the whole organization.

IP Address Plan

Site        Subnet          Gateway         Notes
HQ-LAN      10.1.0.0/24     10.1.0.1        Internal campus
HQ-SRV      10.1.1.0/24     10.1.1.1        Server VLAN
B1-LAN      10.2.0.0/24     10.2.0.1        Branch 1 users
B1-SRV      10.2.1.0/24     10.2.1.1        Branch 1 server
B2-LAN      10.3.0.0/24     10.3.0.1        Branch 2 users
B2-SRV      10.3.1.0/24     10.3.1.1        Branch 2 server

WAN Links (point-to-point)
HQ ↔ B1:   10.10.10.0/30    OSPF/BGP area 0
HQ ↔ B2:   10.10.20.0/30    OSPF/BGP area 0

Verification Commands

show ip route               # Verify all remote subnets reachable from HQ
show crypto ipsec sa        # Confirm VPN tunnel is UP for both branches
show ip bgp summary         # Check BGP peering state (if BGP configured)
ping 10.2.1.10 source lo0   # HQ-Router to B1-SRV end-to-end
ping 10.3.1.10 source lo0   # HQ-Router to B2-SRV end-to-end
traceroute 10.2.0.10        # Confirm path traverses VPN link, not internet directly
show ip dhcp binding        # Verify all branch clients leased from central DHCP

What I'd do differently in production

NAT at branch level rather than hairpinning internet through HQ would reduce latency for branch internet access significantly. Split tunneling on the VPN (route corporate traffic through tunnel, internet directly) is standard in modern SD-WAN but adds complexity in a Packet Tracer lab. Additionally, deploying redundant WAN links (primary MPLS + backup internet VPN) per branch is the real-world standard for business continuity — the single WAN link in this lab is a deliberate simplification to keep the focus on the routing and switching logic rather than ISP redundancy.

Files
topology.png         — exported Packet Tracer topology diagram
multi-branch.pkt     — full Packet Tracer project file
/configs             — running-config exports for all 7 devices (HQ-Router, B1-Router, B2-Router, HQ-SW, Switch5, Switch6, B1-Switch, B2-Switch)
IP plan above for quick reference without opening the .pkt file
