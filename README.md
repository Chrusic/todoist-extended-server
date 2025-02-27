# Todoist MCP Server Extended

[![smithery badge](https://smithery.ai/badge/@Chrusic/todoist-mcp-server-extended)](https://smithery.ai/server/@Chrusic/todoist-mcp-server-extended)

An MCP (Model Context Protocol) server implementation that integrates Claude - or any MCP compatible LLM if you're crafty - with Todoist, enabling natural language task management via MCP tools. The tools in this server allows Claude to interact with your Todoist tasks, projects, sections, and labels using everyday language, while also optimized for LLM workflow efficiency.

<a href="https://glama.ai/mcp/servers/xzuab11d38"><img width="380" height="200" src="https://glama.ai/mcp/servers/xzuab11d38/badge" alt="Todoist Server MCP server" /></a>

## Features Overview

* **Task Management**: Create, update, complete, and delete tasks using everyday language
* **Label Management**: Create, update, and manage personal labels and task labels
* **Project Management**: Create, update, and manage Todoist projects
* **Section Organization**: Create and manage sections within projects
* **Smart Search**: Find tasks and labels using partial name matches
* **Flexible Filtering**: Filter tasks by project, section, due date, priority, and labels
* **Rich Task Details**: Support for descriptions, due dates, priority levels, and project/section assignment
* **Batch Operations**: Tools have built in batch operation support and custom parameters for efficient usage with LLM workflows

For a complete list of available tools as well as their usage, see [tools.md](doc/tools.md).

## Quick Installation Guide

**Assuming you already have npm installed.** 

A more comprehensive installation guide can be found in the [How-to Guide.](doc/Howto%20-%20Setting%20up%20Claude%20Todoist%20MCP%20on%20Windows.md)

### Installing via Smithery

To install Todoist MCP Server Extended for Claude Desktop via [Smithery](https://smithery.ai/server/@Chrusic/todoist-mcp-server-extended):

1. Run following command in cmd\pwsh:

```bash
    npx -y @smithery/cli install @Chrusic/todoist-mcp-server-extended --client claude
```

*Also compatible with cline or windsurf, by changing last parameter to  `--client cline` or `--client windsurf`*

### Installing via npm

1. Run following command in cmd\pwsh:

``` bash
    npm install -g @chrusic/todoist-mcp-server-extended
``` 

## Setup

### Grab a Todoist API Token

1. Log in to your [Todoist account](https://www.todoist.com/) 
2. Navigate to `Settings → Integrations`
3. Find your API token under `Developer`
4. Press `Copy API Token`

For more information about the Todoist API, visit the [official Todoist API documentation](https://developer.todoist.com/guides/#developing-with-todoist).

### Add MCP Server and API Token Claude Desktop Client

1. In your  `claude_desktop_config.json` file, paste the following json snippet between: `"mcpServers":{ }: `

``` json
    "todoist": {
      "command": "npx",
      "args": ["-y", "@chrusic/todoist-mcp-server-extended"],
      "env": {
          "TODOIST_API_TOKEN": "PASTE-YOUR-API-TOKEN-HERE"
      }
    }
```

2. When all put together, it should look something like this: 

``` json
    {
      "mcpServers": {
          "todoist": {
          "command": "npx",
          "args": ["-y", "@chrusic/todoist-mcp-server-extended"],
          "env": {
              "TODOIST_API_TOKEN": "PASTE-YOUR-API-TOKEN-HERE"
          }
        }
      }
    }
```

3. Claude Desktop client will then start the MCP server and load the tools on the next client (re)start.

## Example Usage

Some simple suggestions on what to ask Claude. Note that sometimes you have to be *very* direct to get claude to use the tools: 

- "Using the MCP tool: todoist_get_tasks, list all my tasks for the day."
- "Create task 'Review PR' in project 'Work' section 'To Do'"
- "Add label 'Important' to task 'Review PR'"
- "Show all tasks with label 'Important' in project 'Work'"
- "Move task 'Documentation' to section 'In Progress'"
- "Mark the documentation task as complete"
- "Give me some suggestions for listed tasks I can do today as I'm going shopping in town."
- "Break task X down in to smaller subtasks and add due dates, x, y, z."

## Contributing

Contributions are welcome! Feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Issues and Support

If you encounter any issues or need support, please file an issue on the [GitHub repository](https://github.com/Chrusic/todoist-mcp-server-extended/issues).
