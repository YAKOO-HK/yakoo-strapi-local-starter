'use client';

import React, { startTransition, useEffect, useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Message, useChat } from 'ai/react';
import { MoreVerticalIcon } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useZodForm } from '@/hooks/useZodForm';
import { fetchResponseHandler } from '@/lib/fetch-utils';
import { cn } from '@/lib/utils';
import { ChatData, StartChatSchema } from '@/strapi/chat';
import { ControlledHCaptcha } from './form/ControlledHCaptcha';
import { ControlledTextField } from './form/ControlledTextField';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Form } from './ui/form';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

function ChatBottomAnchor({ isLoading }: { isLoading: boolean }) {
  const [ref, inView, entry] = useInView({
    threshold: 0,
    trackVisibility: true,
    delay: 100,
  });
  useEffect(() => {
    startTransition(() => {
      entry?.target.scrollIntoView({ block: 'start' });
    });
  }, [entry?.target]);
  useEffect(() => {
    if (!inView && isLoading) {
      startTransition(() => {
        entry?.target.scrollIntoView({ block: 'start' });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, isLoading]);
  return <div id="chat-anchor" ref={ref} className="h-2" />;
}

function ChatUI({
  uuid,
  initialMessages = [],
  name = 'User',
}: {
  uuid: string;
  initialMessages?: Message[];
  name?: string;
}) {
  const { messages, input, handleInputChange, handleSubmit, stop, isLoading, error } = useChat({
    id: uuid,
    api: '/api/langchain/chat',
    initialMessages,
    sendExtraMessageFields: true,
  });
  return (
    <>
      <ScrollArea className="h-64 max-h-full min-h-[12rem]">
        {messages.map((m) => (
          <div key={m.id} className="my-2 grid grid-cols-12 gap-2">
            <div className={'col-span-1 py-2 pl-2 text-right'}>{m.role === 'user' ? null : 'AI'}</div>
            <div className={cn('col-span-9 rounded-md', m.role === 'user' ? 'text-right' : '')}>
              <div
                className={cn('inline-block rounded-lg p-2', {
                  'bg-slate-100': m.role !== 'user',
                  'bg-blue-700 text-white': m.role === 'user',
                })}
              >
                {m.content}
              </div>
            </div>
            <div className={'col-span-2 line-clamp-1 py-2 pr-2 text-left'} title={name}>
              {m.role === 'user' ? name : null}
            </div>
          </div>
        ))}
        {error ? <div className="text-center text-red-500">{error.message}</div> : null}
        <ChatBottomAnchor isLoading={isLoading} />
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask AI a question"
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
        <EndChatButton />
      </form>
    </>
  );
}

function EndChatButton() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: () => fetch('/api/langchain/chat/end', { method: 'POST' }).then(fetchResponseHandler()),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['langchain-chat-id'],
      });
    },
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon">
          <MoreVerticalIcon className="h-4 w-4" aria-hidden />
          <span className="sr-only">More actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => mutateAsync()}>End Chat</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function StatChatUI() {
  const queryClient = useQueryClient();
  const hCaptchaRef = useRef<HCaptcha>(null);
  const methods = useZodForm({
    zodSchema: StartChatSchema,
    defaultValues: { hCaptcha: '', name: '' },
    onSubmit: async (data) => {
      await fetch('/api/langchain/chat/start', { method: 'POST', body: JSON.stringify(data) }).then(
        fetchResponseHandler()
      );
      hCaptchaRef.current?.resetCaptcha();
      queryClient.invalidateQueries({
        queryKey: ['langchain-chat-id'],
      });
    },
    onError: () => {
      hCaptchaRef.current?.resetCaptcha();
    },
  });
  const { control, onFormSubmit } = methods;
  return (
    <Form {...methods}>
      <form onSubmit={onFormSubmit} className="grid grid-cols-1 gap-2">
        <ControlledTextField control={control} name="name" label="Tell us your name:" className="w-full" />
        <ControlledHCaptcha control={control} name="hCaptcha" hCaptchaRef={hCaptchaRef} />
        <Button type="submit">Start Chat</Button>
      </form>
    </Form>
  );
}

export function AskAi({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { data } = useQuery({
    queryKey: ['langchain-chat-id'],
    queryFn: () => fetch('/api/langchain/chat/start').then(fetchResponseHandler<ChatData>()),
  });

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className={className} variant="default" size="lg">
            Ask AI
          </Button>
        </DialogTrigger>
        <DialogContent
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="px-3 sm:p-6"
        >
          <DialogHeader>
            <DialogTitle>Ask AI</DialogTitle>
          </DialogHeader>
          {data?.uuid ? <ChatUI uuid={data.uuid} initialMessages={data.history} name={data.name} /> : <StatChatUI />}
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className={className} variant="default" size="lg">
          Ask AI
        </Button>
      </DrawerTrigger>
      <DrawerContent key={data?.uuid ?? ''} className="">
        <DrawerHeader className="text-left">
          <DrawerTitle>Ask AI</DrawerTitle>
        </DrawerHeader>
        <div className="px-2 pb-2">
          {data?.uuid ? <ChatUI uuid={data.uuid} initialMessages={data.history} name={data.name} /> : <StatChatUI />}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
