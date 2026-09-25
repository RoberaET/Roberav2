============================================================================
MULTI-FLOOR DAISY-CHAIN VLAN NETWORK — ROUTER-ON-A-STICK

Cisco Packet Tracer Lab
============================================================================

OVERVIEW
This lab simulates a 4-story office building (Ground Floor + Floors 2-4) where each floor has its own access-layer switch and its own VLAN. All inter-VLAN routing is handled centrally by a single router using the router-on-a-stick (ROAS) method. Switches are daisy-chained floor-to-floor rather than each connecting directly to the router — only the Ground Floor switch has a direct uplink to the router.

Topology:

MAIN-ROUTER
     |
   0F-SW  (Ground Floor)
     |
   1F-SW  (Floor 1)            [implied — same cascade pattern as 0F-SW]
     |
   2F-SW  (Floor 2)            [implied — same cascade pattern as 0F-SW]
     |
   3F-SW  (Floor 3)            [implied — same cascade pattern as 0F-SW]
     |
   4F-SW  (Floor 4 — END OF CHAIN)
Each switch connects to the next via a redundant pair of trunk uplinks (Gig0/1 and Gig0/2), and hosts its floor's PCs on FastEthernet access ports.

VLAN PLAN
VLAN Purpose Subnet Assigned Floor
10 Ground Floor users 192.168.10.0/24 0F-SW
20 Floor 1 users 192.168.20.0/24 1F-SW
30 Floor 2 users 192.168.30.0/24 2F-SW
40 Floor 3/4 users 192.168.40.0/24 4F-SW (and 3F)
99 Management (MGMT) 192.168.99.0/24 All switches (SVI)

VLAN 99 is dedicated to switch management only — no end-user devices are placed on it. Each switch has a Vlan99 SVI for remote administration.

ROUTER CONFIGURATION (MAIN-ROUTER)
Router-on-a-stick: a single physical trunk (GigabitEthernet0/0/0) carries all VLANs to the router, which uses dot1Q subinterfaces to provide a gateway for each VLAN and route between them.

interface GigabitEthernet0/0/0.10
 encapsulation dot1Q 10
 ip address 192.168.10.1 255.255.255.0

interface GigabitEthernet0/0/0.20
 encapsulation dot1Q 20
 ip address 192.168.20.1 255.255.255.0

interface GigabitEthernet0/0/0.30
 encapsulation dot1Q 30
 ip address 192.168.30.1 255.255.255.0

interface GigabitEthernet0/0/0.40
 encapsulation dot1Q 40
 ip address 192.168.40.1 255.255.255.0

interface GigabitEthernet0/0/0.99
 encapsulation dot1Q 99
 ip address 192.168.99.1 255.255.255.0

DHCP is also handled centrally on the router — one pool per VLAN:

ip dhcp pool VLAN10 -> network 192.168.10.0/24, gateway .1, dns 1.1.1.1
ip dhcp pool VLAN20 -> network 192.168.20.0/24, gateway .1, dns 1.1.1.1
ip dhcp pool VLAN30 -> network 192.168.30.0/24, gateway .1, dns 1.1.1.1
ip dhcp pool VLAN40 -> network 192.168.40.0/24, gateway .1, dns 1.1.1.1

Gateway addresses are excluded from DHCP leasing via:

ip dhcp excluded-address 192.168.10.1
ip dhcp excluded-address 192.168.20.1
ip dhcp excluded-address 192.168.30.1
ip dhcp excluded-address 192.168.40.1
ip dhcp excluded-address 192.168.30.1 192.168.30.3

NOTE — known issue to fix: there is no DHCP pool or excluded-address entry for VLAN 99. This is intentional and acceptable since VLAN 99 is management-only and uses static IPs on switch SVIs, not DHCP-issued addresses.

SWITCH CONFIGURATION PATTERN
Every switch in the chain follows the same template:

