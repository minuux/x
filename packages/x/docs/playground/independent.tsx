import {
  AppstoreAddOutlined,
  CloudUploadOutlined,
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  FileSearchOutlined,
  GlobalOutlined,
  HeartOutlined,
  PaperClipOutlined,
  ProductOutlined,
  QuestionCircleOutlined,
  ScheduleOutlined,
  ShareAltOutlined,
  SmileOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import type { ActionsFeedbackProps, BubbleListProps, ThoughtChainItemProps } from '@ant-design/x';
import {
  Actions,
  Attachments,
  Bubble,
  Conversations,
  Prompts,
  Sender,
  Think,
  ThoughtChain,
  Welcome,
  XProvider,
} from '@ant-design/x';
import type { ComponentProps } from '@ant-design/x-markdown';
import XMarkdown from '@ant-design/x-markdown';
import { useXConversations } from '@ant-design/x-sdk';
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Flex,
  type GetProp,
  message,
  Pagination,
  Space,
  Tag,
} from 'antd';
import { createStyles } from 'antd-style';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';
import { BubbleListRef } from '@ant-design/x/es/bubble';
import { useMarkdownTheme } from '../x-markdown/demo/_utils';
import locale from './_utils/local';

// ==================== Style ====================
const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
      width: 100%;
      height: 100vh;
      display: flex;
      background: ${token.colorBgContainer};
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;
    `,
    // side 样式
    side: css`
      background: ${token.colorBgLayout}80;
      width: 280px;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 0 12px;
      box-sizing: border-box;
    `,
    logo: css`
      display: flex;
      align-items: center;
      justify-content: start;
      padding: 0 24px;
      box-sizing: border-box;
      gap: 8px;
      margin: 24px 0;

      span {
        font-weight: bold;
        color: ${token.colorText};
        font-size: 16px;
      }
    `,
    conversations: css`
      overflow-y: auto;
      margin-top: 12px;
      padding: 0;
      flex: 1;
      .ant-conversations-list {
        padding-inline-start: 0;
      }
    `,
    sideFooter: css`
      border-top: 1px solid ${token.colorBorderSecondary};
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    `,
    // chat list 样式
    chat: css`
      height: 100%;
      width: calc(100% - 280px);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .ant-bubble-content-updating {
        background-image: linear-gradient(90deg, #ff6b23 0%, #af3cb8 31%, #53b6ff 89%);
        background-size: 100% 2px;
        background-repeat: no-repeat;
        background-position: bottom;
      }
    `,
    chatPrompt: css`
      .ant-prompts-label {
        color: #000000e0 !important;
      }
      .ant-prompts-desc {
        color: #000000a6 !important;
        width: 100%;
      }
      .ant-prompts-icon {
        color: #000000a6 !important;
      }
    `,
    chatList: css`
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    `,
    placeholder: css`
      width: 100%;
      padding: ${token.paddingLG}px;
      box-sizing: border-box;
    `,
    sender: css`
      width: 100%;
      max-width: 840px;
    `,
    senderPrompt: css`
      width: 100%;
      max-width: 840px;
      margin: 0 auto;
      color: ${token.colorText};
    `,
    toolPanel: css`
      width: 100%;
      max-width: 840px;
    `,
    toolHint: css`
      color: ${token.colorTextSecondary};
      font-size: 12px;
    `,
  };
});

// ==================== Static Config ====================
const DEFAULT_CONVERSATIONS_ITEMS = [
  {
    key: 'default-0',
    label: locale.whatIsAntDesignX,
    group: locale.today,
  },
  {
    key: 'default-1',
    label: locale.howToQuicklyInstallAndImportComponents,
    group: locale.today,
  },
  {
    key: 'default-2',
    label: locale.newAgiHybridInterface,
    group: locale.yesterday,
  },
];

const HOT_TOPICS = {
  key: '1',
  label: locale.hotTopics,
  children: [
    {
      key: '1-1',
      description: locale.whatComponentsAreInAntDesignX,
      icon: <span style={{ color: '#f93a4a', fontWeight: 700 }}>1</span>,
    },
    {
      key: '1-2',
      description: locale.newAgiHybridInterface,
      icon: <span style={{ color: '#ff6565', fontWeight: 700 }}>2</span>,
    },
    {
      key: '1-3',
      description: locale.whatComponentsAreInAntDesignX,
      icon: <span style={{ color: '#ff8f1f', fontWeight: 700 }}>3</span>,
    },
    {
      key: '1-4',
      description: locale.comeAndDiscoverNewDesignParadigm,
      icon: <span style={{ color: '#00000040', fontWeight: 700 }}>4</span>,
    },
    {
      key: '1-5',
      description: locale.howToQuicklyInstallAndImportComponents,
      icon: <span style={{ color: '#00000040', fontWeight: 700 }}>5</span>,
    },
  ],
};

const DESIGN_GUIDE = {
  key: '2',
  label: locale.designGuide,
  children: [
    {
      key: '2-1',
      icon: <HeartOutlined />,
      label: locale.intention,
      description: locale.aiUnderstandsUserNeedsAndProvidesSolutions,
    },
    {
      key: '2-2',
      icon: <SmileOutlined />,
      label: locale.role,
      description: locale.aiPublicPersonAndImage,
    },
    {
      key: '2-3',
      icon: <CommentOutlined />,
      label: locale.chat,
      description: locale.howAICanExpressItselfWayUsersUnderstand,
    },
    {
      key: '2-4',
      icon: <PaperClipOutlined />,
      label: locale.interface,
      description: locale.aiBalances,
    },
  ],
};

const SENDER_PROMPTS: GetProp<typeof Prompts, 'items'> = [
  {
    key: '1',
    description: locale.upgrades,
    icon: <ScheduleOutlined />,
  },
  {
    key: '2',
    description: '帮我查询杭州天气',
    icon: <GlobalOutlined />,
  },
  {
    key: '3',
    description: '帮我查询 ANTD 股票',
    icon: <FileSearchOutlined />,
  },
  {
    key: '4',
    description: '帮我查询用户资料',
    icon: <AppstoreAddOutlined />,
  },
];

const THOUGHT_CHAIN_CONFIG = {
  loading: {
    title: locale.modelIsRunning,
    status: 'loading',
  },
  updating: {
    title: locale.modelIsRunning,
    status: 'loading',
  },
  success: {
    title: locale.modelExecutionCompleted,
    status: 'success',
  },
  error: {
    title: locale.executionFailed,
    status: 'error',
  },
  abort: {
    title: locale.aborted,
    status: 'abort',
  },
};

// ==================== Types ====================
type ToolName = 'get_weather' | 'get_stock_price' | 'get_user_profile';

type ToolDefinition = {
  name: ToolName;
  description: string;
  inputSchema: Record<string, any>;
};

type ToolCallState = 'pending' | 'running' | 'success' | 'error';

type AssistantTextContent = {
  type: 'text';
  text: string;
};

type AssistantToolCallContent = {
  type: 'tool-call';
  toolName: ToolName;
  arguments: Record<string, any>;
  state: ToolCallState;
};

type AssistantToolResultContent = {
  type: 'tool-result';
  toolName: ToolName;
  content: string;
  structuredContent?: Record<string, any>;
  isError?: boolean;
};

type RichAssistantContent =
  | AssistantTextContent
  | AssistantToolCallContent
  | AssistantToolResultContent;

type ChatContent = string | RichAssistantContent;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: ChatContent;
  extraInfo?: {
    feedback: ActionsFeedbackProps['value'];
  };
}

type OrchestratedMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: ChatContent;
  status?: 'success' | 'loading' | 'error' | 'updating' | 'abort';
  extraInfo?: ChatMessage['extraInfo'];
};

// ==================== Mock MCP Client ====================
const MOCK_TOOLS: ToolDefinition[] = [
  {
    name: 'get_weather',
    description: '获取指定城市天气信息',
    inputSchema: {
      type: 'object',
      properties: {
        city: { type: 'string', description: '城市名称' },
      },
      required: ['city'],
    },
  },
  {
    name: 'get_stock_price',
    description: '获取股票价格信息',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: '股票代码' },
      },
      required: ['symbol'],
    },
  },
  {
    name: 'get_user_profile',
    description: '获取用户资料信息',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: '用户 ID' },
      },
      required: ['userId'],
    },
  },
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockMcpClient = {
  async listTools(): Promise<{ tools: ToolDefinition[] }> {
    await sleep(200);
    return { tools: MOCK_TOOLS };
  },

  async callTool(input: {
    name: ToolName;
    arguments: Record<string, any>;
  }): Promise<{
    content: string;
    structuredContent?: Record<string, any>;
    isError?: boolean;
  }> {
    await sleep(900);

    switch (input.name) {
      case 'get_weather':
        return {
          content: `已获取 ${input.arguments.city || '杭州'} 的天气`,
          structuredContent: {
            city: input.arguments.city || '杭州',
            condition: '多云',
            temperature: 26,
            humidity: '78%',
          },
        };
      case 'get_stock_price':
        return {
          content: `已获取 ${input.arguments.symbol || 'ANTD'} 的股价`,
          structuredContent: {
            symbol: input.arguments.symbol || 'ANTD',
            price: 128.5,
            change: '+2.31%',
            market: 'NASDAQ',
          },
        };
      case 'get_user_profile':
        return {
          content: `已获取用户 ${input.arguments.userId || 'u_001'} 的资料`,
          structuredContent: {
            userId: input.arguments.userId || 'u_001',
            name: 'Ant Design X User',
            email: 'demo@ant.design',
            tags: ['VIP', 'Beta'],
          },
        };
      default:
        return {
          content: '未知工具',
          isError: true,
        };
    }
  },
};

const planToolCall = async (input: string): Promise<{
  toolName?: ToolName;
  args?: Record<string, any>;
  finalText?: string;
}> => {
  await sleep(300);
  const q = input.toLowerCase();

  if (q.includes('天气') || q.includes('weather')) {
    return {
      toolName: 'get_weather',
      args: {
        city: input.includes('北京') ? '北京' : input.includes('上海') ? '上海' : '杭州',
      },
    };
  }

  if (q.includes('股票') || q.includes('stock')) {
    return {
      toolName: 'get_stock_price',
      args: {
        symbol: 'ANTD',
      },
    };
  }

  if (q.includes('用户') || q.includes('profile')) {
    return {
      toolName: 'get_user_profile',
      args: {
        userId: 'u_001',
      },
    };
  }

  return {
    finalText: `这是普通文本回答：${input}`,
  };
};

const summarizeToolResult = async (
  toolName: ToolName,
  structuredContent?: Record<string, any>,
): Promise<string> => {
  await sleep(300);

  switch (toolName) {
    case 'get_weather':
      return `查询结果：${structuredContent?.city}当前${structuredContent?.condition}，气温 ${structuredContent?.temperature}°C，湿度 ${structuredContent?.humidity}。`;
    case 'get_stock_price':
      return `查询结果：${structuredContent?.symbol} 当前价格 ${structuredContent?.price}，涨跌幅 ${structuredContent?.change}，市场 ${structuredContent?.market}。`;
    case 'get_user_profile':
      return `查询结果：用户 ${structuredContent?.name}，邮箱 ${structuredContent?.email}，标签为 ${structuredContent?.tags?.join('、')}。`;
    default:
      return '工具调用已完成。';
  }
};

// ==================== Context ====================
const ChatContext = React.createContext<{
  onReload?: (id?: string | number) => Promise<void>;
  setMessage?: (id: string | number, updater: (prev?: Partial<OrchestratedMessage>) => Partial<OrchestratedMessage>) => void;
}>({});

// ==================== Sub Component ====================
const ThinkComponent = React.memo((props: ComponentProps) => {
  const [title, setTitle] = React.useState(`${locale.deepThinking}...`);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (props.streamStatus === 'done') {
      setTitle(locale.completeThinking);
      setLoading(false);
    }
  }, [props.streamStatus]);

  return (
    <Think title={title} loading={loading}>
      {props.children}
    </Think>
  );
});

const WeatherResultCard: React.FC<{ data: Record<string, any> }> = ({ data }) => (
  <Card size="small" title="天气结果" bordered={false}>
    <Descriptions size="small" column={1}>
      <Descriptions.Item label="城市">{data.city}</Descriptions.Item>
      <Descriptions.Item label="天气">{data.condition}</Descriptions.Item>
      <Descriptions.Item label="温度">{data.temperature}°C</Descriptions.Item>
      <Descriptions.Item label="湿度">{data.humidity}</Descriptions.Item>
    </Descriptions>
  </Card>
);

const StockResultCard: React.FC<{ data: Record<string, any> }> = ({ data }) => (
  <Card size="small" title="股票结果" bordered={false}>
    <Descriptions size="small" column={1}>
      <Descriptions.Item label="代码">{data.symbol}</Descriptions.Item>
      <Descriptions.Item label="价格">{data.price}</Descriptions.Item>
      <Descriptions.Item label="涨跌">{data.change}</Descriptions.Item>
      <Descriptions.Item label="市场">{data.market}</Descriptions.Item>
    </Descriptions>
  </Card>
);

const UserProfileResultCard: React.FC<{ data: Record<string, any> }> = ({ data }) => (
  <Card size="small" title="用户资料" bordered={false}>
    <Descriptions size="small" column={1}>
      <Descriptions.Item label="用户 ID">{data.userId}</Descriptions.Item>
      <Descriptions.Item label="姓名">{data.name}</Descriptions.Item>
      <Descriptions.Item label="邮箱">{data.email}</Descriptions.Item>
      <Descriptions.Item label="标签">
        <Space wrap>
          {(data.tags || []).map((tag: string) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Space>
      </Descriptions.Item>
    </Descriptions>
  </Card>
);

const AssistantContentRender: React.FC<{
  content: ChatContent;
  className: string;
  status?: string;
}> = ({ content, className, status }) => {
  if (typeof content === 'string') {
    return (
      <XMarkdown
        paragraphTag="div"
        components={{ think: ThinkComponent }}
        className={className}
        streaming={{
          hasNextChunk: status === 'updating',
          enableAnimation: true,
        }}
      >
        {content.replace(/\n\n/g, '<br/><br/>')}
      </XMarkdown>
    );
  }

  if (content.type === 'text') {
    return (
      <XMarkdown
        paragraphTag="div"
        components={{ think: ThinkComponent }}
        className={className}
        streaming={{
          hasNextChunk: status === 'updating',
          enableAnimation: true,
        }}
      >
        {content.text.replace(/\n\n/g, '<br/><br/>')}
      </XMarkdown>
    );
  }

  if (content.type === 'tool-call') {
    return (
      <ThoughtChain
        items={[
          {
            title: `调用工具：${content.toolName}`,
            description: `参数：${JSON.stringify(content.arguments, null, 2)}`,
            status:
              content.state === 'error'
                ? 'error'
                : content.state === 'success'
                  ? 'success'
                  : 'loading',
          },
        ]}
      />
    );
  }

  if (content.type === 'tool-result') {
    if (content.isError) {
      return <Card size="small">{content.content}</Card>;
    }

    switch (content.toolName) {
      case 'get_weather':
        return <WeatherResultCard data={content.structuredContent || {}} />;
      case 'get_stock_price':
        return <StockResultCard data={content.structuredContent || {}} />;
      case 'get_user_profile':
        return <UserProfileResultCard data={content.structuredContent || {}} />;
      default:
        return <pre>{JSON.stringify(content.structuredContent, null, 2)}</pre>;
    }
  }

  return null;
};

const Footer: React.FC<{
  id?: string | number;
  content: string;
  status?: string;
  extraInfo?: ChatMessage['extraInfo'];
}> = ({ id, content, extraInfo, status }) => {
  const context = React.useContext(ChatContext);
  const Items = [
    {
      key: 'pagination',
      actionRender: <Pagination simple total={1} pageSize={1} />,
    },
    {
      key: 'retry',
      label: locale.retry,
      icon: <SyncOutlined />,
      onItemClick: () => {
        if (id) {
          context?.onReload?.(id);
        }
      },
    },
    {
      key: 'copy',
      actionRender: <Actions.Copy text={content} />,
    },
    {
      key: 'audio',
      actionRender: (
        <Actions.Audio
          onClick={() => {
            message.info(locale.isMock);
          }}
        />
      ),
    },
    {
      key: 'feedback',
      actionRender: (
        <Actions.Feedback
          styles={{
            liked: {
              color: '#f759ab',
            },
          }}
          value={extraInfo?.feedback || 'default'}
          key="feedback"
          onChange={(val) => {
            if (id) {
              context?.setMessage?.(id, () => ({
                extraInfo: {
                  feedback: val,
                },
              }));
              message.success(`${id}: ${val}`);
            } else {
              message.error('has no id!');
            }
          }}
        />
      ),
    },
  ];
  return status !== 'updating' && status !== 'loading' ? (
    <div style={{ display: 'flex' }}>{id && <Actions items={Items} />}</div>
  ) : null;
};

const getRole = (className: string): BubbleListProps['role'] => ({
  assistant: {
    placement: 'start',
    header: (_, { status }) => {
      const config = THOUGHT_CHAIN_CONFIG[status as keyof typeof THOUGHT_CHAIN_CONFIG];
      return config ? (
        <ThoughtChain.Item
          style={{
            marginBottom: 8,
          }}
          status={config.status as ThoughtChainItemProps['status']}
          variant="solid"
          icon={<GlobalOutlined />}
          title={config.title}
        />
      ) : null;
    },
    footer: (content, { status, key, extraInfo }) => (
      <Footer
        content={typeof content === 'string' ? content : JSON.stringify(content)}
        status={status}
        extraInfo={extraInfo as ChatMessage['extraInfo']}
        id={key as string}
      />
    ),
    contentRender: (content: ChatContent, { status }) => {
      return <AssistantContentRender content={content} className={className} status={status} />;
    },
  },
  user: {
    placement: 'end',
    contentRender: (content: ChatContent) => {
      if (typeof content === 'string') return content;
      if ('type' in content && content.type === 'text') return content.text;
      return JSON.stringify(content);
    },
  },
});

const Independent: React.FC = () => {
  const { styles } = useStyle();

  const {
    conversations,
    activeConversationKey,
    setActiveConversationKey,
    addConversation,
    setConversations,
  } = useXConversations({
    defaultConversations: DEFAULT_CONVERSATIONS_ITEMS,
    defaultActiveConversationKey: DEFAULT_CONVERSATIONS_ITEMS[0].key,
  });

  const [className] = useMarkdownTheme();
  const [messageApi, contextHolder] = message.useMessage();
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<GetProp<typeof Attachments, 'items'>>([]);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<OrchestratedMessage[]>([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const [availableTools, setAvailableTools] = useState<ToolDefinition[]>([]);

  const listRef = useRef<BubbleListRef>(null);

  React.useEffect(() => {
    mockMcpClient.listTools().then((res) => {
      setAvailableTools(res.tools);
    });
  }, []);

  const abort = () => {
    setIsRequesting(false);
    messageApi.info(locale.aborted);
  };

  const onReload = async (id?: string | number) => {
    if (!id) return;
    messageApi.info(`mock retry: ${id}`);
  };

  const setMessage = (
    id: string | number,
    updater: (prev?: Partial<OrchestratedMessage>) => Partial<OrchestratedMessage>,
  ) => {
    setMessages((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const patch = updater(item);
        return { ...item, ...patch, extraInfo: { ...item.extraInfo, ...patch.extraInfo } };
      }),
    );
  };

  const onSubmit = async (val: string) => {
    if (!val) return;

    const userId = `user_${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: userId,
        role: 'user',
        content: val,
        status: 'success',
      },
    ]);

    setIsRequesting(true);
    listRef.current?.scrollTo({ top: 'bottom' });

    try {
      const plan = await planToolCall(val);

      if (!plan.toolName) {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant_text_${Date.now()}`,
            role: 'assistant',
            content: {
              type: 'text',
              text: plan.finalText || locale.noData,
            },
            status: 'success',
          },
        ]);
        return;
      }

      const toolCallId = `tool_call_${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        {
          id: toolCallId,
          role: 'assistant',
          content: {
            type: 'tool-call',
            toolName: plan.toolName,
            arguments: plan.args || {},
            state: 'running',
          },
          status: 'loading',
        },
      ]);

      listRef.current?.scrollTo({ top: 'bottom' });

      const toolResult = await mockMcpClient.callTool({
        name: plan.toolName,
        arguments: plan.args || {},
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === toolCallId
            ? {
                ...msg,
                content: {
                  type: 'tool-call',
                  toolName: plan.toolName!,
                  arguments: plan.args || {},
                  state: toolResult.isError ? 'error' : 'success',
                },
                status: toolResult.isError ? 'error' : 'success',
              }
            : msg,
        ),
      );

      setMessages((prev) => [
        ...prev,
        {
          id: `tool_result_${Date.now()}`,
          role: 'assistant',
          content: {
            type: 'tool-result',
            toolName: plan.toolName!,
            content: toolResult.content,
            structuredContent: toolResult.structuredContent,
            isError: toolResult.isError,
          },
          status: toolResult.isError ? 'error' : 'success',
        },
      ]);

      const finalAnswer = await summarizeToolResult(plan.toolName, toolResult.structuredContent);

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant_final_${Date.now()}`,
          role: 'assistant',
          content: {
            type: 'text',
            text: finalAnswer,
          },
          status: 'success',
        },
      ]);
    } finally {
      setIsRequesting(false);
      setActiveConversationKey(activeConversationKey);
      setTimeout(() => {
        listRef.current?.scrollTo({ top: 'bottom' });
      }, 0);
    }
  };

  const chatSide = (
    <div className={styles.side}>
      <div className={styles.logo}>
        <img
          src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
          draggable={false}
          alt="logo"
          width={24}
          height={24}
        />
        <span>Ant Design X</span>
      </div>
      <Conversations
        creation={{
          onClick: () => {
            if (messages.length === 0) {
              messageApi.error(locale.itIsNowANewConversation);
              return;
            }
            const now = dayjs().valueOf().toString();
            addConversation({
              key: now,
              label: `${locale.newConversation} ${conversations.length + 1}`,
              group: locale.today,
            });
            setActiveConversationKey(now);
            setMessages([]);
          },
        }}
        items={conversations.map(({ key, label, ...other }) => ({
          key,
          label: key === activeConversationKey ? `[${locale.curConversation}]${label}` : label,
          ...other,
        }))}
        className={styles.conversations}
        activeKey={activeConversationKey}
        onActiveChange={setActiveConversationKey}
        groupable
        styles={{ item: { padding: '0 8px' } }}
        menu={(conversation) => ({
          items: [
            {
              label: locale.rename,
              key: 'rename',
              icon: <EditOutlined />,
            },
            {
              label: locale.delete,
              key: 'delete',
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => {
                const newList = conversations.filter((item) => item.key !== conversation.key);
                const newKey = newList?.[0]?.key;
                setConversations(newList);
                if (conversation.key === activeConversationKey) {
                  setActiveConversationKey(newKey);
                }
              },
            },
          ],
        })}
      />

      <div className={styles.sideFooter}>
        <Avatar size={24} />
        <Button type="text" icon={<QuestionCircleOutlined />} />
      </div>
    </div>
  );

  const chatList = (
    <div className={styles.chatList}>
      {messages.length ? (
        <Bubble.List
          ref={listRef}
          items={messages.map((i) => ({
            role: i.role,
            content: i.content,
            key: i.id,
            status: i.status,
            loading: i.status === 'loading',
            extraInfo: i.extraInfo,
          }))}
          styles={{
            root: {
              maxWidth: 940,
            },
          }}
          role={getRole(className)}
        />
      ) : (
        <Flex
          vertical
          style={{
            maxWidth: 840,
          }}
          gap={16}
          align="center"
          className={styles.placeholder}
        >
          <Welcome
            style={{
              width: '100%',
            }}
            variant="borderless"
            icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
            title={locale.welcome}
            description={locale.welcomeDescription}
            extra={
              <Space>
                <Button icon={<ShareAltOutlined />} />
                <Button icon={<EllipsisOutlined />} />
              </Space>
            }
          />
          <Flex
            gap={16}
            justify="center"
            style={{
              width: '100%',
            }}
          >
            <Prompts
              items={[HOT_TOPICS]}
              styles={{
                list: { height: '100%' },
                item: {
                  flex: 1,
                  backgroundImage: 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
                  borderRadius: 12,
                  border: 'none',
                },
                subItem: { padding: 0, background: 'transparent' },
              }}
              onItemClick={(info) => {
                onSubmit(info.data.description as string);
              }}
              className={styles.chatPrompt}
            />

            <Prompts
              items={[DESIGN_GUIDE]}
              styles={{
                item: {
                  flex: 1,
                  backgroundImage: 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
                  borderRadius: 12,
                  border: 'none',
                },
                subItem: { background: '#ffffffa6' },
              }}
              onItemClick={(info) => {
                onSubmit(info.data.description as string);
              }}
              className={styles.chatPrompt}
            />
          </Flex>
        </Flex>
      )}
    </div>
  );

  const senderHeader = (
    <Sender.Header
      title={locale.uploadFile}
      open={attachmentsOpen}
      onOpenChange={setAttachmentsOpen}
      styles={{ content: { padding: 0 } }}
    >
      <Attachments
        beforeUpload={() => false}
        items={attachedFiles}
        onChange={(info) => setAttachedFiles(info.fileList)}
        placeholder={(type) =>
          type === 'drop'
            ? { title: locale.dropFileHere }
            : {
                icon: <CloudUploadOutlined />,
                title: locale.uploadFiles,
                description: locale.clickOrDragFilesToUpload,
              }
        }
      />
    </Sender.Header>
  );

  const chatSender = (
    <Flex
      vertical
      gap={12}
      align="center"
      style={{
        margin: 8,
      }}
    >
      {!attachmentsOpen && (
        <Prompts
          items={SENDER_PROMPTS}
          onItemClick={(info) => {
            onSubmit(info.data.description as string);
          }}
          styles={{
            item: { padding: '6px 12px' },
          }}
          className={styles.senderPrompt}
        />
      )}

      <Card size="small" title="Mock MCP Tools" className={styles.toolPanel}>
        <Flex vertical gap={8}>
          <div className={styles.toolHint}>前端 Client 编排演示：静态发现工具，模型决定调用，前端执行并渲染结果。</div>
          <Space wrap>
            {availableTools.map((tool) => (
              <Button
                key={tool.name}
                size="small"
                onClick={() => {
                  if (tool.name === 'get_weather') onSubmit('帮我查询杭州天气');
                  if (tool.name === 'get_stock_price') onSubmit('帮我查询 ANTD 股票');
                  if (tool.name === 'get_user_profile') onSubmit('帮我查询用户资料');
                }}
              >
                {tool.name}
              </Button>
            ))}
          </Space>
        </Flex>
      </Card>

      <Sender
        value={inputValue}
        header={senderHeader}
        onSubmit={() => {
          onSubmit(inputValue);
          setInputValue('');
        }}
        onChange={setInputValue}
        onCancel={() => {
          abort();
        }}
        prefix={
          <Button
            type="text"
            icon={<PaperClipOutlined style={{ fontSize: 18 }} />}
            onClick={() => setAttachmentsOpen(!attachmentsOpen)}
          />
        }
        loading={isRequesting}
        className={styles.sender}
        allowSpeech
        placeholder={locale.askOrInputUseSkills}
      />
    </Flex>
  );

  return (
    <XProvider locale={locale}>
      <ChatContext.Provider value={{ onReload, setMessage }}>
        {contextHolder}
        <div className={styles.layout}>
          {chatSide}
          <div className={styles.chat}>
            {chatList}
            {chatSender}
          </div>
        </div>
      </ChatContext.Provider>
    </XProvider>
  );
};

export default Independent;
