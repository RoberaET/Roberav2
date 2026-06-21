Enterprise Campus Network — OSPF, HSRP, VLANs, DHCP Relay

A three-tier campus network (Core / Distribution / Access) built in Cisco Packet Tracer, designed to mirror how a real small-to-mid enterprise campus is structured rather than a single-path lab topology. The goal of this project was to go past a basic "VLANs + static routing" exercise and build something with actual redundancy, gateway high availability, and security hardening at every layer.

Topology
                    CORE (IE-9320)
                    /            \
              Gig1/0/23        Gig1/0/24
                  /                  \
            DIST1 (3650)         DIST2 (3650)
           /    |    |    \     /    |    |    \
        ACC1  ACC2  ACC3  ACC4 (each access switch
        (2960)                 dual-homed to both
                                distribution switches)

Core connects to each distribution switch with a single routed Layer 3 link. Every access switch connects to both distribution switches — one primary uplink, one cross-link to the other distribution switch — so no single distribution failure isolates an access closet. Because this creates a real Layer 2 loop, rapid-PVST actively blocks the redundant path per VLAN until it's needed.

Design decisions
Why Layer 3 at distribution, not at core only. Default gateways live on the distribution switches as SVIs, not centralized at core. This keeps inter-VLAN routing local to each distribution pair and gives a natural point for HSRP to provide gateway redundancy without making core a single point of failure for every VLAN's default gateway.

Why split-active HSRP, not simple active/passive. Dist1 is HSRP-active for VLAN 10 (Users) and VLAN 30 (CCTV); Dist2 is HSRP-active for VLAN 20 (Voice) and VLAN 40 (Servers). Both distribution switches forward live production traffic simultaneously instead of one sitting idle as pure backup. If either fails, the surviving switch becomes active for all four VLANs.

Why OSPF point-to-point with MD5, not broadcast network type. All Core-Distribution links are /30 point-to-point routed links. Setting ip ospf network point-to-point skips the DR/BDR election that's pointless on a two-router segment and speeds convergence. MD5 authentication on every OSPF-enabled interface prevents rogue device injection into the routing domain — a detail worth having on a portfolio piece since it signals security awareness beyond "OSPF works."

Why passive-interface on every VLAN SVI. Distribution switches advertise VLAN subnets into OSPF but never send Hello packets out onto access-layer ports. There's no legitimate OSPF neighbor on a VLAN facing end-user devices, so this closes off a no-cost attack surface.

Why DHCP snooping, port security, and storm control at access. Every access port carrying an end device runs port security with sticky MAC and violation restrict (logs and drops, doesn't kill the whole port on a false positive), portfast with bpduguard, and DHCP snooping trusts only the uplinks. This blocks rogue DHCP servers and unauthorized device spoofing at the edge, which is where real campus attacks start.

VLAN plan
VLAN	Name	Subnet	Gateway (HSRP VIP)	Active on
10	Users	10.10.10.0/24	10.10.10.1	Dist1
20	Voice	10.10.20.0/24	10.10.20.1	Dist2
30	CCTV	10.10.30.0/24	10.10.30.1	Dist1
40	Servers	10.10.40.0/24	10.10.40.1	Dist2
Native VLAN on all trunks is set to an unused VLAN 999, not VLAN 1 — standard hardening to avoid untagged-frame attacks via the default native VLAN.

IP addressing
Link	Subnet	Notes
Core ↔ Dist1	10.255.255.0/30	OSPF area 0, MD5 auth
Core ↔ Dist2	10.255.255.8/30	OSPF area 0, MD5 auth
Loopback interfaces (1.1.1.1 / 2.2.2.2 / 3.3.3.3) fix each device's OSPF router-ID so it never shifts on an interface flap, and Core's loopback is advertised into OSPF as the DHCP relay target.

DHCP
DHCP is centralized on Core, one pool per VLAN, with ip helper-address configured on every distribution VLAN SVI pointing at Core's loopback (reachable via OSPF regardless of which physical link is up). Each pool excludes the first ten addresses to protect the HSRP virtual IP and any static infrastructure addresses.

Verification
show ip ospf neighbor      # Core shows both Dist1 and Dist2 as FULL
show ip route              # all four VLAN subnets visible from every L3 device
show standby brief         # confirms split-active HSRP roles
show spanning-tree vlan X  # confirms the redundant access uplink is blocking, not forwarding
show ip dhcp binding       # confirms end devices are leasing from the correct pool
ping <vlan40-server-ip>    # from a VLAN10 host, proving inter-VLAN routing works end to end

What I'd do differently in a real deployment
Single routed links between Core and each distribution switch mean there's no ECMP between those tiers — losing a Core-Dist link means traffic has to recover via the cross-linked access layer rather than an alternate direct path. This was a deliberate topology choice to demonstrate access-layer redundancy and STP convergence behavior, but a production design would likely dual-home Core to each distribution switch as well, trading some of this STP-blocking-port demonstration value for true ECMP/load-balanced uplinks.

Files
topology.png — exported Packet Tracer topology diagram
campus-network.pkt — full Packet Tracer project file
/configs — running-config exports for every device
IP and VLAN plan documented above for quick reference without opening the .pkt file