a) Access ports (FastEthernet 0/1–0/24)
   Assigned to that floor's single VLAN only, e.g.:

   interface FastEthernet0/1
    switchport access vlan 10
    switchport mode access

b) Uplink ports (GigabitEthernet0/1 and 0/2)
   Configured as 802.1Q trunks, each carrying only the VLANs that floor and every floor "downstream" of it actually need — see Section 5.

c) Management SVI (VLAN 99)
   Each switch has a Vlan99 interface with a static IP for remote administration:

   interface Vlan99
    ip address 192.168.99.X 255.255.255.0

 X increases per switch (0F-SW = .2, 4F-SW = .5, etc. — assign sequentially per floor).

d) Remote access security
   VLAN 99 is the designated management VLAN. Remote administration is locked down with:

   username admin secret 1234
   line vty 0 4
    login local
    transport input ssh
   line vty 5 15
    login

   Username: admin
   Password: 1234   (configured as a secret/hashed credential)

 SSH is enforced on the primary VTY lines (0-4) so management traffic is encrypted. (Note: 4F-SW currently uses "login" with no local username binding on its VTY lines — for consistency, every switch's VTY config should match 0F-SW exactly: "login local" + SSH only.)

VLAN PROPAGATION ACROSS THE DAISY CHAIN (CRITICAL CONCEPT)
This is the core design principle of a daisy-chain VLAN topology: each trunk link only needs to carry the VLANs required by everything connected BEYOND that point in the chain — not every VLAN that exists in the building.

MAIN-ROUTER <--- trunk carries VLAN 10,20,30,40,99 ---> 0F-SW
0F-SW <--- trunk carries VLAN 10,20,30,40,99 ---> 1F-SW
1F-SW <--- trunk carries VLAN 20,30,40,99 ---> 2F-SW
2F-SW <--- trunk carries VLAN 30,40,99 ---> 3F-SW
3F-SW <--- trunk carries VLAN 40,99 ---> 4F-SW (end)

Why this matters:
0F-SW's uplink allows VLAN 10,20,30,40,99 because Ground Floor itself uses VLAN 10, AND every floor above it (1-4) still needs VLAN 20/30/40 traffic to pass through 0F-SW on its way to/from the router.

4F-SW's uplink only allows VLAN 40,99 because it is the LAST switch in the chain. There is nothing beyond it, so it has no reason to carry VLAN 10/20/30 — those floors' traffic never needs to reach 4F-SW, and allowing them would be unnecessary and a minor security/broadcast-domain hygiene risk.

VLAN 99 (management) is the only VLAN allowed on EVERY trunk in the chain without exception, since every switch needs reachability back to the management subnet regardless of its position in the chain.

Rule of thumb for this design: as you move farther from the router, the list of allowed VLANs on each uplink should shrink — it should only ever contain that switch's own VLAN(s), any floor VLANs still downstream of it, and VLAN 99. A switch should never be configured to trunk a VLAN that neither it nor anything behind it actually uses.

VERIFICATION COMMANDS
On the router: show ip interface brief, show ip dhcp binding, show ip route
On any switch: show vlan brief, show interfaces trunk, show ip interface brief, show cdp neighbors

To confirm a host has correct connectivity: ipconfig /all (on PC, verify IP/gateway/DNS match the VLAN plan), ping <gateway>, ping <a host on a different VLAN/floor>

KNOWN GAPS / FUTURE IMPROVEMENTS
- VLAN 99 has no DHCP pool — by design, since it's management-only and statically addressed. No action needed unless management hosts (e.g. a jump box) are added to VLAN 99 later.
- 4F-SW's VTY configuration does not yet match 0F-SW's "login local + SSH-only" standard — should be aligned for consistent security policy across all switches.
- No STP root-bridge priority tuning has been applied yet; all switches are running default PVST+ priorities. For a production-style build, explicitly set MAIN-ROUTER-side switch (0F-SW) as STP root.
- No port security / DHCP snooping configured on access ports — worth adding as a hardening exercise.
============================================================================
