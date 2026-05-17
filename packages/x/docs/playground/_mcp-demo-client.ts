import type { Tool } from '@modelcontextprotocol/client';

type DemoToolName = 'get_weather' | 'get_stock_price' | 'get_user_profile';

type DemoStructuredContent = Record<string, unknown>;

type DemoToolContent = {
  type: 'text';
  text: string;
};

export type DemoToolResult = {
  content: DemoToolContent[];
  structuredContent?: DemoStructuredContent;
  isError?: boolean;
};

export type DemoMcpTool = Tool & {
  name: DemoToolName;
  inputSchema: Record<string, unknown>;
};

export interface DemoMcpClientAdapter {
  connect(): Promise<void>;
  listTools(input?: { cursor?: string }): Promise<{ tools: DemoMcpTool[]; nextCursor?: string }>;
  callTool(input: {
    name: DemoToolName;
    arguments?: Record<string, unknown>;
  }): Promise<DemoToolResult>;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DEMO_TOOLS: DemoMcpTool[] = [
  {
    name: 'get_weather',
    title: 'Get Weather',
    description: 'Get current weather information for a city',
    inputSchema: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'City name' },
      },
      required: ['city'],
    },
  },
  {
    name: 'get_stock_price',
    title: 'Get Stock Price',
    description: 'Get the latest stock price for a symbol',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Stock symbol' },
      },
      required: ['symbol'],
    },
  },
  {
    name: 'get_user_profile',
    title: 'Get User Profile',
    description: 'Get profile details for a user id',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User id' },
      },
      required: ['userId'],
    },
  },
];

class DemoMcpClient implements DemoMcpClientAdapter {
  private connected = false;

  async connect(): Promise<void> {
    await sleep(120);
    this.connected = true;
  }

  async listTools(): Promise<{ tools: DemoMcpTool[]; nextCursor?: string }> {
    if (!this.connected) {
      await this.connect();
    }

    await sleep(160);

    return {
      tools: DEMO_TOOLS,
      nextCursor: undefined,
    };
  }

  async callTool(input: {
    name: DemoToolName;
    arguments?: Record<string, unknown>;
  }): Promise<DemoToolResult> {
    if (!this.connected) {
      await this.connect();
    }

    await sleep(900);

    switch (input.name) {
      case 'get_weather': {
        const city = (input.arguments?.city as string) || 'Hangzhou';
        return {
          content: [{ type: 'text', text: `Weather lookup complete for ${city}.` }],
          structuredContent: {
            city,
            condition: '多云',
            temperature: 26,
            humidity: '78%',
          },
        };
      }
      case 'get_stock_price': {
        const symbol = (input.arguments?.symbol as string) || 'ANTD';
        return {
          content: [{ type: 'text', text: `Stock lookup complete for ${symbol}.` }],
          structuredContent: {
            symbol,
            price: 128.5,
            change: '+2.31%',
            market: 'NASDAQ',
          },
        };
      }
      case 'get_user_profile': {
        const userId = (input.arguments?.userId as string) || 'u_001';
        return {
          content: [{ type: 'text', text: `Profile lookup complete for ${userId}.` }],
          structuredContent: {
            userId,
            name: 'Ant Design X User',
            email: 'demo@ant.design',
            tags: ['VIP', 'Beta'],
          },
        };
      }
      default:
        return {
          content: [{ type: 'text', text: 'Unknown tool.' }],
          isError: true,
        };
    }
  }
}

export const createDemoMcpClient = (): DemoMcpClientAdapter => new DemoMcpClient();
