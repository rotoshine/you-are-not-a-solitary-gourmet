import * as React from 'react'
import { FormGroup, Label } from 'reactstrap'
import * as AutoComplete from 'react-autocomplete'
import ReactSelect from 'react-select'
import flatpickr from 'flatpickr'
import Flatpickr from 'react-flatpickr'

import { ESC } from './utils/keycodes'
import { Overlay, CloseBtn } from './CommonStyledComponents'

import './PartyForm.css'
import 'flatpickr/dist/themes/light.css'
import 'react-select/dist/react-select.css'

interface Props {
  party: Party | null
  categories: Category[]
  destinations: Destination[] | null
  onSave: Function
  onClose: Function
}

interface State {
  form: {
    isChanged: boolean,
    id?: string,
    category: Category,
    title: string,
    destinationName: string,
    playName: string,
    partyTimeString: string,
    dueDateTimeString: string | null,
    description: string,
    maxPartyMember: number,
  },
  selectedDueDateTime: DueDateTimeOption,
}

interface DueDateTimeOption {
  label: string,
  value: number,
}

const ONE_MINUTE = 1000 * 60
const DATE_FORMAT = 'Y-m-d H:i'
const { parseDate, formatDate } = flatpickr

const dueDateTimeOptions = [
  {
    label: '5분 전',
    value: ONE_MINUTE * 5,
  },
  {
    label: '15분 전',
    value: ONE_MINUTE * 10,
  },
  {
    label: '삼십분 전',
    value: ONE_MINUTE * 30,
  },
  {
    label: '한 시간 전',
    value: ONE_MINUTE * 60,
  },
  {
    label: '하루 전',
    value: ONE_MINUTE * 60 * 24,
  },
]

