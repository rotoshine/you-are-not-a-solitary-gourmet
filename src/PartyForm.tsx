import * as React from 'react'
import * as AutoComplete from 'react-autocomplete'
import flatpickr from 'flatpickr'
import Flatpickr from 'react-flatpickr'

import { ESC } from './utils/keycodes'

import './PartyForm.css'
import 'flatpickr/dist/themes/light.css'

type Props = {
  party: Party | null,
  destinations: Destination[] | null,
  onSave: Function,
  onClose: Function,
}

type PartyFormState = {
  form: {
    id?: string,
    category: string,
    title: string,
    destinationName: string,
    partyTimeString: string,
    dueDateTimeString: string,
    description: string,
    isDelivery: boolean,
    maxPartyMember: number,
  },
}

const DATE_FORMAT = 'Y-m-d H:i'
const { parseDate, formatDate } = flatpickr

export default class PartyForm extends React.Component<Props, PartyFormState> {
  constructor(props: Props) {
    super(props)

    const { party } = props

    if (party) {
      const {
        id,
        category,
        title,
        destinationName,
        partyTime,
        dueDateTime,
        description,
        isDelivery,
        maxPartyMember,
      } = party

      this.state = {
        form: {
          id,
          category,
          title,
          destinationName,
          description,
          isDelivery,
          maxPartyMember,
          partyTimeString: formatDate(partyTime.toDate(), DATE_FORMAT),
          dueDateTimeString: formatDate(dueDateTime.toDate(), DATE_FORMAT),
        },
      }
    } else {
      this.state = {
        form: {
          category: '',
          title: '',
          destinationName: '',
          partyTimeString: formatDate(new Date(), DATE_FORMAT),
          dueDateTimeString: formatDate(new Date(), DATE_FORMAT),
          description: '',
          isDelivery: false,
          maxPartyMember: 0,
        },
      }
    }
  }

  handleFormChange = (field: string, value: string | boolean | Date) => {
    const { form } = this.state
    this.setState({
      form: {
        ...form,
        [field]: value,
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
      isDelivery,
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
      isDelivery,
      maxPartyMember,
      partyTimeDate: parseDate(partyTimeString, DATE_FORMAT),
      dueDateTimeDate: parseDate(dueDateTimeString, DATE_FORMAT),
    })

    onClose()
  }

  destinationsToAutocompleteData(): any[] {
    const { destinations } = this.props

    if (!destinations) {
      return []
    }

    return destinations.map((destination: Destination) => ({
      label: destination.id,
    }))
  }

  componentDidMount() {
    document.body.classList.add('modal-open')
    document.body.addEventListener('keyup', this.handleKeyPress)
  }

  componentWillUnmount() {
    document.body.classList.remove('modal-open')
    document.body.removeEventListener('keyup', this.handleKeyPress)
  }

  handleKeyPress = (evt: KeyboardEvent) => {
    if (evt.keyCode !== ESC) return
    this.handleClose()
  }

  handleClose = () => {
    this.props.onClose()
  }

  handlePartyTimeChange = (date: any, str: string) => {
    this.handleFormChange('partyTimeString', str)
  }

  render() {
    const { form } = this.state
    const { onClose } = this.props

    return (
      <div className="PartyForm-overlay" onClick={this.handleClose}>
        <div className="PartyForm-group"
          onClick={(evt: any) => evt.stopPropagation()}
        >
          <div className="PartyForm-title">
            <h3><span role="img" aria-label="tada">🎉</span> 파티 {form.id ? '수정하기' : '만들기'}</h3>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => onClose()}
            >닫기</button>
          </div>
          <form
            className="PartyForm-form"
            onSubmit={this.handleSubmit}>
            <div className="form-row">
              <div className="form-group col-sm-9">
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
              </div>
              <div className="form-group col-sm-3">
                <label htmlFor="isDelivery">배달음식?</label>
                <input
                  className="PartyForm__form-control form-control"
                  type="checkbox"
                  name="isDelivery"
                  id="isDelivery"
                  value={String(form.isDelivery)}
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement>,
                  ) => this.handleFormChange('isDelivery', e.target.checked)}
                />
              </div>
            </div>
            <div className="form-group">
              <label
                htmlFor="category"
              >
                카테고리
                </label>
              <div className="PartyForm__inline">
                {['점심', '저녁', '간식', '기타'].map(
                  (category, i) => (
                    <div
                      key={category}
                      className="PartyForm__checkbox form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="categoryOptions"
                        id={`category-${i}`}
                        value={category}
                        checked={form.category === category}
                        onChange={
                          (e: React.FormEvent<HTMLInputElement>) =>
                            this.handleFormChange('category', e.currentTarget.value)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`category-${i}`}
                      >
                        {category}
                      </label>
                    </div>
                  ),
                )
                }
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-sm-9">
                <label
                  htmlFor="destinationName">
                  행선지
              </label>
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
                  items={this.destinationsToAutocompleteData()}
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
                      this.handleFormChange('destinationName', e.target.value)}
                  onSelect={(value: string) => this.handleFormChange('destinationName', value)}
                />
              </div>
              <div className="form-group col-sm-3">
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
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-sm-6">
                <label
                  htmlFor="partyTime">언제 먹나요?</label>
                <div className="PartyForm__form-control form-control">
                  <Flatpickr data-enable-time
                    value={form.partyTimeString}
                    options={{ dateFormat: DATE_FORMAT, minDate: 'today' }}
                    onChange={this.handlePartyTimeChange}
                  />
                </div>
              </div>
              <div className="form-group col-sm-6">
                <label htmlFor="dueDateTime">파티 모집 마감 시간</label>
                <div className="PartyForm__form-control form-control">
                  <Flatpickr data-enable-time
                    value={form.dueDateTimeString}
                    options={{
                      dateFormat: DATE_FORMAT,
                      minDate: 'today',
                      maxDate: `${form.partyTimeString}`,
                    }}
                    onChange={
                      (date, str: string) =>
                        this.handleFormChange('dueDateTimeString', str)}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="description">자세한 정보를 입력하세요</label>
              <textarea
                placeholder="파티를 설명해주세요!"
                className="PartyForm__form-control form-control"
                rows={8}
                value={form.description}
                onChange={e => this.handleFormChange('description', e.target.value)} />
            </div>
            <button className="PartyForm__button btn">파티를 만듭니다!</button>
          </form>
        </div>
      </div>
    )
  }
}
