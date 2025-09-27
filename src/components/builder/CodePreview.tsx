import React, { useEffect, useState, Suspense } from 'react';
import { useMcpStore } from '@/store/mcpStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Parameter = {
  id: string;
  name: string;
  type: string;
  description: string;
  required: boolean;
};

type Tool = {
  id: string;
  name: string;
  description: string;
  parameters: Parameter[];
};

function generateJsonSchema(tool: Tool | undefined) {
  if (!tool) return {};

  const properties = tool.parameters.reduce((acc: Record<string, { type: string; description: string }>, param: Parameter) => {
    acc[param.name] = {
      type: param.type,
      description: param.description,
    };
    return acc;
  }, {});

  const required = tool.parameters
    .filter((param: Parameter) => param.required)
    .map((param: Parameter) => param.name);

  return {
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: {
        type: 'object',
        properties,
        required,
      },
    },
  };
}

export function CodePreview() {
  const activeToolId = useMcpStore((state) => state.activeToolId);
  const tool = useMcpStore((state) => state.tools.find(t => t.id === activeToolId));
  const [codeString, setCodeString] = useState('// Select a tool to see its schema');

  useEffect(() => {
    if (tool) {
      const schema = generateJsonSchema(tool);
      setCodeString(JSON.stringify(schema, null, 2));
    } else {
      setCodeString('// Select a tool to see its schema');
    }
  }, [tool]);

  return (
    <Card className="bg-glass h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5 text-primary" />
          Live Code Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto font-mono text-sm">
        <Suspense fallback={<Skeleton className="w-full h-full" />}>
          <SyntaxHighlighter
            language="json"
            style={vscDarkPlus}
            customStyle={{ background: 'transparent', height: '100%' }}
            PreTag="div"
          >
            {codeString}
          </SyntaxHighlighter>
        </Suspense>
      </CardContent>
    </Card>
  );
}
//