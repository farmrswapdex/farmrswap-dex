# Project Overview

This project is a decentralized exchange (DEX) named "farmrswap". It is a web-based application built with React, TypeScript, and Vite. The DEX provides features like swapping tokens, adding/removing liquidity, and farming. It integrates with Ethereum-based blockchains using `wagmi` and `@rainbow-me/rainbowkit` for wallet connectivity and interaction with smart contracts. The smart contracts seem to be based on the Uniswap V2 protocol.

## Key Technologies

*   **Frontend:** React, TypeScript, Vite, Tailwind CSS
*   **Web3:** ethers.js, wagmi, viem, @rainbow-me/rainbowkit
*   **State Management:** Zustand
*   **Routing:** React Router
*   **UI Components:** Radix UI, Lucide React

# Building and Running

## Prerequisites

*   Node.js and yarn installed.

## Installation

```bash
yarn install
```

## Development

To run the development server:

```bash
yarn dev
```

## Build

To build the project for production:

```bash
yarn build
```

## Lint

To lint the codebase:

```bash
yarn lint
```

# Development Conventions

*   The project follows a component-based architecture with a clear separation of concerns.
*   State management is handled by Zustand.
*   Web3 interactions are managed through `wagmi` hooks.
*   Smart contract addresses and ABIs are stored in `src/lib/config.ts`.
*   Token information is stored in `src/lib/constants.ts`.
*   The UI is built with Tailwind CSS and Radix UI components.
*   The project uses `eslint` for code linting.
