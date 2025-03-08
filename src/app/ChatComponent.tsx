'use client'
import React, {FormEvent, useCallback} from 'react';
import {useAgentMessages} from "@letta-ai/letta-react";

interface ChatComponentProps {
    agentId: string;
}

export function ChatComponent(props: ChatComponentProps) {
    const {agentId} = props;

    const [messageToSend, setMessageToSend] = React.useState('');
    const {messages, isLoading, isSending, sendMessage} = useAgentMessages({
        agentId,
    });

    const handleSendMessage = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!messageToSend) {
            return;
        }

        if (isSending) {
            return
        }

        setMessageToSend('');

        await sendMessage({
            messages: [
                {
                    content: messageToSend,
                    role: 'user',
                }
            ]
        });

    }, [messageToSend, isSending, sendMessage]);

    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div className="h-full w-full max-w-[800px] mx-auto flex flex-col p-4 pb-5">
            <div className="flex-1">
                {messages.map((message, index) => {
                    if (message.messageType === 'user_message') {
                        if (typeof message.content !== 'string') {
                            return null;
                        }

                        return (
                            <div key={index}>{message.content}</div>
                        )
                    }

                    if (message.messageType === 'assistant_message') {
                        if (typeof message.content !== 'string') {
                            return null;
                        }

                        return (
                            <div key={index}>{message.content}</div>
                        )
                    }

                    return null;
                })}
            </div>
            {isSending ? 'Sending message...' : null}
            <form onSubmit={handleSendMessage} className="w-full p-2 flex bg-gray-200">
                <input
                    placeholder="Type a message..."
                    className="w-full"
                    value={messageToSend}
                    onChange={(e) => setMessageToSend(e.target.value)}
                />
                <button
                    className="bg-black text-white p-1 px-2"
                    type="submit"
                >
                    Send
                </button>
            </form>
        </div>
    )
}