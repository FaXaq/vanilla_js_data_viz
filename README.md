## Purpose

The purpose of this code snippet is to experiment with `D3.js` and `animejs` libraries outside of reactive frameworks.
The goal was also to create a webpack and babel config from scratch.

## Data

Dummy data used for visualization is inside `data.json`.

## Prerequisites

`npm` & `node`. A `index.html` file has to be created under a `public` directory at the root of the project. It should contain at least three html elements : 
- A `div` with its `id` attribute set to `graph`
- A `div` with its `id` attribute set to `pie`
- A `p` with its `id` attribute set to `fees`

## Installation 

`npm i`

## Run

`npm run dev`

## Dev server

`http://192.168.1.83:9000` or whatever url is yield by webpack-dev-server upon run of `package.json` dev script.

## Build

`npm run build`