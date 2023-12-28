'use client';

import React from 'react';
import { useChat } from 'ai/react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

export function AskAi({ className }: { className?: string }) {
  const { messages, input, handleInputChange, handleSubmit, stop, isLoading } = useChat({
    api: '/api/langchain/chat',
    // TODO: use jotai to store messages?
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={className} variant="default" size="lg">
          Ask AI
        </Button>
      </DialogTrigger>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Ask AI</DialogTitle>
        </DialogHeader>
        <ScrollArea className="dark h-48 max-h-full min-h-[12rem]">
          <div className="grid grid-cols-12 gap-2">
            {messages.map((m) => (
              <React.Fragment key={m.id}>
                <div className="col-span-2">{m.role === 'user' ? 'User: ' : 'AI: '}</div>
                <div className="col-span-10">{m.content}</div>
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Say somethings"
            className="flex-1"
            disabled={isLoading}
          />
          {isLoading ? (
            <Button variant="secondary" onClick={stop}>
              Stop
            </Button>
          ) : (
            <Button type="submit">Send</Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
