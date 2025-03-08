'use server'
import {LettaClient} from "@letta-ai/letta-client";
import {currentUser} from "@clerk/nextjs/server";
import {SignedIn, SignedOut} from "@clerk/nextjs";
import {ChatComponent} from "./ChatComponent";

async function getAgentId() {
    const user = await currentUser()

    if (!user?.id) {
        return null;
    }

    const lettaClient = new LettaClient({
        baseUrl: process.env.LETTA_API_BASE_URL,
        token: process.env.LETTA_API_KEY || '',
    });

    const identitiesList = await lettaClient.identities.list({
        identifierKey: user?.id,
    })

    let lettaIdentity = identitiesList[0];

    if (!lettaIdentity) {
        lettaIdentity = await lettaClient.identities.create({
            body: {
                identityType: 'user',
                name: user.fullName || 'No name',
                identifierKey: user.id,
            }
        })
    }

    if (!lettaIdentity?.id) {
        throw new Error('Failed to create identity');
    }

    const lettaAgentId = lettaIdentity.agentIds[0];


    if (lettaAgentId) {
        return lettaAgentId;
    }

    const agent = await lettaClient.agents.create({
        fromTemplate: 'merced-helper-bot:latest',
        identityIds: [lettaIdentity.id],
    })


    return agent.id;
}

export default async function Home() {
    const agentId = await getAgentId();

    return (
        <div className="w-[100vw] h-[100vh] absolute top-0 flex">
            <SignedOut>
                Please log in!
            </SignedOut>
            <SignedIn>
                {agentId ?
                    <ChatComponent agentId={agentId} /> : <div>Something went wrong</div>
                }
            </SignedIn>
        </div>
    );
}
