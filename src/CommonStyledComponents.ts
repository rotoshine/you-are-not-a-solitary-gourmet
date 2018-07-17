import styled from 'styled-components'

export const Overlay = styled.div`
  position: fixed;
  z-index: 10;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow-y: scroll;
  animation: fadeIn 0.4s ease;
`

export const CenterText = styled.div`
  width: 300px;
  background: white;
  padding: 4rem 3rem;
  position: relative;
  border-radius: 6px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`

export const CloseBtn = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 100;
  width: 3rem;
  height: 3rem;
  cursor: pointer;
  padding: 4rem 10rem;
  transition: transform 0.2s ease;
  &:before {
    content: '';
    width: 3rem;
    height: 3px;
    background: white;
    position: fixed;
    transform: rotate(-45deg);
    @media screen and (max-width: 600px) {
      background: #484848;
    }
  }
  &:after {
    content: '';
    width: 3rem;
    height: 3px;
    background: white;
    position: fixed;
    transform: rotate(45deg);
    @media screen and (max-width: 600px) {
      background: #484848;
    }
  }
  &:hover {
    transform: translate(-2px,2px);
  }
  @media screen and (max-width: 600px) {
    padding: 5rem 6rem 5rem 2rem;
  }
`
