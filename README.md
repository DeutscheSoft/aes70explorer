![aes70exlorer logo](images/AES70 Explorer Logo 4C.svg)
# Repository setup

Some dependencies are pulled into this repository as git submodules. To
initialize them, run

      git submodule update --init

# NodeJS Server

The AES70 Explorer can be run without a UI as a pure http server.

## Installation

      cd src/nodejs/
      npm ci

## Running

In the `src/nodejs` directory run

      node server.js [tcp:<IP>:<PORT>]

It is possible to disable mdns discovery and the ability for clients to add
manual devices using the web interface with command line options.

# License

The AES70 Explorer is available under the terms of the GNU General Public License version 2.
See the `COPYING` file for details.

Copyright (c) 2020-2021 DeusO GmbH
