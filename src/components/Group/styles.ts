import styled from 'styled-components';
import { HiOutlineTrash } from 'react-icons/hi';

import { COLORS } from '../../services/chrome/constants';

interface TitleWrapperProps {
  color: string;
  saved: boolean;
}

interface RemoveButtonProps {
  $saved: boolean;
}

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const Title = styled.div<TitleWrapperProps>`
  display: flex;
  justify-content: center;
  padding: 5px;
  width: ${({ saved }) => (saved ? '100%' : '75px')};
  margin-left: ${({ saved }) => (saved ? 0 : 5)}px;
  border-radius: ${({ saved }) => (saved ? 0 : 5)}px;
  background-color: ${({ color }) => COLORS[color]};
  transition: all 0.2s ease-out;
  font-size: 12px;
  user-select: none;
  cursor: pointer;
  &:hover {
    border-radius: 0;
    width: ${({ saved }) => (saved ? '100%' : '90px')};
    margin-left: 0;
    opacity: ${({ saved }) => (saved ? 0.8 : 1)};
  }
  &:active {
    width: ${({ saved }) => (saved ? '100%' : '100px')};
    opacity: ${({ saved }) => (saved ? 0.7 : 1)};
  }
`;

export const RemoveButton = styled(HiOutlineTrash)<RemoveButtonProps>`
  visibility: ${({ $saved }) => ($saved ? 'visible' : 'hidden')};
  padding: 0 4px;
  background-color: #d73c0b;
  color: #a20404;
  user-select: none;
  cursor: pointer;
  transition: all 0.1s ease-out;
  &:hover {
    color: #ffc9c9;
  }
  &:active {
    padding-left: 16px;
  }
  &:not(:hover) {
    padding: 0 4px;
  }
`;
