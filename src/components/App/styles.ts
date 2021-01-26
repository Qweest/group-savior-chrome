import styled, { css } from 'styled-components';
import { HiOutlineFolderDownload } from 'react-icons/hi';

interface AddAllProps {
  $saved: boolean;
}

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  margin: 10px;
  border-radius: 8px;
  background-color: #343439;
`;

export const InfoText = styled.div`
  min-height: 130px;
  margin: 12px;
  font-size: 16px;
  font-weight: bold;
  color: #848485;
`;

export const Header = styled.a`
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  font-family: 'Andale Mono', sans-serif;
  text-decoration: underline;
  color: wheat;
  margin: 10px;
  transition: all 0.2s ease;
  user-select: none;

  &:hover {
    transform: scale(1.1);
  }
`;

export const GroupsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100px;
`;

export const Separator = styled.div`
  box-sizing: border-box;
  border-top: 1px solid #5e5e6b;
  margin: 8px;
`;

export const ActionsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 0 10px 10px;
`;

const savedAll = css`
  color: greenyellow;
  fill: rgba(173, 255, 47, 0.1);
`;

export const AddAll = styled(HiOutlineFolderDownload)<AddAllProps>`
  cursor: pointer;
  color: white;

  &:hover {
    color: greenyellow;
    transform: scale(1.1);
    transition: all 0.2s ease;
  }

  &:active {
    transform: scale(0.9);
    transition: all 0.1s ease;
  }

  ${({ $saved }) => ($saved ? savedAll : '')};
`;
