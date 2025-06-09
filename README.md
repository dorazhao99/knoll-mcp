# Knoll MCP Server

This is a basic instantiation of an MCP server connected to knowledge modules on Knoll. 

First, make sure you have ```node``` and ```npm``` installed.

```
node --version
npm --version
```

Next, clone into the repository and install the packages you need.
```bash
> git clone git@github.com:dorazhao99/knoll-mcp.git
> cd knoll-mcp
> npm install package.json
```

Create a ```.env``` file with your environment variables. You will need a variable ```UID``` that has your Knoll User ID.

Finally, build and launch your MCP server: 

```bash
> npm run build
> node /ABSOLUTE/PATH/TO/PARENT/FOLDER/knoll-mcp/build/index.js
```

The MCP should then be enabled in the Claude Desktop app.
