"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import * as Tooltip from '@radix-ui/react-tooltip';

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span>{format(time, 'HH:mm:ss')}</span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="bg-black text-white p-2 rounded-md" sideOffset={5}>
            {format(time, 'h:mm:ss a')}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
} 