#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { TodoistApi } from "@doist/todoist-api-typescript";

// Define task tools
const GET_PROJECTS_TOOL: Tool = {
  name: "todoist_get_projects",
  description: "Get all projects from Todoist",
  inputSchema: {
    type: "object",
    properties: {}
  }
};

const CREATE_PROJECT_TOOL: Tool = {
  name: "todoist_create_project",
  description: "Create a new project in Todoist",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the project"
      },
      parent_id: {
        type: "string",
        description: "Parent project ID for nested projects (optional)"
      },
      color: {
        type: "string",
        description: "Color of the project (optional)",
        enum: ["berry_red", "red", "orange", "yellow", "olive_green", "lime_green", "green", "mint_green", "teal", "sky_blue", "light_blue", "blue", "grape", "violet", "lavender", "magenta", "salmon", "charcoal", "grey", "taupe"]
      },
      favorite: {
        type: "boolean",
        description: "Whether the project is a favorite (optional)"
      }
    },
    required: ["name"]
  }
};

const UPDATE_PROJECT_TOOL: Tool = {
  name: "todoist_update_project",
  description: "Update an existing project in Todoist",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "ID of the project to update"
      },
      name: {
        type: "string",
        description: "New name for the project (optional)"
      },
      color: {
        type: "string",
        description: "New color for the project (optional)",
        enum: ["berry_red", "red", "orange", "yellow", "olive_green", "lime_green", "green", "mint_green", "teal", "sky_blue", "light_blue", "blue", "grape", "violet", "lavender", "magenta", "salmon", "charcoal", "grey", "taupe"]
      },
      favorite: {
        type: "boolean",
        description: "Whether the project should be a favorite (optional)"
      }
    },
    required: ["project_id"]
  }
};

const GET_PROJECT_SECTIONS_TOOL: Tool = {
  name: "todoist_get_project_sections",
  description: "Get all sections in a Todoist project",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "ID of the project"
      }
    },
    required: ["project_id"]
  }
};

const CREATE_SECTION_TOOL: Tool = {
  name: "todoist_create_section",
  description: "Create a new section in a Todoist project",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "ID of the project"
      },
      name: {
        type: "string",
        description: "Name of the section"
      },
      order: {
        type: "number",
        description: "Order of the section (optional)"
      }
    },
    required: ["project_id", "name"]
  }
};

const MOVE_TASK_TOOL: Tool = {
  name: "todoist_move_task",
  description: "Move a task to a different section and/or project",
  inputSchema: {
    type: "object",
    properties: {
      task_name: {
        type: "string",
        description: "Name/content of the task to move"
      },
      project_id: {
        type: "string",
        description: "ID of the project to move the task to (optional)"
      },
      section_id: {
        type: "string",
        description: "ID of the section to move the task to (optional)"
      }
    },
    required: ["task_name"]
  }
};

const CREATE_TASK_TOOL: Tool = {
  name: "todoist_create_task",
  description: "Create a new task in Todoist with optional description, due date, and priority",
  inputSchema: {
    type: "object",
    properties: {
      content: {
        type: "string",
        description: "The content/title of the task"
      },
      description: {
        type: "string",
        description: "Detailed description of the task (optional)"
      },
      due_string: {
        type: "string",
        description: "Natural language due date like 'tomorrow', 'next Monday', 'Jan 23' (optional)"
      },
      priority: {
        type: "number",
        description: "Task priority from 1 (normal) to 4 (urgent) (optional)",
        enum: [1, 2, 3, 4]
      },
      project_id: {
        type: "string",
        description: "ID of the project to add the task to (optional)"
      },
      section_id: {
        type: "string",
        description: "ID of the section to add the task to (optional)"
      },
      assignee_id: {
        type: "string",
        description: "ID of the assignee to add the task to (optional)"
      }
    },
    required: ["content"]
  }
};

