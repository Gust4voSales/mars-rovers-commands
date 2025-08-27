abstract class BaseEntity<Props> {
  private _id: string
  protected props: Props

  constructor(props: Props, id: string) {
    this.props = props
    this._id = id
  }

  get id() {
    return this._id
  }
}

export { BaseEntity }