## Sector7

A webserver tracking individual workstation "breaches", modeled after Google's Cheese. This is intended as gamified training, encouraging users to lock their workstations. Users are instructed to prank their peers and colleagues when they leave their workstations unlocked by visiting the Sector7 web page, which will display the phrase "Security Breach!!" in blinking, all-caps, red letters. Metrics are kept on the number of times a workstation has visited the page, opening up the possibility for a network-wide competition and a friendly wall-of-shame.

### Usage & Requirements

See the accompanying `docker-compose.yml` for an idea how to deploy. A Redis instance is needed for persistence. A DNS server on your local network, serving out meaningful hostnames for local addresses is beneficial.

For actual usage, instruct users to point the victim's browser to the IP or hostname of the instance running sector7, instead of the usual Facebook shenanigans. A status page of most breaches per host/user is available from `/status` at the same host.

### License

BSD 2-Clause. See the LICENSE file for details.