const GET_TASKS_TOOL: Tool = {
  name: "todoist_get_tasks",
  description: "Get a list of tasks from Todoist with various filters",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "Filter tasks by project ID (optional)"
      },
      section_id: {
        type: "string",
        description: "Filter tasks by section ID (optional)"
      },
      filter: {
        type: "string",
        description: "Natural language filter like 'today', 'tomorrow', 'next week', 'priority 1', 'overdue' (optional)"
      },
      priority: {
        type: "number",
        description: "Filter by priority level (1-4) (optional)",
        enum: [1, 2, 3, 4]
      },
      limit: {
        type: "number",
        description: "Maximum number of tasks to return (optional)",
        default: 10
      }
    }
  }
};

const UPDATE_TASK_TOOL: Tool = {
  name: "todoist_update_task",
  description: "Update an existing task in Todoist by searching for it by name and then updating it",
  inputSchema: {
    type: "object",
    properties: {
      task_name: {
        type: "string",
        description: "Name/content of the task to search for and update"
      },
      content: {
        type: "string",
        description: "New content/title for the task (optional)"
      },
      description: {
        type: "string",
        description: "New description for the task (optional)"
      },
      due_string: {
        type: "string",
        description: "New due date in natural language like 'tomorrow', 'next Monday' (optional)"
      },
      priority: {
        type: "number",
        description: "New priority level from 1 (normal) to 4 (urgent) (optional)",
        enum: [1, 2, 3, 4]
      },
      project_id: {
        type: "string",
        description: "Move task to this project ID (optional)"
      },
      section_id: {
        type: "string",
        description: "Move task to this section ID (optional)"
      }
    },
    required: ["task_name"]
  }
};

const DELETE_TASK_TOOL: Tool = {
  name: "todoist_delete_task",
  description: "Delete a task from Todoist by searching for it by name",
  inputSchema: {
    type: "object",
    properties: {
      task_name: {
        type: "string",
        description: "Name/content of the task to search for and delete"
      }
    },
    required: ["task_name"]
  }
};

const COMPLETE_TASK_TOOL: Tool = {
  name: "todoist_complete_task",
  description: "Mark a task as complete by searching for it by name",
  inputSchema: {
    type: "object",
    properties: {
      task_name: {
        type: "string",
        description: "Name/content of the task to search for and complete"
      }
    },
    required: ["task_name"]
  }
};

// Personal Label Management Tools
const GET_PERSONAL_LABELS_TOOL: Tool = {
  name: "todoist_get_personal_labels",
  description: "Get all personal labels from Todoist",
  inputSchema: {
    type: "object",
    properties: {}
  }
};

const CREATE_PERSONAL_LABEL_TOOL: Tool = {
  name: "todoist_create_personal_label",
  description: "Create a new personal label in Todoist",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the label"
      },
      color: {
        type: "string",
        description: "Color of the label (optional)",
        enum: ["berry_red", "red", "orange", "yellow", "olive_green", "lime_green", "green", 
               "mint_green", "teal", "sky_blue", "light_blue", "blue", "grape", "violet", 
               "lavender", "magenta", "salmon", "charcoal", "grey", "taupe"]
      },
      order: {
        type: "number",
        description: "Order of the label (optional)"
      },
      is_favorite: {
        type: "boolean",
        description: "Whether the label is a favorite (optional)"
      }
    },
    required: ["name"]
  }
};

const GET_PERSONAL_LABEL_TOOL: Tool = {
  name: "todoist_get_personal_label",
  description: "Get a personal label by ID",
  inputSchema: {
    type: "object",
    properties: {
      label_id: {
        type: "string",
        description: "ID of the label to retrieve"
      }
    },
    required: ["label_id"]
  }
};

