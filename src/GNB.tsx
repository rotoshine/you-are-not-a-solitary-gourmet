import * as React from 'react'
import { Link } from 'react-router-dom'

import styled from './styled-components'

const Nav = styled.nav`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  padding: 2rem;
  display: flex;
`

const Menulist = styled.div`
  padding: 0 1rem;
  font-size: 1.6rem;
  font-weight: 400;
  letter-spacing: 0.1rem;

  a {
    color: white;
  }

  a:hover {
    text-decoration: none;
    color: #ffffffa6;
  }
`

const GNB = () => (
  <Nav>
    <Menulist>
      <Link to="/parties">
        파티보기
      </Link>
    </Menulist>
    <Menulist>
      <Link to="/parties/new">
        행선지보기
      </Link>
    </Menulist>
    <Menulist>
      <Link to="/me">
        마이페이지
      </Link>
    </Menulist>
  </Nav>
)

export default GNB
