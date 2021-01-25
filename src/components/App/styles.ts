import styled from 'styled-components';
import { HiOutlineColorSwatch, HiOutlineBan } from 'react-icons/hi';

interface AddAllProps {
  $saved: boolean;
}

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  width: 200px;
  background-color: #242425;
`;

export const GroupsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 10px;
`;

export const Separator = styled.div`
  box-sizing: border-box;
  border-top: 1px solid #5e5e6b;
  margin: 8px;
`;

export const ActionsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 10px 10px;
`;

export const AddAll = styled(HiOutlineColorSwatch)<AddAllProps>`
  cursor: pointer;
  color: ${({ $saved }) => ($saved ? 'wheat' : 'white')};

  &:hover {
    color: #f5deb3;
    transform: scale(1.1);
    transition: all 0.2s ease;
  }

  &:active {
    transform: scale(0.9);
    transition: all 0.1s ease;
  }
`;

export const RemoveAll = styled(HiOutlineBan)`
  cursor: pointer;
  color: orangered;

  &:hover {
    color: #c10818;
    transform: scale(1.1);
    transition: all 0.2s ease;
  }

  &:active {
    transform: scale(0.9);
    transition: all 0.1s ease;
  }
`;