const UPDATE_PERSONAL_LABEL_TOOL: Tool = {
  name: "todoist_update_personal_label",
  description: "Update an existing personal label in Todoist",
  inputSchema: {
    type: "object",
    properties: {
      label_id: {
        type: "string",
        description: "ID of the label to update"
      },
      name: {
        type: "string",
        description: "New name for the label (optional)"
      },
      color: {
        type: "string",
        description: "New color for the label (optional)",
        enum: ["berry_red", "red", "orange", "yellow", "olive_green", "lime_green", "green", 
               "mint_green", "teal", "sky_blue", "light_blue", "blue", "grape", "violet", 
               "lavender", "magenta", "salmon", "charcoal", "grey", "taupe"]
      },
      order: {
        type: "number",
        description: "New order for the label (optional)"
      },
      is_favorite: {
        type: "boolean",
        description: "Whether the label is a favorite (optional)"
      }
    },
    required: ["label_id"]
  }
};

const DELETE_PERSONAL_LABEL_TOOL: Tool = {
  name: "todoist_delete_personal_label",
  description: "Delete a personal label from Todoist",
  inputSchema: {
    type: "object",
    properties: {
      label_id: {
        type: "string",
        description: "ID of the label to delete"
      }
    },
    required: ["label_id"]
  }
};

// Task Label Management Tool
const UPDATE_TASK_LABELS_TOOL: Tool = {
  name: "todoist_update_task_labels",
  description: "Update the labels of a task in Todoist",
  inputSchema: {
    type: "object",
    properties: {
      task_name: {
        type: "string",
        description: "Name/content of the task to update labels for"
      },
      labels: {
        type: "array",
        items: {
          type: "string"
        },
        description: "Array of label names to set for the task"
      }
    },
    required: ["task_name", "labels"]
  }
};

// Server implementation
const server = new Server(
  {
    name: "todoist-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Check for API token
const TODOIST_API_TOKEN = process.env.TODOIST_API_TOKEN!;
if (!TODOIST_API_TOKEN) {
  console.error("Error: TODOIST_API_TOKEN environment variable is required");
  process.exit(1);
}

// Initialize Todoist client
const todoistClient = new TodoistApi(TODOIST_API_TOKEN);

// Type guards for arguments (original typeguards)

function isCreateTaskArgs(args: unknown): args is {
  content: string;
  description?: string;
  due_string?: string;
  priority?: number;
  project_id?: string;
  section_id?: string;
  assigne_id?: string;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "content" in args &&
    typeof (args as { content: string }).content === "string"
  );
}

function isGetTasksArgs(args: unknown): args is {
  project_id?: string;
  section_id?: string;
  assignee_id?: string;
  filter?: string;
  priority?: number;
  limit?: number;
} {
  return (
    typeof args === "object" &&
    args !== null
  );
}

function isUpdateTaskArgs(args: unknown): args is {
  task_name: string;
  content?: string;
  description?: string;
  due_string?: string;
  assignee_id?: string;
  priority?: number;
  project_id?: string;
  section_id?: string;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "task_name" in args &&
    typeof (args as { task_name: string }).task_name === "string"
  );
}

function isDeleteTaskArgs(args: unknown): args is {
  task_name: string;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "task_name" in args &&
    typeof (args as { task_name: string }).task_name === "string"
  );
}

function isCompleteTaskArgs(args: unknown): args is {
  task_name: string;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "task_name" in args &&
    typeof (args as { task_name: string }).task_name === "string"
  );
}

function isGetProjectsArgs(args: unknown): args is {} {
  return typeof args === "object" && args !== null;
}

function isCreateProjectArgs(args: unknown): args is {
  name: string;
  parent_id?: string;
  color?: string;
  favorite?: boolean;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "name" in args &&
    typeof (args as { name: string }).name === "string"
  );
}

function isUpdateProjectArgs(args: unknown): args is {
  project_id: string;
  name?: string;
  color?: string;
  favorite?: boolean;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "project_id" in args &&
    typeof (args as { project_id: string }).project_id === "string"
  );
}

