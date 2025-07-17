/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { getHeight, toAbsoluteUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { KeenIcon } from '@/components';
import {
  Menu,
  MenuItem,
  MenuLink,
  MenuSub,
  MenuTitle,
  MenuToggle,
  MenuArrow,
  MenuIcon
} from '@/components/menu';
import { useLanguage } from '@/i18n';
import { useViewport } from '@/hooks';
import { CommonAvatars } from '@/partials/common';
import { IDropdownChatProps, IDropdownMessage } from './types';
import { DropdownChatMessageOut } from './DropdownChatMessageOut';
import { DropdownChatMessageIn } from './DropdownChatMessageIn';

const DropdownChat = ({ menuTtemRef }: IDropdownChatProps) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [scrollableHeight, setScrollableHeight] = useState<number>(0);
  const [viewportHeight] = useViewport();
  const { isRTL } = useLanguage();
  const offset = 110;

  useEffect(() => {
    if (messagesRef.current) {
      let availableHeigh: number = viewportHeight - offset;

      if (headerRef.current) availableHeigh -= getHeight(headerRef.current);
      if (footerRef.current) availableHeigh -= getHeight(footerRef.current);

      setScrollableHeight(availableHeigh);
    }
  }, [menuTtemRef.current?.isOpen(), viewportHeight]);

  const handleClose = () => {
    if (menuTtemRef.current) {
      menuTtemRef.current.hide(); // Call the closeMenu method to hide the submenu
    }
  };

  const handleFormInput = () => {};

  const buildHeader = () => {
    return (
      <>
        <div className="flex items-center justify-between gap-2.5 text-sm text-gray-900 font-semibold px-5 py-2.5">
          Chat
          <button
            className="btn btn-sm btn-icon btn-light btn-clear shrink-0"
            onClick={handleClose}
          >
            <KeenIcon icon="cross" />
          </button>
        </div>
        <div className="border-b border-b-gray-200"></div>
      </>
    );
  };

  const buildMessages = () => {
    const messages: IDropdownMessage[] = [
      {
        avatar: '/media/avatars/300-5.png',
        time: '08:0',
        text: `
            Hello! <br>
            Bem vindo ao suporte Novak, como podemos te ajudar hoje?`,
        in: true
      }
    ];

    return (
      <div className="flex flex-col gap-5 py-5">
        {messages.map((message, index) => {
          if (message.out) {
            return (
              <DropdownChatMessageOut
                key={index}
                text={message.text}
                time={message.time}
                read={message.read || false} // Default to false if read is not provided
              />
            );
          } else if (message.in) {
            return (
              <DropdownChatMessageIn
                key={index}
                text={message.text}
                time={message.time}
                avatar={message.avatar}
              />
            );
          }
          return null; // Handle cases where neither `in` nor `out` is specified
        })}
      </div>
    );
  };

  const buildForm = () => {
    const [emailInput, setEmailInput] = useState('');
    return (
      <div className="relative grow mx-5 mb-2.5">
        <img
          src={toAbsoluteUrl('/media/avatars/300-2.png')}
          className="rounded-full size-[30px] absolute start-0 top-2/4 -translate-y-2/4 ms-2.5"
          alt=""
        />

        <input
          type="text"
          className="input h-auto py-4 ps-12 bg-transparent"
          onChange={(e) => setEmailInput(e.target.value)}
          placeholder="Write a message..."
          value={emailInput}
        />

        <div className="flex items-center gap-2.5 absolute end-3 top-1/2 -translate-y-1/2">
          <button className="btn btn-sm btn-icon btn-light btn-clear">
            <KeenIcon icon="exit-up" />
          </button>
          <button className="btn btn-dark btn-sm">Send</button>
        </div>
      </div>
    );
  };

  return (
    <MenuSub rootClassName="w-full max-w-[450px]" className="light:border-gray-300">
      <div ref={headerRef}>{buildHeader()}</div>

      <div
        ref={messagesRef}
        className="scrollable-y-auto"
        style={{ maxHeight: `${scrollableHeight}px` }}
      >
        {buildMessages()}
      </div>

      <div ref={footerRef}>{buildForm()}</div>
    </MenuSub>
  );
};

export { DropdownChat };
