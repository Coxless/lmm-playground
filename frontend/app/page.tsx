import { ChatWindow } from "@/components/ChatWindow";
import { GuideInfoBox } from "@/components/guide/GuideInfoBox";

export default function Home() {
  const InfoCard = (
    <GuideInfoBox>
      <ul>
        <li className="text-l">This is a playground for LLM</li>
        <li className="text-l">
          <span>Based on </span>
          <a
            className="text-blue-500 hover:underline"
            href="https://github.com/langchain-ai/langchain-nextjs-template"
          >
            Langchain-nextjs-template
          </a>
          <span> for reference.</span>
        </li>
      </ul>
    </GuideInfoBox>
  );
  return (
    <ChatWindow
      endpoint="api/chat"
      emoji="🏴‍☠️"
      placeholder="LLM Input here..."
      emptyStateComponent={InfoCard}
    />
  );
}