function isGetProjectSectionsArgs(args: unknown): args is {
  project_id: string;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "project_id" in args &&
    typeof (args as { project_id: string }).project_id === "string"
  );
}

function isCreateSectionArgs(args: unknown): args is {
  project_id: string;
  name: string;
  order?: number;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "project_id" in args &&
    "name" in args &&
    typeof (args as { project_id: string; name: string }).project_id === "string" &&
    typeof (args as { project_id: string; name: string }).name === "string"
  );
}

function isMoveTaskArgs(args: unknown): args is {
  task_name: string;
  project_id?: string;
  section_id?: string;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "task_name" in args &&
    typeof (args as { task_name: string }).task_name === "string"
  );
}

// Type guards for label management
function isGetPersonalLabelsArgs(args: unknown): args is {} {
  return typeof args === "object" && args !== null;
}

function isCreatePersonalLabelArgs(args: unknown): args is {
  name: string;
  color?: string;
  order?: number;
  is_favorite?: boolean;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "name" in args &&
    typeof (args as { name: string }).name === "string"
  );
}

function isGetPersonalLabelArgs(args: unknown): args is {
  label_id: string;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "label_id" in args &&
    typeof (args as { label_id: string }).label_id === "string"
  );
}

function isUpdatePersonalLabelArgs(args: unknown): args is {
  label_id: string;
  name?: string;
  color?: string;
  order?: number;
  is_favorite?: boolean;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "label_id" in args &&
    typeof (args as { label_id: string }).label_id === "string"
  );
}

function isDeletePersonalLabelArgs(args: unknown): args is {
  label_id: string;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "label_id" in args &&
    typeof (args as { label_id: string }).label_id === "string"
  );
}

function isUpdateTaskLabelsArgs(args: unknown): args is {
  task_name: string;
  labels: string[];
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "task_name" in args &&
    "labels" in args &&
    typeof (args as { task_name: string }).task_name === "string" &&
    Array.isArray((args as { labels: string[] }).labels)
  );
}


