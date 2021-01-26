import styled, { css } from 'styled-components';
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
  flex-direction: row;
  justify-content: center;
  width: 100%;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const titleSaved = css`
  max-width: 100% !important;
  border-radius: 0;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.7;
  }
`;

export const Title = styled.div<TitleWrapperProps>`
  display: inline-block;
  padding: 5px;
  width: 100%;
  max-width: 90px;
  border-radius: 5px;
  background-color: ${({ color }) => COLORS[color]};
  transition: all 0.2s ease-out;
  text-align: center;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  user-select: none;
  cursor: pointer;

  &:hover {
    border-radius: 0;
    max-width: 110px;
  }

  &:active {
    max-width: 160px;
  }

  ${({ saved }) => (saved ? titleSaved : '')}
`;

const removeButtonHidden = css`
  visibility: hidden;
  width: 0;
  padding: 0;
`;

export const RemoveButton = styled(HiOutlineTrash)<RemoveButtonProps>`
  visibility: visible;
  padding: 0 4px;
  background-color: #d73c0b;
  color: #6d0707;
  user-select: none;
  cursor: pointer;
  transition: all 0.1s ease-out;

  &:hover {
    color: #ffc9c9;
  }

  &:active {
    padding-left: 16px;
  }

  ${({ $saved }) => ($saved ? '' : removeButtonHidden)};
`;
