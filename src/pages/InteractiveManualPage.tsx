import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen } from 'lucide-react';
const CodeBlock = ({ children }: { children: React.ReactNode }) => (
  <pre className="bg-muted p-4 rounded-md overflow-x-auto my-4 font-mono text-sm">
    <code>{children}</code>
  </pre>
);
export function InteractiveManualPage() {
  return (
    <div className="flex-1 flex flex-col items-center p-4 md:p-6">
      <Card className="w-full max-w-4xl bg-glass">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Interactive Manual</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Your guide to the Model Context Protocol (MCP) and Context Architect.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-semibold">What is the Model Context Protocol (MCP)?</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-4">
                <p>
                  The Model Context Protocol (MCP) is a standardized way for AI models to access external information and capabilities, often called "tools." It defines a clear contract for how an AI can discover, understand, and use these tools to perform tasks it couldn't do on its own, like fetching live data, searching the web, or interacting with other services.
                </p>
                <p>
                  Think of it as a universal language that allows any AI model to talk to any tool, making the AI much more powerful and versatile.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-xl font-semibold">Core Concept: Tools</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-4">
                <p>
                  A "Tool" is the fundamental building block in MCP. It represents a specific capability or function that you want to make available to the AI model. Each tool has a clear definition that includes:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li><strong>Name:</strong> A unique identifier for the function (e.g., `get_weather`).</li>
                  <li><strong>Description:</strong> A clear, human-readable explanation of what the tool does. The AI uses this to decide when to use the tool.</li>
                  <li><strong>Parameters:</strong> The inputs the tool requires to run, including their names, data types (string, number, boolean), and descriptions.</li>
                </ul>
                <p>
                  Here is an example of a tool definition in the JSON schema format that MCP uses:
                </p>
                <CodeBlock>
{`{
  "type": "function",
  "function": {
    "name": "get_weather",
    "description": "Get the current weather in a given location",
    "parameters": {
      "type": "object",
      "properties": {
        "location": {
          "type": "string",
          "description": "The city and state, e.g. San Francisco, CA"
        }
      },
      "required": ["location"]
    }
  }
}`}
                </CodeBlock>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-xl font-semibold">Using the Tool Builder</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-4">
                <p>
                  The Tool Builder in Context Architect provides a simple visual interface to create these complex JSON schemas without writing any code.
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li><strong>Tool Name & Description:</strong> Fill these out at the top. Be descriptive, as the AI relies on this information.</li>
                  <li><strong>Add Parameter:</strong> Click this button to add a new input for your tool.</li>
                  <li><strong>Parameter Fields:</strong> For each parameter, define its name, type, and description. Toggle whether it's required.</li>
                  <li><strong>Drag and Drop:</strong> You can reorder parameters by clicking and dragging the grip handle on the left.</li>
                  <li><strong>Live Preview:</strong> The code preview on the right instantly updates to show you the generated JSON schema as you make changes.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-xl font-semibold">What are Resources and Prompts?</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-4">
                <p>
                  While Tools define actions, Resources and Prompts provide the AI with knowledge and guidance.
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li><strong>Resources (Coming Soon):</strong> These are data sources the AI can query. This could be a database, a document, or an API that provides information without performing an action.</li>
                  <li><strong>Prompts (Coming Soon):</strong> This is where you define the AI's personality, goals, and constraints. A good system prompt is crucial for ensuring the AI behaves as expected and uses its tools correctly.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        Built with ❤️ at Cloudflare
      </footer>
    </div>
  );
}