// Tool handlers (Added label handlers)
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    CREATE_TASK_TOOL,
    GET_TASKS_TOOL,
    UPDATE_TASK_TOOL,
    DELETE_TASK_TOOL,
    COMPLETE_TASK_TOOL,
    GET_PROJECTS_TOOL,
    CREATE_PROJECT_TOOL,
    UPDATE_PROJECT_TOOL,
    GET_PROJECT_SECTIONS_TOOL,
    CREATE_SECTION_TOOL,
    MOVE_TASK_TOOL,
    GET_PERSONAL_LABELS_TOOL,
    CREATE_PERSONAL_LABEL_TOOL,
    GET_PERSONAL_LABEL_TOOL,
    UPDATE_PERSONAL_LABEL_TOOL,
    DELETE_PERSONAL_LABEL_TOOL,
    UPDATE_TASK_LABELS_TOOL
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    // Original MCP handlers.
    if (!args) {
      throw new Error("No arguments provided");
    }

    if (name === "todoist_get_projects") {
      if (!isGetProjectsArgs(args)) {
        throw new Error("Invalid arguments for todoist_get_projects");
      }
      const projects = await todoistClient.getProjects();
      return {
        content: [{
          type: "text",
          text: JSON.stringify(projects, null, 2)
        }],
        isError: false,
      };
    }

    if (name === "todoist_create_project") {
      if (!isCreateProjectArgs(args)) {
        throw new Error("Invalid arguments for todoist_create_project");
      }
      const project = await todoistClient.addProject({
        name: args.name,
        parentId: args.parent_id,
        color: args.color,
        isFavorite: args.favorite
      });
      return {
        content: [{
          type: "text",
          text: `Project created:\n${JSON.stringify(project, null, 2)}`
        }],
        isError: false,
      };
    }

    if (name === "todoist_update_project") {
      if (!isUpdateProjectArgs(args)) {
        throw new Error("Invalid arguments for todoist_update_project");
      }
      const project = await todoistClient.updateProject(args.project_id, {
        name: args.name,
        color: args.color,
        isFavorite: args.favorite
      });
      return {
        content: [{
          type: "text",
          text: `Project updated:\n${JSON.stringify(project, null, 2)}`
        }],
        isError: false,
      };
    }

    if (name === "todoist_get_project_sections") {
      if (!isGetProjectSectionsArgs(args)) {
        throw new Error("Invalid arguments for todoist_get_project_sections");
      }
      const sections = await todoistClient.getSections(args.project_id);
      return {
        content: [{
          type: "text",
          text: JSON.stringify(sections, null, 2)
        }],
        isError: false,
      };
    }

    if (name === "todoist_create_section") {
      if (!isCreateSectionArgs(args)) {
        throw new Error("Invalid arguments for todoist_create_section");
      }
      const section = await todoistClient.addSection({
        projectId: args.project_id,
        name: args.name,
        order: args.order
      });
      return {
        content: [{
          type: "text",
          text: `Section created:\n${JSON.stringify(section, null, 2)}`
        }],
        isError: false,
      };
    }

    if (name === "todoist_move_task") {
      if (!isMoveTaskArgs(args)) {
        throw new Error("Invalid arguments for todoist_move_task");
      }

      // First, search for the task
      const tasks = await todoistClient.getTasks();
      const matchingTask = tasks.find(task =>
        task.content.toLowerCase().includes(args.task_name.toLowerCase())
      );

      if (!matchingTask) {
        return {
          content: [{
            type: "text",
            text: `Could not find a task matching "${args.task_name}"`
          }],
          isError: true,
        };
      }

      // Build update data
      const updateData: any = {};
      if (args.project_id) updateData.projectId = args.project_id;
      if (args.section_id) updateData.sectionId = args.section_id;

      const updatedTask = await todoistClient.updateTask(matchingTask.id, updateData);

      return {
        content: [{
          type: "text",
          text: `Task "${matchingTask.content}" moved successfully:\n${JSON.stringify(updatedTask, null, 2)}`
        }],
        isError: false,
      };
    }

    if (name === "todoist_create_task") {
      if (!isCreateTaskArgs(args)) {
        throw new Error("Invalid arguments for todoist_create_task");
      }
      const task = await todoistClient.addTask({
        content: args.content,
        description: args.description,
        dueString: args.due_string,
        priority: args.priority,
        projectId: args.project_id,
        sectionId: args.section_id,
        assigneeId: args.assignee_id,
      });
      return {
        content: [{
          type: "text",
          text: `Task created:\nTitle: ${task.content}${task.description ? `\nDescription: ${task.description}` : ''}${task.due ? `\nDue: ${task.due.string}` : ''}${task.priority ? `\nPriority: ${task.priority}` : ''}${task.projectId ? `\nProject ID: ${task.projectId}` : ''}${task.sectionId ? `\nSection ID: ${task.sectionId}` : ''}${task.assigneeId ? `\nAssignee ID: ${task.assigneeId}` : ''}`
        }],
        isError: false,
      };
    }

    if (name === "todoist_get_tasks") {
      if (!isGetTasksArgs(args)) {
        throw new Error("Invalid arguments for todoist_get_tasks");
      }
    
      try {
        // First get all tasks without filters
        const allTasks = await todoistClient.getTasks();
        
        // Then apply filters in memory
        let filteredTasks = allTasks;
    
        // Apply project filter
        if (args.project_id) {
          filteredTasks = filteredTasks.filter(task => task.projectId === args.project_id);
        }
    
        // Apply section filter
        if (args.section_id) {
          filteredTasks = filteredTasks.filter(task => task.sectionId === args.section_id);
        }
    
        // Apply priority filter
        if (args.priority) {
          filteredTasks = filteredTasks.filter(task => task.priority === args.priority);
        }

        // Apply assignee filter
        if (args.assignee) {
          filteredTasks = filteredTasks.filter(task => task.assignee === args.assignee);
        }
    
        // Apply custom filter if provided
        if (args.filter) {
          // Basic text search in content and description
          filteredTasks = filteredTasks.filter(task => {
            const searchText = args.filter?.toLowerCase() || '';
            return (
              task.content.toLowerCase().includes(searchText) ||
              (task.description && task.description.toLowerCase().includes(searchText))
            );
          });
        }
    
        // Apply limit
        if (args.limit && args.limit > 0) {
          filteredTasks = filteredTasks.slice(0, args.limit);
        }
    
        // Format the response
        const taskList = filteredTasks.map(task => {
          let taskInfo = `- ${task.content}`;
          
          if (task.description) {
            taskInfo += `\n  Description: ${task.description}`;
          }
          if (task.due) {
            taskInfo += `\n  Due: ${task.due.string || task.due.date}`;
          }
          if (task.priority) {
            taskInfo += `\n  Priority: ${task.priority}`;
          }
          if (task.labels && task.labels.length > 0) {
            taskInfo += `\n  Labels: ${task.labels.join(', ')}`;
          }
          if (task.projectId) {
            taskInfo += `\n  Project ID: ${task.projectId}`;
          }
          if (task.sectionId) {
            taskInfo += `\n  Section ID: ${task.sectionId}`;
          }
          if (task.assigneeId) {
            taskInfo += `\n  Assignee ID: ${task.assigneeId}`;
          }
          
          return taskInfo;
        }).join('\n\n');
    
        return {
          content: [{
            type: "text",
            text: filteredTasks.length > 0 ? taskList : "No tasks found matching the criteria"
          }],
          isError: false,
        };
    
      } catch (error) {
        console.error('Error in todoist_get_tasks:', error);
        return {
          content: [{
            type: "text",
            text: `Error retrieving tasks: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true,
        };
      }
    }

    if (name === "todoist_update_task") {
      if (!isUpdateTaskArgs(args)) {
        throw new Error("Invalid arguments for todoist_update_task");
      }

      // First, search for the task
      const tasks = await todoistClient.getTasks();
      const matchingTask = tasks.find(task =>
        task.content.toLowerCase().includes(args.task_name.toLowerCase())
      );

      if (!matchingTask) {
        return {
          content: [{
            type: "text",
            text: `Could not find a task matching "${args.task_name}"`
          }],
          isError: true,
        };
      }

      // Build update data
      const updateData: any = {};
      if (args.content) updateData.content = args.content;
      if (args.description) updateData.description = args.description;
      if (args.due_string) updateData.dueString = args.due_string;
      if (args.priority) updateData.priority = args.priority;
      if (args.project_id) updateData.projectId = args.project_id;
      if (args.section_id) updateData.sectionId = args.section_id;
      if (args.assignee_id) pdateData.assigneeId = args.assignee_id;

      const updatedTask = await todoistClient.updateTask(matchingTask.id, updateData);

      return {
        content: [{
          type: "text",
          text: `Task "${matchingTask.content}" updated:\n${JSON.stringify(updatedTask, null, 2)}`
        }],
        isError: false,
      };
    }

    if (name === "todoist_delete_task") {
      if (!isDeleteTaskArgs(args)) {
        throw new Error("Invalid arguments for todoist_delete_task");
      }

      // First, search for the task
      const tasks = await todoistClient.getTasks();
      const matchingTask = tasks.find(task =>
        task.content.toLowerCase().includes(args.task_name.toLowerCase())
      );

      if (!matchingTask) {
        return {
          content: [{
            type: "text",
            text: `Could not find a task matching "${args.task_name}"`
          }],
          isError: true,
        };
      }

      // Delete the task
      await todoistClient.deleteTask(matchingTask.id);

      return {
        content: [{
          type: "text",
          text: `Successfully deleted task: "${matchingTask.content}"`
        }],
        isError: false,
      };
    }

    if (name === "todoist_complete_task") {
      if (!isCompleteTaskArgs(args)) {
        throw new Error("Invalid arguments for todoist_complete_task");
      }

      // First, search for the task
      const tasks = await todoistClient.getTasks();
      const matchingTask = tasks.find(task =>
        task.content.toLowerCase().includes(args.task_name.toLowerCase())
      );

      if (!matchingTask) {
        return {
          content: [{
            type: "text",
            text: `Could not find a task matching "${args.task_name}"`
          }],
          isError: true,
        };
      }

      // Complete the task
      await todoistClient.closeTask(matchingTask.id);

      return {
        content: [{
          type: "text",
          text: `Successfully completed task: "${matchingTask.content}"`
        }],
        isError: false,
      };
    }

    // Handlers for label management

    if (name === "todoist_get_personal_labels") {
      if (!isGetPersonalLabelsArgs(args)) {
        throw new Error("Invalid arguments for todoist_get_personal_labels");
      }
      const labels = await todoistClient.getLabels();
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify(labels, null, 2)
        }],
        isError: false,
      };
    }

    if (name === "todoist_create_personal_label") {
      if (!isCreatePersonalLabelArgs(args)) {
        throw new Error("Invalid arguments for todoist_create_personal_label");
      }
      const label = await todoistClient.addLabel({
        name: args.name,
        color: args.color,
        order: args.order,
        isFavorite: args.is_favorite
      });
      return {
        content: [{ 
          type: "text", 
          text: `Label created:\n${JSON.stringify(label, null, 2)}`
        }],
        isError: false,
      };
    }

    if (name === "todoist_get_personal_label") {
      if (!isGetPersonalLabelArgs(args)) {
        throw new Error("Invalid arguments for todoist_get_personal_label");
      }
      const label = await todoistClient.getLabel(args.label_id);
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify(label, null, 2)
        }],
        isError: false,
      };
    }

    if (name === "todoist_update_personal_label") {
      if (!isUpdatePersonalLabelArgs(args)) {
        throw new Error("Invalid arguments for todoist_update_personal_label");
      }
      const label = await todoistClient.updateLabel(args.label_id, {
        name: args.name,
        color: args.color,
        order: args.order,
        isFavorite: args.is_favorite
      });
      return {
        content: [{ 
          type: "text", 
          text: `Label updated:\n${JSON.stringify(label, null, 2)}`
        }],
        isError: false,
      };
    }

    if (name === "todoist_delete_personal_label") {
      if (!isDeletePersonalLabelArgs(args)) {
        throw new Error("Invalid arguments for todoist_delete_personal_label");
      }
      await todoistClient.deleteLabel(args.label_id);
      return {
        content: [{ 
          type: "text", 
          text: `Successfully deleted label with ID: ${args.label_id}`
        }],
        isError: false,
      };
    }

    if (name === "todoist_update_task_labels") {
      if (!isUpdateTaskLabelsArgs(args)) {
        throw new Error("Invalid arguments for todoist_update_task_labels");
      }
    
      // First, search for the task
      const tasks = await todoistClient.getTasks();
      const matchingTask = tasks.find(task => 
        task.content.toLowerCase().includes(args.task_name.toLowerCase())
      );
    
      if (!matchingTask) {
        return {
          content: [{ 
            type: "text", 
            text: `Could not find a task matching "${args.task_name}"` 
          }],
          isError: true,
        };
      }
    
      // Update the task's labels
      const updatedTask = await todoistClient.updateTask(matchingTask.id, {
        labels: args.labels
      });

      return {
        content: [{ 
          type: "text", 
          text: `Labels updated for task "${matchingTask.content}":\n${JSON.stringify(updatedTask, null, 2)}` 
        }],
        isError: false,
      };
    }


    return {
      content: [{ type: "text", text: `Unknown tool: ${name}` }],
      isError: true,
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Todoist MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
