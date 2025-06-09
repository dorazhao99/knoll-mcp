import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from 'axios';
const API_BASE = "https://api.knollapp.com/api";
const USER_ID = "PxOQleGigGPQ92RHVzt4ydrYdDl1";
async function makeKnowledgeRequest() {
    const modulesUrl = `${API_BASE}/userModule_v2`;
    const modulesHeader = {
        user: USER_ID
    };
    const knowledgeUrl = `${API_BASE}/get_knowledge`;
    console.error(modulesUrl, modulesHeader);
    let knowledgeHeaders = {
        user: USER_ID,
        modules: {},
        checked: {}
    };
    let moduleInfo = await axios.get(modulesUrl, { params: modulesHeader });
    if (moduleInfo.data) {
        knowledgeHeaders.modules = moduleInfo.data.modules;
        knowledgeHeaders.checked = moduleInfo.data.checked;
    }
    let knowledgeInfo = await axios.post(knowledgeUrl, knowledgeHeaders);
    if (knowledgeInfo.data) {
        const updatedKnowledge = JSON.stringify(knowledgeInfo.data);
        return { success: true, response: updatedKnowledge };
    }
    else {
        return { success: false };
    }
}
// Create server instance
const server = new McpServer({
    name: "knoll",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});
// Register knoll tools
server.tool("add-knowledge-modules", "Insert activated knowledge modules", {}, async () => {
    console.error("Using tool");
    const knowledgeData = await makeKnowledgeRequest();
    console.error(knowledgeData);
    if (!knowledgeData?.success) {
        return {
            content: [
                {
                    type: "text",
                    text: "Failed to retrieve knowledge data",
                },
            ],
        };
    }
    var knowledgeText = "";
    if (knowledgeData.response) {
        const knowledgeModules = JSON.parse(knowledgeData.response);
        Object.keys(knowledgeModules).forEach((v) => {
            const mod = knowledgeModules[v];
            knowledgeText += mod.knowledge;
        });
    }
    return {
        content: [
            {
                type: "text",
                text: knowledgeText,
            },
        ],
    };
});
// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Knoll MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