export default class PartyForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const { party, categories } = props

    if (party) {
      const {
        id,
        category,
        title,
        destinationName,
        playName,
        partyTime,
        dueDateTime,
        description,
        maxPartyMember,
      } = party

      this.state = {
        form: {
          id,
          category,
          title,
          destinationName,
          playName,
          description,
          maxPartyMember,
          partyTimeString: formatDate(partyTime.toDate(), DATE_FORMAT),
          dueDateTimeString: dueDateTime ? formatDate(dueDateTime.toDate(), DATE_FORMAT) : null,
          isChanged: false,
        },
        selectedDueDateTime: dueDateTimeOptions[0],
      }
    } else {
      this.state = {
        form: {
          category: categories[0],
          title: '',
          destinationName: '',
          playName: '',
          partyTimeString: formatDate(new Date(), DATE_FORMAT),
          dueDateTimeString: formatDate(new Date(), DATE_FORMAT),
          description: '',
          maxPartyMember: 0,
          isChanged: false,
        },
        selectedDueDateTime: dueDateTimeOptions[0],
      }
    }
  }

  handleFormChange = (field: string, value: string | boolean | Date) => {
    const { form } = this.state
    this.setState({
      form: {
        ...form,
        [field]: value,
        isChanged: true,
      },
    })
  }

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { form } = this.state
    const { onSave, onClose } = this.props

    const {
      id,
      category,
      title,
      description,
      destinationName,
      playName,
      maxPartyMember,
      partyTimeString,
      dueDateTimeString,
    } = form

    await onSave({
      id,
      category,
      title,
      description,
      destinationName,
      playName,
      maxPartyMember,
      partyTimeDate: parseDate(partyTimeString, DATE_FORMAT),
      dueDateTimeDate: dueDateTimeString ? parseDate(dueDateTimeString, DATE_FORMAT) : null,
    })

    onClose()
  }

  componentDidMount() {
    document.body.classList.add('modal-open')
    document.body.addEventListener('keyup', this.handleKeyPress)
  }

  componentWillUnmount() {
    document.body.classList.remove('modal-open')
    document.body.removeEventListener('keyup', this.handleKeyPress)
  }

  getPartyText(category: Category) {
    if (category.isTravel) {
      return '여행 출발 날짜가 언제인가요?'
    }

    if (category.isRestaurant) {
      return '언제 먹나요?'
    }

    return '언제 모이나요?'
  }

  destinationsToAutoComplete(filter: (destination: Destination) => boolean): any[] {
    const { destinations } = this.props

    if (!destinations) {
      return []
    }

    return destinations
      .filter(filter)
      .map((destination: Destination) => ({
        label: destination.id,
      }))
  }

  destinationsToFilteredAutocomplete(): any[] {
    const { category } = this.state.form

    const filter = (() => {
      if (category.isTravel) {
        return (destination: Destination) => destination.isTravel
      }

      if (category.isRestaurant) {
        return category.isDeliverable ?
          (destination: Destination) => destination.isRestaurant && destination.isDeliverable :
          (destination: Destination) => destination.isRestaurant
      }

      return () => true
    })()

    return this.destinationsToAutoComplete(filter)
  }

  destinationsToPlayNameAutocomplete(): any[] {
    return this.destinationsToAutoComplete((destination: Destination) => destination.isPlaying)
  }

  calculateDueDateTime = (partyTimeString: string, duration: number): string | null => {
    const partyTime = parseDate(partyTimeString, DATE_FORMAT)

    if (partyTime) {
      return formatDate(
        new Date(partyTime.getTime() - duration),
        DATE_FORMAT,
      )
    }

    return null
  }

  handleKeyPress = (evt: KeyboardEvent) => {
    if (evt.keyCode !== ESC) return
    this.handleClose()
  }

  handleClose = () => {
    if (this.state.form.isChanged) {
      if (confirm('작성 중인 내용이 날라가도 괜찮습니까?')) {
        this.props.onClose()
      }
    } else {
      this.props.onClose()
    }

  }

  handlePartyTimeChange = (date: any, str: string) => {
    this.handleFormChange('partyTimeString', str)

    if (this.state.form.category.hasDueDateTime) {
      this.handleDueDateTimeChange(this.state.selectedDueDateTime)
    }
  }

  handleDueDateTimeChange = (selectedOption: DueDateTimeOption) => {
    if (selectedOption) {
      const { form } = this.state
      const { partyTimeString } = form

      this.setState({
        form: {
          ...form,
          dueDateTimeString: this.calculateDueDateTime(
            partyTimeString, selectedOption.value,
          ),
        },
        selectedDueDateTime: selectedOption,
      })
    }
  }

  render() {
    const { form, selectedDueDateTime } = this.state
    const { category } = form
    const { categories } = this.props

    return (
      <Overlay onClick={this.handleClose}>
        <CloseBtn />
        <div className="PartyForm-group"
          onClick={(evt: any) => evt.stopPropagation()}
        >
          <div className="PartyForm-title">
            <h3><span role="img" aria-label="tada">🎉</span> 파티 {form.id ? '수정하기' : '만들기'}</h3>
          </div>
          <form
            className="PartyForm-form"
            onSubmit={this.handleSubmit}>
            <div className="form-row">
              <FormGroup className="col-sm-12">
                <Label for="category">파티 종류</Label>
                <ReactSelect
                  id="category"
                  autoFocus
                  wrapperStyle={{ zIndex: 25 }}
                  placeholder="파티 종류를 선택해주세요."
                  options={categories}
                  value={category}
                  clearable={false}
                  labelKey="name"
                  valueKey="id"
                  onChange={(selectedOption: any) => {
                    if (selectedOption) {
                      this.handleFormChange('category', selectedOption)
                    }
                  }}
                />
              </FormGroup>
            </div>
            <div className="form-row">
              <FormGroup className="col-sm-12">
                <label
                  htmlFor="title">
                  파티 제목
              </label>
                <input
                  type="text"
                  className="PartyForm__form-control form-control"
                  id="title"
                  placeholder="파티제목"
                  value={form.title}
                  autoComplete="off"
                  onChange={
                    (e: React.FormEvent<HTMLInputElement>) =>
                      this.handleFormChange('title', e.currentTarget.value)
                  }
                />
              </FormGroup>
            </div>
            {
              category.isRestaurant &&

              <div className="form-row">
                <FormGroup className="col-sm-9">
                  <Label
                    for="destinationName">
                    {
                      category.isTravel ? '여행 장소' : '식당 이름'
                    }
                  </Label>
                  <AutoComplete
                    inputProps={{
                      className: 'PartyForm__form-control form-control',
                      id: 'destinationName',
                      placeholder: '식당, 장소이름을 입력해 주세요',
                    }}
                    wrapperStyle={{
                      width: 'calc(100% - 10px)',
                      position: 'absolute',
                      zIndex: 20,
                    }}
                    getItemValue={(item: any) => item.label}
                    items={this.destinationsToFilteredAutocomplete()}
                    renderItem={(item, isHighlighted: boolean) => (
                      <div
                        key={item.label}
                        className="PartyForm__autocompleteItem"
                        style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                        {item.label}
                      </div>
                    )}
                    value={form.destinationName}
                    onChange={
                      (e: React.ChangeEvent<HTMLInputElement>) =>
                        this.handleFormChange('destinationName', e.currentTarget.value)}
                    onSelect={(value: string) => this.handleFormChange('destinationName', value)}
                  />
                </FormGroup>
                <FormGroup className="col-sm-3">
                  <label htmlFor="maxPartyMember">인원 (무제한:0)</label>
                  <input
                    id="maxPartyMember"
                    className="PartyForm__form-control form-control"
                    type="number"
                    value={form.maxPartyMember}
                    onChange={
                      (e: React.FormEvent<HTMLInputElement>) =>
                        this.handleFormChange('maxPartyMember', e.currentTarget.value)
                    }
                  />
                </FormGroup>
              </div>
            }
            {
              category.isPlaying &&
              <div className="form-row">
                <FormGroup className="col-sm-12">
                  <Label for="playName">무엇을 하고 노나요?</Label>
                  <AutoComplete
                    inputProps={{
                      className: 'PartyForm__form-control form-control',
                      id: 'playName',
                      placeholder: 'ex) 마리오 테니스, 배틀그라운드',
                    }}
                    wrapperStyle={{
                      width: 'calc(100% - 10px)',
                      position: 'absolute',
                      zIndex: 20,
                    }}
                    getItemValue={(item: any) => item.label}
                    items={this.destinationsToPlayNameAutocomplete()}
                    renderItem={(item, isHighlighted: boolean) => (
                      <div
                        key={item.label}
                        className="PartyForm__autocompleteItem"
                        style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                        {item.label}
                      </div>
                    )}
                    value={form.playName}
                    onChange={
                      (e: React.ChangeEvent<HTMLInputElement>) =>
                        this.handleFormChange('playName', e.currentTarget.value)}
                    onSelect={(value: string) => this.handleFormChange('playName', value)}
                  />
                </FormGroup>
              </div>
            }
            <div className="form-row">
              <FormGroup className="col-sm-6">
                <label
                  htmlFor="partyTime">{this.getPartyText(category)}</label>
                <div className="PartyForm__form-control form-control">
                  <Flatpickr data-enable-time
                    value={form.partyTimeString}
                    options={{ dateFormat: DATE_FORMAT, minDate: 'today' }}
                    onChange={this.handlePartyTimeChange}
                  />
                </div>
              </FormGroup>
              {
                category.hasDueDateTime &&
                <FormGroup className="col-sm-6">
                  <Label for="dueDateTime">파티 모집 마감 시간</Label>
                  <div className="PartyForm__form-control form-control">
                    <ReactSelect
                      id="dueDateTime"
                      wrapperStyle={{ zIndex: 25 }}
                      placeholder="파티 마감 시간을 선택해주세요."
                      options={dueDateTimeOptions}
                      value={selectedDueDateTime ? selectedDueDateTime : undefined}
                      clearable={false}
                      onChange={this.handleDueDateTimeChange}
                    />
                  </div>
                </FormGroup>
              }
            </div>
            <div className="form-group">
              <label htmlFor="description">파티에 대한 정보를 입력해주세요</label>
              <textarea
                placeholder="파티를 설명해주세요!"
                className="PartyForm__form-control form-control"
                rows={8}
                value={form.description}
                onChange={e => this.handleFormChange('description', e.currentTarget.value)} />
            </div>
            <button className="PartyForm__button btn">파티를 {form.id ? '수정합니다!' : '만듭니다!'}</button>
          </form>
        </div>
      </Overlay>
    )
  }
}
