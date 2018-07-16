import * as React from 'react'

import styled from './styled-components'

const FooterContainer = styled.footer`
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: relative;
`
const Background = styled.div`
  margin-top: 22rem;
  background: linear-gradient(60deg, #ff8d00, #a5007d, #26186f);
  transform: skewY(-11deg);
  transform-origin: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 100%;

  @media (min-width: 1020px) {
    margin-top: 28rem;
    transform: skewY(-6deg);
  }
`

const FooterContent = styled.div`
  flex-wrap: wrap;
  display: flex;
  font-size: 1.3rem;
  color: #ffffffa6;
  justify-content: center;
  margin-top: 25rem;

  h2 {
    font-size: 1.6rem;
    font-weight: 300;
    letter-spacing: 0.1rem;
  }

  h3 {
    margin: 2rem 0 1rem 0;
    letter-spacing: 0.1rem;
    font-size: 1.3rem;
    text-transform: uppercase;
  }

  .group {
    p {
      line-height: 2;
      letter-spacing: 0.05rem;
      word-break: keep-all;
    }

    a {
      text-decoration: none !important;
      display: block;
      color: inherit;
      letter-spacing: 0.08rem;
    }

    a:link {
      text-decoration: none !important;
    }
  }

  @media (min-width: 1020px) {
    margin-top: 32rem;
  }
`

const SecretMSG = styled.div`
  text-align: right;
  font-weight: 100;
  font-size: 1rem;
  margin: 2rem 0;
  opacity: 0.3;
`

const Footer = () => (
  <FooterContainer>
    <Background></Background>
      <div className="container">
        <FooterContent>
          <h2 className="col-md-12">ANGOMI:안 고독한 미식가</h2>
          <div className="group col-md-3">
            <h3>links</h3>
            <a
              target="_blank"
              href="https://github.com/rotoshine/you-are-not-a-solitary-gourmet">
              github
            </a>
          </div>
          <div className="group col-md-3">
            <h3>contributors</h3>
            <a
              target="_blank"
              href="https://en.wikipedia.org/wiki/God">Alma<span>🏄</span>
            </a>
            <a
              target="_blank"
              href="https://github.com/stardustrain">Lucas<span>❤️</span>
            </a>
            <a
              target="_blank"
              href="https://github.com/yogicat">Ohda<span>🌞</span>
            </a>
            <a
              target="_blank"
              href="https://github.com/rotoshine">Roto<span>🐱</span>
            </a>
          </div>
          <div className="group col-md-6">
            <h3>about</h3>
            <p>안 고미는 사내 그룹이나 동호회 등에서 소규모 파티 모임을
               활성화해, 늘 어울리는 사람이 아닌 다양한 사람들과 함께 맛있는
               것을 먹자는 취지에서 시작된 사이드 프로젝트입니다. 안 고미는
                오픈소스이며 여러분의 다양한 기여를 언제나 환영합니다. 버그를 발견하거나, 개선사항이 있으시면 깃허브에 언제든 이슈
                 남겨주세요.</p>
          </div>
          <SecretMSG className="col-md-12">
            <strong>for our lonely friend, kingkong / 이 프로젝트를 우리의 고독한 킹콩에게 받칩니다</strong>
          </SecretMSG>
        </FooterContent>
      </div>
  </FooterContainer>
)

export default Footer
