import * as React from 'react'
import styled from 'styled-components'

import { search } from './utils/giphy'

interface Props {
  onClose: () => void
  onSelect: (gif: Giphy) => void
}

interface State {
  keyword: string
  gifs: Giphy[]
}

const GifSearchWrapper = styled.div`
  position: fixed;
  background-color: #fff;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow-y: scroll;
  width: 500px;
  height: 400px;
  border-radius: 6px;
  padding: 10px;
  box-shadow: 0px 4px 16px 2px #6666663b;
`
const GifSearchHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
`

const KeywordWrapper = styled.div`
  font-size: 2rem;
`
const SearchList = styled.ul`
  
`

const SeachListItem = styled.li`
  display: inline-block;
  margin: 3px;

  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`

const CloseButton = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
`

export default class GifSearch extends React.Component<Props, State> {
  $keyword: HTMLInputElement | null = null

  state = {
    keyword: '',
    gifs: []
  }

  async fetchGif() {
    const { keyword } = this.state

    if (keyword.length > 2) {
      const result = await search(keyword)
      this.setState({
        gifs: result.data
      })
    }
  }

  componentDidMount() {
    if (this.$keyword) {
      this.$keyword.focus()
      this.$keyword = null
    }
  }

  handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    await this.fetchGif()
  }

  handleSelect = (gif: Giphy) => {
    this.props.onSelect(gif)
  }

  render() {
    const { keyword, gifs } = this.state
    const { onClose } = this.props

    return (
      <GifSearchWrapper>
        <GifSearchHeader>
          <h3>GIF 검색</h3>
          <CloseButton
            className="btn btn-xs btn-danger"
            onClick={onClose}>x</CloseButton>
        </GifSearchHeader>
        <form onSubmit={this.handleSearch}>
          <KeywordWrapper>
            <input
              ref={($input) => this.$keyword = $input}
              className="form-control"
              type="text"
              placeholder="어떤 키워드로 gif를 검색할까요?"
              value={keyword}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                this.setState({
                  keyword: e.currentTarget.value,
                })}
            />
          </KeywordWrapper>
          <SearchList>
            {gifs.map((gif: Giphy) => (
              <SeachListItem key={gif.id} onClick={() => this.handleSelect(gif)}>
                <img src={gif.images.fixedHeight.url}
                  width={gif.images.fixedHeight.width}
                  height={gif.images.fixedHeight.height}
                />
              </SeachListItem>
            ))}
          </SearchList>
        </form>
      </GifSearchWrapper>
    )
  }
}