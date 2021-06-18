![aes70exlorer logo](aes70explorer_4c.svg)
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

# License

The AES70 Explorer is available under the terms of the GNU General Public License version 2.
See the `COPYING` file for details.

Copyright (c) 2020-2021 DeusO GmbH
