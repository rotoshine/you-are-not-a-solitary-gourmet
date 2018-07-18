import * as React from 'react'
import styled from 'styled-components'

import categories from './data/categories'

interface Props {
  selectedCategory: Category | null,
  onSelect: (selectedCategory: Category | null) => void,
}

const CategoriesWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 0;
  margin: 3rem 0;
`

const CategoryItem = styled.li`
  position: relative;
  width: 180px;
  height: 150px;
  margin: 0 14px 14px 0;
  box-shadow: 0 4px 16px #00000020;
  padding: 20px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  cursor: pointer;
  text-align: center;

  &:hover {
    box-shadow: 0 10px 20px 3px #00000020;
    transform: translateY(-5px);
  }
`

const SelectedCategory = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`

const CategoryEmoji = styled.p`
  font-size: 3rem;
  line-height: 3rem;
  margin-bottom: 2px;
  display: inline-block;
`

const CategoryName = styled.p`
  font-weight: 300;
  font-size: 2rem;
  letter-spacing: .1rem;
  word-break: keep-all;
  height: 3rem;
`

const Categories: React.SFC<Props> = ({ selectedCategory, onSelect }) => (
  <CategoriesWrapper>
    <CategoryItem onClick={() => onSelect(null)}>
      {!selectedCategory &&
        <SelectedCategory>✅</SelectedCategory>
      }
      <CategoryEmoji>🎮🍱🏖🏄</CategoryEmoji>
      <CategoryName>전체</CategoryName>
    </CategoryItem>
    {categories.map((category: Category) => (
      <CategoryItem
        onClick={() => onSelect(category)}>
        {selectedCategory &&
          selectedCategory.id === category.id &&
          <SelectedCategory>✅</SelectedCategory>
        }
        <CategoryEmoji>{category.emoji}</CategoryEmoji>
        <CategoryName>{category.name}</CategoryName>
      </CategoryItem>
    ))}
  </CategoriesWrapper>
)

export default Categories
